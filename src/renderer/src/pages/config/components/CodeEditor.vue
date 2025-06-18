<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from '@renderer/components/ui/message'
import { useDataStore } from '@renderer/store/data.store'
import {
  MinusSvg,
  PlusSvg,
  SettingsSvg,
  FullscreenSvg,
  ExitFullscreenSvg,
  EditSvg,
  CheckSvg,
  CopySvg
} from './svg'

const dataStore = useDataStore()

// 是否显示编辑器选项面板
const showOptions = ref(false)

// 是否处于全屏模式
const isFullscreen = ref(false)

// 编辑器字体大小
const fontSize = ref(12)

// 背景主题
const backgroundTheme = ref('light')

// 复制状态
const isCopied = ref(false)

// 编辑中的代码内容
const editingCode = ref('')

// 背景主题选项
const backgroundThemes = [
  { id: 'light', name: '浅色', class: 'bg-gray-50', color: 'bg-gray-200' },
  { id: 'dark', name: '深色', class: 'bg-gray-900', color: 'bg-gray-800' },
  { id: 'blue', name: '蓝色', class: 'bg-blue-50', color: 'bg-blue-200' },
  { id: 'green', name: '绿色', class: 'bg-green-50', color: 'bg-green-200' }
]

// 增加字体大小
function increaseFontSize() {
  if (fontSize.value < 24) {
    fontSize.value += 1
  }
}

// 减小字体大小
function decreaseFontSize() {
  if (fontSize.value > 10) {
    fontSize.value -= 1
  }
}

// 切换选项面板
function toggleOptions() {
  showOptions.value = !showOptions.value
}

// 切换全屏模式
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// 切换编辑模式
function toggleEditMode() {
  if (!dataStore.isEditMode) {
    // 进入编辑模式，初始化编辑内容
    editingCode.value = dataStore.currentSnippet?.code || ''
  } else {
    // 保存改动 - 使用参数化查询避免SQL注入
    dataStore.updateSnippet(dataStore.currentSnippet?.id as number, editingCode.value)
    message.success('保存成功')
  }
  dataStore.toggleEditMode()
}

// 切换背景主题
function changeBackgroundTheme(themeId: string) {
  backgroundTheme.value = themeId
}

