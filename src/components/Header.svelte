<script>
    export let step
    export let totalSteps
</script>

<style>
    header {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 40px 0;
        background: #fff;
    }

    img {
        width: 221px;
        height: 51px;
    }

    span {
        font-size: 20px;
    }

    div {
        height: 5px;
        display: flex;
        flex: 9;
        flex-direction: row;
    }

    div div {
        height: 5px;
        width: 10px;
        background: #000;
        flex: 1;
        border-right: 4px solid #fff;
        justify-content: center;
    }

    div div:last-of-type {
        border-right: 0px;
    }

    .currentStep {
        background: #5dbcd2;
    }

    .futureStep {
        background: #fff;
    }
    
    .pastStep {
        background: #249357;
    }

    div span {
        font-size: 16px;
        padding-top: 10px;
    }
</style>

<header>
    <img src="./seed-manager.svg" alt="Seed Manager" />
    <span>Need help? <a href="https://discord.iota.org">Visit our Discord</a></span>
</header>
<div>
        {#each new Array(totalSteps) as s, i}
            {#if i + 1 < step}
                <div class="pastStep"/>
            {:else if i + 1 === step}
                <div class="currentStep">
                    <span>Step {step} of {totalSteps}</span>
                </div>
            {:else if i + 1 > step}
                <div class="futureStep"/>
            {/if}
        {/each}
</div>
