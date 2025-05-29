<script setup lang="ts">
import CategoryList from './components/CategoryList.vue'
import CodeEditor from './components/CodeEditor.vue'
import Snippet from './components/SnippetList.vue'
import { useDataStore } from '@renderer/store/data.store'
import { onMounted } from 'vue'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.getAllCategories()
})
</script>

<template>
  <div class="grid-container">
    <div class="grid-item category-area">
      <CategoryList :categories="dataStore.categories" />
    </div>
    <div class="grid-item snippet-area">
      <Snippet :snippets="dataStore.snippets" :current-category="dataStore.currentCategory" />
    </div>
    <div class="grid-item editor-area">
      <CodeEditor :snippet="dataStore.currentSnippet" />
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
