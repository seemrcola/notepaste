import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initSearchWindow, createSearchWindow } from './search'
import './db' // 初始化 数据库

app.whenReady().then(() => {
  // 设置应用用户模型ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境默认打开或关闭DevTools，生产环境忽略CommandOrControl + R
  // 查看 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 初始化 搜索窗口 （主窗口）
  initSearchWindow()

  app.on('activate', function () {
    // 在macOS中，当点击dock图标且没有其他窗口打开时，通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createSearchWindow()
  })
})

// 当所有窗口关闭时退出，除非在macOS中
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
