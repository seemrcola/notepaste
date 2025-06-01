import { createWindow } from './window'
import { BrowserWindow } from 'electron'

let settingsWindow: BrowserWindow | null = null

function createSettingsWindow() {
  if (!settingsWindow) {
    settingsWindow = createWindow() as BrowserWindow
  }
  settingsWindow.show()

  // 监听窗口关闭事件
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

export { createSettingsWindow }
