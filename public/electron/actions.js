const path = require('path');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const remove = require('lodash.remove');
const {
  BrowserWindow,
  app,
} = require('electron');

const {
  BUILD_URL,
  COLLAPSED_HEIGHT,
  DEV_URL,
  EXPANDED_HEIGHT,
  FETCHED_COLLAPSE,
  FETCHED_FOCUS,
  FETCHED_POMODOROS,
  FETCHED_TASKS,
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

  const isAlwaysOnTop = store.get('settings.alwaysOnTop');
  if (isAlwaysOnTop) {
    win.setAlwaysOnTop(true);
  }

  win.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

function expandWindow() {
  store.set('windowCollapsed', false);

  const win = BrowserWindow.getFocusedWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, EXPANDED_HEIGHT, true);

  win.setAlwaysOnTop(false);

  win.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

module.exports = {
  getMainWindow,
  collapseWindow,
  expandWindow,
  openSettings() {
    const windows = BrowserWindow.getAllWindows();
    const oldSettingsWin = windows.find(win => win.isSettingsWin);
    if (oldSettingsWin) {
      oldSettingsWin.focus();
      return;
    }

    const settingsWin = new BrowserWindow({
      height: 300,
      width: 300,
      resizable: false,
      fullscreen: false,
      fullscreenable: false,
      titleBarStyle: 'hidden-inset',
      title: 'Preferences',
    });
    settingsWin.isSettingsWin = true;
    const settingsUrl = isDev ? `${DEV_URL}#settings` : `${BUILD_URL}#settings`;
    settingsWin.loadURL(settingsUrl);
    if (isDev) { settingsWin.webContents.openDevTools(); }
  },
  startPomodoro(duration, startTime) {
    store.set('pomodoros.current', { duration, startTime });
    const win = getMainWindow();
    win.send(FETCHED_POMODOROS, store.get('pomodoros'));
    if (store.get('focus')) {
      collapseWindow();
    }
  },
  stopPomodoro() {
    store.set('pomodoros.current', null);
    const icon = app.trayIcon;
    if (icon) {
      const iconPath = path.join(__dirname, '../menuIconTemplate.png');
      icon.setImage(iconPath);
      icon.setTitle('');
    }
    const win = getMainWindow();
    win.send(FETCHED_POMODOROS, store.get('pomodoros'));
  },
  deleteCompleted() {
    const tasks = store.get('tasks');
    remove(tasks, task => task.done);
    store.set('tasks', tasks);
    const win = getMainWindow();
    if (win) {
      win.send(FETCHED_TASKS, store.get('tasks'));
    }
  },
  toggleExpand() {
    const isCollapsed = store.get('windowCollapsed');
    if (isCollapsed) {
      expandWindow();
    } else {
      collapseWindow();
    }
  },
  giveUpFocus() {
    const task = store.get('focus');
    const win = getMainWindow();
    if (task) {
      store.set('focus', null);
      win.send(FETCHED_FOCUS, store.get('focus'));
    }
  },
  markFocusDone() {
    const tasks = store.get('tasks');
    const focus = store.get('focus');
    if (focus) {
      const task = tasks.find(t => t.id === focus.id);
      const idx = tasks.indexOf(task);

      const toggledTask = Object.assign(task, { done: !task.done });
      const newTasks = Object.assign(tasks.slice(), { [idx]: toggledTask });

      store.set('tasks', newTasks);
      store.set('focus', null);
      const win = getMainWindow();
      win.send(FETCHED_TASKS, store.get('tasks'));
      win.send(FETCHED_FOCUS, store.get('focus'));
      expandWindow();
    }
  },
  quitApp() {
    app.quit();
  },
};
