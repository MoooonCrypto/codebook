# GitHub自動インポートBot

## 概要

GitHubから寛容なライセンス（MIT、Apache 2.0等）のオープンソースコードを自動的に検索・取得し、CodeBookに投稿するシステムです。

## 機能

- **ライセンスフィルタリング**: MIT、Apache 2.0、BSD等の寛容なライセンスのみ対象
- **品質フィルタリング**: スター数、フォーク数でフィルタ
- **自動タグ付け**: 言語、トピックから自動的にタグを生成
- **ライセンス表記**: 投稿に元のライセンス情報を自動付与
- **GitHub リンク**: 元のリポジトリへのリンクを自動追加

## 法的対応

### 許可されるライセンス

```typescript
const ALLOWED_LICENSES = [
  'mit',           // MIT License
  'apache-2.0',    // Apache License 2.0
  'bsd-2-clause',  // BSD 2-Clause License
  'bsd-3-clause',  // BSD 3-Clause License
  'isc',           // ISC License
  'cc0-1.0',       // CC0 1.0 Universal
  'unlicense',     // The Unlicense
];
```

### 必須の表記事項

各投稿には以下が自動的に含まれます：

1. **ライセンス名**: 元のライセンス情報
2. **GitHubリンク**: 元のリポジトリURL
3. **著作権表示**: ライセンスが要求する場合
4. **自動インポート表記**: "このコードはGitHubから自動的にインポートされました"

## 使用方法

### 手動実行

#### 方法1: Node.jsスクリプトとして実行

```bash
# プロジェクトルートで実行
node -e "import('./src/lib/githubBot.js').then(m => m.manualRunBot())"
```

#### 方法2: 管理者UIから実行（今後実装予定）

管理者用ページ `/admin/github-bot` から実行可能にする予定。

### 定期実行（本番環境）

#### Vercel Cron Jobs

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/github-bot",
      "schedule": "0 0 * * *"  // 毎日深夜0時
    }
  ]
}
```

#### APIルート作成

```typescript
// src/app/api/cron/github-bot/route.ts
import { runGitHubImportBot } from '@/lib/githubBot';
import { createPost } from '@/lib/api';

export async function GET(request: Request) {
  // 認証チェック（Vercelのcron secretなど）
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const posts = await runGitHubImportBot({
      languages: ['TypeScript', 'Python', 'Go'],
      minStars: 1000,
      maxReposPerLanguage: 5,
      maxFilesPerRepo: 2,
    });

    // データベースに保存
    for (const post of posts) {
      await createPost(post);
    }

    return Response.json({
      success: true,
      count: posts.length,
    });
  } catch (error) {
    console.error('Bot execution failed:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

## 設定オプション

```typescript
runGitHubImportBot({
  languages: ['TypeScript', 'Python'], // 対象言語
  minStars: 500,                       // 最小スター数
  maxReposPerLanguage: 5,              // 言語ごとの最大リポジトリ数
  maxFilesPerRepo: 2,                  // リポジトリごとの最大ファイル数
});
```

## API制限

- **未認証**: 60リクエスト/時間
- **認証済み**: 5000リクエスト/時間

環境変数 `GITHUB_TOKEN` を設定することで認証済みAPIを使用できます。

```bash
# .env.local
GITHUB_TOKEN=ghp_your_personal_access_token
```

## 削除依頼への対応

著作者からの削除依頼があった場合の対応フロー：

1. **削除依頼フォーム**: `/contact/dmca` ページを作成
2. **24時間以内に対応**: 投稿を非公開化
3. **検証後削除**: 正当な依頼であれば完全削除

## 注意事項

- GPL系ライセンスは対象外（派生物もGPL化が必要なため）
- プライベートリポジトリは対象外
- テストファイル、設定ファイルは除外
- ファイルサイズ50KB以下に制限

## トラブルシューティング

### API制限エラー

```
Error: API rate limit exceeded
```

→ `GITHUB_TOKEN` を設定してください

### ライセンス情報なし

```
Warning: No license found for repository
```

→ 該当リポジトリはスキップされます

## 今後の改善案

- [ ] 重複チェック（既に投稿済みのコードを除外）
- [ ] 品質スコア算出（スター数、フォーク数、最終更新日などから）
- [ ] 言語ごとの投稿バランス調整
- [ ] ユーザーレビュー機能（自動投稿の評価）
- [ ] 削除依頼の自動処理フロー
