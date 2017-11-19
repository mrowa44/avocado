const path = require('path');
const { app } = require('electron');
const moment = require('moment');
const {
  Menu,
  Tray,
  nativeImage,
} = require('electron');

const {
  deleteCompleted,
  openSettings,
  startPomodoro,
  stopPomodoro,
  toggleExpand,
  giveUpFocus,
} = require('./actions');

let icon;
const iconPath = path.join(__dirname, '../menuIconTemplate.png');

function createPomodoro(time) {
  return () => { startPomodoro(time, moment().format()); };
}

module.exports = {
  createMenuBarIcon(text = '') {
    icon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: '15 min', click: createPomodoro(15) },
      { label: '20 min', click: createPomodoro(20) },
      { label: '25 min', click: createPomodoro(25) },
      { label: '30 min', click: createPomodoro(30) },
      { label: '35 min', click: createPomodoro(35) },
      { label: '40 min', click: createPomodoro(40) },
      { label: '45 min', click: createPomodoro(45) },
      { label: '50 min', click: createPomodoro(50) },
      { label: '55 min', click: createPomodoro(55) },
      { label: '60 min', click: createPomodoro(60) },
    ]);
    icon.setToolTip('Avocado');
    icon.setContextMenu(contextMenu);
    icon.setTitle(text);
    return icon;
  },
  destroyMenuBarIcon() { icon.destroy(); },
  getIconInstance() { return icon; },
  setNoIcon() {
    const emptyImg = nativeImage.createEmpty();
    emptyImg.resize({ width: 0, height: 0 });
    if (icon) {
      icon.setImage(emptyImg);
    }
  },
  setNormalIcon() {
    if (icon) {
      icon.setImage(iconPath);
      icon.setTitle('');
    }
  },
  createMenuActions() {
    const name = app.getName();
    const template = [
      {
        label: name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          {
            label: 'Preferences...',
            accelerator: 'Cmd+,',
            click: openSettings,
          },
          { type: 'separator' },
          {
            role: 'services',
            submenu: [],
          },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' },
            ],
          },
        ],
      },
      {
        label: 'Tasks',
        submenu: [
          {
            label: 'Delete completed tasks',
            accelerator: 'Cmd+Shift+Backspace',
            click: deleteCompleted,
          },
          {
            label: 'Give up focus',
            accelerator: 'Cmd+G',
            click: giveUpFocus,
          },
        ],
      },
      {
        label: 'Pomodoro',
        submenu: [
          {
            label: 'Stop pomodoro',
            accelerator: 'Cmd+S',
            click: stopPomodoro,
          },
        ],
      },
      {
        role: 'window',
        submenu: [
          {
            label: 'Expand/collapse',
            accelerator: 'Cmd+E',
            click: toggleExpand,
          },
          { role: 'minimize' },
          { role: 'close' },
          { label: 'Zoom', role: 'zoom' },
          { type: 'separator' },
          { label: 'Bring All to Front', role: 'front' },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};
