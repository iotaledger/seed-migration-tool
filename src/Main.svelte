<script>
    import { view, hasReadPrivacyPolicy } from './lib/state'

    import Titlebar from './components/Titlebar.svelte'
    import StatusBanner from './components/StatusBanner.svelte'
    import Header from './components/Header.svelte'
    import Route from './components/Route.svelte'
    import Wave from './components/Wave.svelte'
    import Modal from './components/Modal.svelte'
    import ErrorLog from './components/ErrorLog'

    import PrivacyPolicy from './views/PrivacyPolicy.svelte'
    import Intro from './views/Intro.svelte'
    import Import from './views/Import.svelte'
    import Balance from './views/Balance.svelte'
    import Incorrect from './views/Incorrect.svelte'
    import Export from './views/Export.svelte'
    import Verify from './views/Verify.svelte'
    import Transfer from './views/Transfer.svelte'
    import Success from './views/Success.svelte'
    import Status from './views/Status.svelte'
    import Loading from './views/Loading.svelte'
    import AlreadyMigrated from './views/AlreadyMigrated'
    import Minimum from './views/Minimum.svelte'
    import MigrateOnce from './views/MigrateOnce.svelte'

    const screensBySequence = [
        'import',
        'migrateOnce',
        'loading/import',
        'balance',
        'export',
        'verify',
        'loading/export',
        'transfer',
        'success'
    ]
</script>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: calc(100% - 300px);
    }

    article {
        padding: 20px;
        width: 100%;
        max-width: 680px;
    }
</style>

{#if $view === 'status'}
    <StatusBanner />
{:else}
    <Header totalSteps={screensBySequence.length} step={screensBySequence.indexOf($view) + 1} />
{/if}
<main>
    <article>
        <Route route="">
            {#if $hasReadPrivacyPolicy}
                <Intro />
            {:else}
                <PrivacyPolicy />
            {/if}
        </Route>
        <Route route="intro">
            <Intro />
        </Route>
        <Route route="import">
            <Import />
        </Route>
        <Route route="status">
            <Status />
        </Route>
        <Route route="balance">
            <Balance />
        </Route>
        <Route route="minimum">
            <Minimum />
        </Route>
        <Route route="incorrect">
            <Incorrect />
        </Route>
        <Route route="migrateOnce">
            <MigrateOnce />
        </Route>
        <Route route="export">
            <Export />
        </Route>
        <Route route="verify">
            <Verify />
        </Route>
        <Route route="transfer">
            <Transfer />
        </Route>
        <Route route="success">
            <Success />
        </Route>
        <Route route="loading/export">
            <Loading />
        </Route>
        <Route route="loading/import">
            <Loading />
        </Route>
        <Route route="already-migrated">
            <AlreadyMigrated />
        </Route>
    </article>
</main>
<Wave />
<Modal>
    <ErrorLog />
</Modal>
<Titlebar />
