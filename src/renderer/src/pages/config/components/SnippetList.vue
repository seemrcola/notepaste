<script setup lang="ts">
import { ref } from 'vue'
import { message } from '@renderer/components/ui/message'
import { confirm } from '@renderer/components/ui/confirm'
import { useDataStore } from '@renderer/store/data.store'
import { SNIPPET } from '@renderer/type'
import { DeleteSvg, SearchSvg, CloseSvg, AddSvg, CodeSvg } from './svg'

const dataStore = useDataStore()

// 搜索关键词
const searchQuery = ref('')

// 是否显示添加片段表单
const showAddForm = ref(false)

// 新片段信息
const newSnippet = ref({
  name: '',
  code: '',
  language: '',
  description: ''
})

// 拖拽的片段
const dragSnippet = ref<SNIPPET | null>(null)

// 处理片段选择
function handleSelectSnippet(index: number) {
  const snippet = dataStore.snippets[index]
  if (snippet) {
    dataStore.setCurrentSnippet(snippet)
  }
}

// 处理添加片段按钮点击
function handleAddClick() {
  showAddForm.value = true
}

// 处理取消添加
function handleCancelAdd() {
  showAddForm.value = false
  newSnippet.value = { name: '', code: '', language: '', description: '' }
}

// 处理添加片段
function handleAddSnippet() {
  if (newSnippet.value.name.trim()) {
    if (dataStore.currentCategory) {
      dataStore.addSnippet(newSnippet.value)
      message.success('添加代码片段成功')
      handleCancelAdd()
    } else {
      message.error('请先选择一个分类 或 新建一个分类')
    }
    return
  }
  message.error('请输入片段名称')
}

// 处理搜索
async function handleSearch() {
  await dataStore.searchSnippets(searchQuery.value)
}

// 处理搜索框清除
async function clearSearch() {
  searchQuery.value = ''
  await dataStore.searchSnippets('')
}

// 处理删除片段
async function handleDeleteSnippet(id: number, name: string) {
  const result = await confirm({
    title: '删除代码片段',
    content: `确定要删除代码片段"${name}"吗？此操作不可撤销。`,
    confirmText: '删除',
    cancelText: '取消'
  })

  if (result) {
    dataStore.deleteSnippet(id)
    message.success('删除代码片段成功')
  }
}

// 拖拽改变分组
function handleDragStart(event: DragEvent, snippet: SNIPPET) {
  dragSnippet.value = snippet

  // 设置拖拽数据
  if (event.dataTransfer) {
    // 数据设置
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(snippet))
  } else {
    console.error('❌ DataTransfer 不可用')
  }
}

// 拖拽结束处理
function handleDragEnd(event: DragEvent) {
  console.log('拖拽结束')
  const dragElement = event.currentTarget as HTMLElement
  if (dragElement) {
    dragElement.style.opacity = '1'
    dragElement.style.transform = 'scale(1)'
    dragElement.style.transition = 'all 0.2s ease'
  }
  dragSnippet.value = null
}
</script>

<template>
  <div class="h-full flex flex-col bg-blue-50/50 p-2">
    <!-- 头部 -->
    <div class="flex-shrink-0 px-2 border-gray-200">
      <div class="flex items-center justify-between !mb-3">
        <h2 class="text-sm !font-semibold text-gray-900">代码片段</h2>
        <button
          class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
          @click="handleAddClick"
        >
          + 新建
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索片段..."
          class="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="handleSearch"
        />
        <SearchSvg />
        <button
          v-if="searchQuery"
          class="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
          @click="clearSearch"
        >
          <CloseSvg />
        </button>
      </div>
    </div>

    <!-- 添加表单 -->
    <div v-if="showAddForm" class="add-form-container px-3 pt-2 pb-1 animate-slide-down">
      <div
        class="add-snippet-card bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="flex items-center p-3 bg-blue-50">
          <AddSvg />
          <h3 class="font-medium text-sm text-blue-700">新建代码片段</h3>
          <button
            class="!ml-auto p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
            @click="handleCancelAdd"
          >
            <CloseSvg />
          </button>
        </div>

        <div class="p-3 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 !mb-1">片段名称</label>
              <input
                v-model="newSnippet.name"
                type="text"
                placeholder="输入片段名称"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 !mb-1">编程语言</label>
              <input
                v-model="newSnippet.language"
                type="text"
                placeholder="如：JavaScript"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 !mb-1">描述</label>
            <input
              v-model="newSnippet.description"
              type="text"
              placeholder="简单描述这个代码片段的用途"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 !mb-1">代码内容</label>
            <textarea
              v-model="newSnippet.code"
              rows="4"
              placeholder="在这里输入您的代码..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono resize-none transition-all"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between p-3 bg-gray-50 border-t border-gray-100">
          <button
            class="flex-1 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-200 transition-colors text-sm"
            @click="handleCancelAdd"
          >
            取消
          </button>
          <div class="w-4"></div>
          <button
            :disabled="!newSnippet.name.trim()"
            class="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleAddSnippet"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 片段列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="dataStore.snippets.length > 0" class="px-1 !my-1 pb-4">
        <div
          v-for="(snippet, index) in dataStore.snippets"
          :key="snippet.id"
          class="snippet-item p-4 cursor-pointer transition-all duration-200 ease-in-out rounded-lg !mx-1 !my-2 border border-transparent"
          :class="{ selected: dataStore.currentSnippet?.id === snippet.id }"
          @click="handleSelectSnippet(index)"
        >
          <div class="flex items-start justify-between !mb-3">
            <div class="flex-1 min-w-0">
              <h3
                class="text-sm font-semibold text-gray-800 truncate drag-handle"
                draggable="true"
                @dragstart="handleDragStart($event, snippet)"
                @dragend="handleDragEnd"
                @click.stop
              >
                {{ snippet.name }}
              </h3>
              <p class="text-xs text-gray-500 !mt-1">{{ snippet.description }}</p>
            </div>
            <span
              class="!ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium"
            >
              {{ snippet.language }}
            </span>
          </div>

          <div class="bg-gray-100 rounded-md p-2 !mt-3">
            <pre
              class="text-xs text-gray-700 font-mono whitespace-pre-wrap overflow-hidden"
              style="max-height: 40px"
              >{{ snippet.code }}</pre
            >
          </div>

          <!-- 删除按钮 -->
          <div class="tool-button">
            <DeleteSvg
              class="scale-80 cursor-pointer"
              @click="handleDeleteSnippet(snippet.id, snippet.name)"
            />
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 py-12">
        <CodeSvg />
        <p class="text-sm">没有找到代码片段</p>
        <button
          class="!mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          @click="handleAddClick"
        >
          创建第一个片段
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snippet-item {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 80px;
}

.snippet-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.snippet-item::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: #3b82f6;
  opacity: 0.1;
  transition: width 0.3s ease;
}

.snippet-item:hover::after {
  width: 100%;
}

.snippet-item.selected {
  background-color: #eff6ff;
  border-left: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.drag-handle {
  cursor: grab;
  -webkit-user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle[draggable='true']:hover {
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.tool-button {
  position: absolute;
  z-index: 10;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  gap: 0.1rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.snippet-item:hover .tool-button {
  opacity: 1;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease forwards;
}

.add-snippet-card {
  animation: float-in 0.3s ease forwards;
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
