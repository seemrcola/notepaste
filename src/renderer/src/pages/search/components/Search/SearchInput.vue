<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const searchTerm = ref('')
const mode = ref<'search' | 'command' | 'clear'>('clear') // 当前模式

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'command', value: string): void
  (e: 'clear'): void
}>()

// 使用watch监听searchTerm，改善响应性
watch(searchTerm, (newValue) => {
  if (newValue === '') {
    mode.value = 'clear'
    return emit('clear')
  }

  if (newValue.startsWith('/')) {
    mode.value = 'command'
    emit('command', newValue)
  } else {
    mode.value = 'search'
    emit('search', newValue)
  }
})

function handleEnter() {
  if (mode.value === 'search') {
    emit('search', searchTerm.value)
  } else if (mode.value === 'command') {
    emit('command', searchTerm.value)
  }
}

function handleClear() {
  searchTerm.value = ''
  emit('clear')
}

// 键盘快捷键处理
function handleKeydown(e: KeyboardEvent) {
  // ESC键清空搜索
  if (e.key === 'Escape') {
    handleClear()
  }
  // Ctrl+/ 聚焦到搜索框
  if (e.ctrlKey && e.key === '/') {
    const inputEl = document.querySelector('.search-input') as HTMLInputElement
    if (inputEl) {
      inputEl.focus()
    }
  }
}

// 注册全局键盘事件
window.addEventListener('keydown', handleKeydown)

// 组件卸载时清理事件监听
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  mode,
  clear: handleClear
})
</script>

<template>
  <div class="relative w-full flex">
    <!-- 搜索输入框 -->
    <input
      v-model="searchTerm"
      type="text"
      placeholder="搜索或输入命令 (以 / 开头)"
      class="search-input w-full px-4 py-3 border border-transparent outline-none text-gray-700 bg-white/80"
      aria-label="搜索框"
      @keyup.enter="handleEnter"
    />
    <!-- 搜索按钮 -->
    <button
      class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
      aria-label="搜索"
      @click="handleEnter"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <!-- 清除按钮 -->
    <button
      v-if="searchTerm"
      class="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 transform hover:scale-110"
      aria-label="清除搜索"
      @click="handleClear"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <!-- 键盘快捷键提示 -->
    <div class="absolute -bottom-6 right-0 text-xs text-gray-400">
      <span>Ctrl+/ 聚焦 | ESC 清空</span>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
