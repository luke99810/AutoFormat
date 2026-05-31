import React, { useState } from 'react'
import { Sparkles, Wand2, Check, AlertCircle } from 'lucide-react'
import { parseFormatDescription, mergeParsedConfig, getParsedSummary } from '../utils/formatParser'

export default function SmartParser({ onApplyStyles, currentStyles }) {
  const [inputText, setInputText] = useState('')
  const [parsedConfig, setParsedConfig] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // 示例模板
  const examples = [
    {
      label: '高校学位论文',
      text: `页面布局
使用 A4纸张（210mm × 297mm）
边距：顶部 ≥ 2.5cm，底部、左侧、右侧均 ≥ 2.5cm

字体与字号
正文：Times New Roman，10pt
标题：可使用 14pt 或更大，居中放置于第一页顶端下方约1英寸处

段落格式
正文首行缩进 2 字符
1.5 倍行距
段前 0pt，段后 0pt`
    },
    {
      label: '商业计划书',
      text: `页面设置：A4 纸张，上下左右边距 2cm

正文：宋体，12pt，黑色
标题：黑体，16pt，居中，加粗
副标题：黑体，14pt

段落：首行缩进 2 字符，两端对齐
行距：1.5 倍`
    },
    {
      label: '课程作业',
      text: `标题居中，16pt，加粗，黑体
正文宋体 12pt，首行缩进 2 字符
行距 1.2 倍
页眉：课程名称
页码居中`
    },
  ]

  // 解析输入的格式描述
  const handleParse = () => {
    if (!inputText.trim()) {
      alert('请先粘贴格式描述内容')
      return
    }

    const result = parseFormatDescription(inputText)
    setParsedConfig(result)
    setShowResult(true)
  }

  // 应用解析后的样式
  const handleApply = () => {
    if (!parsedConfig) return

    const newStyles = mergeParsedConfig(parsedConfig, currentStyles)
    onApplyStyles(newStyles)

    // 显示成功提示
    setShowResult(false)
    setInputText('')
    setParsedConfig(null)
  }

  // 加载示例
  const loadExample = (example) => {
    setInputText(example.text)
    setShowResult(false)
    setParsedConfig(null)
  }

  // 清空
  const handleClear = () => {
    setInputText('')
    setShowResult(false)
    setParsedConfig(null)
  }

  const summary = parsedConfig ? getParsedSummary(parsedConfig) : []
  const hasContent = inputText.trim().length > 0

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 mb-4 border border-purple-100">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-800">智能格式解析</h3>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
          AI 识别
        </span>
      </div>

      {/* 输入区域 */}
      <textarea
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value)
          setShowResult(false)
          setParsedConfig(null)
        }}
        placeholder="粘贴格式描述，例如：
页面：A4纸张，上下左右边距 2.5cm
正文：Times New Roman 10pt
标题：14pt 居中 加粗
行距：1.5倍，首行缩进2字符..."
        className="w-full h-40 px-3 py-2 border border-purple-200 rounded-lg text-sm resize-none
                   focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   placeholder:text-slate-400"
      />

      {/* 操作按钮 */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleParse}
          disabled={!hasContent}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                     transition-all ${hasContent
                       ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
                       : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                     }`}
        >
          <Wand2 className="w-4 h-4" />
          解析格式
        </button>
        {hasContent && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            清空
          </button>
        )}
      </div>

      {/* 解析结果预览 */}
      {showResult && parsedConfig && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">识别到以下格式设置：</span>
          </div>

          {summary.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {summary.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                >
                  <span className="text-green-500">{item.label}：</span>
                  <span className="font-medium">{item.value}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 text-sm mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>未识别到明确的格式参数，请尝试更详细的描述</span>
            </div>
          )}

          <button
            onClick={handleApply}
            className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium
                       hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            应用到文档
          </button>
        </div>
      )}

      {/* 示例模板 */}
      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-2">💡 试试这些示例：</div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600
                         hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
