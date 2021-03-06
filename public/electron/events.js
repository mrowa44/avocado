const Store = require('electron-store');
const remove = require('lodash.remove');

const { formatToday } = require('../helpers');
const {
  app,
  ipcMain: ipc,
} = require('electron');
const {
  getIconInstance,
  setNoIcon,
  setNormalIcon,
} = require('./menu');
const {
  ADD_TODO,
  COLLAPSE_WINDOW,
  COMPLETE_FOCUS_TASK,
  DELETE_TASK,
  EXPAND_WINDOW,
  FETCHED_ALWAYS_ON_TOP,
  FETCHED_COLLAPSE,
  FETCHED_DAILY_GOAL,
  FETCHED_DOCK_ICON_HIDDEN,
  FETCHED_FOCUS,
  FETCHED_POMODOROS,
  FETCHED_TASKS,
  FETCH_ALWAYS_ON_TOP,
  FETCH_COLLAPSE,
  FETCH_DAILY_GOAL,
  FETCH_DOCK_ICON_HIDDEN,
  FETCH_FOCUS,
  FETCH_POMODOROS,
  FETCH_TASKS,
  GIVE_UP_FOCUS,
  INITIAL_TASKS,
  POMODORO_FINISHED,
  POMODORO_START,
  POMODORO_STOP,
  POMODORO_TIME,
  SET_FOCUS,
  TOGGLE_DONE,
  UPDATE_ALWAYS_ON_TOP,
  UPDATE_DAILY_GOAL,
  UPDATE_HIDE_DOCK_ICON,
} = require('../constants');
const {
  collapseWindow,
  expandWindow,
  getMainWindow,
  markFocusDone,
  startPomodoro,
  stopPomodoro,
} = require('./actions');

const store = new Store();

ipc.on(FETCH_TASKS, (event) => {
  if (!store.get('tasks')) {
    store.set('tasks', INITIAL_TASKS);
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

ipc.on(DELETE_TASK, (event, taskId) => {
  const tasks = store.get('tasks');
  remove(tasks, task => task.id === taskId);
  store.set('tasks', tasks);

  const focus = store.get('focus');
  if (focus && focus.id === taskId) {
    store.set('focus', null);
    event.sender.send(FETCHED_FOCUS);
  }
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

ipc.on(POMODORO_STOP, stopPomodoro);

ipc.on(POMODORO_TIME, (event, time) => {
  const icon = getIconInstance();
  if (icon) {
    icon.setTitle(time);
    setNoIcon();
  }
});

ipc.on(POMODORO_START, (event, duration, startTime) => {
  startPomodoro(duration, startTime);
});

ipc.on(COLLAPSE_WINDOW, (event) => { collapseWindow(event); });

ipc.on(EXPAND_WINDOW, (event) => {
  expandWindow(event);
});

ipc.on(FETCH_COLLAPSE, (event) => {
  event.sender.send(FETCHED_COLLAPSE, store.get('windowCollapsed'));
});

ipc.on(SET_FOCUS, (event, task) => {
  const currentFocus = store.get('focus');
  if (currentFocus && currentFocus.id === task.id) {
    store.set('focus', null);
    event.sender.send(FETCHED_FOCUS, store.get('focus'));
  } else {
    store.set('focus', task);
    event.sender.send(FETCHED_FOCUS, store.get('focus'));
    if (store.get('pomodoros.current')) {
      collapseWindow(event);
    }
  }
});

ipc.on(FETCH_FOCUS, (event) => {
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
});

ipc.on(COMPLETE_FOCUS_TASK, markFocusDone);

ipc.on(GIVE_UP_FOCUS, (event) => {
  store.set('focus', null);
  event.sender.send(FETCHED_FOCUS, store.get('focus'));
  expandWindow(event);
});

ipc.on(FETCH_DAILY_GOAL, (event) => {
  event.sender.send(FETCHED_DAILY_GOAL, store.get('pomodoros.goal'));
});

ipc.on(UPDATE_DAILY_GOAL, (event, newGoal) => {
  store.set('pomodoros.goal', newGoal);
  const mainWin = getMainWindow();
  mainWin.send(FETCHED_POMODOROS, store.get('pomodoros'));
  event.sender.send(FETCHED_DAILY_GOAL, store.get('pomodoros.goal'));
});

ipc.on(FETCH_ALWAYS_ON_TOP, (event) => {
  const isAlwaysOnTop = store.get('settings.alwaysOnTop');
  event.sender.send(FETCHED_ALWAYS_ON_TOP, isAlwaysOnTop);
});

ipc.on(UPDATE_ALWAYS_ON_TOP, (event, isAlwaysOnTop) => {
  store.set('settings.alwaysOnTop', isAlwaysOnTop);
  event.sender.send(FETCHED_ALWAYS_ON_TOP, isAlwaysOnTop);
});

ipc.on(UPDATE_HIDE_DOCK_ICON, (event, hideDockIcon) => {
  store.set('settings.hideDockIcon', hideDockIcon);
  if (hideDockIcon) {
    app.dock.hide();
  } else {
    app.dock.show();
  }
  event.sender.send(FETCHED_DOCK_ICON_HIDDEN, hideDockIcon);
});

ipc.on(FETCH_DOCK_ICON_HIDDEN, (event) => {
  const isIconHidden = store.get('settings.hideDockIcon');
  event.sender.send(FETCHED_DOCK_ICON_HIDDEN, isIconHidden);
});
