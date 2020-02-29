<script>
    export let onClick
    export let disabled = false
    export let dark = false
    export let inline = false
    export let secondary = false
</script>

<style>
    button {
        display: block;
        flex: 1;
        background: #41dcf3;
        height: 72px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
    }

    button.inline {
        border-radius: 5px;
        margin: 30px auto 0px;
        padding: 0 40px;
        height: 44px;
    }

    button.dark {
        background: #062332;
        color: #fff;
    }

    button.disabled {
        background: #5cb5d4;
        color: #408ea8;
        pointer-events: none;
    }

    button.secondary {
        background: #47819d;
        color: #fff;
    }

    button:hover {
        background: #3dd6ed;
    }

    button.dark:hover {
        background: #0b3043;
    }

    button.secondary:hover {
        background: #407792;
        color: #fff;
    }
</style>

<button class:secondary class:dark class:inline class:disabled on:click={onClick}>
    <slot />
</button>
