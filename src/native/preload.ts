import { remote, ipcRenderer as ipc } from 'electron'
import fs from 'fs'
import path from 'path'
import Entangled from './entangled'
import { SecurityLevels } from '../lib/iota'
import { getCurrentDate } from './helpers'
;(global as any)['Electron'] = {
    getCurrentDate,

    getOS: () => {
        return process.platform
    },

    _eventListeners: {},

    showMenu: () => {
        ipc.send('menu.popup');
    },

    /**
     * Add native window wallet event listener
     * 
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * 
     * @returns {undefined}
     */
    onEvent: function(event, callback) {
        let listeners = this._eventListeners[event];
        if (!listeners) {
            listeners = this._eventListeners[event] = [];
            ipc.on(event, (e, args) => {
                listeners.forEach((call) => {
                    call(args);
                });
            });
        }
        listeners.push(callback);
    },

    /**
     * Remove native window wallet event listener
     * 
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * 
     * @returns {undefined}
     */
    removeEvent: function(event, callback) {
        const listeners = this._eventListeners[event];
        listeners.forEach((call, index) => {
            if (call === callback) {
                listeners.splice(index, 1);
            }
        });
    },

    saveSeedVault: async (buffer: ArrayBuffer) => {
        try {
            const targetPath = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                title: 'Export SeedVault',
                defaultPath: `SeedVault-${getCurrentDate()}.kdbx`,
                buttonLabel: 'Export',
                filters: [{ name: 'SeedVault File', extensions: ['kdbx'] }]
            })

            if (targetPath.canceled) {
                throw Error('Export cancelled')
            }

            fs.writeFileSync(targetPath.filePath, Buffer.from(buffer))

            return true
        } catch (error) {
            return false
        }
    },

    saveLogFile: async (input: string, date?: string) => {
        try {
            const targetPath = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                title: 'Export migration log',
                defaultPath: `MigrationLog-${date || getCurrentDate()}.json`,
                buttonLabel: 'Export',
                filters: [{ name: 'Migration log', extensions: ['json'] }]
            })

            if (targetPath.canceled) {
                throw Error('Export cancelled')
            }

            fs.writeFileSync(targetPath.filePath, input)

            return true
        } catch (error) {
            return false
        }
    },

    savePaperWallet: async () => {
        try {
            const targetPath = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                title: 'Save IOTA seed template',
                defaultPath: `iota-seed-template.pdf`,
                buttonLabel: 'Save',
                filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
            })

            if (targetPath.canceled) {
                throw Error('Export cancelled')
            }

            const devMode = process.env.NODE_ENV === 'development'
            const pdfPath = path.resolve(devMode ? __dirname : remote.app.getAppPath(), devMode ? '../' : './', 'dist/wallet.pdf')

            fs.copyFileSync(pdfPath, targetPath.filePath)

            return true
        } catch (error) {
            return false
        }
    },

    loadFile: async (): Promise<string> => {
        const paths = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: 'Import log file',
            buttonLabel: 'Import',
            filters: [{ name: 'Seed migration log file', extensions: ['json'] }]
        })

        if (paths.canceled || paths.filePaths.length !== 1) {
            return null
        }

        const content = fs.readFileSync(paths.filePaths[0])

        return content.toString()
    },

    generateAddress: async (seed: string, index: number, security: SecurityLevels, total: number): Promise<string | string[]> => {
        if (!total || total === 1) {
            return Entangled.generateAddress(seed, index, security)
        }

        const addresses = []

        for (let i = 0; i < total; i++) {
            const address = await Entangled.generateAddress(seed, index + i, security)
            addresses.push(address)
        }

        return addresses
    },

    minimize: () => {
        remote.getCurrentWindow().minimize()
    },

    maximize: () => {
        const window = remote.getCurrentWindow()
        if (window.isMaximized()) {
            window.unmaximize()
        } else {
            window.maximize()
        }
    },

    close: () => {
        remote.getCurrentWindow().close()
    }
}
