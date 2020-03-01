<script>
    import { get } from 'svelte/store'

    import { encrypt } from '../lib/crypto'
    import {
        errorLog,
        seedFirstAddresses,
        activeMigrationLog,
        importSeed,
        exportSeed,
        migrationLogs,
        view,
        passwordHash,
        passwordSalt
    } from '../lib/state'
    import { prepareBundle } from '../lib/iota'
    import api from '../lib/recoveryToolApi'
    import SeedStore from '../lib/SeedStore'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'
    import Loading from '../components/Loading.svelte'

    let hasStoredMigrationLog = false

    let transferStep = 0
    let transferError = false

    let activeLog = get(activeMigrationLog)
    const activeHash = activeLog.bundleHash
    const date = global.Electron.getCurrentDate()

    const onBeginTransfer = async () => {
        transferError = false
        renderNextStep()

        api.saveBundle(activeHash, activeLog.trytes)
            .then(async ({ secret }) => {
                const data = await encrypt(secret, $passwordHash)

                migrationLogs.update((existingLogs) =>
                    Object.assign({}, existingLogs, {
                        [activeHash]: {
                            bundleHash: activeHash,
                            trytes: activeLog.trytes,
                            key: data.cipher,
                            iv: data.iv,
                            salt: $passwordSalt.toString(),
                            date
                        }
                    })
                )

                const importSeedStore = new SeedStore($importSeed)

                seedFirstAddresses.update((existingAddresses) => [...existingAddresses, importSeedStore.meta[0].address])

                renderNextStep()
            })
            .catch((e) => {
                errorLog.update((existingLog) => [...existingLog, { error: e.message, timestamp: Date.now() }])

                transferError = true
                renderPreviousStep()
            })
    }

    const renderNextStep = () => {
        transferStep = transferStep + 1
    }

    const renderPreviousStep = () => {
        transferStep = transferStep - 1
    }

    const saveMigrationLog = async () => {
        try {
            const { status, ...logContent } = $migrationLogs[activeHash]
            const content = JSON.stringify(logContent, null, 2)
            const result = await global.Electron.saveLogFile(content, date)

            if (result) {
                hasStoredMigrationLog = true
            }
        } catch (err) {
            console.log(err)
        }
    }
    const onContinue = () => {
        view.set('success')
    }
</script>

{#if transferStep === 0}
    <h1>Begin Migration</h1>
    {#if transferError}
        <Info error center>Error migrating seed. Please try again.</Info>
    {:else}
        <h2>Migrate your funds to your new seed</h2>
    {/if}
    <Info warning center>
        This migration may take some time. Do not close the app or turn off your device during this process.
        <br/>
        <br/>
        <strong>Neither of your seeds will ever leave your device during this process.</strong>
        <br/>
        <br/>
        Press 'Begin migration' to migrate to your new seed.
    </Info>

    <Footer cancel>
        <Button onClick={onBeginTransfer}>{transferError ? 'Try Again' : 'Begin migration'}</Button>
    </Footer>
{:else if transferStep === 1}
    <h1>Migrating Seed</h1>
    <h2>Please wait. This may take a while.</h2>

    <Loading />
{:else if transferStep === 2}
    <h1>Before we complete migration...</h1>
    <h2>You must save a copy of your migration log</h2>

    <Info warning center>
        Your migration log provides proof that you have migrated your seed. The log is encrypted with the same password you set for your SeedVault earlier.
        <br/>
        <br/>
        <strong>Further action may be required. You may need this log to access your funds if there is a conflicting migration.</strong>
        <br/>
        <br/>
        <strong>Keep your log safe and do not share it with anyone!</strong>
        <Button inline onClick={saveMigrationLog}>Save migration log</Button>
    </Info>

    <Footer>
        <Button onClick={onContinue} disabled={!hasStoredMigrationLog}>Continue</Button>
    </Footer>
{/if}
