import { Database } from 'better-sqlite3'

function createTables(db: Database) {
  // 创建表 分类category
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建表 代码片段snippet
  db.exec(`
    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      description TEXT NOT NULL,
      categoryId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建表 快捷键hotkeys
  db.exec(`
    CREATE TABLE IF NOT EXISTS hotkeys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hotkey TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

function createHotKeys(db: Database) {
  // 检查是否已经存在数据，避免重复插入
  const existingHotkeys = db.prepare('SELECT COUNT(*) as count FROM hotkeys').get() as {
    count: number
  }

  if (existingHotkeys.count === 0) {
    // 插入默认快捷键数据
    const insertHotkey = db.prepare(`
      INSERT INTO hotkeys (name, hotkey) VALUES (?, ?)
    `)
    // 如果searchHotkey存在，则不处理 如果不存在，则插入
    const searchHotkey = db
      .prepare('SELECT COUNT(*) as count FROM hotkeys WHERE name = ?')
      .get() as {
      count: number
    }
    if (searchHotkey.count === 0) {
      insertHotkey.run('searchHotkey', 'CommandOrControl+Shift+K')
    }

    console.log('默认快捷键数据已插入')
  }
}

export { createTables, createHotKeys }
