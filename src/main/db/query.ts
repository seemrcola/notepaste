import { Database } from 'better-sqlite3'

// findAll
const findAll = (db: Database, sql: string) => {
  return db.prepare(sql).all()
}

// findOne
const findOne = (db: Database, sql: string) => {
  return db.prepare(sql).get()
}

// insert
const insert = (db: Database, sql: string, params?: unknown[]) => {
  if (params) {
    return db.prepare(sql).run(...params).lastInsertRowid
  }
  return db.prepare(sql).run().lastInsertRowid
}

// update
const update = (db: Database, sql: string) => {
  return db.prepare(sql).run().changes
}

// del
const del = (db: Database, sql: string) => {
  return db.prepare(sql).run().changes
}

export { findAll, findOne, insert, update, del }
