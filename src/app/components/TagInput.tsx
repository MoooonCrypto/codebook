'use client';

import { useState, useRef, useEffect } from 'react';
import { Post } from '@/types';
import { searchTagSuggestions } from '@/lib/searchUtils';

interface TagInputProps {
  posts: Post[];
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  posts,
  value,
  onChange,
  maxTags = 5,
  placeholder = 'タグを入力...',
  className = ''
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ tag: string; count: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 入力値が変更されたときに候補を更新
  useEffect(() => {
    if (inputValue.trim()) {
      const tagSuggestions = searchTagSuggestions(posts, inputValue.trim(), 10);
      // 既に選択されているタグを除外
      const filteredSuggestions = tagSuggestions.filter(
        suggestion => !value.includes(suggestion.tag)
      );

      // 新規タグとして追加できる場合のオプションを追加
      const hasExactMatch = filteredSuggestions.some(
        suggestion => suggestion.tag.toLowerCase() === inputValue.trim().toLowerCase()
      );

      const allSuggestions = [...filteredSuggestions];

      // 完全一致がない場合は「新規タグとして追加」オプションを追加
      if (!hasExactMatch && inputValue.trim() && !value.includes(inputValue.trim())) {
        allSuggestions.unshift({
          tag: inputValue.trim(),
          count: 0, // 新規タグは使用回数0
        });
      }

      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, value, posts]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          addTag(suggestions[selectedIndex].tag);
        } else if (inputValue.trim()) {
          addTag(inputValue);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;

      case 'Backspace':
        if (!inputValue && value.length > 0) {
          removeTag(value.length - 1);
        }
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* メインの入力エリア */}
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600
                      rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2
                      focus-within:ring-blue-500 focus-within:border-transparent
                      transition-colors duration-200">

        {/* 選択されたタグ */}
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm
                       bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200
                       rounded-md"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}

        {/* 入力フィールド */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={value.length >= maxTags}
          className="flex-1 min-w-0 outline-none bg-transparent text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
        />
      </div>

      {/* タグ候補の表示 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                        rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.tag}
              type="button"
              onClick={() => addTag(suggestion.tag)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                         flex items-center justify-between transition-colors
                         ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex items-center gap-2">
                {suggestion.count === 0 ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )}
                <span className="text-gray-900 dark:text-gray-100">
                  #{suggestion.tag}
                </span>
                {suggestion.count === 0 && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    新規
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {suggestion.count === 0 ? '新規作成' : `${suggestion.count}件`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 入力中だが候補がない場合の新規作成ヒント */}
      {inputValue.trim() && suggestions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                        rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">
              Enter または Tab で &quot;#{inputValue.trim()}&quot; を新規タグとして追加
            </span>
          </div>
        </div>
      )}

      {/* タグ数の制限表示とヘルプ */}
      <div className="mt-1 flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {value.length}/{maxTags} タグ
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Enter または Tab で追加・新規タグ作成可能
        </div>
      </div>
    </div>
  );
}