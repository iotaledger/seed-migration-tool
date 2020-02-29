import {
    MenuItemConstructorOptions,
    App,
    BrowserWindow,
    Menu,
    shell,
    ipcMain
} from 'electron'
import packageJson from '../../package.json'

const state = {
    enabled: true,
};

let language = {
    about: `Version ${packageJson.version}`,
    errorLog: 'Error log',
    hide: 'Hide',
    quit: 'Quit',
    edit: 'Edit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    documentation: 'Documentation',
};

/**
 * Create native menu tree and apply to the application window
 *
 * @param {App} app - Application object
 * @param {function} getWindow - Get Window instance helper
 *
 * @returns {void}
 */
export const initMenu = (app: App, getWindow: () => BrowserWindow): void => {
    let mainMenu: Menu;

    const navigate = (path) => {
        const window: BrowserWindow = getWindow()

        window.webContents.send('menu', path);

    };

    const createMenu = (): Menu => {
        const template: MenuItemConstructorOptions[] = [
            {
                label: 'Seed Migration Tool',
                submenu: [
                    {
                        label: language.about,
                        enabled: false,

                    },
                    {
                        type: 'separator',
                    },
                    {
                        label: language.errorLog,
                        click: () => navigate('errorlog'),
                        enabled: state.enabled,
                    },
                    {
                        type: 'separator',
                    },

                ],
            },
        ];

        if (process.platform === 'darwin') {
            template[0].submenu = template[0].submenu.concat([
                {
                    label: `${language.hide} ${app.getName()}`,
                    role: 'hide',
                },
                {
                    type: 'separator',
                },
            ]);
        }

        template[0].submenu = template[0].submenu.concat([
            {
                label: language.quit,
                accelerator: 'Command+Q',
                click: function () {
                    app.quit();
                },
            },
        ]);

        template.push({
            label: language.edit,
            submenu: [
                { label: language.undo, accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: language.redo, accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: language.cut, accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: language.copy, accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: language.paste, accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: language.selectAll, accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
            ],
        });

        template.push({
            label: language.documentation,
            submenu: [
                {
                    label: `${language.documentation}`,
                    click: function () {
                        shell.openExternal('https://docs.iota.org/docs/wallets/0.1/trinity/how-to-guides/protect-trinity-account');
                    },
                },
            ],
        });

        const applicationMenu = Menu.buildFromTemplate(template)

        Menu.setApplicationMenu(applicationMenu)

        return applicationMenu;
    };

    app.once('ready', () => {
        ipcMain.on('menu.update', (e, settings) => {
            state[settings.attribute] = settings.value;
            mainMenu = createMenu();
        });

        ipcMain.on('menu.enabled', (e, enabled) => {
            state.enabled = enabled;
            createMenu();
        });

        ipcMain.on('menu.language', (e, data) => {
            language = data;
            mainMenu = createMenu();
        });

        ipcMain.on('menu.popup', () => {
            const window = getWindow();
            mainMenu.popup(window);
        });

        mainMenu = createMenu();
    });
};
