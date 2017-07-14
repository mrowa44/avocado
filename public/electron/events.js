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
  COMPLETE_FOCUS_TASK,
  EXPAND_WINDOW,
  FETCHED_COLLAPSE,
  FETCHED_FOCUS,
  FETCHED_POMODOROS,
  FETCHED_TASKS,
  FETCH_COLLAPSE,
  FETCH_FOCUS,
  FETCH_POMODOROS,
  FETCH_TASKS,
  GIVE_UP_FOCUS,
  POMODORO_FINISHED,
  POMODORO_START,
  POMODORO_STOP,
  POMODORO_TIME,
  SET_FOCUS,
  TOGGLE_DONE,
} = require('../constants');
const {
  setNormalWindowHeight,
  setWindowHeight,
} = require('../electron');

const store = new Store();

function collapseWindow(event) {
  setWindowHeight(COLLAPSED_HEIGHT);
  store.set('windowCollapsed', true);
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

function expandWindow(event) {
  setNormalWindowHeight();
  store.set('windowCollapsed', false);
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
}

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

  const focus = store.get('focus');
  if (toggledTask.done && focus && focus.id === toggledTask.id) {
    store.set('focus', null);
    event.sender.send(FETCHED_FOCUS, store.get('focus'));
  }

  store.set('tasks', newTasks);
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
});

ipc.on(FETCH_POMODOROS, (event) => {
  if (!store.get('pomodoros')) {
    store.set('pomodoros', { goal: 6, current: null });
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
  event.sender.send(FETCHED_POMODOROS, store.get('pomodoros'));
});

ipc.on(POMODORO_STOP, (event) => {
  store.set('pomodoros.current', null);
  setNormalIcon();
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
  event.sender.send(FETCHED_POMODOROS, store.get('pomodoros'));
  if (store.get('focus')) {
    collapseWindow(event);
  }
});

ipc.on(COLLAPSE_WINDOW, (event) => { collapseWindow(event); });

ipc.on(EXPAND_WINDOW, (event) => {
  expandWindow(event);
});

ipc.on(FETCH_COLLAPSE, (event) => {
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
});

ipc.on(SET_FOCUS, (event, task) => {
  store.set('focus', task);
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
  if (store.get('pomodoros.current')) {
    collapseWindow(event);
  }
});

ipc.on(FETCH_FOCUS, (event) => {
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
});

ipc.on(COMPLETE_FOCUS_TASK, (event) => {
  const tasks = store.get('tasks');
  const focus = store.get('focus');
  const task = tasks.find(t => t.id === focus.id);
  const idx = tasks.indexOf(task);

  const toggledTask = Object.assign(task, { done: !task.done });
  const newTasks = Object.assign(tasks.slice(), { [idx]: toggledTask });

  store.set('tasks', newTasks);
  store.set('focus', null);
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
  expandWindow(event);
});

ipc.on(GIVE_UP_FOCUS, (event) => {
  store.set('focus', null);
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
  expandWindow(event);
});
