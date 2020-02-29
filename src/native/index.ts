import { app, BrowserWindow, shell } from 'electron'
import { initMenu } from './menu'
import path from 'path'

const devMode = process.env.NODE_ENV === 'development'

/**
 * Terminate application if Node remote debugging detected
 */
const argv = process.argv.join()
if (argv.includes('inspect') || argv.includes('remote')) {
    app.quit()
}

let mainWindow: BrowserWindow

function createWindow(): void {
    const url = devMode ? 'http://localhost:3000' : `file://${path.join(__dirname, 'index.html')}`
    const urlPreload = path.resolve(devMode ? __dirname : app.getAppPath(), devMode ? '../' : './', 'dist/preload.js')

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 740,
        minWidth: 720,
        minHeight: 720,
        frame: process.platform === 'linux',
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            disableBlinkFeatures: 'Auxclick',
            preload: urlPreload,
            webviewTag: false
        }
    })

    mainWindow.loadURL(url)

    if (devMode) {
        mainWindow.webContents.once('dom-ready', () => {
            mainWindow.webContents.openDevTools({ mode: 'detach' })
        })
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.on('will-navigate', (e, targetURL) => {
        if (url.indexOf(targetURL) !== 0) {
            e.preventDefault()

            const whitelist = ['discord.iota.org', 'www.iota.org', 'status.iota.org', 'iota.org', 'thetangle.org', 'docs.iota.org', 'docs.google.com']

            try {
                const parsedURL = new URL(targetURL)
                if (whitelist.indexOf(parsedURL.hostname) > -1) {
                    shell.openExternal(targetURL)
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
}

app.on('ready', createWindow)

initMenu(app, () => mainWindow);


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
