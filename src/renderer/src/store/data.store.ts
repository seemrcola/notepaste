import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useIpcStore, IpcDbApi } from './ipc.store'
import type { CATEGORY, SNIPPET } from '@renderer/type.d'

export const useDataStore = defineStore('data', () => {
  // State
  const categories = ref<CATEGORY[]>([])
  const snippets = ref<SNIPPET[]>([])
  const currentCategory = ref<CATEGORY | null>(null)
  const currentSnippet = ref<SNIPPET | null>(null)
  const ipcStore = useIpcStore()

  // ########################### 分类 ###########################
  // 获取所有分类
  const getAllCategories = async (
    mode: 'init' | 'add' | 'del' | 'update' = 'init',
    id?: string | number
  ) => {
    const result = await ipcStore[IpcDbApi.SQL](`SELECT * FROM categories`, 'findAll', [])
    categories.value = result as CATEGORY[]

    if (mode === 'init') currentCategory.value = categories.value[0] || null
    if (mode === 'add') {
      // 添加分类后，获取最新分类
      currentCategory.value = categories.value[categories.value.length - 1] || null
    }
    if (mode === 'del') {
      // 删除的分类是当前分类
      if (id === currentCategory.value?.id) {
        currentCategory.value = categories.value[0] || null
      }
      // 删除的分类不是当前分类
      else {
        // nothing to do
      }
    }
    if (mode === 'update') void 0 // nothing to do
  }

  // 添加分类
  const addCategory = async (name: string) => {
    // 添加分类
    await ipcStore[IpcDbApi.SQL](`INSERT INTO categories (name) VALUES (?)`, 'insert', [name])
    // 刷新分类
    await getAllCategories('add')
  }

  // 编辑分类【名称】
  const updateCategory = async (id: number, name: string) => {
    await ipcStore[IpcDbApi.SQL](`UPDATE categories SET name = ? WHERE id = ?`, 'update', [
      name,
      id
    ])
    await getAllCategories('update')
  }

  // 删除分类
  const deleteCategory = async (id: number) => {
    // 删除分类下的所有代码片段
    await ipcStore[IpcDbApi.SQL](`DELETE FROM snippets WHERE categoryId = ?`, 'del', [id])
    // 删除分类
    await ipcStore[IpcDbApi.SQL](`DELETE FROM categories WHERE id = ?`, 'del', [id])
    // 刷新分类
    await getAllCategories('del', id)
  }

  // ########################### 代码片段 ###########################
  // 监听分类变化
  watch(
    () => currentCategory.value,
    (n) => {
      if (n) {
        void getAllSnippets(n.id, 'init')
      }
    },
    { immediate: true }
  )

  // 获取所有代码片段
  const getAllSnippets = async (
    id: number,
    mode: 'add' | 'update' | 'del' | 'init' = 'init',
    updateId = 0
  ) => {
    const result = await ipcStore[IpcDbApi.SQL](
      `SELECT * FROM snippets WHERE categoryId = ?`,
      'findAll',
      [id]
    )
    console.log(result, 'result')
    snippets.value = result as SNIPPET[]
    if (mode === 'init' || mode === 'add' || mode === 'del') {
      currentSnippet.value = snippets.value[0] || null
    }
    if (mode === 'update') {
      console.log(id, 'id')
      currentSnippet.value = snippets.value.find((s) => s.id === updateId) || null
      console.log(currentSnippet.value, 'currentSnippet.value')
    }
  }

  // 添加代码片段
  const addSnippet = async (insertSnippet: {
    name: string
    code: string
    language: string
    description: string
  }) => {
    // 添加代码片段
    await ipcStore[IpcDbApi.SQL](
      `INSERT INTO snippets (name, code, language, description, categoryId) VALUES (?, ?, ?, ?, ?)`,
      'insert',
      [
        insertSnippet.name,
        insertSnippet.code,
        insertSnippet.language,
        insertSnippet.description,
        currentCategory.value?.id
      ]
    )
    // 获取最新代码片段
    await getAllSnippets(currentCategory.value?.id as number, 'add')
  }

  // 搜索代码片段
  const searchSnippets = async (query: string) => {
    if (!query) {
      await getAllSnippets(currentCategory.value?.id as number, 'add')
      return
    }
    const result = await ipcStore[IpcDbApi.SQL](
      `SELECT * FROM snippets WHERE name LIKE ? OR code LIKE ?`,
      'findAll',
      [`%${query}%`, `%${query}%`]
    )
    snippets.value = result as SNIPPET[]
  }

  // 删除代码片段
  const deleteSnippet = async (id: number) => {
    await ipcStore[IpcDbApi.SQL](`DELETE FROM snippets WHERE id = ?`, 'del', [id])
    await getAllSnippets(currentCategory.value?.id as number, 'del')
  }

  // 编辑代码片段【代码】
  const updateSnippet = async (id: number, code: string) => {
    await ipcStore[IpcDbApi.SQL](`UPDATE snippets SET code = ? WHERE id = ?`, 'update', [code, id])
    await getAllSnippets(currentCategory.value?.id as number, 'update', id)
  }

  // 返回 state 和 actions
  return {
    // State
    categories,
    snippets,
    currentCategory,
    currentSnippet,

    // Actions
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getAllSnippets,
    addSnippet,
    searchSnippets,
    deleteSnippet,
    updateSnippet
  }
})
