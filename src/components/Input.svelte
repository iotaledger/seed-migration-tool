<script>
    export let value
    export let label
    export let indicator = null
    export let score = null

    export let onConfirm = null

    let inputType = 'password'

    const toggleType = () => {
        inputType = inputType === 'password' ? 'text' : 'password'
    }

    const onInput = (e) => {
        value = e.target.value
    }

    const onKey = (e) => {
        if (e.key === 'Enter') {
            onConfirm()
        }
    }
</script>

<style>
    input {
        width: 100%;
        height: 52px;
        background: #f7f8fa;
        border: 1px solid #ced3dc;
        font-size: 16px;
        border-radius: 4px;
        padding: 0 48px 0 14px;
        margin-bottom: 36px;
        margin-top: 3px;
    }
    label {
        display: block;
        font-size: 14px;
        width: 100%;
        position: relative;
    }

    strong {
        position: absolute;
        top: 0px;
        right: 0px;
        font-size: 14px;
        font-weight: 700;
    }

    .score {
        position: absolute;
        top: 6px;
        right: 2px;
        display: flex;
    }
    .score span {
        display: block;
        height: 4px;
        width: 30px;
        background: #ac4545;
        margin-left: 3px;
    }

    .score span.ok {
        background: #249357;
    }

    .input {
        position: relative;
    }

    .input button {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 30px;
        height: 30px;
        z-index: 2;
        cursor: pointer;
        background: #f7f8fa;
    }
</style>

{#if label}
    <label>
        {label}
        {#if indicator}
            <strong>{indicator}</strong>
        {/if}
        {#if typeof score === 'number'}
            <div class="score">
                <span class:ok={score > 0} />
                <span class:ok={score > 1} />
                <span class:ok={score > 2} />
                <span class:ok={score > 3} />
            </div>
        {/if}
    </label>
{/if}
<div class="input">
    <button class:hidden={inputType === 'password'} on:click={toggleType}>
        {#if inputType !== 'password'}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1024 1024">
                <path
                    fill="#808080"
                    d="M1017.446
                    520.499c-2.406-2.714-60.518-66.816-151.347-131.686-53.606-38.298-107.52-68.813-160.256-90.778-66.816-27.853-132.045-41.984-193.843-41.984s-127.027
                    14.131-193.843 41.984c-52.736 21.965-106.65 52.531-160.256 90.778C67.072 453.683 8.96 517.837 6.554
                    520.499c-8.755 9.728-8.755 24.525 0 34.253 2.406 2.714 60.518 66.816 151.347 131.686 53.606 38.298 107.52
                    68.813 160.256 90.778C384.973 805.069 450.202 819.2 512 819.2s127.027-14.131 193.843-41.984c52.736-21.965
                    106.65-52.531 160.256-90.778 90.829-64.87 148.941-129.024 151.347-131.686 8.755-9.728 8.755-24.525
                    0-34.253zM643.789 329.626C690.227 368.692 716.8 425.524 716.8 486.4c0 112.947-91.853 204.8-204.8
                    204.8s-204.8-91.853-204.8-204.8c0-60.826 26.573-117.709 73.011-156.774C422.297 315.904 466.79 307.2 512
                    307.2s89.702 8.704 131.789 22.426zM835.43 645.427C756.94 701.337 637.132 768 512
                    768s-244.941-66.662-323.43-122.573C129.332 603.238 84.02 560.537 61.133 537.6c22.886-22.938 68.198-65.587
                    127.437-107.827 27.136-19.354 59.187-39.936 94.72-58.624C265.524 406.375 256 445.645 256 486.4c0 141.158
                    114.842 256 256 256s256-114.842 256-256c0-40.755-9.523-80.026-27.29-115.251 35.533 18.688 67.584 39.322 94.72
                    58.624 59.238 42.189 104.55 84.89 127.437 107.827-22.886 22.938-68.198 65.587-127.437 107.827z" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1024 1024">
                <path
                    fill="#808080"
                    d="M1017.45,520.5c-2.41-2.71-60.52-66.82-151.35-131.69C812.49,350.52,758.58,320,705.84,298c-66.81-27.86-132-42-193.84-42s-127,14.13-193.84,42c-52.74,22-106.65,52.53-160.26,90.77C67.07,453.68,9,517.84,6.55,520.5a25.63,25.63,0,0,0,0,34.25C9,557.47,67.07,621.57,157.9,686.44c53.61,38.3,107.52,68.81,160.26,90.78,66.81,27.85,132,42,193.84,42s127-14.13,193.84-42c52.74-22,106.65-52.54,160.26-90.78,90.83-64.87,148.94-129,151.35-131.69a25.63,25.63,0,0,0,0-34.25ZM643.79,329.63a203.91,203.91,0,0,1,73,156.77c0,113-91.85,204.8-204.8,204.8S307.2,599.35,307.2,486.4a204,204,0,0,1,73-156.77C422.3,315.9,466.79,307.2,512,307.2S601.7,315.9,643.79,329.63Zm191.64,315.8C756.94,701.34,637.13,768,512,768S267.06,701.34,188.57,645.43A1024.82,1024.82,0,0,1,61.13,537.6,1029.22,1029.22,0,0,1,188.57,429.77a830.33,830.33,0,0,1,94.72-58.62A255.31,255.31,0,0,0,256,486.4c0,141.16,114.84,256,256,256s256-114.84,256-256a255.31,255.31,0,0,0-27.29-115.25,837.45,837.45,0,0,1,94.72,58.62A1024.82,1024.82,0,0,1,962.87,537.6,1029.22,1029.22,0,0,1,835.43,645.43Z" />
                <rect
                    fill="#808080"
                    x="36.98"
                    y="496.5"
                    width="942.05"
                    height="55"
                    transform="translate(-221.73 512.69) rotate(-45)" />
            </svg>
        {/if}
    </button>
    <input type={inputType} {value} on:input={onInput} on:keydown={onKey} onCopy="return false" onCut="return false" onPaste="return false" />
</div>
