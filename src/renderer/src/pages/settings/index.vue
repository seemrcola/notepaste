<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIpcStore, IpcDbApi } from '@renderer/store/ipc.store'
import { message } from '@renderer/components/ui/message'
import { SearchIcon, ResetIcon, SaveIcon, KeyboardIcon } from './components/svg'

const ipcStore = useIpcStore()

// 设置数据
const settings = ref({
  searchHotkey: 'CommandOrControl+Shift+K'
})

// 当前正在编辑的快捷键
const editingKey = ref<string | null>(null)

// 快捷键显示名称映射
const keyDisplayMap: Record<string, string> = {
  CommandOrControl: 'Cmd/Ctrl',
  Command: 'Cmd',
  Control: 'Ctrl',
  Alt: 'Alt',
  Shift: 'Shift',
  Space: 'Space',
  Enter: 'Enter',
  Escape: 'Escape',
  Tab: 'Tab'
}

// 设置项配置
const settingItems = [
  {
    key: 'searchHotkey',
    title: '唤起搜索',
    icon: 'search',
    color: 'text-blue-500'
  }
]

// 格式化快捷键显示
function formatHotkey(hotkey: string): string {
  return hotkey
    .split('+')
    .map((key) => keyDisplayMap[key] || key)
    .join(' ')
}

// 开始录制快捷键
function startRecording(key: string) {
  editingKey.value = key
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
}

// 停止录制
function stopRecording() {
  editingKey.value = null
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
}

// 处理按键
function handleKeyDown(event: KeyboardEvent) {
  if (!editingKey.value) return

  event.preventDefault()
  event.stopPropagation()

  const keys: string[] = []

  // 修饰键
  if (event.ctrlKey || event.metaKey) {
    keys.push('CommandOrControl')
  }
  if (event.altKey) {
    keys.push('Alt')
  }
  if (event.shiftKey) {
    keys.push('Shift')
  }

  // 主键
  if (event.code === 'Space') {
    keys.push('Space')
  } else if (event.code === 'Enter') {
    keys.push('Enter')
  } else if (event.code === 'Escape') {
    keys.push('Escape')
  } else if (event.code === 'Tab') {
    keys.push('Tab')
  } else if (event.key.length === 1) {
    keys.push(event.key.toUpperCase())
  }

  if (keys.length > 0) {
    const newHotkey = keys.join('+')
    settings.value[editingKey.value as keyof typeof settings.value] = newHotkey
  }
}

function handleKeyUp(event: KeyboardEvent) {
  if (!editingKey.value) return

  // 如果松开了所有修饰键，停止录制
  if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
    setTimeout(stopRecording, 100)
  }
}

// 重置为默认值
function resetToDefault() {
  settings.value = {
    searchHotkey: 'CommandOrControl+Shift+K'
  }
  message.success('已重置为默认设置')
}

// 保存设置
async function saveSettings() {
  // 保存设置到数据库 更新数据库内容
  await ipcStore[IpcDbApi.SQL](`UPDATE hotkeys SET hotkey = ? WHERE name = ?`, 'update', [
    settings.value.searchHotkey,
    'searchHotkey'
  ])
  message.success('设置已保存 重启后生效')
}

