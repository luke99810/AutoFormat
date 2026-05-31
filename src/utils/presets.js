// 预设排版模板
export const PRESETS = {
  '自定义': {
    label: '📝 自定义',
    description: '自由配置所有排版参数',
    styles: {
      chineseFont: '宋体',
      englishFont: 'Times New Roman',
      headingSizes: [22, 18, 16, 14, 12, 12],
      bodySize: 10.5,
      headingBold: [true, true, true, true, false, false],
      charSpacing: 0,
      lineSpacing: 1.5,
      paraSpacingBefore: 0,
      paraSpacingAfter: 6,
      alignment: 'justify',
      firstLineIndent: 2,
      pageMarginTop: 2.54,
      pageMarginBottom: 2.54,
      pageMarginLeft: 3.17,
      pageMarginRight: 3.17,
      headerContent: '',
      footerContent: 'pageNumber',
      numberingStyle: 'none',
      bindingMargin: 0,
    }
  },
  '高校学位论文': {
    label: '📚 高校学位论文',
    description: 'GB/T 7714 标准，适用于本科/硕士/博士论文',
    styles: {
      chineseFont: '宋体',
      englishFont: 'Times New Roman',
      headingSizes: [22, 18, 16, 14, 12, 12],
      bodySize: 10.5,
      headingBold: [true, true, true, true, false, false],
      charSpacing: 0,
      lineSpacing: 1.5,
      paraSpacingBefore: 0,
      paraSpacingAfter: 6,
      alignment: 'justify',
      firstLineIndent: 2,
      pageMarginTop: 2.54,
      pageMarginBottom: 2.54,
      pageMarginLeft: 3.18,
      pageMarginRight: 3.18,
      headerContent: '',
      footerContent: 'pageNumber',
      numberingStyle: 'none',
      bindingMargin: 0,
    }
  },
  '商业计划书': {
    label: '📋 商业计划书',
    description: '专业商务风格，适用于投资人路演',
    styles: {
      chineseFont: '黑体',
      englishFont: 'Arial',
      headingSizes: [24, 20, 18, 16, 14, 12],
      bodySize: 11,
      headingBold: [true, true, true, true, true, false],
      charSpacing: 0.5,
      lineSpacing: 1.5,
      paraSpacingBefore: 12,
      paraSpacingAfter: 12,
      alignment: 'justify',
      firstLineIndent: 2,
      pageMarginTop: 2.54,
      pageMarginBottom: 2.54,
      pageMarginLeft: 2.54,
      pageMarginRight: 2.54,
      headerContent: 'title',
      footerContent: 'pageNumber',
      numberingStyle: 'decimal',
      bindingMargin: 0,
    }
  },
  '课程作业': {
    label: '📝 课程作业',
    description: '通用作业格式，适用于中小学和大学课程',
    styles: {
      chineseFont: '宋体',
      englishFont: 'Times New Roman',
      headingSizes: [18, 16, 14, 12, 12, 12],
      bodySize: 12,
      headingBold: [true, true, true, false, false, false],
      charSpacing: 0,
      lineSpacing: 1.5,
      paraSpacingBefore: 0,
      paraSpacingAfter: 6,
      alignment: 'justify',
      firstLineIndent: 2,
      pageMarginTop: 2.54,
      pageMarginBottom: 2.54,
      pageMarginLeft: 3.18,
      pageMarginRight: 3.18,
      headerContent: '',
      footerContent: 'none',
      numberingStyle: 'none',
      bindingMargin: 0,
    }
  },
  '政府公文': {
    label: '📄 政府公文',
    description: '仿宋GB2312标准，适用于机关公文',
    styles: {
      chineseFont: '仿宋',
      englishFont: '仿宋',
      headingSizes: [22, 18, 16, 16, 16, 16],
      bodySize: 10.5,
      headingBold: [true, true, true, true, true, true],
      charSpacing: 1,
      lineSpacing: 2,
      paraSpacingBefore: 0,
      paraSpacingAfter: 0,
      alignment: 'justify',
      firstLineIndent: 2,
      pageMarginTop: 3.7,
      pageMarginBottom: 3.5,
      pageMarginLeft: 2.8,
      pageMarginRight: 2.6,
      headerContent: '',
      footerContent: 'pageNumber',
      numberingStyle: 'none',
      bindingMargin: 0,
    }
  },
  '科研论文': {
    label: '📰 科研论文',
    description: 'APA 7th 格式，适用于 SCI/SSCI 期刊',
    styles: {
      chineseFont: '宋体',
      englishFont: 'Times New Roman',
      headingSizes: [14, 13, 12, 11, 11, 11],
      bodySize: 11,
      headingBold: [true, true, true, true, true, true],
      charSpacing: 0,
      lineSpacing: 2,
      paraSpacingBefore: 12,
      paraSpacingAfter: 12,
      alignment: 'justify',
      firstLineIndent: 4,
      pageMarginTop: 2.54,
      pageMarginBottom: 2.54,
      pageMarginLeft: 2.54,
      pageMarginRight: 2.54,
      headerContent: 'title',
      footerContent: 'pageNumber',
      numberingStyle: 'decimal',
      bindingMargin: 0,
    }
  },
}

// 中文字体选项
export const CHINESE_FONTS = [
  { value: '宋体', label: '宋体（正文经典）' },
  { value: '仿宋', label: '仿宋（公文标准）' },
  { value: '黑体', label: '黑体（标题醒目）' },
  { value: '楷体', label: '楷体（柔和正式）' },
  { value: '微软雅黑', label: '微软雅黑（现代清晰）' },
]

// 英文字体选项
export const ENGLISH_FONTS = [
  { value: 'Times New Roman', label: 'Times New Roman（学术经典）' },
  { value: 'Arial', label: 'Arial（现代商务）' },
  { value: 'Calibri', label: 'Calibri（清晰易读）' },
  { value: 'Georgia', label: 'Georgia（优雅衬线）' },
  { value: 'Tahoma', label: 'Tahoma（简洁无衬线）' },
]

// 字号映射
export const FONT_SIZE_MAP = [
  { pt: 22, label: '小二（22pt）', level: '一级标题' },
  { pt: 18, label: '小三（18pt）', level: '二级标题' },
  { pt: 16, label: '四号（16pt）', level: '三级标题' },
  { pt: 14, label: '小四（14pt）', level: '四级标题' },
  { pt: 12, label: '五号（12pt）', level: '五级标题' },
  { pt: 10.5, label: '小五（10.5pt）', level: '六级标题' },
]

// 行间距选项
export const LINE_SPACING_OPTIONS = [
  { value: 1, label: '单倍行距' },
  { value: 1.5, label: '1.5 倍行距' },
  { value: 2, label: '2 倍行距' },
  { value: 'custom', label: '固定值' },
]

// 对齐方式
export const ALIGN_OPTIONS = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中对齐' },
  { value: 'right', label: '右对齐' },
  { value: 'justify', label: '两端对齐' },
]

// 编号样式
export const NUMBERING_OPTIONS = [
  { value: 'none', label: '无编号' },
  { value: 'decimal', label: '数字编号（1. 1.1 1.1.1）' },
  { value: 'bullet', label: '实心圆点（•）' },
  { value: 'circle', label: '空心圆点（○）' },
  { value: 'check', label: '勾选框（✓）' },
]
