import { Database } from 'better-sqlite3'
import { dialog, BrowserWindow } from 'electron'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// 将数组数据转换为 CSV 格式
function arrayToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''

  // 获取表头
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')

  // 转换数据行
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header]
        // 处理包含逗号、引号、换行符的值
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

// 导出所有数据为多个 CSV 文件（打包在一个文件夹中）
export async function exportAllToCSV(db: Database, mainWindow: BrowserWindow) {
  try {
    // 显示保存对话框选择文件夹
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '选择导出文件夹',
      properties: ['openDirectory', 'createDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const exportDir = result.filePaths[0]

      // 导出分类
      const categories = db.prepare('SELECT * FROM categories').all()
      const categoriesCSV = arrayToCSV(categories as Record<string, unknown>[])
      writeFileSync(resolve(exportDir, 'categories.csv'), categoriesCSV, 'utf8')

      // 导出代码片段
      const snippets = db
        .prepare(
          `
        SELECT 
          s.id,
          s.name,
          s.code,
          s.language,
          s.description,
          c.name as categoryName,
          s.createdAt,
          s.updatedAt
        FROM snippets s
        LEFT JOIN categories c ON s.categoryId = c.id
        ORDER BY c.name, s.name
      `
        )
        .all()
      const snippetsCSV = arrayToCSV(snippets as Record<string, unknown>[])
      writeFileSync(resolve(exportDir, 'snippets.csv'), snippetsCSV, 'utf8')

      return { success: true, path: exportDir }
    }

    return { success: false, message: '用户取消了导出' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}
