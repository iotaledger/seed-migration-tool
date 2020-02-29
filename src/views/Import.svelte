<script>
    import { view, importSeed, importError } from '../lib/state'
    import { importVault } from '../lib/seedVault'
    import { bytesToString, stringToBytes, getSeedChecksum } from '../lib/helpers'

    import Button from '../components/Button.svelte'
    import Dropzone from '../components/Dropzone.svelte'
    import Info from '../components/Info.svelte'
    import Input from '../components/Input.svelte'
    import Loading from '../components/Loading.svelte'
    import Footer from '../components/Footer.svelte'

    let seed = $importError ? bytesToString($importSeed.seed) : '';
    let password = ''
    let vault

    let fileError = false
    let invalidCharactersError = false
    let unlockError = false

    let invalidPasswordError = false

    let unlocking = false

    const onDrop = (buffer) => {
        importError.set(false)
        unlockError = false
        fileError = false
        invalidCharactersError = false
        invalidPasswordError = false

        if (!buffer) {
            return fileError = true
        }
        unlocking = true
        vault = buffer
    }

    const onUnlock = async () => {
        if (password.length < 1) {
            return
        }

        try {
            const result = await importVault(vault, password)
            if (result.length === 1) {
                importSeed.set({ ...result[0], meta: [] })
                view.set('migrateOnce')
            }
        } catch (err) {
            if (err.code === 'InvalidKey') {
                return invalidPasswordError = true
            }
            unlockError = true
            unlocking = false
            vault = null
            password = ''
        }
    }

    const onCancelUnlock = () => {
        unlocking = false
        password = ''
    }

    const onSeedEnter = () => {
        importError.set(false)
        fileError = false
        unlockError = false

        if (seed.length !== 81) {
            return
        }

        invalidCharactersError = !seed.toUpperCase().match(/^[A-Z9]+$/)

        if (invalidCharactersError) {
            return
        }
        importSeed.set({
            title: '',
            seed: stringToBytes(seed.toUpperCase()),
            meta: []
        })

        view.set('migrateOnce')
    }
</script>

{#if unlocking}
    <h1>Enter password</h1>
    <h2>Enter your password to unlock the SeedVault</h2>

    {#if invalidPasswordError}
        <Info error center>Incorrect password.</Info>
    {/if}

    <Input label={'Password'} bind:value={password} onConfirm={onUnlock} />
    <Footer>
        <Button onClick={onCancelUnlock} dark>Back</Button>
        <Button onClick={onUnlock} disabled={password.length === 0}>Continue</Button>
    </Footer>
{:else}
    <h1>Import your existing seed</h1>
    {#if invalidCharactersError}
        <Info error center>Entered seed contains invalid characters</Info>
    {:else if unlockError}
        <Info error center>Your SeedVault file may be corrupted. Try again or export a new one from Trinity.</Info>
    {:else if fileError}
        <Info error center>Wrong file format imported.</Info>
    {:else if $importError}
        <Info error center>Error importing seed. Please try again.</Info>
    {:else}
        <h2>Manually type your seed below or upload a SeedVault file</h2>
    {/if}

    <Input
        label="Enter your seed below"
        indicator={seed.length === 0 ? '' : seed.length < 81 ? '< 81' : seed.length > 81 ? '> 81' : 'Checksum: ' + getSeedChecksum(seed)}
        bind:value={seed}
        onConfirm={onSeedEnter} />

    <Dropzone {onDrop} label="Or upload a SeedVault"/>

    <Footer back>
        <Button onClick={onSeedEnter} disabled={seed.length !== 81}>Continue</Button>
    </Footer>
{/if}
