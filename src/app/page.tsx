'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CodePost } from '@/types';
import { getTrendingPosts, getLatestPosts } from '@/lib/api';
import { convertToCodePosts } from '@/lib/utils';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeAwareLogo } from './components/ThemeAwareLogo';

// アイコンコンポーネントを直接定義（lucide-react代替）
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const HeartIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BookmarkIcon = ({
  size = 16,
  fill = 'none',
}: {
  size?: number;
  fill?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const UserIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TagIcon = ({ size = 8 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ホーム');
  const [selectedFilter, setSelectedFilter] = useState('すべて');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set<string>());
  const [trendingCodes, setTrendingCodes] = useState<CodePost[]>([]);
  const [newCodes, setNewCodes] = useState<CodePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendingPosts, latestPosts] = await Promise.all([
          getTrendingPosts(6),
          getLatestPosts(6)
        ]);

        const [trendingCodePosts, latestCodePosts] = await Promise.all([
          convertToCodePosts(trendingPosts),
          convertToCodePosts(latestPosts)
        ]);

        setTrendingCodes(trendingCodePosts);
        setNewCodes(latestCodePosts);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const tabItems = [
    { id: 'ホーム', label: 'ホーム', color: 'blue' },
    { id: 'ブックマーク', label: 'ブックマーク', color: 'purple' },
    { id: 'ランキング', label: 'ランキング', color: 'red' },
  ];

  const filterOptions = ['すべて', 'フォロー中ユーザ', 'フォロー中タグ'];

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const PostCard = ({
    post,
    showLikes = true,
    showBookmark = true,
  }: {
    post: CodePost;
    showLikes?: boolean;
    showBookmark?: boolean;
  }) => (
    <Link
      href={`/posts/${post.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow duration-200 lg:aspect-square flex flex-col cursor-pointer w-full"
    >
      {/* 投稿者アイコン */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full mr-3"
            unoptimized
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {post.author.name}
          </span>
        </div>
      </div>

      {/* 投稿タイトル */}
      <div className="px-4 py-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
          {post.title}
        </h3>
      </div>

      {/* ソースコードプレビュー */}
      <div className="flex-1 px-4 pb-2">
        <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 h-full overflow-hidden">
          <pre className="text-xs text-gray-300 dark:text-gray-400 font-mono leading-tight overflow-hidden">
            <code className="whitespace-pre-wrap">
              {post.codePreview.split('\n').slice(0, 8).join('\n')}
              {post.codePreview.split('\n').length > 8 && '...'}
            </code>
          </pre>
        </div>
      </div>

      {/* 設定タグ */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              <TagIcon size={8} />
              <span className="ml-1">{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* いいね数・ブックマークボタン */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {showLikes && (
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <HeartIcon size={16} />
              <span className="text-sm font-medium">{post.likes}</span>
            </div>
          )}
          {showBookmark && (
            <button
              className={`flex items-center space-x-1 transition-colors ${
                bookmarkedPosts.has(post.id) || post.isBookmarked
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
              onClick={() => toggleBookmark(post.id)}
            >
              <BookmarkIcon
                size={16}
                fill={
                  bookmarkedPosts.has(post.id) || post.isBookmarked
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            {/* 左側: ロゴ */}
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
              <div className="w-7 h-7 sm:w-10 sm:h-10 mr-1.5 sm:mr-3 flex-shrink-0">
                <ThemeAwareLogo />
              </div>
              <span className="font-bold text-base sm:text-xl text-gray-900 dark:text-white truncate">CodeBook</span>
            </Link>

            {/* 右側: ボタン群 */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* 検索ボタン */}
              <Link
                href="/search"
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                aria-label="検索"
              >
                <SearchIcon />
              </Link>

              {/* テーマ切り替えボタン */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* プロフィール - PCのみ */}
              {isLoggedIn ? (
                <button className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <UserIcon size={20} />
                  <span className="text-sm font-medium">プロフィール</span>
                </button>
              ) : (
                <button
                  className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2"
                  onClick={() => setIsLoggedIn(true)}
                >
                  ログイン
                </button>
              )}

              {/* 投稿ボタン */}
              <Link
                href="/posts/create"
                className="bg-blue-600 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                投稿
              </Link>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.id;
              const colorClasses = {
                blue: isActive ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300',
                green: isActive ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300',
                purple: isActive ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-300',
                red: isActive ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300'
              };

              return (
                <button
                  key={tab.id}
                  className={`pb-3 sm:pb-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${colorClasses[tab.color as keyof typeof colorClasses]}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* フィルターバー */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                フィルター:
              </span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>


      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* トレンド・人気投稿セクション */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            トレンド・人気投稿
          </h2>

          {/* 投稿グリッド */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-auto min-h-[300px] lg:aspect-square animate-pulse w-full"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
              {trendingCodes.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* もっと見るボタン */}
          <div className="text-center mb-12">
            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
              もっと見る
            </button>
          </div>
        </div>

        {/* 新規投稿セクション */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">新規投稿</h2>

          {/* 新規投稿グリッド */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-auto min-h-[300px] lg:aspect-square animate-pulse w-full"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {newCodes.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* スクロール示唆 */}
          <div className="text-center mt-8 py-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              スクロールして続きを見る
            </div>
            <div className="text-2xl text-gray-400 dark:text-gray-500">↓ ↓</div>
          </div>
        </div>
      </main>

      {/* フッター（横並び） */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm">
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900 dark:text-white">About Us</span>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                会社概要
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                チーム
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900 dark:text-white">ガイド・Q&A</span>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                使い方
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                FAQ
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900 dark:text-white">各種リンク</span>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                API
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                GitHub
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900 dark:text-white">
                リーガル・ポリシー
              </span>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                利用規約
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                プライバシー
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>© 2024 CodeBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
