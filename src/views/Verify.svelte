<script>
    import { view, exportSeed, prepareBundleError } from '../lib/state'
    import { importVault } from '../lib/seedVault'
    import { bytesToString, getSeedChecksum } from '../lib/helpers'

    import Button from '../components/Button.svelte'
    import Dropzone from '../components/Dropzone.svelte'
    import Info from '../components/Info.svelte'
    import Input from '../components/Input.svelte'
    import Loading from '../components/Loading.svelte'
    import Footer from '../components/Footer.svelte'

    let seed = $prepareBundleError ? bytesToString($exportSeed.seed) : ''
    let password = ''
    let vault

    let fileError = false
    let invalidCharactersError = false
    let incorrectSeedError = false
    let unlockError = false
    let incorrectSeedVaultError = false

    let invalidPasswordError = false

    let unlocking = false

    const onDrop = (buffer) => {
        prepareBundleError.set(false)
        invalidCharactersError = false
        unlockError = false
        fileError = false
        incorrectSeedError = false
        incorrectSeedVaultError = false
        invalidPasswordError = false

        if (!buffer) {
            return fileError = true
        }

        unlocking = true
        vault = buffer
    }

    const validateSeed = (inputSeed) => {
        if (inputSeed === bytesToString($exportSeed.seed)) {
            return view.set('loading/export')
        }

        password = ''

        if (unlocking) {
            incorrectSeedVaultError = true
            return unlocking = false
        }
        return incorrectSeedError = true
    }

    const onUnlock = async () => {
        if (password.length < 1) {
            return
        }

        try {
            const result = await importVault(vault, password)
            if (result.length === 1) {
                validateSeed(bytesToString(result[0].seed))
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
        prepareBundleError.set(false)
        fileError = false
        unlockError = false
        incorrectSeedVaultError = false
        incorrectSeedError = false

        if (seed.length !== 81) {
            return
        }

        invalidCharactersError = !seed.toUpperCase().match(/^[A-Z9]+$/)

        if (invalidCharactersError) {
            return
        }

        validateSeed(seed.toUpperCase())
    }
</script>

{#if unlocking}
    <h1>Enter your SeedVault password</h1>
    <h2>Enter your new password to confirm</h2>

    {#if invalidPasswordError}
        <Info error center>Incorrect password.</Info>
    {/if}

    <Input label={`Password`} bind:value={password} onConfirm={onUnlock} />
    <Footer back onBack={onCancelUnlock}>
        <Button onClick={onUnlock} disabled={password.length === 0}>Continue</Button>
    </Footer>
{:else}
    <h1>Check your new seed</h1>

    {#if incorrectSeedVaultError}
        <Info error center>Wrong SeedVault file. Make sure you selected the correct SeedVault file.</Info>
    {:else if unlockError}
        <Info error center>Something went wrong. Try again. Your SeedVault file may be corrupted.</Info>
    {:else if invalidCharactersError}
        <Info error center>Seed contains invalid characters.</Info>
    {:else if incorrectSeedError}
        <Info error center>Seed is incorrect. Make sure it matches your back up.</Info>
    {:else if fileError}
        <Info error center>Wrong file format imported.</Info>
    {:else if $prepareBundleError}
        <Info error center>Error checking seed. Please try again.</Info>
    {:else}
        <h2>Manually type your new seed below or upload the SeedVault file</h2>
    {/if}


    <Input
        label={"Enter your new seed below"}
        indicator={seed.length === 0 ? '' : seed.length < 81 ? '< 81' : seed.length > 81 ? '> 81' : 'Checksum: ' + getSeedChecksum(seed)}
        bind:value={seed}
        onConfirm={onSeedEnter} />

    <Dropzone {onDrop} label={"Or upload your SeedVault"}/>

    <Footer back previousScreen='export'>
        <Button onClick={onSeedEnter} disabled={seed.length !== 81}>Continue</Button>
    </Footer>
{/if}
