export interface CATEGORY {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface SNIPPET {
  id: number
  name: string
  code: string
  language: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface HOTKEY {
  id: number
  name: string
  hotkey: string
  createdAt: string
  updatedAt: string
}

export type SQLType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del'
