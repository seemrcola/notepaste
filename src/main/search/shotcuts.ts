import { globalShortcut, BrowserWindow } from 'electron'
import { db } from '../db'
import { findAll } from '../db/query'

const WAKEUP_HOTKEY = 'CommandOrControl+Shift+K'

interface Hotkey {
  id: number
  name: string
  hotkey: string
  createdAt: string
  updatedAt: string
}

function queryWakeupHotkey() {
  const hotkeys = findAll(db, 'SELECT * FROM hotkeys') as Hotkey[]
  return hotkeys.find((hotkey: Hotkey) => hotkey.name === 'searchHotkey')?.hotkey || WAKEUP_HOTKEY
}

// cmd+shift+k 显示搜索框
function wakeup(showWindowHandler: () => void) {
  const hotkey = queryWakeupHotkey()
  const ret = globalShortcut.register(hotkey, () => {
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
