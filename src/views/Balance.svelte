<script>
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'

    import { importSeed, view, exportSeed } from '../lib/state'
    import { withFallback, formatIotas, randomBytes } from '../lib/helpers'
    import { accumulateBalance, searchAddresses } from '../lib/iota'
    import SeedStore from '../lib/SeedStore'

    let balance = accumulateBalance(get(importSeed).meta)
    let isSyncingAddresses = false

    const onClick = () => {
        if (balance < 1000000) {
            return view.set('minimum')
        }
        view.set('export')
    }

    const onIncorrect = () => {
        view.set('incorrect')
    }

    const syncAddresses = () => {
        isSyncingAddresses = true

        withFallback(searchAddresses)(new SeedStore($importSeed))
            .then((newMeta) => {
                importSeed.update((existingAddressData) =>
                    Object.assign({}, existingAddressData, {
                        meta: [...existingAddressData.meta, ...newMeta]
                    })
                )

                balance = accumulateBalance(get(importSeed).meta)

                isSyncingAddresses = false
            })
            .catch((error) => {
                console.log(error)
                isSyncingAddresses = false
            })
    }

    onMount(() => {
        if (!$exportSeed) {
            const newSeed = randomBytes(81)
            exportSeed.set({
                title: '',
                seed: newSeed,
                meta: []
            })
        }
    })
</script>

<style>
    span {
        color: #2f94a9;
        text-decoration: underline;
        cursor: pointer;
    }
    p {
        text-align: center;
    }
</style>

<h1>
    Account balance:
    <strong>{formatIotas(balance)}</strong>
</h1>

<Info center>
    <strong>If your balance is incorrect, make sure you have entered your seed correctly.</strong>
    <br />
    <br />
    If you are sure you have the right seed, try scanning more addresses for the correct balance.
    <Button inline onClick={syncAddresses} disabled={isSyncingAddresses}>Scan more addresses</Button>
</Info>

<p>
    If your balance remains incorrect, please
    <span on:click={onIncorrect}>follow this link</span>
    .
</p>

<Footer cancel>
    <Button {onClick} disabled={isSyncingAddresses}>Continue</Button>
</Footer>
