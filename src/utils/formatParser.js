/**
 * 智能格式解析器
 * 从自然语言格式描述中提取排版参数
 */

/**
 * 解析格式描述文本，返回配置对象
 * @param {string} text - 用户粘贴的格式描述
 * @returns {object} 解析后的配置
 */
export function parseFormatDescription(text) {
  const config = {
    page: {},
    font: {},
    heading: {},
    paragraph: {},
    margin: {},
    header: {},
    footer: {},
  }

  const lowerText = text.toLowerCase()
  const originalText = text

  // === 页面设置 ===
  // 纸张大小
  if (/A4/i.test(text)) {
    config.page.paperSize = 'A4'
  } else if (/letter/i.test(text)) {
    config.page.paperSize = 'Letter'
  }

  // 页数限制
  const pageMatch = text.match(/(\d+)\s*页/i)
  if (pageMatch) {
    config.page.maxPages = parseInt(pageMatch[1])
  }

  // === 边距 ===
  const marginPatterns = [
    { regex: /上[下面]?\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginTop' },
    { regex: /顶部\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginTop' },
    { regex: /下[下面]?\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginBottom' },
    { regex: /底部\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginBottom' },
    { regex: /左[右面]?\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginLeft' },
    { regex: /左侧\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginLeft' },
    { regex: /右[左面]?\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginRight' },
    { regex: /右侧\s*[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginRight' },
    // 通用边距
    { regex: /边距[：:]\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'allMargins' },
  ]

  // 更精确的边距匹配
  const preciseMarginPatterns = [
    // 顶部边距
    { regex: /顶部[：:\s]*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginTop' },
    { regex: /上[下面]?[：:\s]*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginTop' },
    { regex: /页[面边]距[，,]\s*[上下面]?\s*[：:]*\s*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginTop' },
    // 底部边距
    { regex: /底部[：:\s]*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginBottom' },
    // 左右边距
    { regex: /左侧[：:\s]*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginLeft' },
    { regex: /右侧[：:\s]*≥?\s*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/gi, key: 'pageMarginRight' },
  ]

  // 检查是否有统一边距
  const allMarginMatch = text.match(/边距[：:\s]*(\d+(?:\.\d+)?)\s*(?:cm|厘米|公分)/i)
  if (allMarginMatch) {
    config.margin.unified = parseFloat(allMarginMatch[1])
  }

  // 精确匹配各边距
  for (const pattern of preciseMarginPatterns) {
    const match = text.match(pattern.regex)
    if (match) {
      const value = parseFloat(match[match.length - 1] || match[0].match(/(\d+(?:\.\d+)?)/)[1])
      if (pattern.key === 'pageMarginTop') config.margin.pageMarginTop = value
      if (pattern.key === 'pageMarginBottom') config.margin.pageMarginBottom = value
      if (pattern.key === 'pageMarginLeft') config.margin.pageMarginLeft = value
      if (pattern.key === 'pageMarginRight') config.margin.pageMarginRight = value
    }
  }

  // === 字体字号 ===
  // 英文字体
  const fontMap = {
    'times new roman': 'Times New Roman',
    'arial': 'Arial',
    'calibri': 'Calibri',
    'georgia': 'Georgia',
    'verdana': 'Verdana',
    'courier': 'Courier New',
    'consolas': 'Consolas',
  }

  for (const [name, font] of Object.entries(fontMap)) {
    if (text.toLowerCase().includes(name)) {
      config.font.englishFont = font
      break
    }
  }

  // 中文字体
  const chineseFontMap = {
    '宋体': 'SimSun',
    '仿宋': 'FangSong',
    '黑体': 'SimHei',
    '楷体': 'KaiTi',
    '微软雅黑': 'Microsoft YaHei',
    '苹方': 'PingFang SC',
    '思源': 'Source Han Sans',
  }

  for (const [name, font] of Object.entries(chineseFontMap)) {
    if (text.includes(name)) {
      config.font.chineseFont = font
      break
    }
  }

  // 正文字号 - 多种匹配模式
  const bodySizePatterns = [
    /正文[：:]*\s*[^，,。\n]*?\s*(\d+(?:\.\d+)?)\s*pt/gi,
    /字号[：:]*\s*(\d+(?:\.\d+)?)\s*pt/gi,
    /(\d+(?:\.\d+)?)\s*pt[字号]?/gi,
    /(\d+(?:\.\d+)?)\s*磅/gi,
    /10pt|10\.5pt|11pt|12pt|14pt|9pt|10\s*点/gi,
  ]

  for (const pattern of bodySizePatterns) {
    const match = text.match(pattern)
    if (match) {
      const sizeStr = match[match.length - 1]
      const size = parseFloat(sizeStr.match(/(\d+(?:\.\d+)?)/)[1])
      if (size >= 8 && size <= 16) {
        config.font.bodySize = size
        break
      }
    }
  }

  // 标题字号
  const headingSizePatterns = [
    /标题[字号：:]*\s*(\d+(?:\.\d+)?)\s*pt/gi,
    /标题.*?(\d+(?:\.\d+)?)\s*pt/gi,
    /一级标题[：:]*\s*(\d+(?:\.\d+)?)/gi,
  ]

  for (const pattern of headingSizePatterns) {
    const match = text.match(pattern)
    if (match) {
      const size = parseFloat(match[0].match(/(\d+(?:\.\d+)?)/)[1])
      if (size >= 12 && size <= 26) {
        config.heading.size = size
        break
      }
    }
  }

  // 标题是否加粗
  if (/标题.*?加粗/i.test(text) || /加粗.*?标题/i.test(text) || /标题.*?居中.*?加粗/i.test(text)) {
    config.heading.bold = true
  }

  // 标题对齐
  if (/标题.*?居中/i.test(text) || /居中.*?标题/i.test(text)) {
    config.heading.align = 'center'
  }

  // === 段落设置 ===
  // 行间距
  const lineSpacingPatterns = [
    { regex: /行间距[：:]*\s*(\d+(?:\.\d+)?)\s*(?:倍|%)?/i, type: 'multiple' },
    { regex: /(\d+(?:\.\d+)?)\s*倍行距/i, type: 'multiple' },
    { regex: /单倍行距|单行距/i, value: 1.0 },
    { regex: /1\.5\s*倍行距|一倍半行距/i, value: 1.5 },
    { regex: /双倍行距|双行距|2\s*倍行距/i, value: 2.0 },
    { regex: /固定值[：:]*\s*(\d+)\s*pt/i, type: 'fixed' },
  ]

  for (const pattern of lineSpacingPatterns) {
    if (pattern.value) {
      config.paragraph.lineSpacing = pattern.value
      break
    }
    const match = text.match(pattern.regex)
    if (match) {
      const value = parseFloat(match[1])
      if (pattern.type === 'multiple') {
        if (value <= 3) config.paragraph.lineSpacing = value
      } else if (pattern.type === 'fixed') {
        config.paragraph.lineSpacing = value
        config.paragraph.lineSpacingType = 'fixed'
      }
      break
    }
  }

  // 段前/段后间距
  const beforeMatch = text.match(/段前[间距：:]*\s*(\d+(?:\.\d+)?)/i)
  if (beforeMatch) {
    config.paragraph.paraSpacingBefore = parseFloat(beforeMatch[1])
  }

  const afterMatch = text.match(/段后[间距：:]*\s*(\d+(?:\.\d+)?)/i)
  if (afterMatch) {
    config.paragraph.paraSpacingAfter = parseFloat(afterMatch[1])
  }

  // 首行缩进
  if (/首行缩进[：:]*\s*(\d+)\s*字符/i.test(text)) {
    const indentMatch = text.match(/首行缩进[：:]*\s*(\d+)/i)
    config.paragraph.firstLineIndent = parseInt(indentMatch[1])
  } else if (/首行缩进/i.test(text)) {
    config.paragraph.firstLineIndent = 2 // 默认2字符
  }

  // 对齐方式
  if (/两端对齐|分散对齐/i.test(text)) {
    config.paragraph.alignment = 'both'
  } else if (/居中/i.test(text)) {
    config.paragraph.alignment = 'center'
  } else if (/左对齐/i.test(text)) {
    config.paragraph.alignment = 'left'
  } else if (/右对齐/i.test(text)) {
    config.paragraph.alignment = 'right'
  }

  // === 页眉页脚 ===
  if (/页眉/i.test(text)) {
    // 检查页眉内容
    if (/页眉[：:]*\s*文档标题/i.test(text) || /标题.*?页眉/i.test(text)) {
      config.header.content = 'title'
    } else if (/页眉[：:]*\s*(\S+)/i.test(text)) {
      const customMatch = text.match(/页眉[：:]*\s*(\S+)/i)
      if (customMatch && customMatch[1].length < 20) {
        config.header.content = 'custom'
        config.header.customText = customMatch[1]
      }
    } else {
      config.header.enabled = true
    }
  }

  if (/页脚/i.test(text)) {
    if (/页码/i.test(text) || /第.*?页.*?共.*?页/i.test(text)) {
      config.footer.content = 'pageOfTotal'
    } else {
      config.footer.enabled = true
    }
  }

  // === 编号样式 ===
  if (/编号/i.test(text)) {
    if (/汉字编号|中文编号|一二三/i.test(text)) {
      config.numbering = 'chinese'
    } else if (/阿拉伯编号|1\.\s*2\.\s*3\./i.test(text)) {
      config.numbering = 'arabic'
    } else if (/字母编号|A\.\s*B\.\s*C\./i.test(text)) {
      config.numbering = 'alpha'
    }
  }

  return config
}

/**
 * 将解析后的配置转换为应用样式
 * @param {object} parsedConfig - parseFormatDescription 返回的配置
 * @param {object} currentStyles - 当前样式对象
 * @returns {object} 合并后的新样式
 */
export function mergeParsedConfig(parsedConfig, currentStyles) {
  const newStyles = { ...currentStyles }

  // 页面设置
  if (parsedConfig.page.paperSize) {
    newStyles.paperSize = parsedConfig.page.paperSize
  }
  if (parsedConfig.page.maxPages) {
    newStyles.maxPages = parsedConfig.page.maxPages
  }

  // 边距
  if (parsedConfig.margin.unified) {
    newStyles.pageMarginTop = parsedConfig.margin.unified
    newStyles.pageMarginBottom = parsedConfig.margin.unified
    newStyles.pageMarginLeft = parsedConfig.margin.unified
    newStyles.pageMarginRight = parsedConfig.margin.unified
  }
  if (parsedConfig.margin.pageMarginTop) newStyles.pageMarginTop = parsedConfig.margin.pageMarginTop
  if (parsedConfig.margin.pageMarginBottom) newStyles.pageMarginBottom = parsedConfig.margin.pageMarginBottom
  if (parsedConfig.margin.pageMarginLeft) newStyles.pageMarginLeft = parsedConfig.margin.pageMarginLeft
  if (parsedConfig.margin.pageMarginRight) newStyles.pageMarginRight = parsedConfig.margin.pageMarginRight

  // 字体
  if (parsedConfig.font.englishFont) newStyles.englishFont = parsedConfig.font.englishFont
  if (parsedConfig.font.chineseFont) newStyles.chineseFont = parsedConfig.font.chineseFont
  if (parsedConfig.font.bodySize) newStyles.bodySize = parsedConfig.font.bodySize

  // 标题
  if (parsedConfig.heading.size) {
    const newSizes = [...(newStyles.headingSizes || [22, 18, 16, 14, 12, 12])]
    newSizes[0] = parsedConfig.heading.size
    newSizes[1] = Math.max(12, parsedConfig.heading.size - 2)
    newSizes[2] = Math.max(12, parsedConfig.heading.size - 4)
    newStyles.headingSizes = newSizes
  }
  if (parsedConfig.heading.bold !== undefined) {
    const newBold = [...(newStyles.headingBold || [true, true, true, true, false, false])]
    newBold[0] = parsedConfig.heading.bold
    newStyles.headingBold = newBold
  }
  if (parsedConfig.heading.align) {
    newStyles.headingAlignment = parsedConfig.heading.align
  }

  // 段落
  if (parsedConfig.paragraph.lineSpacing) {
    newStyles.lineSpacing = parsedConfig.paragraph.lineSpacing
    if (parsedConfig.paragraph.lineSpacingType === 'fixed') {
      newStyles.lineSpacing = parsedConfig.paragraph.lineSpacing
    }
  }
  if (parsedConfig.paragraph.paraSpacingBefore !== undefined) {
    newStyles.paraSpacingBefore = parsedConfig.paragraph.paraSpacingBefore
  }
  if (parsedConfig.paragraph.paraSpacingAfter !== undefined) {
    newStyles.paraSpacingAfter = parsedConfig.paragraph.paraSpacingAfter
  }
  if (parsedConfig.paragraph.firstLineIndent !== undefined) {
    newStyles.firstLineIndent = parsedConfig.paragraph.firstLineIndent
  }
  if (parsedConfig.paragraph.alignment) {
    newStyles.alignment = parsedConfig.paragraph.alignment
  }

  // 页眉页脚
  if (parsedConfig.header.content) {
    newStyles.headerContent = parsedConfig.header.content
    if (parsedConfig.header.customText) {
      newStyles.headerCustom = parsedConfig.header.customText
    }
  }
  if (parsedConfig.footer.content) {
    newStyles.footerContent = parsedConfig.footer.content
  }

  // 编号
  if (parsedConfig.numbering) {
    const numberingMap = {
      'chinese': 'chinese',
      'arabic': 'decimal',
      'alpha': 'alpha',
    }
    newStyles.numberingStyle = numberingMap[parsedConfig.numbering] || 'decimal'
  }

  return newStyles
}

/**
 * 从描述中提取的关键信息摘要
 * @param {object} parsedConfig - 解析后的配置
 * @returns {array} 提取到的配置项列表
 */
export function getParsedSummary(parsedConfig) {
  const items = []

  if (parsedConfig.page.paperSize) {
    items.push({ label: '纸张', value: parsedConfig.page.paperSize })
  }
  if (parsedConfig.page.maxPages) {
    items.push({ label: '页数限制', value: `${parsedConfig.page.maxPages}页` })
  }
  if (parsedConfig.margin.pageMarginTop) {
    items.push({ label: '边距', value: `${parsedConfig.margin.pageMarginTop}cm` })
  }
  if (parsedConfig.font.bodySize) {
    items.push({ label: '正文字号', value: `${parsedConfig.font.bodySize}pt` })
  }
  if (parsedConfig.font.englishFont) {
    items.push({ label: '英文字体', value: parsedConfig.font.englishFont })
  }
  if (parsedConfig.font.chineseFont) {
    items.push({ label: '中文字体', value: parsedConfig.font.chineseFont })
  }
  if (parsedConfig.heading.size) {
    items.push({ label: '标题字号', value: `${parsedConfig.heading.size}pt` })
  }
  if (parsedConfig.paragraph.lineSpacing) {
    items.push({ label: '行间距', value: `${parsedConfig.paragraph.lineSpacing}倍` })
  }
  if (parsedConfig.paragraph.alignment) {
    const alignMap = { 'both': '两端对齐', 'center': '居中', 'left': '左对齐', 'right': '右对齐' }
    items.push({ label: '对齐', value: alignMap[parsedConfig.paragraph.alignment] || parsedConfig.paragraph.alignment })
  }
  if (parsedConfig.header.enabled || parsedConfig.header.content) {
    items.push({ label: '页眉', value: '已设置' })
  }
  if (parsedConfig.footer.enabled || parsedConfig.footer.content) {
    items.push({ label: '页脚', value: '已设置' })
  }
  if (parsedConfig.numbering) {
    items.push({ label: '编号', value: parsedConfig.numbering })
  }

  return items
}
