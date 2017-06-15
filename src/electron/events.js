const { ipcMain: ipc } = require('electron');

ipc.on('dupa', () => {
  console.log('wowo');
});
