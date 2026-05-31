import React from 'react'
import { Download, FileDown, FileText, Zap } from 'lucide-react'

export default function Header({ onExport, onExportTxt, hasContent, exporting }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 2h8l4 4v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M11 2v4h4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M5 9h8M5 12h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-none">AutoFormat</h1>
          <p className="text-xs text-slate-400 leading-none mt-0.5">智能文档排版助手</p>
        </div>
      </div>

      {/* 副标题 */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full">
        <Zap size={11} className="text-blue-500" />
        <span className="text-xs text-blue-600">告别手动排版，一键生成专业文档</span>
      </div>

      <div className="flex-1" />

      {/* 导出按钮 */}
      {hasContent && (
        <div className="flex items-center gap-2">
          <button
            onClick={onExportTxt}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileText size={13} />
            导出 .txt
          </button>
          <button
            onClick={onExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download size={13} />
                导出 .docx
              </>
            )}
          </button>
        </div>
      )}
    </header>
  )
}
