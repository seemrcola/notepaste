<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AddCategorySvg from './svg/add-category.svg.vue'
import AddSvg from './svg/add.svg.vue'
import DeleteSvg from './svg/delete.svg.vue'
import CloseSvg from './svg/close.svg.vue'
import FolderSvg from './svg/folder.svg.vue'
import ExportSvg from './svg/export.svg.vue'
import { message } from '@renderer/components/ui/message'
import { confirm } from '@renderer/components/ui/confirm'
import type { CATEGORY } from '@renderer/type.d'
import { useDataStore } from '@renderer/store/data.store'
import { useIpcStore, IpcDbApi } from '@renderer/store/ipc.store'

const ipcStore = useIpcStore()
const dataStore = useDataStore()

// 是否显示添加分类表单
const showAddForm = ref(false)

// 导出下拉菜单状态
const showExportMenu = ref(false)

// 新分类名称
const newCategoryName = ref('')

// 编辑相关状态
const editingCategoryId = ref<number | null>(null)
const editingCategoryName = ref('')
const originalCategoryName = ref('')

// 拖拽相关状态
const dragOverCategoryId = ref<number | null>(null)

// 点击外部关闭下拉菜单
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showExportMenu.value = false
  }
}

// 处理添加分类按钮点击
function handleAddClick() {
  showAddForm.value = true
  // 自动聚焦输入框
  setTimeout(() => {
    const input = document.querySelector('.add-category-input')
    if (input) {
      ;(input as HTMLInputElement).focus()
    }
  }, 100)
}

// 处理取消添加
function handleCancelAdd() {
  showAddForm.value = false
  newCategoryName.value = ''
}

// 添加分类
async function handleAddCategory() {
  if (newCategoryName.value.trim()) {
    await dataStore.addCategory(newCategoryName.value.trim())
    message.success('添加分类成功')
    showAddForm.value = false
    newCategoryName.value = ''
  }
}

// 处理双击编辑分类
function handleDoubleClickCategory(category: CATEGORY) {
  editingCategoryId.value = category.id
  editingCategoryName.value = category.name
  originalCategoryName.value = category.name // 记录原始名称
  // 自动聚焦输入框
  setTimeout(() => {
    const input = document.querySelector(`.edit-category-input-${category.id}`)
    if (input) {
      ;(input as HTMLInputElement).focus()
      ;(input as HTMLInputElement).select()
    }
  }, 100)
}

// 保存编辑的分类名称
async function handleSaveEdit(id: number) {
  const trimmedName = editingCategoryName.value.trim()

  // 检查名称是否有效且是否发生了变化
  if (trimmedName && trimmedName !== originalCategoryName.value) {
    await dataStore.updateCategory(id, trimmedName)
    message.success('修改分类名称成功')
  }

  // 重置编辑状态
  editingCategoryId.value = null
  editingCategoryName.value = ''
  originalCategoryName.value = ''
}

// 取消编辑
function handleCancelEdit() {
  editingCategoryId.value = null
  editingCategoryName.value = ''
  originalCategoryName.value = ''
}

// 处理编辑输入框的键盘事件
function handleEditKeydown(event: KeyboardEvent, id: number) {
  if (event.key === 'Enter') {
    handleSaveEdit(id)
  } else if (event.key === 'Escape') {
    handleCancelEdit()
  }
}

// 处理删除分类
async function handleDeleteCategory(id: number, name: string) {
  const result = await confirm({
    title: '删除分类',
    content: `确定要删除分类"${name}"吗？删除后该分类下的所有代码片段也会被删除。`,
    confirmText: '删除',
    cancelText: '取消'
  })

  if (result) {
    // 删除分类
    await dataStore.deleteCategory(id)
    message.success('删除分类成功')
  }
}

function handleSelectCategory(index: number) {
  dataStore.currentCategory = dataStore.categories[index]
}

async function exportAll() {
  try {
    const result = await ipcStore[IpcDbApi.EXPORT]()
    if (result.success) {
      message.success('所有数据导出成功')
    } else {
      message.error(result.message || '导出失败')
    }
  } catch (error) {
    message.error('导出过程中发生错误')
  }
  showExportMenu.value = false
}

// 处理拖拽进入分类
function handleDragEnter(event: DragEvent, categoryId: number) {
  event.preventDefault()
  dragOverCategoryId.value = categoryId
}

// 处理拖拽离开分类
function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    dragOverCategoryId.value = null
  }
}

// 处理拖拽悬停
function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

