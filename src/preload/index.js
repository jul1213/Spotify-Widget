import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const windowControls = {
  close: () => ipcRenderer.send('close'),
}

const spotifyControls = {
  login: () => ipcRenderer.invoke('spotify-login'),
  logout: () => ipcRenderer.invoke('spotify-logout'),
  getCurrentTrack: () => ipcRenderer.invoke('spotify-get-current-track'),
  checkAuth: () => ipcRenderer.invoke('spotify-check-auth'),
  play: () => ipcRenderer.send('play-track'),
  pause: () => ipcRenderer.send('pause-track'),
  skip: () => ipcRenderer.send('skip-track'),
  prev: () => ipcRenderer.send('prev-track'),
  getQueue: () => ipcRenderer.invoke('get-queue'),
  playFromContext: (contextUri, trackUri) => ipcRenderer.invoke('play-from-context', contextUri, trackUri),
}

const appSettings = {
  save: (settings) => ipcRenderer.invoke('save-settings', settings),
  load: () => ipcRenderer.invoke('load-settings'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowControls', windowControls)
    contextBridge.exposeInMainWorld('spotifyControls', spotifyControls)
    contextBridge.exposeInMainWorld('appSettings',appSettings )
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.windowControls = windowControls
  window.spotifyControls = spotifyControls
  window.appSettings = appSettings
}
