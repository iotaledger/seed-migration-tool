<script>
    import { onMount } from 'svelte'

    import { hash, decrypt } from '../lib/crypto'
    import { errorLog, lastFetchedStatesAt, migrationLogs, view } from '../lib/state'
    import RecoveryTool from '../lib/recoveryToolApi.ts'
    import { formatIotas, toHumanReadableDate, parseUint8ArrayString, chunk } from '../lib/helpers'
    import { MAX_BUNDLE_HASHES, BUNDLE_HASH_LENGTH, SALT_LENGTH, IV_LENGTH } from '../lib/config'
    import { iota } from '../lib/iota'

    import Input from '../components/Input'
    import Dropzone from '../components/Dropzone'
    import Button from '../components/Button'
    import Footer from '../components/Footer'
    import Info from '../components/Info'

    let data
    let unlocking = false
    let password = ''

    let importError = false
    let exportError = false
    let invalidPasswordError = false
    let fetchError = false

    const getStatusLabel = (status) => {
        switch (status) {
            case 'stitched':
                return 'Secured'
            case 'submitted':
                return 'Submitted'
            case 'kyc_needed':
                return 'ID Required'
            default:
                return 'Pending'
        }
    }

    const getStatusExplanation = (status) => {
        switch (status) {
            case 'stitched':
                return 'The Coordinator has confirmed your transfer. You are free to send value transactions, using your new seed.'
            case 'submitted':
                return 'Your migration is waiting to be processed. Check back after the migration period because further action may be required.'
            case 'kyc_needed':
                return 'Someone else has tried to use the Seed Migration Tool with your seed. Visit https://status.iota.org for more information.'
            default:
                return ''
        }
    }

    const onExport = async (bundleHash) => {
        exportError = false
        importError = false
        fetchError = false

        try {
            const { status, ...logContent } = $migrationLogs[bundleHash]
            const content = JSON.stringify(logContent, null, 2)
            await global.Electron.saveLogFile(content, $migrationLogs[bundleHash].date)
        } catch (err) {
            exportError = true
        }
    }

    const fetchStates = async (hashes) => {
        const _thirtySecondsAgo = () => {
            const THIRTY_SECONDS = 30 * 1000
            const now = Date.now()

            return Math.abs(now - $lastFetchedStatesAt) > THIRTY_SECONDS
        }

        const _get = async () => {
            try {
                const chunks = chunk(hashes, MAX_BUNDLE_HASHES)

                const results = await Promise.all(chunks.map((chunk) => RecoveryTool.getStates(chunk)))
                const states = results.map((result) => result.states)

                lastFetchedStatesAt.set(Date.now())

                chunks.forEach((chunk, chunkIdx) => {
                    chunk.forEach((bundleHash, hashIdx) => {
                        migrationLogs.update((existingLogs) =>
                            Object.assign({}, existingLogs, {
                                [bundleHash]: { ...existingLogs[bundleHash], status: states[chunkIdx][hashIdx] }
                            })
                        )
                    })
                })
            } catch (e) {
                errorLog.update((existingLog) => [...existingLog, { error: e.message, timestamp: Date.now() }])
                fetchError = true
            }
        }

        if ($lastFetchedStatesAt === null) {
            await _get()
        } else {
            if (_thirtySecondsAgo()) {
                await _get()
            }
        }
    }

    const onUnlock = async () => {
        const passwordHash = await hash(password, parseUint8ArrayString(data.salt))

        let key = ''
        try {
            key = await decrypt(data.key, data.iv, passwordHash)
        } catch (err) {
            return (invalidPasswordError = true)
        }

        migrationLogs.update((existingLogs) =>
            Object.assign({}, existingLogs, {
                [data.bundleHash]: {
                    bundleHash: data.bundleHash,
                    trytes: data.trytes,
                    key: data.key,
                    iv: data.iv,
                    salt: data.salt,
                    status: null,
                    date: data.date
                }
            })
        )

        unlocking = false

        fetchStates([data.bundleHash])
    }

    const onCancelUnlock = () => {
        unlocking = false
        password = ''
    }

    const onImport = async () => {
        invalidPasswordError = false
        exportError = false
        importError = false
        fetchError = false

        try {
            const content = await global.Electron.loadFile()
            if (!content) {
                return
            }

            data = JSON.parse(content)

            const hash = data.bundleHash

            const trytes = data.trytes

            if (
                data.bundleHash.length !== BUNDLE_HASH_LENGTH ||
                !Array.isArray(trytes) ||
                !iota.utils.isBundle(
                    trytes
                        .map(iota.utils.transactionObject)
                        .slice()
                        .reverse()
                ) ||
                data.salt.split(',').length !== SALT_LENGTH ||
                data.iv.split(',').length !== IV_LENGTH ||
                !data.key.length ||
                data.key.split(',').some(isNaN)
            ) {
                return (importError = 'Invalid or corrupt log data')
            }

            if ($migrationLogs[hash]) {
                return (importError = 'Migration log already imported')
            }

            unlocking = true
        } catch (err) {
            importError = 'Error loading migration log'
        }
    }

    const onClose = () => {
        view.set('')
    }

    onMount(async () => {
        const hashes = Object.keys($migrationLogs)

        if (hashes.length) {
            await fetchStates(hashes)
        }
    })
