import { globalShortcut, BrowserWindow } from 'electron'

// cmd+shift+k 显示搜索框
function wakeup(showWindowHandler: () => void) {
  const ret = globalShortcut.register('CommandOrControl+Shift+K', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const mainWindow = windows.find((window) => window.title === 'mainWindow')
      if (!mainWindow) {
        showWindowHandler()
        return
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show()
      } else if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    } else {
      showWindowHandler()
    }
  })

  if (!ret) {
    console.log('唤醒快捷键注册失败')
  }
}

export { wakeup as registerWakeup }
