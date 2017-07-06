const Store = require('electron-store');

const { formatToday } = require('../helpers');
const { ipcMain: ipc } = require('electron');
const {
  getIconInstance,
  setNoIcon,
  setNormalIcon,
} = require('./menu-bar');
const {
  ADD_TODO,
  COLLAPSED_HEIGHT,
  COLLAPSE_WINDOW,
  EXPANDED_HEIGHT,
  EXPAND_WINDOW,
  FETCHED_POMODOROS,
  FETCHED_TASKS,
  FETCH_POMODOROS,
  FETCH_TASKS,
  POMODORO_FINISHED,
  POMODORO_START,
  POMODORO_TIME,
  TOGGLE_DONE,
} = require('../constants');
const { getMainWindow } = require('../electron');

const store = new Store();

ipc.on(FETCH_TASKS, (event) => {
  if (!store.get('tasks')) {
    store.set('tasks', []);
  }
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
});

ipc.on(ADD_TODO, (event, text) => {
  const tasks = store.get('tasks');
  const ids = tasks.map(t => t.id);
  const nextId = Math.max(0, ...ids) + 1;
  const task = { text, done: false, id: nextId };
  store.set('tasks', [task, ...tasks]);
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
});

ipc.on(TOGGLE_DONE, (event, taskId) => {
  const tasks = store.get('tasks');
  const task = tasks.find(t => t.id === taskId);
  const idx = tasks.indexOf(task);

  const toggledTask = Object.assign(task, { done: !task.done });
  const newTasks = Object.assign(tasks.slice(), { [idx]: toggledTask });

  store.set('tasks', newTasks);
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
});

ipc.on(FETCH_POMODOROS, (event) => {
  if (!store.get('pomodoros')) {
    store.set('pomodoros', { goal: 6 });
  }

  const today = formatToday();
  if (!store.get(`pomodoros.${today}`)) {
    store.set(`pomodoros.${today}`, 0);
  }
  event.sender.send(FETCHED_POMODOROS, store.get('pomodoros'));
});

ipc.on(POMODORO_FINISHED, (event) => {
  const key = `pomodoros.${formatToday()}`;
  const count = store.get(key);
  store.set(key, count + 1);
  store.set('pomodoros.current', null);
  setNormalIcon();
  const icon = getIconInstance();
  if (icon) {
    icon.setTitle('');
  }
  event.sender.send(FETCHED_POMODOROS, store.get('pomodoros'));
});

ipc.on(POMODORO_TIME, (event, time) => {
  const icon = getIconInstance();
  if (icon) {
    icon.setTitle(time);
    setNoIcon();
  }
});

ipc.on(POMODORO_START, (event, duration, startTime) => {
  store.set('pomodoros.current', { duration, startTime });
});

ipc.on(COLLAPSE_WINDOW, () => {
  const win = getMainWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, COLLAPSED_HEIGHT, true);
});

ipc.on(EXPAND_WINDOW, () => {
  const win = getMainWindow();
  const oldBounds = win.getBounds();
  win.setSize(oldBounds.width, EXPANDED_HEIGHT, true);
});