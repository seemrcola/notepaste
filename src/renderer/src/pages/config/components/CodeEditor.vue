<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SNIPPET } from '@renderer/type.d'

const props = defineProps<{
  snippet: SNIPPET | null
}>()

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

// 背景主题选项
const backgroundThemes = [
  { id: 'light', name: '浅色', class: 'bg-gray-50', color: 'bg-gray-200' },
  { id: 'dark', name: '深色', class: 'bg-gray-900', color: 'bg-gray-800' },
  { id: 'blue', name: '蓝色', class: 'bg-blue-50', color: 'bg-blue-200' },
  { id: 'green', name: '绿色', class: 'bg-green-50', color: 'bg-green-200' }
]

// 增加字体大小
const increaseFontSize = () => {
  if (fontSize.value < 24) {
    fontSize.value += 1
  }
}

// 减小字体大小
const decreaseFontSize = () => {
  if (fontSize.value > 10) {
    fontSize.value -= 1
  }
}

// 切换选项面板
const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 切换背景主题
const changeBackgroundTheme = (themeId) => {
  backgroundTheme.value = themeId
}

// 复制代码到剪贴板
const copyCode = async () => {
  if (!props.snippet?.code) return

  try {
    await navigator.clipboard.writeText(props.snippet.code)
    isCopied.value = true

    // 2秒后重置复制状态
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 计算代码行数
const lineCount = computed(() => {
  return props.snippet?.code.split('\n').length || 0
})

// 获取当前背景主题类
const currentThemeClass = computed(() => {
  return backgroundThemes.find((theme) => theme.id === backgroundTheme.value)?.class || 'bg-gray-50'
})

// 获取文本颜色类
const textColorClass = computed(() => {
  return backgroundTheme.value === 'dark' ? 'text-gray-100' : 'text-gray-800'
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
          class="language-badge !ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
        >
          {{ snippet?.language }}
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="editor-button p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          title="编辑器选项"
          @click="toggleOptions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button
          class="editor-button p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          :title="isFullscreen ? '退出全屏' : '全屏模式'"
          @click="toggleFullscreen"
        >
          <svg
            v-if="!isFullscreen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M20 12H4"
                />
              </svg>
            </button>

            <span class="text-xs font-bold text-gray-800 !min-w-[24px] text-center px-1">{{
              fontSize
            }}</span>

            <button
              class="flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="fontSize >= 24"
              @click="increaseFontSize"
            >
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
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
        class="code-container h-full overflow-auto p-4 font-mono transition-colors duration-300 cursor-pointer relative group"
        :class="[currentThemeClass, textColorClass]"
        title="点击复制代码"
        @click="copyCode"
      >
        <!-- 复制提示 -->
        <div
          v-if="isCopied"
          class="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2 animate-fade-in"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span class="text-sm font-medium">已复制到剪贴板</span>
        </div>

        <!-- 悬停提示 -->
        <div
          class="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2"
          :class="{ hidden: isCopied }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          <span class="text-sm">点击复制</span>
        </div>

        <pre class="code-editor leading-relaxed" :style="{ fontSize: `${fontSize}px` }"
          >{{ snippet?.code }}
        </pre>
      </div>
    </main>

    <footer
      class="py-3 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-600"
    >
      <div class="flex items-center space-x-4">
        <span>{{ lineCount }} </span>
        <span class="!mx-2 text-gray-500">行</span>
        <span class="px-2 py-1 bg-amber-200 rounded-md">{{ snippet?.language }}</span>
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

.code-container:hover {
  background-color: rgba(59, 130, 246, 0.02);
}

.code-editor {
  tab-size: 2;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  padding: 0;
  margin: 0;
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
