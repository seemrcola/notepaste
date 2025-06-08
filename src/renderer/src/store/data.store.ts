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
  const isEditMode = ref(false)
  const ipcStore = useIpcStore()

  // ########################### 分类 ###########################
  // 获取所有分类
  async function getAllCategories(
    mode: 'init' | 'add' | 'del' | 'update' = 'init',
    id?: string | number
  ) {
    const result = await ipcStore[IpcDbApi.SQL](`SELECT * FROM categories`, 'findAll', [])
    categories.value = result as CATEGORY[]

    // 退出编辑模式
    exitEditMode()

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
  async function addCategory(name: string) {
    // 添加分类
    await ipcStore[IpcDbApi.SQL](`INSERT INTO categories (name) VALUES (?)`, 'insert', [name])
    // 刷新分类
    await getAllCategories('add')
  }

  // 编辑分类【名称】
  async function updateCategory(id: number, name: string) {
    await ipcStore[IpcDbApi.SQL](`UPDATE categories SET name = ? WHERE id = ?`, 'update', [
      name,
      id
    ])
    await getAllCategories('update')
  }

  // 删除分类
  async function deleteCategory(id: number) {
    // 删除分类下的所有代码片段
    await ipcStore[IpcDbApi.SQL](`DELETE FROM snippets WHERE categoryId = ?`, 'del', [id])
    // 删除分类
    await ipcStore[IpcDbApi.SQL](`DELETE FROM categories WHERE id = ?`, 'del', [id])
    // 刷新分类
    await getAllCategories('del', id)
  }

  // 变更当前分类
  function setCurrentCategory(category: CATEGORY) {
    currentCategory.value = category
    exitEditMode()
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
  async function getAllSnippets(
    id: number,
    mode: 'add' | 'update' | 'del' | 'init' = 'init',
    updateId = 0
  ) {
    const result = await ipcStore[IpcDbApi.SQL](
      `SELECT * FROM snippets WHERE categoryId = ?`,
      'findAll',
      [id]
    )
    snippets.value = result as SNIPPET[]

    // 退出编辑模式
    exitEditMode()

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

  // 搜索代码片段
  async function searchSnippets(query: string) {
    // 如果搜索内容为空，则获取所有代码片段
    if (!query) {
      await getAllSnippets(currentCategory.value?.id as number, 'add')
      return
    }
    // 如果搜索内容不为空，则搜索代码片段
    const result = await ipcStore[IpcDbApi.SQL](
      `SELECT * FROM snippets WHERE name LIKE ? OR code LIKE ? AND categoryId = ?`,
      'findAll',
      [`%${query}%`, `%${query}%`, currentCategory.value?.id]
    )
    snippets.value = result as SNIPPET[]
    // 退出编辑模式
    exitEditMode()
    // 设置当前代码片段为第一个
    currentSnippet.value = snippets.value[0] || null
  }

  // 添加代码片段
  async function addSnippet(insertSnippet: {
    name: string
    code: string
    language: string
    description: string
  }) {
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

  // 删除代码片段
  async function deleteSnippet(id: number) {
    await ipcStore[IpcDbApi.SQL](`DELETE FROM snippets WHERE id = ?`, 'del', [id])
    await getAllSnippets(currentCategory.value?.id as number, 'del')
  }

  // 编辑代码片段【代码】
  async function updateSnippet(id: number, code: string) {
    await ipcStore[IpcDbApi.SQL](`UPDATE snippets SET code = ? WHERE id = ?`, 'update', [code, id])
    await getAllSnippets(currentCategory.value?.id as number, 'update', id)
  }

  // 移动代码片段到其他分类
  async function moveSnippetToCategory(snippetId: number, newCategoryId: number) {
    await ipcStore[IpcDbApi.SQL](`UPDATE snippets SET categoryId = ? WHERE id = ?`, 'update', [
      newCategoryId,
      snippetId
    ])
    // 刷新当前分类的代码片段列表
    await getAllSnippets(currentCategory.value?.id as number, 'del')
  }

  // 设置当前代码片段
  function setCurrentSnippet(snippet: SNIPPET) {
    currentSnippet.value = snippet
    exitEditMode()
  }

  // ########################### 其他 ###########################

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
