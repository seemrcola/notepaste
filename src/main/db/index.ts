import Database, * as BetterSqlite3 from 'better-sqlite3'
import { resolve } from 'node:path'
import { app } from 'electron'
import { createTables } from './tables'
import { setupIpcDb } from './ipc'

function initDb() {
  // 使用 userData 目录，兼容不同操作系统
  // Windows: %APPDATA%/notepaste
  // macOS: ~/Library/Application Support/notepaste
  // Linux: ~/.config/notepaste
  // const dbPath = resolve(app.getPath('userData'), 'snippets.db')

  // 测试环境下使用桌面
  const dbPath = resolve(app.getPath('desktop'), 'snippets.db')

  const db: BetterSqlite3.Database = new Database(dbPath, {
    fileMustExist: false // 文件不存在的时候不会报错
  })

  // 设置journal_mode为WAL 提高并发性能
  db.pragma('journal_mode = WAL')

  // 创建表
  createTables(db)

  // 设置ipc
  setupIpcDb(db)
}

export { initDb }
