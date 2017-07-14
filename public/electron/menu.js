const path = require('path');
const electron = require('electron');
const {
  Menu,
  MenuItem,
  Tray,
  nativeImage,
} = require('electron');

let icon;
const emptyIcon = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const iconPath = path.join(__dirname, '../icon.png');

module.exports = {
  createMenuBarIcon(text = '') {
    icon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Item1',
        type: 'normal',
        click: () => {
          console.log('wow');
        },
      },
      {
        label: 'Item1',
        type: 'normal',
        click: () => {
          console.log('wow');
        },
      },
      {
        label: 'Item1',
        type: 'normal',
        click: () => {
          console.log('wow');
        },
      },
      {
        label: 'Item1',
        type: 'normal',
        click: () => {
          console.log('wow');
        },
      },
    ]);

    icon.setToolTip('Avocado');
    icon.setContextMenu(contextMenu);
    icon.setTitle(text);
  },
  getIconInstance() {
    return icon;
  },
  setNoIcon() {
    const emptyImg = nativeImage.createFromDataURL(emptyIcon);
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
    const app = electron.app;
    const name = app.getName();

    const template = [
      {
        label: name,
        submenu: [
          { role: 'about' },
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
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
          {
            label: 'Zoom',
            role: 'zoom',
          },
          {
            type: 'separator',
          },
          {
            label: 'Bring All to Front',
            role: 'front',
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};