// 复制代码到剪贴板
async function copyCode() {
  // 编辑模式下不触发复制
  if (dataStore.isEditMode || !dataStore.currentSnippet?.code) return

  try {
    await navigator.clipboard.writeText(dataStore.currentSnippet?.code || '')
    isCopied.value = true

    // 2秒后重置复制状态
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 处理代码容器点击
function handleCodeContainerClick() {
  if (!dataStore.isEditMode) {
    copyCode()
  }
}

// 计算代码行数
const lineCount = computed(() => {
  return dataStore.currentSnippet?.code.split('\n').length || 0
})

// 获取当前背景主题类
const currentThemeClass = computed(() => {
  return backgroundThemes.find((theme) => theme.id === backgroundTheme.value)?.class || 'bg-gray-50'
})

// 获取文本颜色类
const textColorClass = computed(() => {
  return backgroundTheme.value === 'dark' ? 'text-gray-100' : 'text-gray-800'
})

// 获取显示的代码内容
const displayCode = computed(() => {
  return dataStore.isEditMode ? editingCode.value : dataStore.currentSnippet?.code || ''
})
</script>

<template>
  <div
    class="h-full w-full text-gray-800 flex flex-col relative pb-4"
    :class="{ fullscreen: isFullscreen }"
  >
    <header class="p-4 py-2 border-b border-gray-200 flex items-center justify-between bg-white">
      <div class="flex items-center">
        <h2 class="text-sm !font-semibold text-gray-900">代码编辑器</h2>
        <div
          class="language-badge !ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
        >
          {{ dataStore.currentSnippet?.language }}
        </div>
        <!-- 编辑模式指示器 -->
        <div
          v-if="dataStore.isEditMode"
          class="!ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
        >
          编辑中
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="editor-button p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          title="编辑器选项"
          @click="toggleOptions"
        >
          <SettingsSvg class="w-4 h-4" />
        </button>

        <button
          class="editor-button p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          :title="isFullscreen ? '退出全屏' : '全屏模式'"
          @click="toggleFullscreen"
        >
          <FullscreenSvg v-if="!isFullscreen" class="w-4 h-4" />
          <ExitFullscreenSvg v-else class="w-4 h-4" />
        </button>

        <!-- 编辑模式切换按钮 -->
        <button
          class="editor-button p-2 rounded-lg transition-all duration-200"
          :class="
            dataStore.isEditMode
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          "
          :title="dataStore.isEditMode ? '退出编辑模式' : '进入编辑模式'"
          @click="toggleEditMode"
        >
          <EditSvg v-if="!dataStore.isEditMode" class="w-4 h-4" />
          <CheckSvg v-else class="w-4 h-4" />
        </button>
      </div>
    </header>

    <div
      v-if="showOptions"
      class="editor-options px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 animate-slide-down"
    >
      <div class="space-y-3 max-w-4xl !mx-auto">
        <!-- 字体大小控制 -->
        <div class="flex items-center justify-between !my-2">
          <span class="text-xs font-semibold text-gray-700 !min-w-[50px]">字体大小</span>
          <div
            class="flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm border border-gray-200/80"
          >
            <button
              class="flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="fontSize <= 10"
              @click="decreaseFontSize"
            >
              <MinusSvg class="w-4 h-4" />
            </button>

            <span class="text-xs font-bold text-gray-800 !min-w-[24px] text-center px-1">
              {{ fontSize }}
            </span>

            <button
              class="flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="fontSize >= 24"
              @click="increaseFontSize"
            >
              <PlusSvg class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 背景主题选择 -->
        <div class="flex items-center justify-between !my-1">
          <span class="text-xs font-semibold text-gray-700 !min-w-[5rem]">背景主题</span>
          <div class="flex items-center space-x-1">
            <button
              v-for="theme in backgroundThemes"
              :key="theme.id"
              class="!mx-1 group relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 border"
              :class="
                backgroundTheme === theme.id
                  ? 'bg-white text-gray-800 shadow-md border-gray-300/60 ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-white/80 hover:text-gray-800 hover:shadow-sm border-transparent'
              "
              @click="changeBackgroundTheme(theme.id)"
            >
              <div
                class="w-2.5 h-2.5 rounded-full border border-gray-400/50 shadow-sm"
                :class="theme.color"
              ></div>
              <span class="text-xs !mx-1">{{ theme.name }}</span>

              <!-- 选中指示器 -->
              <div
                v-if="backgroundTheme === theme.id"
                class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="flex-1 overflow-hidden relative">
      <div
        class="code-container h-full overflow-auto p-4 font-mono transition-colors duration-300 relative group"
        :class="[
          currentThemeClass,
          textColorClass,
          dataStore.isEditMode ? 'cursor-text' : 'cursor-pointer'
        ]"
        :title="dataStore.isEditMode ? '编辑模式' : '点击复制代码'"
        @click="handleCodeContainerClick"
      >
        <!-- 复制提示 -->
        <div
          v-if="isCopied"
          class="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2 animate-fade-in"
        >
          <CheckSvg class="w-4 h-4 !mr-2" />
          <span class="text-sm font-medium">已复制到剪贴板</span>
        </div>

        <!-- 悬停提示 -->
        <div
          v-if="!dataStore.isEditMode"
          class="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2"
          :class="{ hidden: isCopied }"
        >
          <CopySvg class="w-4 h-4 !mr-2" />
          <span class="text-sm">点击复制</span>
        </div>

        <!-- 编辑模式提示 -->
        <div
          v-if="dataStore.isEditMode"
          class="absolute top-4 right-4 bg-green-500 bg-opacity-90 text-white px-3 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2"
        >
          <EditSvg class="w-4 h-4 !mr-2" />
          <span class="text-sm">编辑模式</span>
        </div>

        <!-- 代码编辑区域 -->
        <textarea
          v-if="dataStore.isEditMode"
          v-model="editingCode"
          class="code-editor w-full h-full resize-none border-none outline-none bg-transparent leading-relaxed"
          :style="{ fontSize: `${fontSize}px` }"
          @click.stop
        ></textarea>

        <!-- 代码显示区域 -->
        <div v-else class="code-editor leading-relaxed" :style="{ fontSize: `${fontSize}px` }">
          {{ displayCode }}
        </div>
      </div>
    </main>

    <footer
      class="py-3 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-600"
    >
      <div class="flex items-center space-x-4">
        <span>{{ lineCount }} </span>
        <span class="!mx-2 text-gray-500">行</span>
        <span class="px-2 py-1 bg-amber-200 rounded-md text-xs">
          {{ dataStore.currentSnippet?.language }}
        </span>
      </div>
      <div class="text-xs text-gray-500 px-2 py-1 bg-amber-200 rounded-md">
        字体: {{ fontSize }}px | 主题:
        {{ backgroundThemes.find((t) => t.id === backgroundTheme)?.name }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  background-color: white;
}

.code-container {
  position: relative;
  line-height: 1.8;
}

.code-editor {
  width: 100%;
  height: 100%;
  tab-size: 2;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  padding: 0;
  margin: 0;
}

/* 编辑模式下的 textarea 样式 */
.code-editor[contenteditable='false'] {
  white-space: pre-wrap;
}

textarea.code-editor {
  font-family: inherit;
  tab-size: 2;
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
  color: inherit;
}

textarea.code-editor:focus {
  outline: none;
}

.editor-button {
  position: relative;
  overflow: hidden;
}

.editor-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.editor-button:hover::after {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0.4;
}

.editor-button:active::after {
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 0.6;
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

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease forwards;
}

/* 清除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
