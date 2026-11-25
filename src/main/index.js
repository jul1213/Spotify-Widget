import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { deleteTokens, getCurrentlyPlaying, getQueue, loadTokens, loginToSpotify, pauseTrack, playFromContext, playTrack, previousTrack, refreshAccessToken, saveTokens, skipTrack } from './spotifyAuth'
import icon from '../../resources/icon.png?asset'
import { loadSettings, saveSettings } from './settings'
import { createTokenManager } from './tokenManager'

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 175,
    height: 250,
    minWidth: 140,
    minHeight: 199,
    maxWidth: 324,
    maxHeight: 462,
    backgroundColor: '#00000000',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    },
    alwaysOnTop: true,
  })
  
  mainWindow.setAspectRatio(0.7)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (is.dev) mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('close', () => mainWindow.close())

  /* SPOTIFY */  
  const manager = createTokenManager({
    initialTokens: await loadTokens(),
    refreshAccessToken, saveTokens, deleteTokens,
    onAuthLost: () => mainWindow.webContents.send('spotify-auth-lost'),
  })

  ipcMain.handle('spotify-login', async () => {
    const tokens = await loginToSpotify()
    await saveTokens(tokens)
    manager.setTokens(tokens)
    return tokens
  })

  ipcMain.handle('spotify-logout', async () => {
    manager.setTokens(null)
    deleteTokens();
  })
  
  ipcMain.handle('spotify-check-auth', async() => {
    return manager.getTokens() !== null
  })

  ipcMain.handle('spotify-get-current-track', async() => {
    if (!(manager.getTokens())) return null
    return manager.withValidToken(getCurrentlyPlaying)
  })

  ipcMain.on('pause-track', () => manager.withValidToken(pauseTrack))
  ipcMain.on('play-track', () => manager.withValidToken(playTrack))
  ipcMain.on('skip-track', () => manager.withValidToken(skipTrack))
  ipcMain.on('prev-track', () => manager.withValidToken(previousTrack))

  ipcMain.handle('get-queue', async () => {
    if (!(manager.getTokens())) return null
    return manager.withValidToken(getQueue)
  })

  ipcMain.handle('play-from-context', async (event, contextUri, trackUri) => {
    return manager.withValidToken((token) => playFromContext(token, contextUri, trackUri))
  })

  /* SETTINGS */
  ipcMain.handle('save-settings', (event, settings) => saveSettings(settings))
  ipcMain.handle('load-settings', () => loadSettings())

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
