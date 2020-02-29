<script>
    export let step
    export let totalSteps
</script>

<style>
    header {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px 0;
    }

    img {
        width: 316px;
        height: 73px;
    }

    span {
        font-size: 20px;
    }

    h2 {
        font-weight: 700;
        color: #67A5C6;
        margin: 0 auto;
        padding-right: 70px;
    }
</style>

<header>
    <img src="./seed-manager.svg" alt="Seed Manager" />
    {#if step}
        <h2>Step {step} of {totalSteps}</h2>
    {/if}
    <span>Need help? <a href="https://discord.iota.org">Visit our Discord</a></span>
</header>
