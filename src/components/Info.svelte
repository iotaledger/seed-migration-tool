<script>
    export let center
    export let left
    export let warning
    export let error
    export let success
</script>

<style>
    p {
        background: rgba(255, 255, 255, 0.3);
        padding: 40px;
        border-radius: 5px;
        margin-bottom: 40px;
        width: 100%;
    }

    p.center {
        text-align: center;
    }

    p.left {
        text-align: left;
    }

    p.warning {
        color: #10293b;
        border: 1px solid #ac4545;
        padding: 25px 20px 30px;
    }

    p.error {
        background: #ac4545;
        color: #fff;
        padding: 25px 20px 30px;
    }

    p.success {
        border: 1px solid #249357;
        padding: 25px 20px 30px;
    }

    :global(p a) {
        color: #2f94a9;
    }
</style>

<p class:center class:left class:warning class:error class:success>
    <slot />
</p>
