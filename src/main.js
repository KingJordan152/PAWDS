const { app, BrowserWindow, globalShortcut } = require('electron')

// Global reference of window object
let win

// When everything has loaded, create/open the window
app.on('ready', createWindow)

// function that creates the main broswer window
function createWindow() {
  win = new BrowserWindow({
    show: false,
    width: 1000,
    height: 600,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      nodeIntegration: true,
    }
  })

  // sets the window to be full screened (F11) on start up.
  win.setFullScreen(true)
  win.removeMenu(true)
  // win.webContents.openDevTools()
  // Loads the index.html of the app.
  win.loadFile('src/title/index.html')

  // allows for more seamless loading
  win.once('ready-to-show', () => {
    win.show()
  })

  // allows program to be closed by pressing "Esc"
  globalShortcut.register('Escape', () => {
    app.quit()
  })

  // When the window is closed.
  // "=>" is just an abbreviation for "function()".
  win.on('closed', () => {
    // Dereferences the window object when the app is closed out of.
    win = null
  })
}

// ======= FOR MAC =======
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // For Mac OS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})