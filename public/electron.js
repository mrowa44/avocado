const Store = require('electron-store');
const isDev = require('electron-is-dev');
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

require('electron-context-menu')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const store = new Store();

function createWindow() {
  mainWindow = new BrowserWindow({
    height: store.get('windowCollapsed') ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
    width: WINDOW_WIDTH,
    resizable: false,
    titleBarStyle: 'hidden-inset',
    fullscreen: false,
    fullscreenable: false,
    title: 'Avocado',
  });

  const appUrl = isDev ? DEV_URL : BUILD_URL;
  mainWindow.loadURL(appUrl);
  mainWindow.isMainWindow = true; // the uglies hack ever?
  if (isDev) { mainWindow.webContents.openDevTools(); }

  mainWindow.on('closed', () => { mainWindow = null; });
  app.trayIcon = createMenuBarIcon();
  createMenuActions();
}

app.commandLine.appendSwitch('disable-renderer-backgrounding'); // must be before app.on('ready');
app.on('ready', createWindow);
app.on('browser-window-focus', () => { app.dock.setBadge(''); });
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
