import { ipcMain, BrowserWindow, IpcMainEvent } from 'electron'
import { createConfigWindow } from '../config'
import { createSettingsWindow } from '../settings'

enum IpcSearchListenerEnum {
  TOGGLE_VISIBILITY = 'search:toggle-visibility',
  WINDOW_RESIZE = 'search:window-resize',
  OPEN_CONFIG_WINDOW = 'search:open-config-window',
  OPEN_SETTINGS_WINDOW = 'search:open-settings-window'
}

// 添加ipc监听
function setupIpcListeners() {
  // 切换窗口可见性
  ipcMain.on(IpcSearchListenerEnum.TOGGLE_VISIBILITY, (event: IpcMainEvent, bool: boolean) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (win) {
      bool ? win.show() : win.hide()
    }
  })

  // 切换窗口大小
  ipcMain.on(
    IpcSearchListenerEnum.WINDOW_RESIZE,
    (event: IpcMainEvent, size: { width: number; height: number }) => {
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      if (win) {
        win.setBounds(
          {
            width: size.width,
            height: size.height
          },
          true
        )
      }
    }
  )

  // 打开配置窗口
  ipcMain.on(IpcSearchListenerEnum.OPEN_CONFIG_WINDOW, () => {
    console.log('打开配置窗口')
    createConfigWindow()
  })

  // 打开设置窗口
  ipcMain.on(IpcSearchListenerEnum.OPEN_SETTINGS_WINDOW, () => {
    console.log('打开设置窗口')
    createSettingsWindow()
  })
}

export { setupIpcListeners, IpcSearchListenerEnum }
