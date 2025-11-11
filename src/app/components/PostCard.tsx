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
      <div className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50
                      transform hover:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700
                      hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer ${className}`}>

        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 flex-1 transition-colors duration-200">
              {post.title}
            </h3>
            <span className="ml-3 px-2.5 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50
                           text-blue-800 dark:text-blue-200 rounded-full font-medium border border-blue-200 dark:border-blue-800 flex-shrink-0">
              {post.sourceCode.language}
            </span>
          </div>

          {/* 作成者と統計 */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">@{post.author.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">{post.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* コードプレビュー */}
        <div className="p-4">
          <div className="mb-3 rounded-lg overflow-hidden ring-1 ring-gray-700 dark:ring-gray-800">
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
                  className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
                           text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40
                           rounded-md font-medium border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-sm hover:scale-105"
                >
                  #{tag}
                </button>
              ) : (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
                           text-blue-700 dark:text-blue-300 rounded-md font-medium border border-blue-200 dark:border-blue-800"
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