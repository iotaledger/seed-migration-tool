<script>
    import { get } from 'svelte/store'
    import zxcvbn from 'zxcvbn'

    import { hash, getSalt } from '../../lib/crypto'
    import { exportSeed, passwordHash, passwordSalt } from '../../lib/state'
    import { bytesToString } from '../../lib/helpers'
    import { createVault } from '../../lib/seedVault'

    import Button from '../../components/Button.svelte'
    import Info from '../../components/Info.svelte'
    import Input from '../../components/Input.svelte'
    import Footer from '../../components/Footer.svelte'

    export let onDone
    export let onCancel

    let step = 0

    let password = ''
    let passwordRetry = ''

    $: passwordStrength = zxcvbn(password)

    let errorPassword = false
    let errorMatch = false
    let errorScore = false

    const resetErrors = () => {
        errorPassword = false
        errorMatch = false
        errorScore = false
    }
    $: resetErrors(password, passwordRetry)

    const onGenerateVault = async () => {
        errorPassword = password.length < 11
        errorMatch = password !== passwordRetry
        errorScore = passwordStrength.score < 4

        if (errorScore || errorPassword || errorMatch) {
            return
        }

        const seed = get(exportSeed).seed
        const vaultBuffer = await createVault(password, bytesToString(seed))
        const result = await global.Electron.saveSeedVault(vaultBuffer)

        if (result) {
            const salt = await getSalt()
            passwordSalt.set(salt)
            passwordHash.set(await hash(password, salt))

            onDone()
        }
    }
</script>

<h1>Export new SeedVault</h1>

{#if step === 0}
    <Info warning center>
        A SeedVault is an encrypted file for backing up your seed. The seed is encrypted with a SeedVault password and cannot be
        accessed without that password.
    </Info>
{:else if step === 1}
    <Info warning center>
        Make sure you back up the file in multiple locations (e.g. hard drive, USB). If you lose this file and the seed is not
        stored elsewhere, you will lose your tokens.
    </Info>
    <Footer>
        <Button onClick={() => (step = 2)}>Continue</Button>
    </Footer>
{:else}
    <h2>Protect your new seed with a password</h2>
    {#if errorPassword}
        <Info error center>Password must be at least 11 characters</Info>
    {:else if errorMatch}
        <Info error center>Passwords do not match</Info>
    {:else if errorScore}
        <Info error center>Your password is too weak. Use a combination of words, and avoid common phrases, names or dates.</Info>
    {/if}
    <Input label="Password" score={passwordStrength.score} bind:value={password} onConfirm={onGenerateVault} />
    <Input label="Confirm password" bind:value={passwordRetry} onConfirm={onGenerateVault} />
{/if}

<Footer>
    <Button dark onClick={onCancel}>Cancel export</Button>
    <Button onClick={step < 2 ? () => (step = step + 1) : onGenerateVault}>{step < 2 ? 'Continue' : 'Export'}</Button>
</Footer>
