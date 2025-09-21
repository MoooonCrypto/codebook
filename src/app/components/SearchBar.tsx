'use client';

import React, { useState } from 'react';
import { SearchFilters } from '@/lib/searchUtils';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, value, onChange, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(value || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query: query.trim() });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // 外部からのvalue変更を反映
  React.useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="タイトル、概要、本文、タグで検索..."
          className="w-full pl-10 pr-16 py-3 border border-gray-300 dark:border-gray-600
                     rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
        />

        {/* 検索アイコン */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
        </div>

        {/* 検索実行ボタン・クリアボタン */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* 検索実行ボタン */}
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg
              className="h-4 w-4"
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
          </button>

          {/* クリアボタン */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onChange) {
                  onChange('');
                }
                onSearch({});
              }}
              className="absolute right-12 flex items-center px-1"
            >
              <svg
                className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}