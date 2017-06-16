const Store = require('electron-store');
const { ipcMain: ipc } = require('electron');

const {
  ADD_TODO,
  FETCH_TASKS,
  FETCHED_TASKS,
  TOGGLE_DONE,
} = require('../constants');

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
