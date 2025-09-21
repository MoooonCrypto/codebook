'use client';

import { useState } from 'react';
import { SearchFilters as SearchFiltersType, SortOption } from '@/lib/searchUtils';
import { Post } from '@/types';
import { TagInput } from './TagInput';

interface SearchFiltersProps {
  posts: Post[];
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'popular', label: '人気順' },
  { value: 'views', label: '閲覧数順' },
];

// 利用可能な言語を投稿から抽出
const getAvailableLanguages = (posts: Post[]): string[] => {
  const languages = new Set<string>();
  posts.forEach(post => {
    languages.add(post.sourceCode.language);
  });
  return Array.from(languages).sort();
};

export function SearchFilters({
  posts,
  filters,
  onFiltersChange,
  className = ''
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const availableLanguages = getAvailableLanguages(posts);

  const updateFilters = (updates: Partial<SearchFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    filters.tags?.length ||
    filters.language ||
    filters.sortBy
  );

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* フィルターヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            フィルター
          </h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900
                           text-blue-800 dark:text-blue-200 rounded-full">
              適用中
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
                       transition-colors"
            >
              クリア
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
                     transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* フィルター内容 */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* タグフィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              タグで絞り込み
            </label>
            <TagInput
              posts={posts}
              value={filters.tags || []}
              onChange={(tags) => updateFilters({ tags: tags.length > 0 ? tags : undefined })}
              placeholder="タグを入力してフィルタリング..."
            />
          </div>

          {/* 言語フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              プログラミング言語
            </label>
            <select
              value={filters.language || ''}
              onChange={(e) => updateFilters({ language: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全ての言語</option>
              {availableLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* ソート順 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              並び順
            </label>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => updateFilters({ sortBy: e.target.value as SortOption })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}