import { Post, User, Tag, PostsResponse, UsersResponse, TagsResponse } from '@/types';


// ========================================
// データ取得関数（現在はJSONファイルから、将来的にはHTTP APIから）
// ========================================

/**
 * 投稿一覧を取得
 */
export async function fetchPosts(): Promise<Post[]> {
  try {
    // 開発環境: JSONファイルから読み込み
    // 本番環境: fetch('/api/posts') に変更予定
    const response = await import('@/data/posts.json');
    const data = response.default as PostsResponse;
    return data.posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

/**
 * 特定の投稿を取得
 */
export async function fetchPostById(id: string): Promise<Post | undefined> {
  const posts = await fetchPosts();
  return posts.find(post => post.id === id);
}

/**
 * ユーザー一覧を取得
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await import('@/data/users.json');
    const data = response.default as UsersResponse;
    return data.users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

/**
 * 特定のユーザーを取得
 */
export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers();
  return users.find(user => user.id === id);
}

/**
 * タグ一覧を取得
 */
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await import('@/data/tags.json');
    const data = response.default as TagsResponse;
    return data.tags;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * 特定のタグを取得
 */
export async function fetchTagById(id: string): Promise<Tag | undefined> {
  const tags = await fetchTags();
  return tags.find(tag => tag.id === id);
}

/**
 * タグ名からタグ情報を取得
 */
export async function fetchTagByName(name: string): Promise<Tag | undefined> {
  const tags = await fetchTags();
  return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
}

// ========================================
// 検索・フィルタリング関数
// ========================================

/**
 * 投稿を検索
 */
export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await fetchPosts();
  const searchTerm = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * タグでフィルタリング
 */
export async function getPostsByTags(tagNames: string[]): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.filter(post =>
    tagNames.some(tagName =>
      post.tags.includes(tagName.toLowerCase())
    )
  );
}

/**
 * ユーザーの投稿を取得
 */
export async function getPostsByUser(userId: string): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.filter(post => post.authorId === userId);
}

/**
 * 人気投稿を取得（いいね数順）
 */
export async function getTrendingPosts(limit: number = 10): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

/**
 * 新着投稿を取得（作成日時順）
 */
export async function getLatestPosts(limit: number = 10): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}