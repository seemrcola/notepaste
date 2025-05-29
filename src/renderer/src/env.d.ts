/// <reference types="vite/client" />

type SQLType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del'

declare global {
  interface Window {
    IpcSearchApi: {
      'search:toggle-visibility': (bool: boolean) => void // 切换窗口可见性
      'search:window-resize': (size: { width: number; height: number }) => void // 切换窗口大小
      'search:open-config-window': () => void // 打开配置窗口
    }
    IpcDbApi: {
      'db:sql': (sql: string, type: SQLType, params?: unknown[]) => Promise<unknown> // 执行sql
    }
  }
}

export {}
