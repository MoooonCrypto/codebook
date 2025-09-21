'use client';

import Link from 'next/link';
import { Post } from '@/types';
import { CodeDisplay } from './CodeEditor';

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function PostCard({ post, onTagClick, className = '' }: PostCardProps) {
  // コードプレビュー用（最初の数行のみ表示）
  const previewCode = post.content.split('\n').slice(0, 8).join('\n') +
    (post.content.split('\n').length > 8 ? '\n...' : '');

  return (
    <Link href={`/posts/${post.id}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg
                      transition-all duration-200 border border-gray-200 dark:border-gray-700
                      hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer ${className}`}>

        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
              {post.title}
            </h3>
            <span className="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900
                           text-blue-800 dark:text-blue-200 rounded-full font-medium">
              {post.sourceCode.language}
            </span>
          </div>

          {/* 作成者と統計 */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>@{post.author.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* コードプレビュー */}
        <div className="p-4">
          <div className="mb-3">
            <CodeDisplay
              code={previewCode}
              language={post.sourceCode.language}
              filename={post.sourceCode.filename}
              showCopyButton={false}
              className="text-sm"
            />
          </div>

          {/* 説明 */}
          {post.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {post.description}
            </p>
          )}

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              onTagClick ? (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900
                           text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-200
                           rounded-md transition-colors"
                >
                  #{tag}
                </button>
              ) : (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-md"
                >
                  #{tag}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}