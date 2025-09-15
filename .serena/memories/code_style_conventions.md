# コードスタイル・規約

## TypeScript設定
- **strictモード**: 有効（型安全を優先）
- **target**: ES2017
- **module**: esnext (bundler resolution)
- **JSX**: preserve
- **パスエイリアス**: `@/*` → `./src/*`

## Prettier設定
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## ESLint設定
- next/core-web-vitals
- next/typescript
- Flat Config形式使用

## VSCode設定
- 保存時自動フォーマット（Prettier）
- ESLint自動修正
- TypeScript相対パスインポート優先
- Emmet対応（TypeScript/TSX）

## 命名規約・パターン
### ファイル構造
- `src/app/` - App Router構造
- `page.tsx` - ページコンポーネント
- `layout.tsx` - レイアウトコンポーネント
- `globals.css` - グローバルスタイル

### コンポーネント
- PascalCase (例: `HomePage`, `SearchIcon`)
- 'use client' ディレクティブ使用（クライアントサイド）
- 関数コンポーネント + hooks pattern

### 型定義
- interfaceよりtype推奨の傾向
- Props型は明示的定義

## CLAUDE.mdで指定された制約
- **コメント**: 特別な指示がない限り追加しない
- **新規ファイル作成**: 必要最小限に留める
- **既存ファイル編集**: 新規作成より既存編集を優先