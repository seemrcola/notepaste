import { defineStore } from 'pinia'
import type { SQLType } from '@renderer/type.d'

export enum IpcSearchApi {
  VISIBILITY = 'search:toggle-visibility',
  RESIZE = 'search:window-resize',
  OPEN_CONFIG_WINDOW = 'search:open-config-window',
  OPEN_SETTINGS_WINDOW = 'search:open-settings-window'
}

export enum IpcDbApi {
  SQL = 'db:sql',
  EXPORT = 'db:export'
}

export const useIpcStore = defineStore('ipc', {
  state: () => ({}),
  actions: {
    async [IpcSearchApi.VISIBILITY](bool: boolean) {
      window.IpcSearchApi[IpcSearchApi.VISIBILITY](bool)
    },
    async [IpcSearchApi.RESIZE](size: { width: number; height: number }) {
      window.IpcSearchApi[IpcSearchApi.RESIZE](size)
    },
    async [IpcSearchApi.OPEN_CONFIG_WINDOW]() {
      window.IpcSearchApi[IpcSearchApi.OPEN_CONFIG_WINDOW]()
    },
    async [IpcSearchApi.OPEN_SETTINGS_WINDOW]() {
      window.IpcSearchApi[IpcSearchApi.OPEN_SETTINGS_WINDOW]()
    },
    async [IpcDbApi.SQL](sql: string, type: SQLType, params?: unknown[]) {
      return window.IpcDbApi[IpcDbApi.SQL](sql, type, params)
    },
    async [IpcDbApi.EXPORT]() {
      return window.IpcDbApi[IpcDbApi.EXPORT]()
    }
  }
})
