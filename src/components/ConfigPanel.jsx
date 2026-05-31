import React from 'react'
import { Settings, ChevronDown } from 'lucide-react'
import { PRESETS, CHINESE_FONTS, ENGLISH_FONTS, LINE_SPACING_OPTIONS, ALIGN_OPTIONS, NUMBERING_OPTIONS } from '../utils/presets'
import SmartParser from './SmartParser'

export default function ConfigPanel({ styles, onChange, activePreset, onPresetChange }) {
  const update = (key, value) => {
    onChange({ ...styles, [key]: value })
  }

  const updateHeadingSize = (index, value) => {
    const newSizes = [...(styles.headingSizes || [22, 18, 16, 14, 12, 12])]
    newSizes[index] = parseInt(value)
    onChange({ ...styles, headingSizes: newSizes })
  }

  const updateHeadingBold = (index, value) => {
    const newBold = [...(styles.headingBold || [true, true, true, true, false, false])]
    newBold[index] = value
    onChange({ ...styles, headingBold: newBold })
  }

  const [openSection, setOpenSection] = React.useState('type')

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
      {/* 智能格式解析器 */}
      <div className="p-4 border-b border-slate-100">
        <SmartParser onApplyStyles={onChange} currentStyles={styles} />
      </div>

      {/* 预设类型选择 */}
      <div className="p-4 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">文档类型</div>
        <div className="space-y-1">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onPresetChange(key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activePreset === key
                  ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 细分配置 */}
      <div className="p-4 space-y-2">

        {/* 字体设置 */}
        <Section title="字体设置" icon={<span className="text-sm">🔤</span>} open={openSection === 'font'} onToggle={() => toggleSection('font')}>
          <ConfigRow label="中文字体">
            <select
              value={styles.chineseFont}
              onChange={e => update('chineseFont', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CHINESE_FONTS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </ConfigRow>
          <ConfigRow label="英文字体">
            <select
              value={styles.englishFont}
              onChange={e => update('englishFont', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ENGLISH_FONTS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </ConfigRow>
          <ConfigRow label="正文字号">
            <select
              value={styles.bodySize}
              onChange={e => update('bodySize', parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[9, 10.5, 11, 12, 14].map(s => (
                <option key={s} value={s}>{s}pt</option>
              ))}
            </select>
          </ConfigRow>
          <ConfigRow label="字间距">
            <select
              value={styles.charSpacing}
              onChange={e => update('charSpacing', parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-0.5}>紧凑 (-0.5pt)</option>
              <option value={0}>标准 (0pt)</option>
              <option value={0.5}>稀疏 (+0.5pt)</option>
              <option value={1}>较宽 (+1pt)</option>
            </select>
          </ConfigRow>
        </Section>

        {/* 标题设置 */}
        <Section title={`标题设置（${styles.headingSizes?.[0] || 22}pt/${styles.headingSizes?.[1] || 18}pt/${styles.headingSizes?.[2] || 16}pt）`} icon={<span className="text-sm">📌</span>} open={openSection === 'heading'} onToggle={() => toggleSection('heading')}>
          {[0, 1, 2].map(i => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center py-1">
              <span className="text-xs text-slate-500 col-span-1">{(['一级', '二级', '三级'])[i]}标题</span>
              <select
                value={styles.headingSizes?.[i] || [22, 18, 16][i]}
                onChange={e => updateHeadingSize(i, e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded text-xs col-span-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {[24, 22, 20, 18, 16, 14, 12].map(s => (
                  <option key={s} value={s}>{s}pt</option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-xs col-span-1">
                <input
                  type="checkbox"
                  checked={styles.headingBold?.[i] !== false}
                  onChange={e => updateHeadingBold(i, e.target.checked)}
                  className="w-3 h-3"
                />
                加粗
              </label>
            </div>
          ))}
          <div className="text-xs text-slate-400 mt-1">三级以下标题与正文同字号</div>
        </Section>

        {/* 段落设置 */}
        <Section title="段落设置" icon={<span className="text-sm">📏</span>} open={openSection === 'paragraph'} onToggle={() => toggleSection('paragraph')}>
          <ConfigRow label="行间距">
            <select
              value={styles.lineSpacing}
              onChange={e => update('lineSpacing', e.target.value === 'custom' ? 20 : parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LINE_SPACING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </ConfigRow>
          {styles.lineSpacing === 'custom' && (
            <ConfigRow label="固定行高">
              <input
                type="number"
                value={styles.lineSpacingCustom || 20}
                onChange={e => update('lineSpacing', parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pt"
              />
            </ConfigRow>
          )}
          <ConfigRow label="段前间距">
            <input
              type="number"
              value={styles.paraSpacingBefore}
              onChange={e => update('paraSpacingBefore', parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0" max="20" step="0.5"
            />
          </ConfigRow>
          <ConfigRow label="段后间距">
            <input
              type="number"
              value={styles.paraSpacingAfter}
              onChange={e => update('paraSpacingAfter', parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0" max="20" step="0.5"
            />
          </ConfigRow>
          <ConfigRow label="首行缩进">
            <select
              value={styles.firstLineIndent}
              onChange={e => update('firstLineIndent', parseInt(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>无缩进</option>
              <option value={2}>2 字符</option>
              <option value={4}>4 字符</option>
            </select>
          </ConfigRow>
          <ConfigRow label="对齐方式">
            <select
              value={styles.alignment}
              onChange={e => update('alignment', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ALIGN_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </ConfigRow>
        </Section>

        {/* 页眉页脚 */}
        <Section title="页眉页脚" icon={<span className="text-sm">📄</span>} open={openSection === 'headerfooter'} onToggle={() => toggleSection('headerfooter')}>
          <ConfigRow label="页眉内容">
            <select
              value={styles.headerContent}
              onChange={e => update('headerContent', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">无页眉</option>
              <option value="title">文档标题</option>
              <option value="custom">自定义文字</option>
            </select>
          </ConfigRow>
          {styles.headerContent === 'custom' && (
            <input
              type="text"
              value={styles.headerCustom || ''}
              onChange={e => update('headerCustom', e.target.value)}
              placeholder="输入页眉文字"
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <ConfigRow label="页脚内容">
            <select
              value={styles.footerContent}
              onChange={e => update('footerContent', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">无页脚</option>
              <option value="pageNumber">页码</option>
              <option value="pageOfTotal">第 X 页 / 共 Y 页</option>
            </select>
          </ConfigRow>
        </Section>

        {/* 编号与边距 */}
        <Section title="编号与边距" icon={<span className="text-sm">📑</span>} open={openSection === 'numbering'} onToggle={() => toggleSection('numbering')}>
          <ConfigRow label="编号样式">
            <select
              value={styles.numberingStyle}
              onChange={e => update('numberingStyle', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {NUMBERING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </ConfigRow>
          <ConfigRow label="装订边距">
            <select
              value={styles.bindingMargin}
              onChange={e => update('bindingMargin', parseFloat(e.target.value))}
              className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>普通边距</option>
              <option value={1.5}>左侧装订边距 (+1.5cm)</option>
              <option value={2}>左侧装订边距 (+2cm)</option>
            </select>
          </ConfigRow>
        </Section>

        {/* 页边距 */}
        <Section title="页边距 (cm)" icon={<span className="text-sm">📐</span>} open={openSection === 'margin'} onToggle={() => toggleSection('margin')}>
          {[
            { key: 'pageMarginTop', label: '上' },
            { key: 'pageMarginBottom', label: '下' },
            { key: 'pageMarginLeft', label: '左' },
            { key: 'pageMarginRight', label: '右' },
          ].map(m => (
            <ConfigRow key={m.key} label={`页边距(${m.label})`}>
              <input
                type="number"
                value={styles[m.key]}
                onChange={e => update(m.key, parseFloat(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1" max="10" step="0.1"
              />
            </ConfigRow>
          ))}
        </Section>

      </div>
    </div>
  )
}

// 配置行组件
function ConfigRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <label className="text-xs text-slate-600 whitespace-nowrap min-w-0">{label}</label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

// 可折叠区块
function Section({ title, icon, open, onToggle, children }) {
  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
      >
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-3 py-2.5 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}
