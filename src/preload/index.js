import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const windowControls = {
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowControls', windowControls)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.windowControls = windowControls
}
