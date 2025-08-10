'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

// 型定義
interface Author {
  name: string;
  avatar: string;
}

interface CodePost {
  id: string;
  title: string;
  author: Author;
  tags: string[];
  likes: number;
  isBookmarked: boolean;
  codePreview: string;
  createdAt: string;
}

// ダミーデータ
const trendingCodes: CodePost[] = [
  {
    id: '1',
    title: 'React カスタムフック useLocalStorage',
    author: {
      name: 'yamada_taro',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['React', 'TypeScript', 'hooks'],
    likes: 42,
    isBookmarked: false,
    codePreview: `const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};`,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Python 非同期処理でAPI呼び出し最適化',
    author: {
      name: 'python_master',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b5a1?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['Python', 'asyncio', 'API'],
    likes: 89,
    isBookmarked: true,
    codePreview: `import asyncio
import aiohttp

async def fetch_data(session, url):
    async with session.get(url) as response:
        return await response.json()

async def main():
    urls = ['http://api1.com', 'http://api2.com']
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    return results`,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'CSS Grid レスポンシブレイアウト',
    author: {
      name: 'css_wizard',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['CSS', 'Grid', 'Responsive'],
    likes: 67,
    isBookmarked: false,
    codePreview: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`,
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: 'Node.js Express ミドルウェア設計',
    author: {
      name: 'node_expert',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['Node.js', 'Express'],
    likes: 73,
    isBookmarked: false,
    codePreview: `const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: 'TypeScript 型安全なAPI クライアント',
    author: {
      name: 'ts_developer',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['TypeScript', 'API'],
    likes: 91,
    isBookmarked: true,
    codePreview: `interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }
}`,
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    title: 'JavaScript モジュール設計パターン',
    author: {
      name: 'js_creator',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b5a1?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['JavaScript', 'Module'],
    likes: 56,
    isBookmarked: false,
    codePreview: `// Counter module with closure
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    get value() {
      return count;
    },
    get doubled() {
      return count * 2;
    },
    increment() {
      count++;
    },
    decrement() {
      count--;
    }
  };
}

const counter = createCounter(5);`,
    createdAt: '2024-01-10',
  },
];

const newCodes: CodePost[] = [
  {
    id: '7',
    title: 'JavaScript ストア管理パターン',
    author: {
      name: 'js_store_fan',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['JavaScript', 'Store', 'Pattern'],
    likes: 34,
    isBookmarked: false,
    codePreview: `// Simple store implementation
function createStore(initialValue) {
  let value = initialValue;
  const subscribers = new Set();
  
  return {
    get value() { return value; },
    set(newValue) {
      value = newValue;
      subscribers.forEach(fn => fn(value));
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    update(fn) {
      this.set(fn(value));
    }
  };
}

const count = createStore(0);`,
    createdAt: '2024-01-16',
  },
  {
    id: '8',
    title: 'Go 並行処理ワーカープール',
    author: {
      name: 'go_master',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['Go', 'Concurrency'],
    likes: 67,
    isBookmarked: false,
    codePreview: `package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
}`,
    createdAt: '2024-01-16',
  },
  {
    id: '9',
    title: 'Rust 所有権システム活用法',
    author: {
      name: 'rust_expert',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    tags: ['Rust', 'Ownership'],
    likes: 89,
    isBookmarked: true,
    codePreview: `struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Self {
        Person { name, age }
    }
    
    fn greet(&self) -> String {
        format!("Hello, my name is {} and I'm {} years old", 
                self.name, self.age)
    }
    
    fn have_birthday(&mut self) {
        self.age += 1;
    }
}`,
    createdAt: '2024-01-16',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ホーム');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('すべて');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set<string>());

  const tabItems = [
    { id: 'ホーム', label: 'ホーム' },
    { id: 'カテゴリー', label: 'カテゴリー' },
    { id: 'ブックマーク', label: 'ブックマーク' },
    { id: 'ランキング', label: 'ランキング' },
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 aspect-square flex flex-col">
      {/* 投稿者アイコン */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full mr-3"
            unoptimized
          />
          <span className="text-sm font-medium text-gray-900">
            {post.author.name}
          </span>
        </div>
      </div>

      {/* 投稿タイトル */}
      <div className="px-4 py-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
          {post.title}
        </h3>
      </div>

      {/* ソースコードプレビュー */}
      <div className="flex-1 px-4 pb-2">
        <div className="bg-gray-900 rounded-lg p-3 h-full overflow-hidden">
          <pre className="text-xs text-gray-300 font-mono leading-tight overflow-hidden">
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
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              <TagIcon size={8} />
              <span className="ml-1">{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* いいね数・ブックマークボタン */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {showLikes && (
            <div className="flex items-center space-x-1 text-gray-500">
              <HeartIcon size={16} />
              <span className="text-sm font-medium">{post.likes}</span>
            </div>
          )}
          {showBookmark && (
            <button
              className={`flex items-center space-x-1 transition-colors ${
                bookmarkedPosts.has(post.id) || post.isBookmarked
                  ? 'text-gray-700'
                  : 'text-gray-400 hover:text-gray-600'
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
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左側: アイコンロゴ */}
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
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
              <span className="font-bold text-xl text-gray-900">CodeBook</span>
            </div>

            {/* 右側: 検索・プロフィール・投稿ボタン */}
            <div className="flex items-center space-x-4">
              {/* 検索フォーム */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="キーワード検索..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* プロフィール */}
              {isLoggedIn ? (
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <UserIcon size={20} />
                  <span className="text-sm font-medium">プロフィール</span>
                </button>
              ) : (
                <button
                  className="text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setIsLoggedIn(true)}
                >
                  ログイン
                </button>
              )}

              {/* 投稿ボタン */}
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                投稿
              </button>
            </div>
          </div>

          {/* タブナビゲーション（横並び） */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-800 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* フィルターバー */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                フィルター:
              </span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
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
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            トレンド・人気投稿
          </h2>

          {/* 投稿グリッド（正方形、横に3つ、モバイルで2つ） */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {trendingCodes.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* もっと見るボタン */}
          <div className="text-center mb-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              もっと見る
            </button>
          </div>
        </div>

        {/* 新規投稿セクション */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">新規投稿</h2>

          {/* 新規投稿グリッド */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {newCodes.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* スクロール示唆 */}
          <div className="text-center mt-8 py-4">
            <div className="text-sm text-gray-500 mb-2">
              スクロールして続きを見る
            </div>
            <div className="text-2xl text-gray-400">↓ ↓</div>
          </div>
        </div>
      </main>

      {/* フッター（横並び） */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm">
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900">About Us</span>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                会社概要
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                チーム
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900">ガイド・Q&A</span>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                使い方
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                FAQ
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900">各種リンク</span>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                API
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                GitHub
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold text-gray-900">
                リーガル・ポリシー
              </span>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                利用規約
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                プライバシー
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-xs text-gray-500">
            <p>© 2024 CodeBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
