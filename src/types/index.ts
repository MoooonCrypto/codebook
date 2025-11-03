// ========================================
// 新しいデータ構造の型定義
// ========================================

// ユーザー情報
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    posts: number;
    likes: number;
    followers: number;
    following: number;
  };
  badges: string[];
  joinedAt: string;
  lastActiveAt: string;
}

// ソースコード情報
export interface SourceCode {
  filename: string;
  language: string;
  code: string;
  fileExtension?: string; // .js, .py, .tsx など
  detectedLanguage?: string; // ファイル拡張子から自動検出された言語
}

// 投稿情報
export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  sourceCode: SourceCode;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// タグ情報
export interface Tag {
  id: string;
  name: string;
  description: string;
  category: 'language' | 'framework' | 'concept' | 'tool' | 'domain' | 'database';
  color: string;
  usageCount: number;
  createdAt: string;
}

// ========================================
// APIレスポンス用の型定義
// ========================================

export interface PostsResponse {
  posts: Post[];
}

export interface UsersResponse {
  users: User[];
}

export interface TagsResponse {
  tags: Tag[];
}

// ========================================
// 従来の型定義（後方互換性のため残す）
// ========================================

export interface Author {
  name: string;
  avatar: string;
}

export interface CodePost {
  id: string;
  title: string;
  author: Author;
  tags: string[];
  likes: number;
  isBookmarked: boolean;
  codePreview: string;
  createdAt: string;
}

// ========================================
// 拡張されたCodePost（新旧の橋渡し用）
// ========================================

export interface EnhancedCodePost extends CodePost {
  description: string;
  content: string;
  authorId: string;
  views: number;
  comments: number;
  isPublished: boolean;
  updatedAt: string;
  sourceCode?: SourceCode;
}

// ========================================
// ユーティリティ型
// ========================================

// 投稿作成用の型（IDや作成日時、統計情報、author情報は除外）
export type CreatePost = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'comments' | 'author'>;

// ユーザー更新用の型（統計情報や日時は除外）
export type UpdateUser = Omit<User, 'id' | 'stats' | 'joinedAt' | 'lastActiveAt'>;

// 検索用の型
export interface SearchParams {
  query?: string;
  tags?: string[];
  authorId?: string;
  language?: string;
  category?: string;
}

// フィルター用の型
export interface FilterOptions {
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  language?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}