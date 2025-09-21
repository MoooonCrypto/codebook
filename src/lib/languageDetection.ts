// 言語自動識別ユーティリティ

// ファイル拡張子から言語を推定
export function detectLanguageFromFilename(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop();

  const extensionMap: Record<string, string> = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mjs': 'javascript',
    'cjs': 'javascript',

    // Python
    'py': 'python',
    'pyw': 'python',
    'pyi': 'python',

    // Web
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'css',
    'sass': 'css',
    'less': 'css',

    // Data formats
    'json': 'json',
    'jsonc': 'json',
    'yaml': 'json', // yaml は未対応なので json として扱う
    'yml': 'json',

    // Shell
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'bash',

    // Documentation
    'md': 'markdown',
    'markdown': 'markdown',
    'txt': 'markdown',

    // Others
    'xml': 'html',
    'svg': 'html',
  };

  return extensionMap[extension || ''] || 'typescript';
}

// コード内容から言語を推定（簡易版）
export function detectLanguageFromContent(code: string): string {
  if (!code.trim()) return 'typescript';

  const content = code.toLowerCase();

  // JavaScript/TypeScript 特徴
  if (content.includes('import ') || content.includes('export ') ||
      content.includes('const ') || content.includes('let ') ||
      content.includes('function ') || content.includes('=>') ||
      content.includes('interface ') || content.includes('type ')) {

    // TypeScript 特有の特徴
    if (content.includes('interface ') || content.includes('type ') ||
        content.includes(': string') || content.includes(': number') ||
        content.includes('<') && content.includes('>')) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Python 特徴
  if (content.includes('def ') || content.includes('import ') ||
      content.includes('from ') || content.includes('class ') ||
      content.includes('if __name__') || content.includes('print(')) {
    return 'python';
  }

  // HTML 特徴
  if (content.includes('<html') || content.includes('<!doctype') ||
      content.includes('<div') || content.includes('<script') ||
      content.includes('<style')) {
    return 'html';
  }

  // CSS 特徴
  if (content.includes('{') && content.includes('}') &&
      (content.includes(':') || content.includes(';')) &&
      !content.includes('function') && !content.includes('const')) {
    return 'css';
  }

  // JSON 特徴
  if ((content.startsWith('{') && content.endsWith('}')) ||
      (content.startsWith('[') && content.endsWith(']'))) {
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      // JSON parse failed
    }
  }

  // Bash/Shell 特徴
  if (content.startsWith('#!') || content.includes('#!/bin/') ||
      content.includes('echo ') || content.includes('cd ') ||
      content.includes('ls ') || content.includes('grep ')) {
    return 'bash';
  }

  // Markdown 特徴
  if (content.includes('# ') || content.includes('## ') ||
      content.includes('```') || content.includes('- ') ||
      content.includes('* ') || content.includes('[') && content.includes('](')) {
    return 'markdown';
  }

  // デフォルトは TypeScript
  return 'typescript';
}

// ファイル名とコンテンツの両方から最適な言語を推定
export function detectLanguage(filename: string, code: string): string {
  // ファイル名から推定
  const filenameLanguage = detectLanguageFromFilename(filename);

  // コンテンツから推定
  const contentLanguage = detectLanguageFromContent(code);

  // ファイル名からの推定を優先し、コンテンツからの推定で補完
  if (filenameLanguage !== 'typescript' || !code.trim()) {
    return filenameLanguage;
  }

  return contentLanguage;
}