// 加载设置
async function loadSettings() {
  // 加载全部快捷键
  const hotkeys = (await ipcStore[IpcDbApi.SQL](`SELECT * FROM hotkeys`, 'findAll')) as Array<{
    id: number
    name: string
    hotkey: string
    createdAt: string
    updatedAt: string
  }>
  console.log('hotkeys', hotkeys)
  // 遍历快捷键，只处理searchHotkey
  hotkeys.forEach((hotkey) => {
    if (hotkey.name === 'searchHotkey' && hotkey.name in settings.value) {
      settings.value[hotkey.name as keyof typeof settings.value] = hotkey.hotkey
    }
  })
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="h-screen tech-bg flex flex-col overflow-hidden">
    <!-- 科技背景装饰 -->
    <div class="tech-bg-overlay"></div>
    <div class="tech-grid"></div>

    <!-- 设置列表 -->
    <div class="flex-1 overflow-y-auto px-4 space-y-6 relative z-10 tech-scrollbar">
      <div
        v-for="(item, index) in settingItems"
        :key="item.key"
        class="setting-item tech-card"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- SVG 图标 -->
            <div class="icon-container" :class="item.color">
              <!-- 搜索图标 -->
              <SearchIcon v-if="item.icon === 'search'" class="icon" />
            </div>

            <div>
              <span class="text-sm font-medium text-slate-100">{{ item.title }}</span>
            </div>
          </div>

          <button
            class="hotkey-btn"
            :class="{ recording: editingKey === item.key }"
            @click="startRecording(item.key)"
          >
            <span v-if="editingKey === item.key" class="recording-text">
              <span class="recording-dot"></span>
              按键中
            </span>
            <span v-else class="hotkey-text">
              {{ formatHotkey(settings[item.key as keyof typeof settings]) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-panel tech-panel relative z-10">
      <div class="flex justify-between">
        <button class="btn-secondary flex-1" @click="resetToDefault">
          <ResetIcon class="w-3.5 h-3.5 !mr-1.5" />
          重置
        </button>
        <div class="w-4"></div>
        <button class="btn-primary flex-1" @click="saveSettings">
          <SaveIcon class="w-3.5 h-3.5 !mr-1.5" />
          保存
        </button>
      </div>
    </div>

    <!-- 录制遮罩 -->
    <div v-if="editingKey" class="recording-overlay" @click="stopRecording">
      <div class="recording-hint tech-card">
        <div class="!mb-4">
          <!-- 键盘图标 -->
          <KeyboardIcon />
        </div>
        <div class="text-lg font-semibold text-slate-100 !mb-2">按下快捷键组合</div>
        <div class="text-sm text-slate-300">点击空白处取消</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-item {
  border-radius: 12px;
  padding: 8px 12px;
  margin: 10px 0;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.tech-bg {
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 25%,
    #334155 50%,
    #1e293b 75%,
    #0f172a 100%
  );
  position: relative;
}

.tech-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
  animation: techPulse 8s ease-in-out infinite;
  pointer-events: none;
}

.tech-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

.tech-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(148, 163, 184, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tech-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
  pointer-events: none;
}

.tech-card:hover::before {
  transform: translateX(100%);
}

.tech-card:hover {
  transform: translateY(-1px);
  box-shadow:
    0 8px 25px -5px rgba(0, 0, 0, 0.4),
    0 4px 6px -2px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(148, 163, 184, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.tech-panel {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.tech-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.tech-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.3);
}

.tech-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #475569 0%, #64748b 100%);
  border-radius: 2px;
}

.tech-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
}

.icon-container {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.setting-item:hover .icon-container::after {
  transform: translateX(100%);
}

.icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.text-blue-500 .icon {
  color: #60a5fa;
}

.text-green-500 .icon {
  color: #34d399;
}

.text-purple-500 .icon {
  color: #a78bfa;
}

.setting-item:hover .icon-container {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(148, 163, 184, 0.5);
}

.hotkey-btn {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
  font-weight: 500;
  font-size: 11px;
  color: #e2e8f0;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hotkey-btn:hover {
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.9) 0%, rgba(71, 85, 105, 0.7) 100%);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-0.5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.hotkey-btn:active {
  transform: translateY(0);
}

.hotkey-btn.recording {
  background: linear-gradient(135deg, rgba(127, 29, 29, 0.9) 0%, rgba(153, 27, 27, 0.7) 100%);
  border-color: #f87171;
  animation: recordingPulse 2s infinite;
}

.recording-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fca5a5;
  font-size: 10px;
}

.recording-dot {
  width: 4px;
  height: 4px;
  background: #f87171;
  border-radius: 50%;
  margin-right: 4px;
  animation: pulse 1s infinite;
}

.hotkey-text {
  letter-spacing: 0.3px;
}

.bottom-panel {
  padding: 8px 16px;
}

.btn-primary,
.btn-secondary {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.btn-primary::before,
.btn-secondary::before {
  content: '';
  position: absolute;
  inset: 0 -100% 0 -100%;
  transition: left 0.5s ease;
}

.btn-primary:hover::before,
.btn-secondary:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  box-shadow:
    0 4px 14px 0 rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-0.5px);
  box-shadow:
    0 6px 20px 0 rgba(59, 130, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-secondary::before {
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.1), transparent);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.9) 0%, rgba(71, 85, 105, 0.7) 100%);
  border-color: rgba(148, 163, 184, 0.5);
  transform: translateY(-0.5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-primary:active,
.btn-secondary:active {
  transform: translateY(0);
}

.recording-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.recording-hint {
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes techPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

@keyframes recordingPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(248, 113, 113, 0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
