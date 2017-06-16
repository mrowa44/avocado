const Store = require('electron-store');
const { ipcMain: ipc } = require('electron');

const {
  FETCH_TASKS,
  FETCHED_TASKS,
} = require('../constants');

const store = new Store();

ipc.on('dupa', () => {
  console.log('wowo');
});

ipc.on(FETCH_TASKS, (event) => {
  if (!store.get('tasks')) {
    store.set('tasks', []);
  }
  event.sender.send(FETCHED_TASKS, store.get('tasks'));
});
