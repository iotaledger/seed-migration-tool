<script>
    export let checked = false
    export let onCheckbox
</script>

<style>
    div {
        display: flex;
        width: 22px;
        height: 22px;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        margin-right: 25px;
        background: #fff;
        align-items: center;
        justify-content: center;
    }

    .checked {
        border-color: #249357;
    }

    img {
        display: flex;
        width: 20px;
        height: 20px;
    }
</style>


<div
    on:click={onCheckbox}
    class={checked ? 'checked' : null}
>
    {#if checked}
         <img src="./check-square.svg" alt="" />
    {/if}
</div>
