<script>
    const os = global.Electron ? Electron.getOS() : 'win32'
</script>

<style>
    div {
        width: 100vw;
        height: 40px;
        position: fixed;
        top: 0px;
        left: 0px;
        -webkit-app-region: drag;
        z-index: 99998;
    }

    div:after {
        display: block;
        content: '';
        width: 100vw;
        height: 6px;
        position: absolute;
        top: 0px;
        left: 0px;
        -webkit-app-region: no-drag;
        z-index: 2;
    }

    nav {
        display: flex;
        width: 100%;
        height: 40px;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;
    }

    button {
        margin-left: 40px;
        width: 21px;
        height: 21px;
        background: none;
        border: none;
        cursor: pointer;
        -webkit-app-region: no-drag;
    }

    button {
        -webkit-app-region: no-drag;
    }

    svg {
        margin: 3px;
        -webkit-app-region: no-drag;
    }

    svg path {
        fill: #000;
        -webkit-app-region: no-drag;
    }

    button:hover svg path {
        fill: #ccc;
    }

    a {
        width: 21px;
        height: 21px;
        -webkit-app-region: no-drag;
        position: absolute;
        left: 20px;
    }
</style>

<div>
    {#if os === 'win32'}
        <nav>
            <a on:click={() => global.Electron.showMenu()}>
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path fill="#000" d="M0 1h15v1h-15z" />
                    <path fill="#000" d="M0 7h15v1h-15z" />
                    <path fill="#000" d="M0 13h15v1h-15z" />
                </svg>
            </a>
            <button on:click={() => global.Electron.minimize()}>
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path fill="#000" d="M0 12h15v1h-15z" />
                </svg>
            </button>
            <button on:click={() => global.Electron.maximize()}>
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path d="M1 1v13h13v-13h-13zm-1-1h15v15h-15v-15z" />
                </svg>
            </button>
            <button on:click={() => global.Electron.close()}>
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path
                        d="M7.425 6.718l6.718-6.718.707.707-6.718 6.718 6.718 6.718-.707.707-6.718-6.718-6.718 6.718-.707-.707
                        6.718-6.718-6.718-6.718.707-.707 6.718 6.718z" />
                </svg>
            </button>
        </nav>
    {/if}
</div>
