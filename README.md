# AutoFormat - Smart Document Formatting Assistant

A one-click document formatting tool for students and professionals, featuring AI-powered heading detection and 6 professional templates.

## 📦 Project Overview

AutoFormat intelligently recognizes heading levels ("Chapter X", "1.1", "一、" formats) from pasted text or uploaded .docx files, and applies professional templates instantly with live preview and one-click .docx export compatible with WPS and Microsoft Word.

## ✨ Features

- **Multi-format Input**: Paste text directly or upload .docx files
- **Smart Heading Detection**: AI recognizes "第X章", "1.1", "一、" heading patterns
- **6 Preset Templates**: Academic thesis, business plan, coursework, government documents, research papers, custom
- **Comprehensive Config**: Font, size, line spacing, margins, headers/footers
- **Real-time Preview**: WYSIWYG editing experience
- **One-click Export**: Standard .docx output compatible with WPS/Word

## 🛠️ Tech Stack

- **Frontend**: React 18 / Vite 5 / JavaScript
- **Styling**: CSS
- **Document**: docx.js

## 📂 Project Structure

```
AutoFormat/
├── src/                       # Source code
│   ├── components/            # React components
│   ├── utils/                 # Utility functions
│   ├── App.jsx
│   └── main.jsx
├── public/                    # Static assets
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/luke99810/AutoFormat.git
cd AutoFormat

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment

Deploy to your preferred platform:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo and auto-deploy
- **GitHub Pages**: Use `npm run build` and deploy `dist/` folder

## 📖 Documentation

- [Product Requirements](PRD.md) - Detailed product specification

## 📄 License

MIT License
