import { Post } from '@/types';
import { isPostMatchingLanguage } from './languageUtils';

// 検索の重み設定
const SEARCH_WEIGHTS = {
  title: 3,      // タイトルの重み（最重要）
  description: 2, // 概要の重み
  tags: 3,       // タグの重み（最重要）
  content: 1     // 本文の重み（最軽量）
};

// ソート順の定義
export type SortOption = 'newest' | 'oldest' | 'popular' | 'views';

// 検索フィルター設定
export interface SearchFilters {
  query?: string;
  tags?: string[];
  language?: string;
  sortBy?: SortOption;
}

/**
 * テキストから検索キーワードにマッチするスコアを計算
 */
function calculateTextScore(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;

  const lowerText = text.toLowerCase();
  let score = 0;

  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();

    // 完全一致
    if (lowerText === lowerKeyword) {
      score += 10;
    }
    // 単語の開始位置でマッチ
    else if (lowerText.startsWith(lowerKeyword)) {
      score += 5;
    }
    // 部分一致
    else if (lowerText.includes(lowerKeyword)) {
      score += 1;
    }
  });

  return score;
}

/**
 * 投稿が検索キーワードにマッチするかスコアを計算
 */
function calculatePostScore(post: Post, keywords: string[]): number {
  if (keywords.length === 0) return 1; // キーワードがない場合は全てマッチ

  let totalScore = 0;

  // タイトルでの検索
  totalScore += calculateTextScore(post.title, keywords) * SEARCH_WEIGHTS.title;

  // 説明文での検索
  totalScore += calculateTextScore(post.description, keywords) * SEARCH_WEIGHTS.description;

  // 本文での検索
  totalScore += calculateTextScore(post.content, keywords) * SEARCH_WEIGHTS.content;

  // タグでの検索
  const tagsText = post.tags.join(' ');
  totalScore += calculateTextScore(tagsText, keywords) * SEARCH_WEIGHTS.tags;

  return totalScore;
}

/**
 * キーワード文字列を単語配列に分割
 */
function parseKeywords(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(keyword => keyword.length > 0);
}

/**
 * 投稿をソートする
 */
function sortPosts(posts: Post[], sortBy: SortOption): Post[] {
  const sorted = [...posts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    case 'popular':
      return sorted.sort((a, b) => b.likes - a.likes);

    case 'views':
      return sorted.sort((a, b) => b.views - a.views);

    default:
      return sorted;
  }
}

/**
 * 投稿を検索・フィルタリングする
 */
export function searchPosts(posts: Post[], filters: SearchFilters): Post[] {
  let filteredPosts = posts;

  // キーワード検索
  if (filters.query) {
    const keywords = parseKeywords(filters.query);
    const scoredPosts = posts
      .map(post => ({
        post,
        score: calculatePostScore(post, keywords)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.post);

    filteredPosts = scoredPosts;
  }

  // タグフィルター
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post =>
      filters.tags!.some(tag => post.tags.includes(tag))
    );
  }

  // 言語フィルター（新しいロジック）
  if (filters.language) {
    filteredPosts = filteredPosts.filter(post =>
      isPostMatchingLanguage(post, filters.language!)
    );
  }

  // ソート（キーワード検索がない場合のみ）
  if (!filters.query && filters.sortBy) {
    filteredPosts = sortPosts(filteredPosts, filters.sortBy);
  }

  return filteredPosts;
}

/**
 * 全投稿からタグの使用回数を集計
 */
export function getTagUsageStats(posts: Post[]): Record<string, number> {
  const tagStats: Record<string, number> = {};

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagStats[tag] = (tagStats[tag] || 0) + 1;
    });
  });

  return tagStats;
}

/**
 * タグ候補を検索（部分一致）
 */
export function searchTagSuggestions(
  posts: Post[],
  query: string,
  limit: number = 10
): Array<{ tag: string; count: number }> {
  if (!query.trim()) return [];

  const tagStats = getTagUsageStats(posts);
  const lowerQuery = query.toLowerCase();

  return Object.entries(tagStats)
    .filter(([tag]) => tag.toLowerCase().includes(lowerQuery))
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count) // 使用回数順
    .slice(0, limit);
}

