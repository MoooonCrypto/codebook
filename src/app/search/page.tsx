'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchPosts, getTagUsageStats, SearchFilters } from '@/lib/searchUtils';
import { SearchBar } from '@/app/components/SearchBar';
import { LanguageGrid } from '@/app/components/LanguageGrid';
import { PostCard } from '@/app/components/PostCard';
import { ThemeAwareLogo } from '@/app/components/ThemeAwareLogo';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { mockPosts } from '@/lib/mockData';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URLパラメータから初期検索条件を設定
  useEffect(() => {
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    const language = searchParams.get('language');

    if (query) {
      setSearchQuery(query);
      setFilters({ query });
    } else if (tag) {
      setSearchQuery(tag);
      setFilters({ query: tag });
    } else if (language) {
      setSearchQuery(language);
      setFilters({ language });
    }
  }, [searchParams]);

  // 人気タグの取得（使用回数の多い順）
  const tagStats = getTagUsageStats(mockPosts);
  const popularTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));

  // 検索実行
  const handleSearch = (newFilters: SearchFilters) => {
    setIsLoading(true);
    setFilters(newFilters);

    // URLパラメータも更新（ブラウザバック対応）
    if (newFilters.query) {
      router.push(`/search?q=${encodeURIComponent(newFilters.query)}`);
    } else {
      router.push('/search');
    }

    // 実際のAPIでは非同期処理になるため、ローディング状態をシミュレート
    setTimeout(() => setIsLoading(false), 300);
  };

  // タグクリックで新しい画面に遷移
  const handleTagClick = (tag: string) => {
    router.push(`/search?tag=${encodeURIComponent(tag)}`);
  };

  // 言語クリックで新しい画面に遷移（言語フィルターを使用）
  const handleLanguageClick = (language: string) => {
    router.push(`/search?language=${encodeURIComponent(language)}`);
  };

  // 検索結果の取得
  const searchResults = searchPosts(mockPosts, filters);
  const hasSearchQuery = !!(filters.query || filters.tags?.length || filters.language);
  const currentSearchTerm = searchParams.get('language') || searchParams.get('tag') || searchParams.get('q') || '';

  // 言語検索かどうかを判定
  const isLanguageSearch = !!searchParams.get('language');

  // 言語アイコンのマッピング
  const languageIcons: { [key: string]: string } = {
    'javascript': '🟨',
    'typescript': '🔷', 
    'python': '🐍',
    'java': '☕',
    'c++': '⚙️',
    'react': '⚛️',
    'vue': '💚',
    'angular': '🅰️',
    'node.js': '🟢',
    'go': '🐹',
    'rust': '🦀',
    'swift': '🍎',
    'kotlin': '💜',
    'c#': '💙',
    'php': '🐘',
    'ruby': '💎',
    'dart': '🎯',
    'flutter': '📱',
    'html': '🌐',
    'css': '🎨',
    'sql': '🗄️',
    'docker': '🐳',
    'aws': '☁️',
    'git': '📝',
    'shell': '🔧'
  };

  // 検索結果画面の場合
  if (hasSearchQuery && currentSearchTerm) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* グローバルヘッダー */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-11 sm:h-16">
              {/* 左側: ロゴ */}
              <Link href="/" className="flex items-center flex-shrink-0 min-w-0 mr-2">
                <div className="w-6 h-6 sm:w-10 sm:h-10 mr-1 sm:mr-3 flex-shrink-0">
                  <ThemeAwareLogo />
                </div>
                <span className="font-bold text-sm sm:text-xl text-gray-900 dark:text-white truncate">CodeBook</span>
              </Link>

              {/* 右側: ボタン群 */}
              <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
                {/* 検索ボタン - アクティブ */}
                <Link
                  href="/search"
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0"
                  aria-label="検索"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>

                {/* プロフィール - PCのみ */}
                <button className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">プロフィール</span>
                </button>

                {/* 投稿ボタン */}
                <Link
                  href="/posts/create"
                  className="bg-gray-700 dark:bg-gray-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  投稿
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* 検索キーワード表示（小さく） */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isLanguageSearch ? (
                  <>
                    <span className="text-xl">{languageIcons[currentSearchTerm.toLowerCase()] || '💻'}</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {currentSearchTerm}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    「{currentSearchTerm}」
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {searchResults.length} 件
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-auto min-h-[280px] sm:min-h-[300px] lg:aspect-square animate-pulse w-full max-w-full"></div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {searchResults.map((post) => (
                <PostCard key={post.id} post={post} onTagClick={handleTagClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  検索結果が見つかりませんでした
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isLanguageSearch ? (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <span>{languageIcons[currentSearchTerm.toLowerCase()] || '💻'}</span>
                        <span className="capitalize">{currentSearchTerm}</span>
                      </span>
                      に一致する投稿がありません。
                    </>
                  ) : (
                    <>「{currentSearchTerm}」に一致する投稿がありません。</>
                  )}
                </p>
                <Link
                  href="/search"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  別のキーワードで検索する
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 検索初期画面
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* グローバルヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-16">
            {/* 左側: ロゴ */}
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0 mr-2">
              <div className="w-6 h-6 sm:w-10 sm:h-10 mr-1 sm:mr-3 flex-shrink-0">
                <ThemeAwareLogo />
              </div>
              <span className="font-bold text-sm sm:text-xl text-gray-900 dark:text-white truncate">CodeBook</span>
            </Link>

            {/* 右側: ボタン群 */}
            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              {/* 検索ボタン（現在のページなのでアクティブ表示） */}
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              {/* テーマ切り替えボタン */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* プロフィール - PCのみ */}
              <button className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-sm font-medium">プロフィール</span>
              </button>

              {/* 投稿ボタン */}
              <Link
                href="/posts/create"
                className="bg-gray-700 dark:bg-gray-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                投稿
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 検索コンテンツ */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              コード検索
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              タグや言語からコードを探す
            </p>
          </div>

          {/* 検索バー */}
          <SearchBar
            onSearch={handleSearch}
            value={searchQuery}
            onChange={setSearchQuery}
            className="mb-6"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* 人気タグ */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              人気のタグ
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm
                           bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900
                           text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-200
                           rounded-full transition-colors"
                >
                  #{tag}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 言語・技術一覧 */}
          <LanguageGrid onLanguageClick={handleLanguageClick} />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}