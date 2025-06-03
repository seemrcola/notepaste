<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import SearchInput from './SearchInput.vue'
import SearchResults from './SearchResults.vue'
import EmptyResults from './EmptyResults.vue'
import CommandDropdown from './Command.vue'
import { commandData } from './data/commandData'
import { debounce } from './utils/debounce'
import type { SNIPPET } from '@renderer/type.d'
import { useIpcStore, IpcSearchApi, IpcDbApi } from '@renderer/store/ipc.store'

const ipcStore = useIpcStore()

const commandItems = ref(commandData) // 命令数据
const isResultDropdownOpen = ref(false)
const isCommandDropdownOpen = ref(false)
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const filteredSnippetItems = ref<SNIPPET[]>([])
const filteredCommandItems = ref<typeof commandItems.value>([])

const mode = computed(() => {
  return searchInputRef.value?.mode
})

// 过滤命令项目的函数（仅用于命令搜索）
function filterCommandItems(
  items: typeof commandItems.value,
  searchTerm: string
): typeof commandItems.value {
  if (!searchTerm.trim()) return []

  const searchLower = searchTerm.toLowerCase()
  return items.filter((item) =>
    ['name', 'description'].some((field) =>
      String(item[field as keyof typeof item])
        .toLowerCase()
        .includes(searchLower)
    )
  )
}

function performSearch(searchTerm: string) {
  if (!searchTerm.trim()) {
    filteredSnippetItems.value = []
    isResultDropdownOpen.value = false
    return
  }

  // 使用数据库的模糊搜索，支持在名称、描述和代码中搜索
  const searchQuery = `
    SELECT * FROM snippets 
    WHERE name LIKE '%${searchTerm}%' 
       OR description LIKE '%${searchTerm}%' 
       OR code LIKE '%${searchTerm}%'
    ORDER BY 
      CASE 
        WHEN name LIKE '%${searchTerm}%' THEN 1
        WHEN description LIKE '%${searchTerm}%' THEN 2
        WHEN code LIKE '%${searchTerm}%' THEN 3
        ELSE 4
      END,
      name ASC
  `

  ipcStore[IpcDbApi.SQL](searchQuery, 'findAll')
    .then((res) => {
      filteredSnippetItems.value = res as SNIPPET[]
      isResultDropdownOpen.value = true
    })
    .catch((err) => {
      console.log('搜索失败:', err)
      filteredSnippetItems.value = []
      isResultDropdownOpen.value = false
    })
}

function performCommand(searchTerm: string) {
  if (!searchTerm.trim()) {
    isCommandDropdownOpen.value = false
    return
  }

  filteredCommandItems.value = filterCommandItems(commandItems.value, searchTerm)

  isCommandDropdownOpen.value = true
}

// 使用防抖处理的搜索函数
const debouncedSearch = debounce(performSearch, 200)
const debouncedCommand = debounce(performCommand, 200)

function handleSearch(searchTerm: string) {
  debouncedSearch(searchTerm)
}

function handleCommand(searchTerm: string) {
  debouncedCommand(searchTerm)
}

function performClear() {
  isResultDropdownOpen.value = false
  isCommandDropdownOpen.value = false
  searchInputRef.value!.mode = 'clear'
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    performClear()
  }
}

// 调整窗口大小
function resizeWindow() {
  let size = { width: 480, height: 100 }
  if (isResultDropdownOpen.value) size = { width: 480, height: 500 }
  if (isCommandDropdownOpen.value) size = { width: 480, height: 320 }

  ipcStore[IpcSearchApi.RESIZE](size)
}

watch(
  () => [isResultDropdownOpen.value, isCommandDropdownOpen.value],
  () => resizeWindow()
)

onMounted(() => {
  // 使用被动事件监听模式提高性能
  document.addEventListener('click', handleClickOutside, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="w-full p-2 rounded-md">
    <div class="relative w-full rounded-[4px] overflow-hidden">
      <SearchInput
        ref="searchInputRef"
        @search="handleSearch"
        @command="handleCommand"
        @clear="performClear"
      />

      <div v-if="mode === 'command'" aria-live="polite" role="region" aria-label="命令结果">
        <CommandDropdown :items="filteredCommandItems" />
      </div>

      <div v-if="mode === 'search'" aria-live="polite" role="region" aria-label="搜索结果">
        <SearchResults
          v-if="isResultDropdownOpen && filteredSnippetItems.length > 0"
          :items="filteredSnippetItems"
        />
        <EmptyResults
          v-if="isResultDropdownOpen && !isCommandDropdownOpen && filteredSnippetItems.length === 0"
        />
      </div>
    </div>
  </div>
</template>
