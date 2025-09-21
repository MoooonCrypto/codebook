'use client';

import { Post } from '@/types';
import { PostCard } from './PostCard';

interface SearchResultsProps {
  results: Post[];
  isLoading?: boolean;
  onTagClick: (tag: string) => void;
  className?: string;
}

export function SearchResults({
  results,
  isLoading = false,
  onTagClick,
  className = ''
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* ローディングスケルトン */}
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            検索結果が見つかりませんでした
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            条件に一致する投稿がありません。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 投稿一覧 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-4">
        {results.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
}