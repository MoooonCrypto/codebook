'use client';

import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// シンプルなマークダウンパーサー
const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';

  return markdown
    // ヘッダー
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6">$1</h1>')

    // 太字・斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')

    // インラインコード
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>')

    // リスト
    .replace(/^\- (.*$)/gim, '<li class="text-gray-700 dark:text-gray-300 mb-1">• $1</li>')
    .replace(/^\* (.*$)/gim, '<li class="text-gray-700 dark:text-gray-300 mb-1">• $1</li>')

    // リンク
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // 改行
    .replace(/\n\n/g, '</p><p class="text-gray-700 dark:text-gray-300 mb-4">')
    .replace(/\n/g, '<br>');
};

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    const parsed = parseMarkdown(content);
    // 最初と最後にpタグを追加（改行処理のため）
    return `<p class="text-gray-700 dark:text-gray-300 mb-4">${parsed}</p>`;
  }, [content]);

  if (!content.trim()) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 italic ${className}`}>
        詳細説明を入力すると、ここにプレビューが表示されます...
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}