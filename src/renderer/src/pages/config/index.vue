<script setup lang="ts">
import CategoryList from './components/CategoryList.vue'
import CodeEditor from './components/CodeEditor.vue'
import Snippet from './components/SnippetList.vue'
import { ref, onMounted } from 'vue'
import type { CATEGORY, SNIPPET } from '@renderer/type.d'
import { useIpcStore, IpcDbApi } from '@renderer/store/ipc.store'

const ipcStore = useIpcStore()

const categories = ref<CATEGORY[]>([])
const currentCategory = ref<CATEGORY | null>(null)
const snippets = ref<SNIPPET[]>([])
const currentSnippet = ref<SNIPPET | null>(null)

function loadSelectedCategory() {
  // sql语句查询 查找所有
  ipcStore[IpcDbApi.SQL]('SELECT * FROM categories', 'findAll')
    .then((res) => {
      categories.value = res as CATEGORY[]
      currentCategory.value = categories.value[0] || null
      if (currentCategory.value) loadSnippets()
    })
    .catch((err) => {
      console.log(err)
    })
}

function loadSnippets() {
  // sql语句查询 查找所有id为currentCategory.value?.id的代码片段
  ipcStore[IpcDbApi.SQL](
    `SELECT * FROM snippets WHERE categoryId = ${currentCategory.value?.id}`,
    'findAll'
  )
    .then((res) => {
      snippets.value = res as SNIPPET[]
      currentSnippet.value = snippets.value[0] || null
    })
    .catch((err) => {
      console.log(err)
    })
}

// 刷新分类列表
function handleRefreshCategories() {
  loadSelectedCategory()
}
// 选择分类
function handleSelectCategory(id: number) {
  currentCategory.value = categories.value.find((category) => category.id === id) || null
  if (currentCategory.value) loadSnippets()
}
// 选择代码片段
function handleSelectSnippet(id: number) {
  currentSnippet.value = snippets.value.find((snippet) => snippet.id === id) || null
}

onMounted(() => {
  loadSelectedCategory()
})
</script>

<template>
  <div class="grid-container">
    <div class="grid-item category-area">
      <CategoryList
        :categories="categories"
        @refresh-categories="handleRefreshCategories"
        @select-category="handleSelectCategory"
      />
    </div>
    <div class="grid-item snippet-area">
      <Snippet
        :snippets="snippets"
        :current-category="currentCategory"
        @refresh-snippets="loadSnippets"
        @select-snippet="handleSelectSnippet"
      />
    </div>
    <div class="grid-item editor-area">
      <CodeEditor :snippet="currentSnippet" />
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 2fr 3fr 4fr;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.grid-item {
  height: 100%;
  overflow: auto;
}

.category-area {
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
}

.snippet-area {
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
}

.editor-area {
  background-color: #f8fafc;
}
</style>
