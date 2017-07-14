const { BrowserWindow } = require('electron');
const Store = require('electron-store');

const {
  COLLAPSED_HEIGHT,
  EXPANDED_HEIGHT,
  FETCHED_COLLAPSE,
  FETCHED_POMODOROS,
} = require('../constants');

const store = new Store();

function collapseWindow(event) {
  const win = BrowserWindow.getFocusedWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, COLLAPSED_HEIGHT, true);
  store.set('windowCollapsed', true);
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

function expandWindow(event) {
  const win = BrowserWindow.getFocusedWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, EXPANDED_HEIGHT, true);
  store.set('windowCollapsed', false);
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

module.exports = {
  collapseWindow,
  expandWindow,
  openSettings() {
    console.log('wow');
  },
  startPomodoro(eventSender, duration, startTime) {
    store.set('pomodoros.current', { duration, startTime });
    eventSender.send(FETCHED_POMODOROS, store.get('pomodoros'));
    if (store.get('focus')) {
      collapseWindow(event);
    }
  },
};
