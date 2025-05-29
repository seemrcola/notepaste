<template>
  <div
    class="message-item"
    :class="[`message-${type}`]"
    :style="{
      top: `${offset}px`
    }"
  >
    <div class="message-content">
      <div class="message-icon">
        <svg
          v-if="type === 'success'"
          class="icon icon-success"
          viewBox="0 0 1024 1024"
          width="16"
          height="16"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
            fill="currentColor"
          ></path>
        </svg>
        <svg
          v-if="type === 'error'"
          class="icon icon-error"
          viewBox="0 0 1024 1024"
          width="16"
          height="16"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-0.3L512 563.4l-99.3 118.4-66.1 0.3c-4.4 0-8-3.5-8-8 0-1.9 0.7-3.7 1.9-5.2l130.1-155L340.5 359c-1.2-1.5-1.9-3.3-1.9-5.2 0-4.4 3.6-8 8-8l66.1 0.3L512 464.6l99.3-118.4 66-0.3c4.4 0 8 3.5 8 8 0 1.9-0.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
            fill="currentColor"
          ></path>
        </svg>
        <svg
          v-if="type === 'info'"
          class="icon icon-info"
          viewBox="0 0 1024 1024"
          width="16"
          height="16"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-272c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="message-text">{{ content }}</div>
    </div>
    <div class="message-close" @click="onClose">
      <svg viewBox="0 0 1024 1024" width="12" height="12">
        <path
          d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
          fill="red"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  type: 'info' | 'success' | 'error'
  content: string
  offset: number
  duration: number
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
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: messageIn 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: black;
}

.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-close {
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: right;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.message-close:hover {
  opacity: 1;
}

.message-info {
  background-color: rgba(240, 249, 255, 0.9);
  border: 1px solid #91caff;
}

.message-info .icon-info {
  color: #1677ff;
}

.message-success {
  background-color: rgba(246, 255, 237, 0.9);
  border: 1px solid #b7eb8f;
}

.message-success .icon-success {
  color: #52c41a;
}

.message-error {
  background-color: rgba(255, 242, 240, 0.9);
  border: 1px solid #ffccc7;
}

.message-error .icon-error {
  color: #ff4d4f;
}
</style>
