<script>
    import { exportSeed } from '../../lib/state'
    import { bytesToString, getSeedChecksum } from '../../lib/helpers'

    import Button from '../../components/Button.svelte'
    import Footer from '../../components/Footer.svelte'

    export let onDone

    let activeRow = 0

    let onPaperWallet = () => {
        global.Electron.savePaperWallet()
    }

    let rows = Array(9).fill(Array(9).fill(''))
</script>

<style>
    div {
        height: calc(100vh - 300px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    ul {
        margin: 0 auto 20px;
        width: 420px;
        position: relative;
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid #ac4545;
        border-radius: 5px;
        padding: 20px 0 0 14px;
    }

    li {
        position: relative;
        align-items: center;
        list-style: none;
        margin-bottom: 8px;
        line-height: 25px;
        margin: 0px;
    }

    button {
        cursor: pointer;
        position: absolute;
        right: -70px;
        top: 50%;
        width: 50px;
        height: 50px;
    }

    button:last-of-type {
        background: #41dcf3;
    }

    button:first-of-type {
        transform: translate(0, -50px) rotateX(180deg);
    }

    button:first-of-type svg {
        opacity: 0.3;
    }

    button:hover {
        opacity: 0.75;
    }

    li strong {
        position: absolute;
        left: -50px;
        display: inline-block;
        background: #b5b6b6;
        color: #18373e;
        width: 24px;
        height: 24px;
        text-align: center;
        font-weight: 400;
        font-size: 14px;
        margin-right: 45px;
    }

    li.active strong {
        background: #88d4ff;
    }

    span {
        display: inline-block;
        width: 14px;
        height: 23px;
        font-size: 26px;
        margin: 0 10px 20px;
        font-family: 'Source Code Pro';
        color: #b5b6b6;
        -webkit-user-select: none;
    }

    li.active span {
        color: #10293b;
    }

    span:nth-of-type(3n) {
        margin-right: 50px;
    }
    span:last-of-type {
        margin-right: 0px;
    }

    #paper-wallet {
        display: none;
    }

    p {
        position: relative;
        text-align: center;
        color: #76838b;
        width: 220px;
        margin: 0 auto 60px;
        cursor: help;
    }

    p strong {
        color: #10293b;
    }

    p small {
        position: absolute;
        width: 300px;
        color: #000;
        font-size: 14px;
        line-height: 21px;
        left: 50%;
        bottom: 100%;
        transform: translate(-50%, -10px);
        background: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
        padding: 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.2s ease-in;
    }

    p:hover small {
        opacity: 1;
    }
</style>

<h1>Write down your Seed</h1>
<h2>Make a note of all the characters, line by line in the red box below</h2>
<div>
    {#if $exportSeed && $exportSeed.seed}
        <ul>
            {#each rows as cols, row}
                <li class:active={row === activeRow}>
                    <strong>{row + 1}</strong>
                    {#each cols as item, col}
                        <span>{bytesToString([$exportSeed.seed[col + row * 9]])}</span>
                    {/each}

                </li>
            {/each}
            <button on:click={() => (activeRow = Math.max(0, activeRow - 1))}>
                <svg width="18" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.706 24.707l8-8a1.001 1.001 0 00-1.414-1.414L10 21.587V1a1 1 0 00-2 0v20.587l-6.295-6.292A1.001 1.001
                        0 000 16.001c0 .254.098.512.294.706l8.001 8c.39.39 1.024.39 1.414 0h-.002z"
                        fill="#10293B" />
                </svg>
            </button>
            <button on:click={() => (activeRow = Math.min(8, activeRow + 1))}>
                <svg width="18" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.706 24.707l8-8a1.001 1.001 0 00-1.414-1.414L10 21.587V1a1 1 0 00-2 0v20.587l-6.295-6.292A1.001 1.001
                        0 000 16.001c0 .254.098.512.294.706l8.001 8c.39.39 1.024.39 1.414 0h-.002z"
                        fill="#10293B" />
                </svg>
            </button>
        </ul>
        <p>
            Seed checksum:
            <strong>{getSeedChecksum($exportSeed.seed)}</strong>
            <small>
                Whenever you add a seed to your wallet, you should ensure that the wallet-generated checksum matches the one you
                have written down.
            </small>
        </p>
    {/if}
</div>
<img src="./paper-wallet.svg" alt="" id="paper-wallet" />

<Footer>
    <Button secondary onClick={onPaperWallet}>Save blank seed template</Button>
    <Button onClick={onDone}>I’ve finished copying my seed</Button>
</Footer>
