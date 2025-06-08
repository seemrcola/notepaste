import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useIpcStore, IpcDbApi } from './ipc.store'
import type { CATEGORY, SNIPPET } from '@renderer/type.d'
import { message } from '@renderer/components/ui/message'

export const useDataStore = defineStore('data', () => {
  // State
  const categories = ref<CATEGORY[]>([])
  const snippets = ref<SNIPPET[]>([])
  const currentCategory = ref<CATEGORY | null>(null)
  const currentSnippet = ref<SNIPPET | null>(null)
  const isEditMode = ref(false)
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

  // 变更当前分类
  function setCurrentCategory(category: CATEGORY) {
    if (isEditMode.value) {
      message.error('编辑模式下不可切换分类')
      return
    }
    currentCategory.value = category
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
    if (mode === 'init' || mode === 'del') {
      currentSnippet.value = snippets.value[0] || null
    }
    if (mode === 'add') {
      currentSnippet.value = snippets.value[snippets.value.length - 1] || null
    }
    if (mode === 'update') {
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

  // 移动代码片段到其他分类
  const moveSnippetToCategory = async (snippetId: number, newCategoryId: number) => {
    await ipcStore[IpcDbApi.SQL](`UPDATE snippets SET categoryId = ? WHERE id = ?`, 'update', [
      newCategoryId,
      snippetId
    ])
    // 刷新当前分类的代码片段列表
    await getAllSnippets(currentCategory.value?.id as number, 'del')
  }

  // 设置当前代码片段
  function setCurrentSnippet(snippet: SNIPPET) {
    if (isEditMode.value) {
      message.error('编辑模式下不可切换代码片段')
      return
    }
    currentSnippet.value = snippet
  }

  // 退出编辑模式
  function exitEditMode() {
    isEditMode.value = false
  }

  // 进入编辑模式
  function enterEditMode() {
    isEditMode.value = true
  }

  // 切换编辑模式
  function toggleEditMode() {
    isEditMode.value = !isEditMode.value
  }

  // 返回 state 和 actions
  return {
    // ########################### State ###########################
    categories,
    snippets,
    currentCategory,
    currentSnippet,
    isEditMode,
    // ########################### Actions ###########################
    // ########################### 分类 #############################
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setCurrentCategory,
    // ########################### 代码片段 ###########################
    getAllSnippets,
    addSnippet,
    searchSnippets,
    deleteSnippet,
    updateSnippet,
    moveSnippetToCategory,
    setCurrentSnippet,
    // ########################### 编辑模式 ###########################
    exitEditMode,
    enterEditMode,
    toggleEditMode
  }
})
