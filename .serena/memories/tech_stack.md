# Tech Stack

## フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **ライブラリ**: React 19
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS v4 + PostCSS
- **フォント**: Geist Sans, Geist Mono
- **UI コンポーネント**: 
  - @headlessui/react (ヘッドレスUI)
  - @heroicons/react (アイコン)
  - lucide-react (アイコン)

## バックエンド・データベース
- **認証**: NextAuth.js v4 + @auth/prisma-adapter
- **ORM**: Prisma v6
- **データベース**: @prisma/client

## 開発ツール
- **コードエディター**: Monaco Editor (@monaco-editor/react)
- **シンタックスハイライト**: Prism.js
- **フォーム**: React Hook Form + Zod (バリデーション)
- **CSS**: clsx + tailwind-merge (条件付きスタイリング)

## 開発環境
- **Node.js**: TypeScript v5
- **リンター**: ESLint v9 (next/core-web-vitals, next/typescript)
- **フォーマッター**: Prettier
- **エディター設定**: VSCode (保存時自動フォーマット、ESLint自動修正)

## デプロイメント
- **予定**: Vercel (CLAUDE.mdに記載)
- **CI/CD**: GitHub連携