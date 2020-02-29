<script>
    import { view } from '../lib/state'

    export let route
</script>

{#if $view === route}
    <slot />
{/if}