</script>

<style>
    ul {
        margin: 50px auto;
        max-height: calc(100vh - 392px);
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px 10px;
    }

    p + ul {
        max-height: calc(100vh - 510px);
        margin-top: 0;
    }

    li {
        display: flex;
        align-items: center;
        list-style: none;
        border: 2px #fff solid;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 20px 20px 20px 25px;
    }

    .center {
        text-align: center;
        display: block;
    }

    p:nth-child(1) {
        flex: 1;
    }

    strong {
        display: block;
        margin-bottom: 8px;
    }

    span {
        text-decoration: underline;
        cursor: pointer;
    }

    p:nth-child(2) {
        font-size: 24px;
    }

    p:nth-child(3) {
        display: block;
        height: 44px;
        line-height: 44px;
        width: 150px;
        border-radius: 5px;
        background: #249357;
        color: #fff;
        text-align: center;
        font-size: 15px;
        margin-left: 30px;
    }

    p:nth-child(3).submitted {
        background: #ffcf71;
        color: #0d2131;
    }
    p:nth-child(3).kyc {
        background: #ac4545;
    }
    p:nth-child(3).loading {
        background: #cccc;
    }

    p:nth-child(3) {
        position: relative;
        cursor: help;
    }

    p small {
        position: absolute;
        width: 300px;
        color: #000;
        font-size: 14px;
        line-height: 21px;
        top: 50%;
        right: 100%;
        transform: translate(-10px, -50%);
        background: #fff;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
        padding: 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.2s ease-in;
    }

    p:nth-child(3):hover small {
        opacity: 1;
    }
</style>

{#if unlocking}
    <h1>Enter password</h1>
    <h2>Enter your password to unlock the migration log</h2>

    {#if invalidPasswordError}
        <Info error center>Incorrect password.</Info>
    {/if}

    <Input label={'Password'} bind:value={password} onConfirm={onUnlock} />
    <Footer back onBack={onCancelUnlock}>
        <Button onClick={onUnlock} disabled={password.length === 0}>Continue</Button>
    </Footer>
{:else}
    <h1>Migration status</h1>
    {#if importError}
        <Info error center>{importError}</Info>
    {:else if exportError}
        <Info error center>Error exporting log, please try again</Info>
    {/if}
    <ul>
        {#if !Object.keys($migrationLogs).length}
            <li class="center">No migration history</li>
        {/if}
        {#each Object.keys($migrationLogs) as hash, index}
            <li>
                <p>
                    <strong>Seed Migration - {toHumanReadableDate($migrationLogs[hash].date)}</strong>
                    <span on:click={() => onExport(hash)}>Download Migration Log</span>
                </p>
                <!--<p>{formatIotas(migration.amount)}</p>-->
                <p />
                <p
                    class:loading={!$migrationLogs[hash].status}
                    class:submitted={$migrationLogs[hash].status === 'submitted'}
                    class:kyc={$migrationLogs[hash].status === 'kyc_needed'}>
                    {getStatusLabel($migrationLogs[hash].status)}
                    {#if $migrationLogs[hash].status}
                        <small>{getStatusExplanation($migrationLogs[hash].status)}</small>
                    {/if}
                </p>
            </li>
        {/each}
    </ul>

    <Footer>
        <Button secondary onClick={onImport}>Restore a migration log</Button>
        <Button onClick={onClose}>Close this page</Button>
    </Footer>
{/if}
