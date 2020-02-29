<script>
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import {
        seedFirstAddresses,
        activeMigrationLog,
        migrationLogs,
        exportSeed,
        importSeed,
        view,
        importError,
        prepareBundleError
    } from '../lib/state'
    import SeedStore from '../lib/SeedStore'
    import { createExportSeedAddressData, prepareBundle, syncAccount } from '../lib/iota'
    import { withFallback } from '../lib/helpers'

    import Loading from '../components/Loading.svelte'

    const currentView = get(view)

    const isLoadingImportSeed = currentView.endsWith('import')

    onMount(() => {
        if (isLoadingImportSeed) {
            withFallback(syncAccount)(new SeedStore(get(importSeed)))
                .then((meta) => {
                    importSeed.update((existingState) =>
                        Object.assign({}, existingState, {
                            meta
                        })
                    )
                    importError.set(false)
                    view.set($seedFirstAddresses.includes(meta[0].address) ? 'already-migrated' : 'balance')
                })
                .catch((error) => {
                    importError.set(true)
                    view.set('import')
                })
        } else {
            createExportSeedAddressData(new SeedStore($exportSeed))
                .then((meta) => {
                    exportSeed.update((existingState) =>
                        Object.assign({}, existingState, {
                            meta
                        })
                    )

                    return withFallback(prepareBundle)(new SeedStore(get(importSeed)), new SeedStore(get(exportSeed))).then(
                        ({ transactionObjects, trytes }) => {
                            const bundleHash = transactionObjects[0].bundle

                            activeMigrationLog.update((activeLog) =>
                                Object.assign({}, activeLog, {
                                    bundleHash,
                                    trytes,
                                    status: null,
                                    date: global.Electron.getCurrentDate()
                                })
                            )

                            prepareBundleError.set(false)
                            view.set('transfer')
                        }
                    )
                })
                .catch((error) => {
                    prepareBundleError.set(true)
                    view.set('verify')
                })
        }
    })
</script>

<h1>Importing seed</h1>
<h2>Please wait. This may take a while.</h2>
<Loading />
