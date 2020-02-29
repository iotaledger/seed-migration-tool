<script>
    import { view, exportSeed, hasExportedSeedVault } from '../lib/state'

    import ExportVault from './export/ExportVault.svelte'
    import ExportWrite from './export/ExportWrite.svelte'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Input from '../components/Input.svelte'
    import Footer from '../components/Footer.svelte'


    let doExport = false
    let doWrite = false

    let disableWrite = !$hasExportedSeedVault

    const onExportSeedVaultDone = () => {
        hasExportedSeedVault.set(true)
        doExport = false
        disableWrite = false
    }

    const onWriteDone = () => {
        doWrite = false
    }

    const onExportCancel = () => {
        doExport = false
        doWrite = false
    }

    const onContinue = () => {
        view.set('verify')
    }

</script>

<style>
    ul {
        display: flex;
        justify-content: center;
    }

    li {
        width: 220px;
        list-style: none;
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 5px;
        margin: 0 6px;
        text-align: center;
        padding: 40px 0 30px;
        cursor: pointer;
    }

    li.disableWrite {
        opacity: 0.3;
        pointer-events: none;
    }

    li:hover {
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(0, 0, 0, 0.12);
    }

    img {
        display: block;
        margin: 0 auto 20px;
    }
</style>

{#if doExport}
    <ExportVault onDone={onExportSeedVaultDone} onCancel={onExportCancel} />
{:else if doWrite}
    <ExportWrite onDone={onWriteDone}/>
{:else}
    <h1>{!$hasExportedSeedVault ? 'Back up your new seed' : 'Do you want to make another back up?'}</h1>
    <h2>{!$hasExportedSeedVault ? 'You must back up your new seed by exporting a SeedVault. You can then choose to write it down as an additional backup.' : 'It is recommended that you also write down your seed as a physical back up'}</h2>

    <ul>
        <li on:click={() => (doExport = true)}>
            <img src="./icon-export.svg" alt="" />
            Export SeedVault
        </li>
        <li class:disableWrite on:click={() => (doWrite = true)}>
            <img src="./icon-write.svg" alt="" />
            Write your seed down
        </li>
    </ul>

    <Footer back previousScreen='balance'>
        <Button disabled={!$hasExportedSeedVault} onClick={onContinue}>I have finished backing up my seed</Button>
    </Footer>
{/if}
