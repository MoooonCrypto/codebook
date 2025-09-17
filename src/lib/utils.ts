import { Post, User, CodePost, Author } from '@/types';
import { fetchUserById, fetchTagByName } from './api';

// ========================================
// データ変換ユーティリティ
// ========================================

/**
 * Post と User から CodePost に変換（既存UIとの互換性のため）
 */
export async function convertToCodePost(post: Post, user?: User): Promise<CodePost> {
  // ユーザー情報が提供されていない場合は取得
  const author = user || await fetchUserById(post.authorId);

  return {
    id: post.id,
    title: post.title,
    author: author ? convertToAuthor(author) : { name: 'Unknown', avatar: '' },
    tags: post.tags,
    likes: post.likes,
    isBookmarked: false, // 実際のブックマーク状態は別途管理
    codePreview: post.sourceCode.code,
    createdAt: post.createdAt,
  };
}

/**
 * User から Author に変換
 */
export function convertToAuthor(user: User): Author {
  return {
    name: user.username,
    avatar: user.avatar,
  };
}

/**
 * 複数の Post を CodePost の配列に変換
 */
export async function convertToCodePosts(posts: Post[]): Promise<CodePost[]> {
  const codePosts: CodePost[] = [];

  for (const post of posts) {
    const codePost = await convertToCodePost(post);
    codePosts.push(codePost);
  }

  return codePosts;
}

// ========================================
// タグ関連ユーティリティ
// ========================================

/**
 * タグ名から色を取得
 */
export async function getTagColor(tagName: string): Promise<string> {
  const tag = await fetchTagByName(tagName);
  return tag?.color || 'gray';
}

/**
 * タグ名の配列から色の配列を取得
 */
export async function getTagColors(tagNames: string[]): Promise<Record<string, string>> {
  const colors: Record<string, string> = {};

  for (const tagName of tagNames) {
    colors[tagName] = await getTagColor(tagName);
  }

  return colors;
}

// ========================================
// 日時フォーマット
// ========================================

/**
 * ISO文字列を日本語形式にフォーマット
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * ISO文字列を相対時間にフォーマット（例: 3日前、1週間前）
 */
export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}日前`;
  } else if (diffHours > 0) {
    return `${diffHours}時間前`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分前`;
  } else {
    return 'たった今';
  }
}

// ========================================
// 文字列処理
// ========================================

/**
 * コードプレビューの行数を制限
 */
export function truncateCode(code: string, maxLines: number = 8): string {
  const lines = code.split('\n');
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + '\n...';
  }
  return code;
}

/**
 * 文字列を指定文字数で切り捨て
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// ========================================
// バリデーション
// ========================================

/**
 * 投稿データの基本バリデーション
 */
export function validatePost(post: Partial<Post>): string[] {
  const errors: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    errors.push('タイトルは必須です');
  }

  if (!post.description || post.description.trim().length === 0) {
    errors.push('説明は必須です');
  }

  if (!post.sourceCode?.code || post.sourceCode.code.trim().length === 0) {
    errors.push('ソースコードは必須です');
  }

  if (!post.tags || post.tags.length === 0) {
    errors.push('少なくとも1つのタグが必要です');
  }

  return errors;
}

// ========================================
// ソート関数
// ========================================

export const sortFunctions = {
  newest: (a: Post, b: Post) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),

  oldest: (a: Post, b: Post) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),

  popular: (a: Post, b: Post) => b.likes - a.likes,

  trending: (a: Post, b: Post) => {
    // 簡単なトレンドスコア計算（いいね数 + 閲覧数の重み付け）
    const scoreA = a.likes * 2 + a.views * 0.1;
    const scoreB = b.likes * 2 + b.views * 0.1;
    return scoreB - scoreA;
  },
};