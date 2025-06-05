import { shell, BrowserWindow, screen } from 'electron'
import { join } from 'node:path'
import url from 'node:url'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const { width } = screen.getPrimaryDisplay().workAreaSize

  if (mainWindow) {
    mainWindow.show()
    return
  }

  mainWindow = new BrowserWindow({
    title: 'mainWindow',
    width: 480, // 宽度
    height: 100, // 高度
    x: (width - 480) / 2, // 初始x坐标
    y: 80, // 初始y坐标
    resizable: false,
    show: false, // 是否显示
    frame: false, // 是否显示边框
    hasShadow: false, // 是否显示阴影
    alwaysOnTop: false, // 是否始终在顶部
    autoHideMenuBar: true, // 是否隐藏菜单栏
    transparent: true, // 是否透明
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // 允许窗口可拖动
  // mainWindow.setMovable(true)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 开发环境加载远程URL，生产环境加载本地HTML文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true,
        hash: 'search'
      })
    )
  }
}

export { createWindow }
