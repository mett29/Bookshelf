var electron = require('electron') // http://electron.atom.io/docs/api
var path = require('path')         // https://nodejs.org/api/path.html
var url = require('url')           // https://nodejs.org/api/url.html

const ipcMain = require('electron').ipcMain;

var window = null

// Wait until the app is ready
electron.app.once('ready', function () {
  // Create a new window
  window = new electron.BrowserWindow({
    // Don't show the window until it ready, this prevents any white flickering
    show: false,

    resizable: false,

    autoHideMenuBar: true
  })

  window.maximize();

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Show window when page is ready
  window.once('ready-to-show', function () {
    window.show();
  })
})

ipcMain.on('load-page', (event, arg) => {
    window.loadURL(arg);
});

ipcMain.on('book_search', (event, arg) => {
  window.loadURL('file://../' + __dirname + '/search.html');
  window.webContents.on('did-finish-load', function() {
    window.webContents.send('info', arg);
  });
});

ipcMain.on('back', (event, arg) => {
  window.loadURL('file://../' + __dirname + '/index.html');
});

ipcMain.on('readThis', (event, arg) => {
  window.loadURL('file://../' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', function() {
    window.webContents.send('readThis', arg);
  });
});