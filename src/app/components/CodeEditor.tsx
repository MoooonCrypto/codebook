'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Prism from 'prismjs';

// Monaco Editor を動的インポート
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-900 text-gray-400 border border-gray-600 rounded">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <div>エディターを読み込み中...</div>
      </div>
    </div>
  ),
  ssr: false
});

// 基本的な言語のみインポート
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

interface CodeDisplayProps {
  code: string;
  language: string;
  filename?: string;
  showCopyButton?: boolean;
  className?: string;
}

// Prism.js 言語マッピング（基本的な言語のみ）
const getPrismLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    'typescript': 'typescript',
    'javascript': 'javascript',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'python': 'python',
    'html': 'markup',
    'css': 'css',
    'json': 'json',
    'shell': 'bash',
    'bash': 'bash',
    'sh': 'bash'
  };

  return languageMap[language.toLowerCase()] || 'markup';
};

// Monaco Editor 言語マッピング
const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    'typescript': 'typescript',
    'javascript': 'javascript',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'python': 'python',
    'rs': 'rust',
    'rust': 'rust',
    'go': 'go',
    'java': 'java',
    'cpp': 'cpp',
    'c++': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'csharp': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'ruby': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sql': 'sql',
    'shell': 'shell',
    'bash': 'shell',
    'sh': 'shell',
    'markdown': 'markdown',
    'md': 'markdown'
  };

  return languageMap[language.toLowerCase()] || 'plaintext';
};

// シンタックスハイライト付きコードエディター
export function CodeEditor({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
  className = ''
}: CodeEditorProps) {
  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-900 ${className}`} style={{ height }}>
      <MonacoEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        language={getMonacoLanguage(language)}
        height="100%"
        theme="vs-dark"
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          contextmenu: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'boundary',
          showFoldingControls: 'always'
        }}
      />
    </div>
  );
}

// 表示専用のコードブロック（Prism.js使用）
export function CodeDisplay({
  code,
  language,
  filename,
  showCopyButton = true,
  className = ''
}: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    const prismLanguage = getPrismLanguage(language);

    if (Prism.languages[prismLanguage]) {
      const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
      setHighlightedCode(highlighted);
    } else {
      setHighlightedCode(code);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className={`bg-gray-900 text-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm text-gray-300 font-medium">{filename}</span>
          )}
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {language}
          </span>
        </div>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-xs text-gray-300 hover:text-white
                     bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                コピー済み
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                コピー
              </>
            )}
          </button>
        )}
      </div>

      {/* コード本体 */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code
            className={`language-${getPrismLanguage(language)}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
}