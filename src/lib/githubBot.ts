/**
 * GitHub自動インポートBotシステム
 * ライセンスフリーのオープンソースコードを自動収集してCodeBookに投稿
 */

export interface LicenseInfo {
  key: string; // mit, apache-2.0, bsd-3-clause等
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface SearchResult {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  license: LicenseInfo | null;
  topics: string[];
  default_branch: string;
}

/**
 * 許可するライセンス一覧（寛容なライセンスのみ）
 */
const ALLOWED_LICENSES = [
  'mit',
  'apache-2.0',
  'bsd-2-clause',
  'bsd-3-clause',
  'isc',
  'cc0-1.0',
  'unlicense',
] as const;

/**
 * 対象となる言語リスト
 */
const TARGET_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
] as const;

/**
 * GitHubで寛容なライセンスのリポジトリを検索
 */
export async function searchOpenSourceRepos(
  language: string,
  minStars: number = 100,
  maxResults: number = 10
): Promise<SearchResult[]> {
  // ライセンス条件を追加したクエリ
  const licenseQuery = ALLOWED_LICENSES.map(l => `license:${l}`).join(' ');
  const query = `${licenseQuery} language:${language} stars:>=${minStars} fork:false sort:stars`;

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${maxResults}&sort=stars&order=desc`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // Note: 認証トークンがあればレート制限が緩和される
      // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API エラー: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * リポジトリからサンプルファイルを取得
 */
export async function fetchSampleFiles(
  owner: string,
  repo: string,
  branch: string = 'main',
  maxFiles: number = 3
): Promise<Array<{ path: string; content: string; language: string; filename: string }>> {
  // リポジトリのファイルツリーを取得
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  const treeResponse = await fetch(treeUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!treeResponse.ok) {
    throw new Error('ファイルツリーの取得に失敗しました');
  }

  const treeData = await treeResponse.json();

  interface TreeItem {
    type: string;
    path: string;
    size: number;
    url: string;
  }

  // コードファイルを抽出（src/, lib/, などから優先的に）
  const codeFiles = (treeData.tree as TreeItem[])
    .filter((item: TreeItem) =>
      item.type === 'blob' &&
      (item.path.match(/\.(ts|js|py|go|rs|java)$/) &&
        (item.path.startsWith('src/') ||
          item.path.startsWith('lib/') ||
          item.path.startsWith('examples/') ||
          !item.path.includes('test') &&
          !item.path.includes('spec') &&
          !item.path.includes('node_modules') &&
          item.size < 50000)) // 50KB以下
    )
    .slice(0, maxFiles);

  // ファイル内容を取得
  const files = await Promise.all(
    codeFiles.map(async (file: TreeItem) => {
      const contentResponse = await fetch(file.url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!contentResponse.ok) {
        return null;
      }

      const contentData = await contentResponse.json();
      const content = atob(contentData.content.replace(/\n/g, ''));
      const filename = file.path.split('/').pop() || '';
      const ext = filename.split('.').pop() || '';

      return {
        path: file.path,
        content,
        language: getLanguageFromExtension(ext),
        filename,
      };
    })
  );

  return files.filter(f => f !== null) as Array<{ path: string; content: string; language: string; filename: string }>;
}

/**
 * 拡張子から言語を推測
 */
function getLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
  };
  return map[ext.toLowerCase()] || ext;
}

/**
 * 自動投稿データを生成
 */
export interface AutoPostData {
  title: string;
  description: string;
  content: string;
  sourceCode: {
    filename: string;
    language: string;
    code: string;
  };
  tags: string[];
  githubUrl: string;
  license: string;
  authorId: string; // bot用の特別なID
}

export async function generateAutoPost(repo: SearchResult): Promise<AutoPostData[]> {
  const [owner, repoName] = repo.full_name.split('/');

  try {
    const files = await fetchSampleFiles(owner, repoName, repo.default_branch);

    return files.map(file => ({
      title: `${repo.name} - ${file.filename}`,
      description: repo.description || `${repo.name}からの優れたコード例`,
      content: `# ${repo.name}

## 概要
${repo.description || 'GitHubで公開されているオープンソースプロジェクトです。'}

## リポジトリ情報
- ⭐ Stars: ${repo.stargazers_count.toLocaleString()}
- 🍴 Forks: ${repo.forks_count.toLocaleString()}
- 📝 License: ${repo.license?.name || 'Unknown'}
- 🔗 GitHub: [${repo.full_name}](${repo.html_url})

## ファイル
\`${file.path}\`

このコードは${repo.license?.name}ライセンスの下で公開されています。

---
*このコードはGitHubから自動的にインポートされました*`,
      sourceCode: {
        filename: file.filename,
        language: file.language,
        code: file.content,
      },
      tags: [
        repo.language?.toLowerCase() || 'other',
        ...(repo.topics || []).slice(0, 3),
        'github',
        'opensource',
      ].filter(Boolean),
      githubUrl: `${repo.html_url}/blob/${repo.default_branch}/${file.path}`,
      license: repo.license?.spdx_id || 'Unknown',
      authorId: 'bot-github-importer', // Bot用の特別なID
    }));
  } catch (error) {
    console.error(`Failed to generate post for ${repo.full_name}:`, error);
    return [];
  }
}

/**
 * Bot実行（メイン処理）
 */
export async function runGitHubImportBot(options: {
  languages?: string[];
  minStars?: number;
  maxReposPerLanguage?: number;
  maxFilesPerRepo?: number;
}): Promise<AutoPostData[]> {
  const {
    languages = TARGET_LANGUAGES,
    minStars = 500,
    maxReposPerLanguage = 5,
    maxFilesPerRepo = 2,
  } = options;

  const allPosts: AutoPostData[] = [];

  for (const language of languages) {
    try {
      console.log(`Searching for ${language} repositories...`);

      const repos = await searchOpenSourceRepos(language, minStars, maxReposPerLanguage);

      console.log(`Found ${repos.length} repositories for ${language}`);

      for (const repo of repos) {
        const posts = await generateAutoPost(repo);
        allPosts.push(...posts.slice(0, maxFilesPerRepo));

        // API制限を考慮して遅延
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error processing ${language}:`, error);
    }
  }

  return allPosts;
}

/**
 * Bot実行スクリプト（手動実行用）
 *
 * 使用方法:
 * ```bash
 * node scripts/run-github-bot.js
 * ```
 */
export async function manualRunBot() {
  console.log('Starting GitHub Import Bot...');

  const posts = await runGitHubImportBot({
    languages: ['TypeScript', 'Python'],
    minStars: 1000,
    maxReposPerLanguage: 3,
    maxFilesPerRepo: 1,
  });

  console.log(`Generated ${posts.length} posts`);
  console.log(JSON.stringify(posts, null, 2));

  return posts;
}
