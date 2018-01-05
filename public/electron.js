const Store = require('electron-store');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const {
  app,
  BrowserWindow,
} = require('electron');

const {
  createMenuActions,
  createMenuBarIcon,
  destroyMenuBarIcon,
} = require('./electron/menu');
const {
  deleteCompleted,
} = require('./electron/actions');
const {
  BUILD_URL,
  COLLAPSED_HEIGHT,
  DEV_URL,
  EXPANDED_HEIGHT,
  WINDOW_WIDTH,
} = require('./constants');

require('electron-debug')({ showDevTools: 'undocked' });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const store = new Store();

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    frame: false,
    fullscreen: false,
    fullscreenable: false,
    height: store.get('windowCollapsed') ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
    resizable: false,
    title: 'Avocado',
    titleBarStyle: 'hiddenInset',
    width: WINDOW_WIDTH,
  });

  const appUrl = isDev ? DEV_URL : BUILD_URL;
  mainWindow.loadURL(appUrl);
  mainWindow.isMainWindow = true; // the uglies hack ever?

  mainWindow.on('closed', () => { mainWindow = null; });
  app.trayIcon = createMenuBarIcon();
  createMenuActions();
  autoUpdater.checkForUpdatesAndNotify();

  const dockIconHidden = store.get('settings.hideDockIcon');
  if (dockIconHidden) {
    app.dock.hide();
  }
}

// reload automatically in dev env
try {
  require('electron-reloader')(module); // eslint-disable-line
} catch (error) {
  // try catch necessary for production
}

app.commandLine.appendSwitch('disable-renderer-backgrounding'); // must be before app.on('ready');
app.on('ready', createWindow);
app.on('before-quit', deleteCompleted);

app.on('window-all-closed', () => {
  destroyMenuBarIcon();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

require('./electron/events');
