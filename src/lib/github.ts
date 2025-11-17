/**
 * GitHub API ユーティリティ
 */

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  default_branch: string;
}

/**
 * GitHub リポジトリURLからファイルを取得
 * 例: https://github.com/user/repo/blob/main/src/App.tsx
 */
export async function fetchGitHubFile(url: string): Promise<{ content: string; filename: string; language: string }> {
  // URLからオーナー、リポジトリ、ブランチ、パスを抽出
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);

  if (!match) {
    throw new Error('無効なGitHub URLです');
  }

  const [, owner, repo, branch, filePath] = match;

  // GitHub API経由でファイル内容を取得
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub APIエラー: ${response.statusText}`);
  }

  const data: GitHubFile = await response.json();

  if (data.type !== 'file' || !data.content) {
    throw new Error('ファイルが見つかりません');
  }

  // Base64デコード
  const content = atob(data.content.replace(/\n/g, ''));

  // ファイル名と拡張子から言語を推測
  const filename = data.name;
  const extension = filename.split('.').pop() || '';
  const language = getLanguageFromExtension(extension);

  return { content, filename, language };
}

/**
 * ユーザーのリポジトリ一覧を取得（OAuth必要）
 */
export async function fetchUserRepos(accessToken: string): Promise<GitHubRepo[]> {
  const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('リポジトリの取得に失敗しました');
  }

  return response.json();
}

/**
 * リポジトリのファイルツリーを取得
 */
export async function fetchRepoContents(
  owner: string,
  repo: string,
  path: string = '',
  accessToken?: string
): Promise<GitHubFile[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('ファイル一覧の取得に失敗しました');
  }

  return response.json();
}

/**
 * 拡張子から言語を推測
 */
function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'kt': 'kotlin',
    'swift': 'swift',
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'vue': 'vue',
    'svelte': 'svelte',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
  };

  return languageMap[ext.toLowerCase()] || ext;
}

/**
 * GitHub GistのURLからコードを取得
 */
export async function fetchGist(gistId: string): Promise<{ content: string; filename: string; language: string }> {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Gistの取得に失敗しました');
  }

  const data = await response.json();
  const files = Object.values(data.files) as Array<{ filename: string; content: string; language: string }>;

  if (files.length === 0) {
    throw new Error('Gistにファイルがありません');
  }

  // 最初のファイルを返す
  const file = files[0];
  const extension = file.filename.split('.').pop() || '';

  return {
    content: file.content,
    filename: file.filename,
    language: file.language?.toLowerCase() || getLanguageFromExtension(extension),
  };
}
