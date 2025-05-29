<script setup lang="ts">
import { useMove } from './utils/useMove'
import { onMounted, onUnmounted, watch } from 'vue'
import { message } from '@renderer/components/ui/message'
import type { SNIPPET } from '@renderer/type.d'

const props = defineProps<{
  items: SNIPPET[]
}>()

const { curIndex, reset } = useMove('.dropdown-item-container', props.items)

watch(
  () => props.items,
  (n) => reset(n)
)

function copy(text: string) {
  navigator.clipboard.writeText(text)
  message.success('复制成功')
}

function keydown(e: KeyboardEvent) {
  if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
    const txt = props.items[curIndex.value]
    copy(txt.code)
  }
}

function handleClick(item: SNIPPET) {
  copy(item.code)
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
    class="dropdown mt-2 w-full bg-white border border-gray-300 shadow-lg overflow-hidden max-h-[400px] overflow-y-auto dropdown-animation"
    role="listbox"
    aria-label="搜索结果列表"
  >
    <ul class="w-full dropdown-item-container">
      <li
        v-for="(item, index) in props.items"
        :key="item.id"
        :class="curIndex === index ? 'bg-blue-50 border-l-blue-500' : ''"
        class="p-4 cursor-pointer transition-all duration-200 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 border-l-4 border-l-transparent"
        role="option"
        :aria-selected="curIndex === index"
        tabindex="0"
        @click="handleClick(item)"
      >
        <div class="font-semibold text-gray-900 mb-1">{{ item.name }}</div>
        <div class="text-sm text-gray-600 truncate">{{ item.description }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-animation {
  animation: slideDown 0.2s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown {
  scrollbar-gutter: stable both-edges;
  overflow-y: auto;
}

/* 简洁的滚动条样式 */
.dropdown::-webkit-scrollbar {
  width: 8px;
}

.dropdown::-webkit-scrollbar-track {
  background-color: #f8f9fa;
}

.dropdown::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
