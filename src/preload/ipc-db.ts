import { contextBridge, ipcRenderer } from 'electron/renderer'
import { IpcDbListenerEnum } from '../main/db/ipc'

type SQLType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del'

const IPC_DB_API = 'IpcDbApi'

const IpcDbApi = {
  [IpcDbListenerEnum.SQL]: (sql: string, type: SQLType, params?: unknown[]) => {
    return ipcRenderer.invoke(IpcDbListenerEnum.SQL, sql, type, params)
  },
  [IpcDbListenerEnum.EXPORT]: () => {
    return ipcRenderer.invoke(IpcDbListenerEnum.EXPORT)
  }
}

function setupIpcListeners() {
  contextBridge.exposeInMainWorld(IPC_DB_API, IpcDbApi)
}

export { setupIpcListeners, IPC_DB_API, IpcDbApi }
