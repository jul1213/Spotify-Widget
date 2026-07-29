import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const windowControls = {
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
}

const spotifyControls = {
  login: () => ipcRenderer.invoke('spotify-login'),
  getCurrentTrack: () => ipcRenderer.invoke('spotify-get-current-track'),
  checkAuth: () => ipcRenderer.invoke('spotify-check-auth'),
  play: () => ipcRenderer.send('play-track'),
  pause: () => ipcRenderer.send('pause-track'),
  skip: () => ipcRenderer.send('skip-track'),
  prev: () => ipcRenderer.send('prev-track'),
  getQueue: () => ipcRenderer.invoke('get-queue'),
  playFromContext: (contextUri, trackUri) => ipcRenderer.invoke('play-from-context', contextUri, trackUri),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowControls', windowControls)
    contextBridge.exposeInMainWorld('spotifyControls', spotifyControls)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.windowControls = windowControls
  window.spotifyControls = spotifyControls
}
