import React, { useMemo } from 'react'
import { Eye, FileText, AlertCircle } from 'lucide-react'

// 生成预览用的样式文本
function getPreviewStyle(styles) {
  const {
    chineseFont,
    englishFont,
    headingSizes,
    bodySize,
    headingBold,
    charSpacing,
    lineSpacing,
    paraSpacingBefore,
    paraSpacingAfter,
    alignment,
    firstLineIndent,
    pageMarginTop,
    pageMarginBottom,
    pageMarginLeft,
    pageMarginRight,
  } = styles

  const alignMap = {
    'left': 'left',
    'center': 'center',
    'right': 'right',
    'justify': 'justify',
  }

  // 计算行高
  const lineHeight = typeof lineSpacing === 'number'
    ? lineSpacing === 1 ? '1' : lineSpacing === 1.5 ? '1.5' : lineSpacing === 2 ? '2' : lineSpacing
    : '1.5'

  // 计算固定行高
  const lineHeightFixed = typeof lineSpacing === 'number' && lineSpacing > 2 ? `${lineSpacing}pt` : undefined

  // 字间距样式
  const letterSpacing = charSpacing ? `${charSpacing}pt` : 'normal'

  // 首行缩进
  const textIndent = firstLineIndent > 0 ? `${firstLineIndent}em` : '0'

  // 边距（转换为 CSS）
  const marginTop = pageMarginTop ? `${(pageMarginTop / 2.54).toFixed(2)}in` : '1in'
  const marginBottom = pageMarginBottom ? `${(pageMarginBottom / 2.54).toFixed(2)}in` : '1in'
  const marginLeft = pageMarginLeft ? `${(pageMarginLeft / 2.54).toFixed(2)}in` : '1.2in'
  const marginRight = pageMarginRight ? `${(pageMarginRight / 2.54).toFixed(2)}in` : '1.2in'

  return `
    body {
      font-family: "${chineseFont}", "Microsoft YaHei", serif;
      font-size: ${bodySize}pt;
      line-height: ${lineHeightFixed || lineHeight};
      letter-spacing: ${letterSpacing};
      text-align: ${alignMap[alignment] || 'justify'};
      text-indent: ${textIndent};
      margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft};
      padding: 0;
      color: #1a1a1a;
    }
    p {
      margin-top: ${paraSpacingBefore}pt;
      margin-bottom: ${paraSpacingAfter}pt;
      font-size: ${bodySize}pt;
      line-height: ${lineHeightFixed || lineHeight};
    }
    .heading-1 {
      font-size: ${headingSizes[0] || 22}pt;
      font-weight: ${headingBold[0] !== false ? 'bold' : 'normal'};
      margin-top: 24pt;
      margin-bottom: 12pt;
    }
    .heading-2 {
      font-size: ${headingSizes[1] || 18}pt;
      font-weight: ${headingBold[1] !== false ? 'bold' : 'normal'};
      margin-top: 18pt;
      margin-bottom: 9pt;
    }
    .heading-3 {
      font-size: ${headingSizes[2] || 16}pt;
      font-weight: ${headingBold[2] !== false ? 'bold' : 'normal'};
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    .heading-4 {
      font-size: ${headingSizes[3] || 14}pt;
      font-weight: ${headingBold[3] !== false ? 'bold' : 'normal'};
      margin-top: 10pt;
      margin-bottom: 6pt;
    }
    .heading-5 {
      font-size: ${headingSizes[4] || 12}pt;
      font-weight: ${headingBold[4] !== false ? 'bold' : 'normal'};
    }
    .heading-6 {
      font-size: ${headingSizes[5] || 12}pt;
      font-weight: ${headingBold[5] !== false ? 'bold' : 'normal'};
    }
  `
}

export default function Preview({ content, styles }) {
  // 解析内容为 HTML
  const { html, hasContent } = useMemo(() => {
    if (!content || !content.trim()) {
      return { html: '', hasContent: false }
    }

    const lines = content.split(/\r?\n/)
    const htmlParts = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) {
        htmlParts.push('')
        continue
      }

      // 智能识别标题
      const level = detectHeadingLevel(line)
      if (level > 0) {
        htmlParts.push(`<h${level} class="heading-${level}">${escapeHtml(line)}</h${level}>`)
      } else {
        htmlParts.push(`<p>${escapeHtml(line)}</p>`)
      }
    }

    return { html: htmlParts.join('\n'), hasContent: true }
  }, [content])

  // 注入样式
  const fullHtml = useMemo(() => {
    if (!hasContent) return ''
    const styleTag = `<style>${getPreviewStyle(styles)}</style>`
    return styleTag + html
  }, [html, styles, hasContent])

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
      {/* 预览头部 */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white">
        <Eye size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">实时预览</span>
        <div className="flex-1" />
        <span className="text-xs text-slate-400">所见即所得</span>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 overflow-auto p-4">
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mb-3">
              <FileText size={24} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">在左侧输入内容<br />即可看到实时预览</p>
          </div>
        ) : (
          <div
            className="bg-white shadow-lg mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '0',
              boxSizing: 'border-box',
            }}
          >
            <iframe
              srcDoc={fullHtml}
              title="preview"
              className="w-full border-0"
              style={{
                width: '210mm',
                minHeight: '297mm',
                display: 'block',
              }}
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// HTML 转义
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 标题级别检测
function detectHeadingLevel(text) {
  const trimmed = text.trim()

  if (/^第[一二三四五六七八九十\d]+[章节条款]/.test(trimmed)) return 1
  if (/^(第[一二三四五六七八九十]+点|[一二三四五六七八九十]+、)/.test(trimmed)) return 2
  if (/^\d+[\.、]/.test(trimmed)) return 2
  if (trimmed.length < 30 && !trimmed.match(/[。！？；]$/) && trimmed.length > 2 && !trimmed.includes('，') && !trimmed.includes('。')) return 3

  return 0
}
