import { setupIpcListeners } from './ipc'
import { registerWakeup } from './shotcuts'
import { createWindow } from './window'

function initSearchWindow() {
  createWindow()

  // 设置IPC监听
  setupIpcListeners()
  // 注册唤醒 热键
  registerWakeup(createWindow)
}

export { initSearchWindow, createWindow as createSearchWindow }
