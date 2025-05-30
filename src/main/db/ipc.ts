import { ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron'
import * as query from '../db/query'
import { Database } from 'better-sqlite3'
import { exportAllToCSV } from './export'

type SQLType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del'

enum IpcDbListenerEnum {
  SQL = 'db:sql',
  EXPORT = 'db:export'
}

function setupIpcDb(db: Database) {
  // 执行 SQL 语句
  ipcMain.handle(
    IpcDbListenerEnum.SQL,
    (_event: IpcMainInvokeEvent, sql: string, type: SQLType, params?: unknown[]) => {
      return query[type](db, sql, params)
    }
  )

  // 导出所有数据为 CSV
  ipcMain.handle(IpcDbListenerEnum.EXPORT, async (event: IpcMainInvokeEvent) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)
    if (!mainWindow) return { success: false, message: '无法获取主窗口' }
    return await exportAllToCSV(db, mainWindow)
  })
}

export { setupIpcDb, IpcDbListenerEnum }
