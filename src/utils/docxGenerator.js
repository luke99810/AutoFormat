import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumber, NumberFormat, convertInchesToTwip, LevelFormat } from 'docx'
import { Document as DocxLib, Paragraph as DocxParagraph, TextRun as DocxTextRun } from 'docx'
import FileSaver from 'file-saver'

// 将文本解析为段落列表，自动识别标题层级
export function parseContent(text) {
  if (!text || !text.trim()) return []

  const lines = text.split(/\r?\n/)
  const paragraphs = []
  let currentPara = []
  let charCount = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 空行判断
    if (line.trim() === '') {
      if (currentPara.length > 0) {
        paragraphs.push({
          type: 'paragraph',
          text: currentPara.join('\n'),
          level: detectHeadingLevel(currentPara.join('')),
        })
        currentPara = []
      }
      continue
    }

    currentPara.push(line)

    // 非空行，检查是否需要合并
    const nextLine = lines[i + 1]
    if (nextLine !== undefined && nextLine.trim() !== '') {
      // 继续累积
    } else if (nextLine === undefined) {
      // 最后一行
      paragraphs.push({
        type: 'paragraph',
        text: currentPara.join('\n'),
        level: detectHeadingLevel(currentPara.join('')),
      })
      currentPara = []
    }
  }

  // 如果最后还有残留
  if (currentPara.length > 0) {
    paragraphs.push({
      type: 'paragraph',
      text: currentPara.join('\n'),
      level: detectHeadingLevel(currentPara.join('')),
    })
  }

  return paragraphs
}

// 智能检测标题层级
function detectHeadingLevel(text) {
  const trimmed = text.trim()

  // 检测"第X章/第X节"模式
  if (/^第[一二三四五六七八九十\d]+[章节条款点]/.test(trimmed)) {
    return 1
  }

  // 检测"第X点/X.X.X"模式
  if (/^\d+[\.、]/.test(trimmed)) {
    return 2
  }

  // 检测中文数字开头
  if (/^[一二三四五六七八九十]+、/.test(trimmed)) {
    return 2
  }

  // 检测很短且无句号的行（可能是标题）
  if (trimmed.length < 30 && !trimmed.match(/[。！？；]$/) && trimmed.length > 2) {
    return 3
  }

  return 0 // 正文
}

// 从 mammoth 解析结果中提取段落
export function parseMammothResult(result) {
  const paragraphs = []
  const messages = result.messages || []

  try {
    // 从 HTML 中提取段落
    const bodyHtml = result.value // mammoth 返回的 HTML

    // 安全解析 HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = bodyHtml || ''

    const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div')

    elements.forEach(el => {
      try {
        const text = el.textContent?.trim() || ''
        if (!text || text.length < 2) return

        const tagName = el.tagName?.toLowerCase() || 'p'
        let level = 0

        if (tagName === 'h1') level = 1
        else if (tagName === 'h2') level = 2
        else if (tagName === 'h3') level = 3
        else if (tagName === 'h4') level = 4
        else if (tagName === 'h5') level = 5
        else if (tagName === 'h6') level = 6
        else level = detectHeadingLevel(text)

        paragraphs.push({
          type: level > 0 ? 'heading' : 'paragraph',
          text: text,
          level: level,
        })
      } catch (e) {
        // 跳过单个元素的解析错误
        console.warn('段落解析跳过:', e)
      }
    })
  } catch (e) {
    console.error('Mammoth 结果解析失败:', e)
  }

  return { paragraphs, messages }
}

