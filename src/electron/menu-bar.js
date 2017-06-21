const path = require('path');
const { Tray, Menu, nativeImage } = require('electron');

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
    }
  },
};
