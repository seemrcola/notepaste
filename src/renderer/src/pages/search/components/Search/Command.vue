<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { commandData } from './data/commandData'
import { useMove } from './utils/useMove'
import { useIpcStore, IpcSearchApi, IpcDbApi } from '@renderer/store/ipc.store'
const ipcStore = useIpcStore()

const props = defineProps<{
  items: typeof commandData
}>()

const { curIndex, reset } = useMove('.command-dropdown-container', props.items)

watch(
  () => props.items,
  (n) => reset(n)
)

function keydown(e: KeyboardEvent) {
  const currentCommand = props.items[curIndex.value]
  // 按下Enter键 执行命令
  if (e.key === 'Enter' && currentCommand.id === 'config') {
    ipcStore[IpcSearchApi.OPEN_CONFIG_WINDOW]()
  }
  if (e.key === 'Enter' && currentCommand.id === 'export') {
    ipcStore[IpcDbApi.EXPORT]()
  }
  if (e.key === 'Enter' && currentCommand.id === 'settings') {
    ipcStore[IpcSearchApi.OPEN_SETTINGS_WINDOW]()
  }
}

function handleClick(item: (typeof commandData)[number]) {
  if (item.id === 'config') {
    ipcStore[IpcSearchApi.OPEN_CONFIG_WINDOW]()
  }
  if (item.id === 'export') {
    ipcStore[IpcDbApi.EXPORT]()
  }
  if (item.id === 'settings') {
    ipcStore[IpcSearchApi.OPEN_SETTINGS_WINDOW]()
  }
}

onMounted(() => {
  window.addEventListener('keydown', keydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', keydown)
})
</script>

<template>
  <div
    class="command-dropdown mt-2 w-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl overflow-hidden dropdown-animation"
    role="listbox"
    aria-label="可用命令列表"
  >
    <div class="border-b border-gray-200 bg-gray-50 px-3 py-2">
      <span class="text-sm font-bold text-gray-500">可用命令</span>
    </div>
    <ul class="max-h-[300px] overflow-y-auto command-dropdown-container">
      <li
        v-for="(item, index) in props.items"
        :key="item.id"
        class="group cursor-pointer border-b border-gray-100 px-3 py-3 transition-all duration-200 hover:bg-gray-50"
        :class="{ 'bg-blue-50': index === curIndex }"
        role="option"
        :aria-selected="index === curIndex"
        tabindex="0"
        @click="handleClick(item)"
      >
        <div class="flex items-center mb-2">
          <span
            class="text-sm font-mono text-gray-800"
            :class="{ 'text-blue-600': index === curIndex }"
            >{{ item.name }}</span
          >
        </div>
        <div class="text-xs text-gray-500 pl-4">
          {{ item.description }}
        </div>
      </li>
      <li
        v-if="props.items.length === 0"
        class="flex items-center justify-center py-5 text-sm text-gray-500"
      >
        <span>没有找到匹配的命令</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-animation {
  animation: slideDown 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.command-dropdown {
  scrollbar-gutter: stable both-edges;
  overflow-y: auto;
}

/* 修改滚动条样式 */
.command-dropdown::-webkit-scrollbar {
  width: 6px;
  background-color: #f9fafb;
}

.command-dropdown::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.command-dropdown::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
