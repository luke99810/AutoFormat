import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import Editor from './components/Editor'
import Preview from './components/Preview'
import { PRESETS } from './utils/presets'
import { parseContent, generateDocx, exportAsTxt, countContent } from './utils/docxGenerator'

export default function App() {
  // 文档内容（原始文本）
  const [content, setContent] = useState('')

  // 当前选中的预设
  const [activePreset, setActivePreset] = useState('高校学位论文')

  // 当前排版样式配置
  const [styles, setStyles] = useState({ ...PRESETS['高校学位论文'].styles })

  // 导出中状态
  const [exporting, setExporting] = useState(false)

  // 切换预设
  const handlePresetChange = (presetKey) => {
    setActivePreset(presetKey)
    setStyles({ ...PRESETS[presetKey].styles })
  }

  // 内容变化
  const handleContentChange = (text) => {
    setContent(text)
  }

  // 从文件加载内容
  const handleFileLoaded = (text) => {
    setContent(text)
  }

  // 导出 docx
  const handleExportDocx = useCallback(async () => {
    if (!content.trim()) {
      alert('请先输入文档内容')
      return
    }

    setExporting(true)
    try {
      const paragraphs = parseContent(content)
      await generateDocx(paragraphs, styles, '排版文档')
    } catch (err) {
      console.error('导出失败:', err)
      alert('导出失败: ' + err.message)
    } finally {
      setExporting(false)
    }
  }, [content, styles])

  // 导出 txt
  const handleExportTxt = useCallback(() => {
    if (!content.trim()) {
      alert('请先输入文档内容')
      return
    }
    const paragraphs = parseContent(content)
    exportAsTxt(paragraphs)
  }, [content])

  // 解析后的段落
  const paragraphs = content.trim() ? parseContent(content) : []

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* 头部 */}
      <Header
        onExport={handleExportDocx}
        onExportTxt={handleExportTxt}
        hasContent={content.trim().length > 0}
        exporting={exporting}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧配置面板 */}
        <ConfigPanel
          styles={styles}
          onChange={setStyles}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
        />

        {/* 中间编辑器 */}
        <Editor
          content={content}
          onChange={handleContentChange}
          onFileLoaded={handleFileLoaded}
        />

        {/* 右侧预览 */}
        <Preview
          content={content}
          styles={styles}
        />
      </div>

      {/* 底部状态栏 */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center px-5 gap-4 text-xs text-slate-400 flex-shrink-0">
        <span>AutoFormat v1.0</span>
        <span>·</span>
        <span>支持 .docx 上传解析</span>
        <span>·</span>
        <span>纯前端处理，文档不上传服务器</span>
        <div className="flex-1" />
        {content.trim() && (
          <span className="text-blue-500 font-medium">
            {paragraphs.length} 段落 · {content.length.toLocaleString()} 字符
          </span>
        )}
      </footer>
    </div>
  )
}
