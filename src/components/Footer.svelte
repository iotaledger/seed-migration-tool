<script>
    import Button from './Button'
    import { resetState, view } from '../lib/state'

    export let cancel = false
    export let back = false
    export let previousScreen = ''

    export let onBack = () => {
        view.set(previousScreen)
    }
</script>

<footer>
    {#if cancel}
        <Button onClick={resetState} dark>Cancel Migration</Button>
    {:else if back}
        <Button onClick={onBack} dark>Back</Button>
    {/if}
    <slot />
</footer>
