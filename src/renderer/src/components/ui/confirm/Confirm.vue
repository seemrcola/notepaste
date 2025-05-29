<script setup lang="ts">
interface Props {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确认',
  cancelText: '取消'
})

function handleConfirm() {
  props.onConfirm()
}

function handleCancel() {
  props.onCancel()
}
</script>

<template>
  <div class="confirm-overlay" @click="handleCancel">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-header">
        <h3 class="confirm-title">{{ title }}</h3>
        <button class="confirm-close" @click="handleCancel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="confirm-content">
        <p>{{ content }}</p>
      </div>

      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn-cancel" @click="handleCancel">
          <span>{{ cancelText }}</span>
        </button>
        <button class="confirm-btn confirm-btn-confirm" @click="handleConfirm">
          <span>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.confirm-dialog {
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  min-width: 360px;
  max-width: 420px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.confirm-dialog::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.4), transparent);
}

.confirm-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  letter-spacing: -0.025em;
  line-height: 1.4;
}

.confirm-close {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.confirm-close:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.confirm-close svg {
  width: 16px;
  height: 16px;
}

.confirm-content {
  padding: 16px 24px 24px;
}

.confirm-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 14px;
}

.confirm-actions {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-btn {
  position: relative;
  padding: 10px 24px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 80px;
  overflow: hidden;
}

.confirm-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.confirm-btn:hover::before {
  left: 100%;
}

.confirm-btn span {
  position: relative;
  z-index: 1;
}

.confirm-btn-cancel {
  background: rgba(248, 250, 252, 0.8);
  border-color: rgba(226, 232, 240, 0.8);
  color: #64748b;
}

.confirm-btn-cancel:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(203, 213, 225, 0.9);
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.confirm-btn-confirm {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #dc2626;
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.confirm-btn-confirm:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.confirm-btn:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .confirm-dialog {
    min-width: 320px;
    margin: 20px;
  }

  .confirm-actions {
    flex-direction: column;
  }

  .confirm-btn {
    width: 100%;
  }
}
</style>
