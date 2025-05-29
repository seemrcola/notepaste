import { ipcMain, IpcMainInvokeEvent } from 'electron'
import * as query from '../db/query'
import { Database } from 'better-sqlite3'

type SQLType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del'

enum IpcDbListenerEnum {
  SQL = 'db:sql'
}

function setupIpcDb(db: Database) {
  ipcMain.handle(
    IpcDbListenerEnum.SQL,
    (_event: IpcMainInvokeEvent, sql: string, type: SQLType, params?: unknown[]) => {
      return query[type](db, sql, params)
    }
  )
}

export { setupIpcDb, IpcDbListenerEnum }
