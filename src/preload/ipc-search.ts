import { contextBridge, ipcRenderer } from 'electron/renderer'
import { IpcSearchListenerEnum } from '../main/search/ipc'

const IPC_SEARCH_API = 'IpcSearchApi'

const IpcSearchApi = {
  [IpcSearchListenerEnum.TOGGLE_VISIBILITY]: (bool: boolean) => {
    ipcRenderer.send(IpcSearchListenerEnum.TOGGLE_VISIBILITY, bool)
  },
  [IpcSearchListenerEnum.WINDOW_RESIZE]: (size: { width: number; height: number }) => {
    ipcRenderer.send(IpcSearchListenerEnum.WINDOW_RESIZE, size)
  },
  [IpcSearchListenerEnum.OPEN_CONFIG_WINDOW]: () => {
    ipcRenderer.send(IpcSearchListenerEnum.OPEN_CONFIG_WINDOW)
  },
  [IpcSearchListenerEnum.OPEN_SETTINGS_WINDOW]: () => {
    ipcRenderer.send(IpcSearchListenerEnum.OPEN_SETTINGS_WINDOW)
  }
}

function setupIpcListeners() {
  contextBridge.exposeInMainWorld(IPC_SEARCH_API, IpcSearchApi)
}

export { setupIpcListeners, IPC_SEARCH_API, IpcSearchApi }
