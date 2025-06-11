<template>
  <div class="message-item" :class="`message-${type}`" :style="{ top: `${offset}px` }">
    <div class="message-content">
      <div class="message-icon">
        <!-- Success Icon -->
        <svg v-if="type === 'success'" viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
            fill="currentColor"
          />
        </svg>
        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-0.3L512 563.4l-99.3 118.4-66.1 0.3c-4.4 0-8-3.5-8-8 0-1.9 0.7-3.7 1.9-5.2l130.1-155L340.5 359c-1.2-1.5-1.9-3.3-1.9-5.2 0-4.4 3.6-8 8-8l66.1 0.3L512 464.6l99.3-118.4 66-0.3c4.4 0 8 3.5 8 8 0 1.9-0.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
            fill="currentColor"
          />
        </svg>
        <!-- Info Icon -->
        <svg v-else viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-272c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="message-text">{{ content }}</div>
    </div>
    <button class="message-close" type="button" @click="onClose">
      <svg viewBox="0 0 1024 1024" width="12" height="12">
        <path
          d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'info' | 'success' | 'error'
  content: string
  offset: number
  onClose: () => void
}>()
</script>

<style scoped>
.message-item {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: messageIn 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
}

.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-close {
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
  background: none;
  border: none;
  border-radius: 4px;
  flex-shrink: 0;
}

.message-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

/* 消息类型样式 - 简化版本 */
.message-info {
  background-color: rgba(240, 249, 255, 0.95);
  border: 1px solid #91caff;
}

.message-info .message-icon,
.message-info .message-text {
  color: #1677ff;
}

.message-success {
  background-color: rgba(246, 255, 237, 0.95);
  border: 1px solid #b7eb8f;
}

.message-success .message-icon,
.message-success .message-text {
  color: #52c41a;
}

.message-error {
  background-color: rgba(255, 242, 240, 0.95);
  border: 1px solid #ffccc7;
}

.message-error .message-icon,
.message-error .message-text {
  color: #ff4d4f;
}
</style>
