import React, { useRef, useCallback } from 'react'
import { Upload, FileText, Trash2, Lightbulb } from 'lucide-react'
import JSZip from 'jszip'

// 使用 JSZip 解析 docx 文件
async function parseDocxWithJSZip(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer)
  
  // 读取主文档 XML
  const docXml = await zip.file('word/document.xml')?.async('string')
  if (!docXml) {
    throw new Error('无效的 docx 文件：找不到主文档内容')
  }

  // 解析 XML 提取文本
  const parser = new DOMParser()
  const doc = parser.parseFromString(docXml, 'text/xml')
  
  // 提取所有段落文本
  const paragraphs = doc.querySelectorAll('w\\:p, p')
  const texts = []
  
  paragraphs.forEach(p => {
    // 获取段落中的所有文本节点
    const textNodes = p.querySelectorAll('w\\:t, t')
    let text = ''
    textNodes.forEach(t => {
      text += t.textContent || ''
    })
    
    // 检测段落样式
    const pPr = p.querySelector('w\\:pPr, pPr')
    let style = 'normal'
    
    if (pPr) {
      const pStyle = pPr.querySelector('w\\:pStyle, pStyle')
      if (pStyle) {
        style = pStyle.getAttribute('w:val') || pStyle.getAttribute('val') || 'normal'
      }
    }
    
    // 智能识别标题（基于样式名或内容模式）
    let level = 0
    const styleLower = style.toLowerCase()
    if (styleLower.includes('heading') || styleLower.includes('title')) {
      if (styleLower.includes('1') || styleLower === 'heading' || styleLower === 'title') level = 1
      else if (styleLower.includes('2')) level = 2
      else if (styleLower.includes('3')) level = 3
    }
    
    // 基于内容模式识别标题
    const trimmedText = text.trim()
    if (!level && trimmedText) {
      if (/^(第[一二三四五六七八九十百千万\d]+[章节篇部])/.test(trimmedText)) level = 1
      else if (/^\d+\.\d+/.test(trimmedText)) level = 2
      else if (/^[一二三四五六七八九十]+[、．.]/.test(trimmedText)) level = 3
    }
    
    if (text.trim()) {
      texts.push({ text: text.trim(), level, style })
    }
  })

  return { paragraphs: texts }
}

export default function Editor({ content, onChange, onFileLoaded }) {
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  // 粘贴文本内容
  const handlePaste = useCallback((e) => {
    // 允许默认粘贴行为
  }, [])

  // 内容变化
  const handleChange = (e) => {
    const text = e.target.value
    onChange(text)
  }

  // 上传 .docx 文件
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.docx')) {
      alert('请上传 .docx 格式的文件')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      
      // 使用 JSZip 解析 docx 文件
      const { paragraphs } = await parseDocxWithJSZip(arrayBuffer)

      // 将解析结果转换为文本（保留结构）
      const text = paragraphs.map(p => {
        const prefix = p.level > 0 ? '\n'.repeat(2 - p.level) : ''
        return prefix + p.text
      }).join('\n')

      if (!text.trim()) {
        alert('文件解析后内容为空，请确保文件包含可识别的文本内容。')
        return
      }

      onFileLoaded(text)
      e.target.value = ''
    } catch (err) {
      console.error('解析错误:', err)
      // 提供更友好的错误提示
      let errorMsg = '文件解析失败'
      if (err.message.includes('Invalid') || err.message.includes('count')) {
        errorMsg = '文件格式可能损坏或包含特殊内容，建议：\n1. 用 Word 重新保存文件\n2. 尝试复制文本后直接粘贴'
      } else if (err.message.includes('Could not find') || err.message.includes('找不到')) {
        errorMsg = '文件格式不正确，请确保是有效的 .docx 文件'
      }
      alert(errorMsg + '\n\n详细信息: ' + err.message)
    }
  }

  // 拖拽上传
  const handleDrop = async (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.docx')) {
      alert('请上传 .docx 格式的文件')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      
      // 使用 JSZip 解析
      const { paragraphs } = await parseDocxWithJSZip(arrayBuffer)

      const text = paragraphs.map(p => {
        const prefix = p.level > 0 ? '\n'.repeat(2 - p.level) : ''
        return prefix + p.text
      }).join('\n')

      if (!text.trim()) {
        alert('文件解析后内容为空，请确保文件包含可识别的文本内容。')
        return
      }

      onFileLoaded(text)
    } catch (err) {
      console.error('解析错误:', err)
      alert('文件解析失败：' + err.message)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
  }

  // 清空内容
  const handleClear = () => {
    onChange('')
  }

  const hasContent = content && content.trim().length > 0

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200">
      {/* 编辑器工具栏 */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-white">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">文档内容</span>
        <div className="flex-1" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Upload size={12} />
          上传 .docx
        </button>
        <button
          onClick={handleClear}
          disabled={!hasContent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={12} />
          清空
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* 输入区域 */}
      <div
        className="flex-1 overflow-y-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            {/* 占位提示 */}
            <div className="w-full max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FileText size={28} className="text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">输入或上传文档</h3>
              <p className="text-sm text-slate-400 mb-4">直接粘贴文本，或拖拽上传 .docx 文件</p>

              {/* 使用提示 */}
              <div className="bg-slate-50 rounded-xl p-4 text-left mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb size={13} className="text-amber-500" />
                  <span className="text-xs font-medium text-slate-600">使用提示</span>
                </div>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• 直接粘贴文本内容即可</li>
                  <li>• 支持上传 .docx 文件自动解析</li>
                  <li>• 标题会自动识别（"第X章"、"1.1"等）</li>
                  <li>• 也可直接在下方输入内容</li>
                </ul>
              </div>

              {/* 拖拽区域 */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => textareaRef.current?.focus()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload size={20} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">拖拽文件到此处 或 点击聚焦输入</p>
              </div>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="在此粘贴文档内容..."
            className="w-full h-full p-5 text-sm text-slate-700 resize-none focus:outline-none leading-relaxed font-mono"
            style={{ fontFamily: "'Microsoft YaHei', monospace", fontSize: '13px', lineHeight: 1.8 }}
            spellCheck={false}
          />
        )}
      </div>

      {/* 底部状态栏 */}
      {hasContent && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-4 text-xs text-slate-400">
          <span>{content.length.toLocaleString()} 字符</span>
          <span>{content.split(/\r?\n/).filter(l => l.trim()).length} 段落</span>
          <span>{content.split(/\r?\n/).length} 行</span>
        </div>
      )}
    </div>
  )
}
