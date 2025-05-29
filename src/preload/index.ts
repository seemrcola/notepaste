import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  setupIpcListeners as setupIpcSearchListeners,
  IPC_SEARCH_API,
  IpcSearchApi
} from './ipc-search'
import { setupIpcListeners as setupIpcDbListeners, IPC_DB_API, IpcDbApi } from './ipc-db'

if (process.contextIsolated) {
  try {
    // 暴露electronAPI
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // 暴露ipcIndexApi
    setupIpcSearchListeners()
    // 暴露ipcDbApi
    setupIpcDbListeners()
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window[IPC_SEARCH_API] = IpcSearchApi
  // @ts-ignore (define in dts)
  window[IPC_DB_API] = IpcDbApi
}
