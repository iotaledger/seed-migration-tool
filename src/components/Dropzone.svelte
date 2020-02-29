<script>
    let dropping = false

    export let onDrop
    export let label = ''

    const onFile = (e) => {
        e.preventDefault()
        dropping = false

        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]

        if (!file || file.size > 100000) {
            return onDrop(false)
        }

        const reader = new FileReader()

        reader.onload = (e) => {
            const buffer = e.target.result
            onDrop(buffer)
        }

        reader.readAsArrayBuffer(file)
    }

    const onEnter = () => {
        dropping = true
    }

    const onLeave = () => {
        dropping = false
    }
</script>

<style>
    .dropzone {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 120px;
        border-radius: 5px;
        border: 2px dashed #fff;
        background: rgba(255, 255, 255, 0.3);
        margin-bottom: 40px;
        margin-top: 3px;

    }

    content {
        display: block;
        position: relative;
        cursor: pointer;
        font-weight: 700;
        z-index: 10;
    }

    h6 {
        font-size: 14px;
        text-align: center;
    }

    h6.dropping {
        pointer-events: none;
    }

    svg {
        display: block;
        margin: 0 auto;
        margin-bottom: 14px;
    }

    input {
        position: absolute;
        opacity: 0;
    }

    label {
        display: block;
        font-size: 14px;
        width: 100%;
        position: relative;
    }
</style>

<div>
    <label>
        {label}
    <label>
    <div class="dropzone" on:drop={onFile} on:dragenter={onEnter} on:dragleave={onLeave} on:dragover|preventDefault>
        <h6 class:dropping>
            {#if dropping}
                Drop your file here
            {:else}
                <content>
                    <svg width="28" height="31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M28 17.937a.81.81 0 01-.796.821c-.437 0-.795-.37-.835-.78V1.642H1.591v16.336a.81.81 0 01-.796.821.81.81
                            0 01-.795-.82V.82A.81.81 0 01.795 0h26.41A.81.81 0 0128 .82v17.117z"
                            fill="#10293B" />
                        <path
                            d="M22.27 12.154a.115.115 0 01.003.037v.328c-.023.024-.033.034-.037.046-.003.009-.003.019-.003.036 0
                            .02-.01.031-.02.041-.01.01-.02.02-.02.041 0
                            .02-.01.031-.02.041-.01.01-.02.02-.02.041-.02.02-.03.041-.04.062-.01.02-.02.041-.04.062-.039
                            0-.079.04-.119.082 0 .04-.04.04-.04.04-.02
                            0-.03.01-.039.021-.01.01-.02.02-.04.02-.023.024-.033.034-.044.039-.009.003-.018.003-.035.003-.023.024-.033.034-.045.038-.008.003-.018.003-.035.003H17.7v2.627a.81.81
                            0 01-.796.82.81.81 0 01-.795-.82v-3.448c0-.452.358-.821.795-.821h2.665L14 5.787l-5.568 5.706h2.864c.437 0
                            .795.37.795.82v3.449a.81.81 0 01-.795.82.81.81 0 01-.796-.82v-2.627H6.602a.887.887 0 01-.636-.246.811.811
                            0 010-1.15l7.477-7.675a.753.753 0 011.114 0l7.437 7.716.12.123c.04 0 .04.041.04.041 0
                            .021.01.031.02.041.01.01.02.021.02.042.022.023.032.033.036.045a.111.111 0
                            01.003.037c.023.023.032.033.037.045zM17.66 18.594a.81.81 0 00-.796-.82.81.81 0 00-.796.82v1.724c0
                            .451.358.82.796.82a.81.81 0 00.795-.82v-1.724zM11.256 17.773a.81.81 0 01.795.821v1.724a.81.81 0
                            01-.795.82.81.81 0 01-.796-.82v-1.724a.81.81 0 01.796-.82zM17.66 24.176a.81.81 0 00-.796-.82.81.81 0
                            00-.796.82v.74c0 .45.358.82.796.82.437 0 .795-.37.795-.82v-.74zM11.256 23.355a.81.81 0 01.795.821v.74c0
                            .45-.358.82-.795.82a.811.811 0 01-.796-.82v-.74a.81.81 0 01.796-.82zM16.864 28.61a.81.81 0
                            00-.796.82v.082c0 .452.358.821.796.821a.81.81 0 00.795-.82v-.083c0-.451-.318-.82-.795-.82zM10.46
                            29.43a.81.81 0 01.796-.82.81.81 0 01.795.82v.082a.81.81 0 01-.795.821.81.81 0 01-.796-.82v-.083z"
                            fill="#10293B" />
                    </svg>
                    <input type="file" on:change={onFile} />
                    Upload Seed Vault
                </content>
            {/if}
        </h6>
    </div>
</div>