// 生成 docx 文件
export async function generateDocx(paragraphs, styles, fileName) {
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
    headerContent,
    footerContent,
    numberingStyle,
    bindingMargin,
  } = styles

  // 构建编号列表
  const numbering = buildNumbering(numberingStyle)

  // 构建段落
  const docxParagraphs = paragraphs.map((para, index) => {
    const level = para.level || 0
    const isHeading = level > 0

    // 字号
    const fontSize = isHeading
      ? Math.round(headingSizes[level - 1] || 12) * 2 // docx 用 half-points
      : Math.round(bodySize) * 2

    // 粗体
    const bold = isHeading
      ? (headingBold[level - 1] !== false)
      : false

    // 字间距
    const spacing = charSpacing * 20 // 转换为 twips

    // 行间距
    const lineSpacingValue = lineSpacing
    const lineSpacingRule = lineSpacing === 'custom' ? 'exact' : 'auto'

    // 对齐方式
    const alignMap = {
      'left': AlignmentType.LEFT,
      'center': AlignmentType.CENTER,
      'right': AlignmentType.RIGHT,
      'justify': AlignmentType.JUSTIFIED,
    }
    const textAlign = alignMap[alignment] || AlignmentType.JUSTIFIED

    // 缩进
    const indent = {
      firstLine: isHeading ? 0 : convertInchesToTwip(firstLineIndent * 0.25),
    }

    // 段落间距
    const paraSpacing = {
      before: isHeading ? convertInchesToTwip(paraSpacingBefore * 0.01) : convertInchesToTwip(paraSpacingBefore * 0.01),
      after: isHeading ? convertInchesToTwip(paraSpacingAfter * 0.01) : convertInchesToTwip(paraSpacingAfter * 0.01),
    }

    // 字体
    const isChinese = /[\u4e00-\u9fa5]/.test(para.text)
    const font = isChinese ? chineseFont : englishFont

    return new Paragraph({
      children: [
        new TextRun({
          text: para.text,
          font: font,
          size: fontSize,
          bold: bold,
          characterSpacing: spacing,
        }),
      ],
      alignment: textAlign,
      spacing: paraSpacing,
      indent: indent,
      numbering: numbering && !isHeading ? {
        reference: 'default-numbering',
        level: 0,
      } : undefined,
      heading: isHeading ? HeadingLevel['HEADING_' + level] : undefined,
    })
  })

  // 构建页眉
  const headerChildren = headerContent ? [
    new Paragraph({
      children: [
        new TextRun({
          text: headerContent === 'title' ? fileName : headerContent,
          font: chineseFont,
          size: 20,
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ] : []

  // 构建页脚
  const footerChildren = footerContent && footerContent !== 'none' ? [
    new Paragraph({
      children: [
        new TextRun({
          children: [PageNumber.CURRENT],
          font: englishFont,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ] : []

  // 创建文档
  const doc = new Document({
    numbering: numbering ? {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: NumberFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    } : undefined,
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(pageMarginTop),
            bottom: convertInchesToTwip(pageMarginBottom),
            left: convertInchesToTwip(pageMarginLeft + bindingMargin),
            right: convertInchesToTwip(pageMarginRight),
          },
        },
      },
      headers: headerChildren.length > 0 ? {
        default: {
          children: headerChildren,
        },
      } : undefined,
      footers: footerChildren.length > 0 ? {
        default: {
          children: footerChildren,
        },
      } : undefined,
      children: docxParagraphs,
    }],
  })

  // 生成并下载
  const blob = await Document.write(doc)
  FileSaver.saveAs(blob, `${fileName || '排版文档'}.docx`)
}

// 构建编号
function buildNumbering(style) {
  if (!style || style === 'none') return null

  const formatMap = {
    'decimal': NumberFormat.DECIMAL,
    'bullet': NumberFormat.BULLET,
    'circle': NumberFormat.UPPER_LETTER,
    'check': NumberFormat.BULLET,
  }

  return formatMap[style] ? {
    reference: 'default-numbering',
    level: 0,
  } : null
}

// 生成纯文本
export function exportAsTxt(paragraphs) {
  const text = paragraphs.map(p => p.text).join('\n\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, '排版文档.txt')
}

// 计算字数和段落数
export function countContent(paragraphs) {
  const totalChars = paragraphs.reduce((sum, p) => sum + (p.text?.length || 0), 0)
  const totalParas = paragraphs.length
  return { totalChars, totalParas }
}
