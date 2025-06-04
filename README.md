### 快捷剪切板
基于electron开发的一款桌面应用。用于快速复制粘贴代码片段/文本片段。  
代码第一阶段用AI写了一部分，目前在逐步优化代码。

#### 基本使用 
目前唤醒的快捷键 是 `ctrl/cmd + alt + k`，唤醒搜索框。  

搜索框支持两种模式：  
1. 搜索模式：在搜索框中输入关键词，可以搜索到对应的代码片段/文本片段。选中之后，使用`ctrl/cmd + c`即可复制文本内容到剪切板。
2. 命令模式：在搜索框中输入`/`，可以搜索到对应的命令。  
   - 命令列表：
     - `/config`：打开内容配置页面
     - `/export`：导出数据库内容（csv格式）
     -  /settings ：打开快捷键设置卡片

配置页面可以管理代码片段/文本片段。  

#### todolist
- [x] 支持代码直接编辑
- [x] 唤起搜索框窗口的快捷键配置
- [ ] 数据库位置配置
- [ ] 支持分类/片段信息拖拽排序
- [x] 批量导出代码片段/文本片段  
- [x] 跨分类拖拽搬运文本片段

... 更多便捷操作

#### 项目运行
```bash
git clone <git-url> <project-name>
cd <project-name>
pnpm install
pnpm dev
```

#### 项目打包
```bash
pnpm build:win
pnpm build:mac
```
打包之后即可使用

#### 数据库存储地址
- Windows: %APPDATA%/notepaste
- macOS: ~/Library/Application Support/notepaste
- Linux: ~/.config/notepaste   

数据库名称 `snippets.db`  数据库类型 `sqlite`  

用户可以在这里找到自己创建的代码片段/文本片段。使用数据库软件，如navicat，来查看/修改数据库内容。
