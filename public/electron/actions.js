const { BrowserWindow } = require('electron');
const Store = require('electron-store');
const path = require('path');
const isDev = require('electron-is-dev');

const {
  COLLAPSED_HEIGHT,
  EXPANDED_HEIGHT,
  FETCHED_COLLAPSE,
  FETCHED_POMODOROS,
} = require('../constants');

const store = new Store();

function getMainWindow() {
  const windows = BrowserWindow.getAllWindows();
  return windows.find(win => win.isMainWindow);
}

function collapseWindow() {
  store.set('windowCollapsed', true);
  const win = getMainWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, COLLAPSED_HEIGHT, true);
  win.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

function expandWindow() {
  const win = BrowserWindow.getFocusedWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, EXPANDED_HEIGHT, true);
  store.set('windowCollapsed', false);
  win.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

module.exports = {
  getMainWindow,
  collapseWindow,
  expandWindow,
  openSettings() {
    const settingsWin = new BrowserWindow({
      height: 300,
      width: 300,
      resizable: false,
      fullscreen: false,
      fullscreenable: false,
      titleBarStyle: 'hidden-inset',
      title: 'Preferences',
    });
    settingsWin.loadURL(isDev ? 'http://localhost:3000/settings' : `file://${path.join(__dirname, '../build/index.html/settings')}`);
  },
  startPomodoro(duration, startTime) {
    store.set('pomodoros.current', { duration, startTime });
    const win = getMainWindow();
    win.send(FETCHED_POMODOROS, store.get('pomodoros'));
    if (store.get('focus')) {
      collapseWindow();
    }
  },
};
