import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { deleteTokens, getCurrentlyPlaying, getQueue, loadTokens, loginToSpotify, pauseTrack, playFromContext, playTrack, previousTrack, refreshAccessToken, saveTokens, skipTrack } from './spotifyAuth'
import icon from '../../resources/icon.png?asset'
import { loadSettings, saveSettings } from './settings'

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 210,
    height: 300,
    backgroundColor: '#00000000',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    alwaysOnTop: true,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
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
  let spotifyTokens = await loadTokens()

  ipcMain.handle('spotify-login', async () => {
    spotifyTokens = await loginToSpotify()
    await saveTokens(spotifyTokens)
    return spotifyTokens
  })

  ipcMain.handle('spotify-logout', async () => {
    spotifyTokens = null;
    deleteTokens();
  })
  
  ipcMain.handle('spotify-check-auth', async() => {
    return spotifyTokens !== null
  })

  async function withValidToken(apiCall) {
    try {
      return await apiCall(spotifyTokens.access_token)
    } catch (err) {
      if (err.status === 401) {
        // token expired
        try {
          spotifyTokens = await refreshAccessToken(spotifyTokens.refresh_token)
          await saveTokens(spotifyTokens)
          return await apiCall(spotifyTokens.access_token)
        } catch (retryErr) {
          console.error('Spotify token refresh failed:', retryErr.message)
          return null
        }
      }
      console.error('Spotify action failed:', err.message)
      return null
    }
  }

  ipcMain.handle('spotify-get-current-track', async() => {
    if (!spotifyTokens) return null
    return withValidToken(getCurrentlyPlaying)
  })

  ipcMain.on('pause-track', () => withValidToken(pauseTrack))
  ipcMain.on('play-track', () => withValidToken(playTrack))
  ipcMain.on('skip-track', () => withValidToken(skipTrack))
  ipcMain.on('prev-track', () => withValidToken(previousTrack))

  ipcMain.handle('get-queue', async () => {
    if (!spotifyTokens) return null
    return withValidToken(getQueue)
  })

  ipcMain.handle('play-from-context', async (event, contextUri, trackUri) => {
    return withValidToken((token) => playFromContext(token, contextUri, trackUri))
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
