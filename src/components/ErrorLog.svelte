<script>
    import { onMount, onDestroy, getContext } from 'svelte'
    import { formatTime } from '../lib/helpers'
    import ErrorLog from './ErrorLog'
    import Button from './Button'
    import { errorLog } from '../lib/state'

    const { open } = getContext('simple-modal')

    const onMenuToggle = (path) => {
        open(ErrorLog)
    }

    onMount(() => {
        global.Electron.onEvent('menu', onMenuToggle)
    })

    onDestroy(() => {
        global.Electron.removeEvent('menu', onMenuToggle)
    })
</script>

<style>
    ul {
        margin-bottom: 20px;
        overflow-wrap: break-word;
    }

    li {
        list-style: none;
        margin: 0 0 8px;
        user-select: all;
        cursor: text;
    }

    article {
        max-height: calc(100vh - 400px);
        height: calc(100vh - 200px);
        display: block;
        position: relative;
        text-align: left;
        padding: 20px 10px 20px 20px;
    }

    p {
        margin: 120px auto;
        text-align: center;
    }

    strong {
        margin-right: 7px;
    }
</style>

<article>
    <h2>Error Log</h2>
    {#if $errorLog.length === 0}
        <p>No errors in log</p>
    {:else}
        <ul>
            {#each $errorLog.slice().reverse() as log}
                <li>
                    <strong>{formatTime(log.timestamp)}</strong>
                    <span>{log.error}</span>
                </li>
            {/each}
        </ul>
    {/if}
</article>
