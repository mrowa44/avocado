const { app, BrowserWindow } = require('electron');
const path = require('path');
const Store = require('electron-store');
const remove = require('lodash.remove');
const isDev = require('electron-is-dev');
const { createMenuBarIcon } = require('./electron/menu-bar');
const {
  EXPANDED_HEIGHT,
  WINDOW_WIDTH,
} = require('./constants');

require('electron-context-menu')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: EXPANDED_HEIGHT,
    resizable: isDev,
    titleBarStyle: 'hidden-inset',
    width: WINDOW_WIDTH,
    fullscreen: false,
    fullscreenable: false,
    title: 'Avocado',
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) { mainWindow.webContents.openDevTools(); }

  mainWindow.on('closed', () => { mainWindow = null; });
  createMenuBarIcon();
}

app.commandLine.appendSwitch('disable-renderer-backgrounding'); // must be before app.on('ready');
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  const store = new Store();
  const tasks = store.get('tasks');
  remove(tasks, task => task.done);
  store.set('tasks', tasks);
});

function getMainWindow() {
  return mainWindow;
}

module.exports = {
  getMainWindow,
};

require('./electron/events');
