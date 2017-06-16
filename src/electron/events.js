const Store = require('electron-store');
const { ipcMain: ipc } = require('electron');

const store = new Store();

ipc.on('dupa', () => {
  console.log('wowo');
});

ipc.on('fetch-tasks', (event) => {
  if (!store.get('tasks')) {
    store.set('tasks', []);
  }
  console.log(store.get('tasks'));
  event.sender.send('fetched-tasks', store.get('tasks'));
});
