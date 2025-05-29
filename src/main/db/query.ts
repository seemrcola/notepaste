import { Database } from 'better-sqlite3'

// findAll
const findAll = (db: Database, sql: string, params?: unknown[]) => {
  return params ? db.prepare(sql).all(...params) : db.prepare(sql).all()
}

// findOne
const findOne = (db: Database, sql: string, params?: unknown[]) => {
  return params ? db.prepare(sql).get(...params) : db.prepare(sql).get()
}

// insert
const insert = (db: Database, sql: string, params?: unknown[]) => {
  return params
    ? db.prepare(sql).run(...params).lastInsertRowid
    : db.prepare(sql).run().lastInsertRowid
}

// update
const update = (db: Database, sql: string, params?: unknown[]) => {
  return params ? db.prepare(sql).run(...params).changes : db.prepare(sql).run().changes
}

// del
const del = (db: Database, sql: string, params?: unknown[]) => {
  return params ? db.prepare(sql).run(...params).changes : db.prepare(sql).run().changes
}

export { findAll, findOne, insert, update, del }