// 处理放置
async function handleDrop(event: DragEvent, categoryId: number) {
  event.preventDefault()
  dragOverCategoryId.value = null

  try {
    const snippetData = event.dataTransfer?.getData('application/json')

    if (snippetData) {
      const snippet = JSON.parse(snippetData)

      // 如果拖拽到相同分类，不做任何操作
      if (snippet.categoryId === categoryId) {
        message.info('代码片段已在当前分类中')
        return
      }

      // 更新代码片段的分类
      await dataStore.moveSnippetToCategory(snippet.id, categoryId)
      message.success(`已将"${snippet.name}"移动到新分类`)
    } else {
      message.error('拖拽数据丢失，请重试')
    }
  } catch (error) {
    message.error('移动代码片段失败')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="h-full w-full text-gray-700 flex flex-col">
    <header class="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
      <h2 class="text-sm !font-bold">分类列表</h2>
      <div class="flex items-center gap-2">
        <!-- 导出下拉菜单 -->
        <div class="relative">
          <button
            class="export-button flex items-center justify-center p-1 rounded-full hover:bg-green-50 transition-colors"
            title="导出数据"
            @click="showExportMenu = !showExportMenu"
          >
            <ExportSvg class="w-5 h-5 text-green-600" />
          </button>

          <!-- 下拉菜单 -->
          <div
            v-if="showExportMenu"
            class="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40"
          >
            <button
              class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors rounded-b-lg"
              @click="exportAll"
            >
              导出所有数据
            </button>
          </div>
        </div>

        <button
          class="add-button flex items-center justify-center p-1 rounded-full hover:bg-blue-50 transition-colors"
          title="添加新分类"
          @click="handleAddClick"
        >
          <AddCategorySvg class="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </header>

    <div v-if="showAddForm" class="add-form-container px-3 pt-2 pb-1 animate-slide-down">
      <div
        class="add-category-card bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="flex items-center p-3 bg-blue-50">
          <AddSvg />
          <h3 class="font-medium text-sm text-blue-700">添加新分类</h3>
          <button
            class="!ml-auto p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
            @click="handleCancelAdd"
          >
            <CloseSvg />
          </button>
        </div>

        <div class="p-2">
          <input
            v-model="newCategoryName"
            type="text"
            :maxlength="20"
            placeholder="请输入分类名称"
            class="add-category-input w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex justify-between p-2 bg-gray-50 border-t border-gray-100">
          <button
            class="flex-1 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200 transition-colors text-sm"
            @click="handleCancelAdd"
          >
            取消
          </button>
          <div class="w-4"></div>
          <button
            class="flex-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!newCategoryName.trim()"
            @click="handleAddCategory"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <main class="flex-1 overflow-y-auto p-2">
      <!-- 空状态 -->
      <div
        v-if="dataStore.categories.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 py-12"
      >
        <FolderSvg />
        <p class="text-sm">先添加分类才能添加片段</p>
        <button
          class="!mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          @click="handleAddClick"
        >
          创建第一个分类
        </button>
      </div>

      <!-- 分类列表 -->
      <ul v-else class="grid gap-2 py-1 pb-4">
        <li
          v-for="(item, index) in dataStore.categories"
          :key="item.id"
          class="category-item flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out"
          :class="{
            selected: dataStore.currentCategory?.id === item.id,
            'drag-over': dragOverCategoryId === item.id
          }"
          @click="handleSelectCategory(index)"
          @dblclick="handleDoubleClickCategory(item)"
          @dragenter="handleDragEnter($event, item.id)"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop($event, item.id)"
        >
          <div
            class="category-icon w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"
          >
            <span class="text-blue-600 text-xs">{{ item.name.charAt(0) }}</span>
          </div>

          <!-- 正常显示模式 -->
          <div
            v-if="editingCategoryId !== item.id"
            class="font-medium truncate max-w-[6rem] text-sm !mx-2"
          >
            {{ item.name }}
          </div>

          <!-- 编辑模式 -->
          <div v-else class="flex-1 !mx-2">
            <input
              v-model="editingCategoryName"
              :class="`edit-category-input-${item.id}`"
              type="text"
              :maxlength="20"
              class="w-[6rem] px-1 py-0.5 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
              @keydown="handleEditKeydown($event, item.id)"
              @blur="handleSaveEdit(item.id)"
              @click.stop
            />
          </div>

          <div class="tool-button">
            <!-- <AddSvg class="scale-80 cursor-pointer" /> -->
            <DeleteSvg
              class="scale-80 cursor-pointer"
              @click.stop="handleDeleteCategory(item.id, item.name)"
            />
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.category-item {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 36px;
  border: 2px solid transparent;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.category-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.category-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: #3b82f6;
  opacity: 0.1;
  transition: width 0.3s ease;
}

.category-item:hover::after {
  width: 100%;
}

.category-item.selected {
  background-color: #eff6ff;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.category-item.selected .category-icon {
  background-color: rgba(59, 130, 246, 0.2);
}

.category-item.drag-over {
  background-color: #dbeafe;
  border: 2px dashed #3b82f6;
  transform: scale(1.02);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.08),
    0 0 0 2px rgba(59, 130, 246, 0.1);
}

.category-item.drag-over .category-icon {
  background-color: rgba(59, 130, 246, 0.3);
}

.tool-button {
  position: absolute;
  z-index: 10;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  gap: 0.1rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.category-item:hover .tool-button {
  opacity: 1;
}

.add-button {
  position: relative;
  overflow: hidden;
}

.add-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.add-button:hover::after {
  transform: scale(2.5);
  opacity: 0.1;
}

.add-button:active::after {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
  transform: scale(1.5);
  opacity: 0.2;
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

.add-category-card {
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

/* 自定义滚动条样式 */
main::-webkit-scrollbar {
  width: 5px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(203, 213, 225, 0.5);
  border-radius: 4px;
  transition: background-color 0.3s;
}

main::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.7);
}
</style>
