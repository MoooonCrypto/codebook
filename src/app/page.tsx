'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CodePost } from '@/types';
import { getTrendingPosts, getLatestPosts, searchPosts } from '@/lib/api';
import { convertToCodePosts } from '@/lib/utils';
import { ThemeToggle } from './components/ThemeToggle';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
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
      } else {
        const searchResults = await searchPosts(searchQuery);
        const searchCodePosts = await convertToCodePosts(searchResults);
        setTrendingCodes(searchCodePosts.slice(0, 6));
        setNewCodes(searchCodePosts.slice(6, 12));
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow duration-200 aspect-square flex flex-col cursor-pointer"
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
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左側: アイコンロゴ */}
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3">
                {/* 任意の正方形画像を設置可能 */}
                <Image
                  src="/logo.png" // public/logo.png に任意の正方形画像を配置
                  alt="CodeBook Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded"
                  unoptimized
                  onError={(e) => {
                    // 画像が見つからない場合はデフォルトのSVGアイコンを表示
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* フォールバック用SVGアイコン */}
                <svg viewBox="0 0 100 100" className="w-full h-full hidden">
                  <defs>
                    <style>
                      {`.st0{fill:#000000;} .st1{fill:#FFFFFF;} .st2{fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}`}
                    </style>
                  </defs>
                  <path
                    className="st0"
                    d="M20,15h50c8.3,0,15,6.7,15,15v40c0,8.3-6.7,15-15,15H30c-8.3,0-15-6.7-15-15V15z"
                  />
                  <rect
                    className="st1"
                    x="25"
                    y="20"
                    width="50"
                    height="45"
                    rx="5"
                    ry="5"
                  />
                  <polyline className="st2" points="35,35 40,40 35,45" />
                  <polyline className="st2" points="55,35 50,40 55,45" />
                  <line className="st2" x1="45" y1="30" x2="42" y2="50" />
                  <rect
                    className="st0"
                    x="80"
                    y="20"
                    width="10"
                    height="60"
                    rx="5"
                    ry="5"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">CodeBook</span>
            </div>

            {/* 右側: ArtCodeメニュー・検索・プロフィール・投稿ボタン */}
            <div className="flex items-center space-x-4">
              {/* ArtCodeメニューボタン */}
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span className="font-medium text-sm">ArtCode</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* 検索フォーム */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="キーワード検索..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* テーマ切り替えボタン */}
              <ThemeToggle />

              {/* プロフィール */}
              {isLoggedIn ? (
                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <UserIcon size={20} />
                  <span className="text-sm font-medium">プロフィール</span>
                </button>
              ) : (
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                  onClick={() => setIsLoggedIn(true)}
                >
                  ログイン
                </button>
              )}

              {/* 投稿ボタン */}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={() => alert('投稿機能は開発中です')}
              >
                + 投稿
              </button>
            </div>
          </div>

          {/* タブナビゲーション（カラータブ） */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
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
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${colorClasses[tab.color as keyof typeof colorClasses]}`}
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

      {/* 検索結果表示 */}
      {searchQuery && !loading && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              「{searchQuery}」の検索結果: {trendingCodes.length + newCodes.length}件
            </p>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* トレンド・人気投稿セクション */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            トレンド・人気投稿
          </h2>

          {/* 投稿グリッド（正方形、横に3つ、モバイルで2つ） */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
