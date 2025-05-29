import { shell, BrowserWindow, app } from 'electron'
import { join } from 'node:path'
import url from 'node:url'
import icon from '../../../resources/icon.png?asset'

function createWindow() {
  const win = new BrowserWindow({
    title: '配置',
    width: 960, // 宽度
    height: 600, // 高度
    x: 100, // 初始x坐标
    y: 100, // 初始y坐标
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 开发环境加载远程URL，生产环境加载本地HTML文件
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/config')
  } else {
    win.loadURL(
      url.format({
        pathname: join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true,
        hash: 'config'
      })
    )
  }

  return win
}

export { createWindow }
