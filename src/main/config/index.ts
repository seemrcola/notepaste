import { createWindow } from './window'
import { BrowserWindow } from 'electron'

let configWindow: BrowserWindow | null = null

function createConfigWindow() {
  if (!configWindow) {
    configWindow = createWindow() as BrowserWindow
  }
  configWindow.show()

  // 监听窗口关闭事件
  configWindow.on('closed', () => {
    configWindow = null
  })
}

export { createConfigWindow }
