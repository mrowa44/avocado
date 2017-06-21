const path = require('path');
const { Tray, Menu } = require('electron');

module.exports = {
  createMenuBarIcon() {
    const iconPath = path.join(__dirname, '../icon.png');
    const icon = new Tray(iconPath);
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
  },
};
