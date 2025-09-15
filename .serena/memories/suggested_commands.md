# 推奨コマンド一覧

## 開発コマンド

### 基本開発フロー
```bash
# 開発サーバー起動（手動実行）
npm run dev

# 本番ビルド
npm run build

# 本番起動（ローカル確認用）
npm run start
```

### コード品質管理
```bash
# ESLint実行
npm run lint

# 型チェック（必要に応じて）
npm run tsc  # または npx tsc --noEmit

# Prettier（VSCodeで自動実行されるが、手動でも可能）
npx prettier --write .
```

### 依存関係管理
```bash
# lockfileに従って環境を完全再現
npm ci

# パッケージ一覧確認
npm ls

# 新しい依存関係追加（要ユーザー確認）
npm install <package-name>
```

### Git操作（手動のみ）
- git操作はすべて手動で実行
- 自動commit/pushは禁止

### システムコマンド（Darwin/macOS）
```bash
# ファイル・ディレクトリ操作
ls -la          # ファイル一覧
find . -name    # ファイル検索
mkdir           # ディレクトリ作成
touch           # ファイル作成
cat             # ファイル内容表示
echo            # テキスト出力

# 検索
grep -r         # テキスト検索（ただしrg推奨）
rg              # ripgrep（高速検索）
```

## 禁止コマンド
- `sudo` - 管理者権限
- `pkill` - プロセス強制終了
- `rm -rf` - 強制削除
- 自動git操作（commit, push等）

## ファイルアクセス制限
### 読み込み禁止
- `.env` - 環境変数ファイル
- `id_rsa`, `id_ed25519` - SSH秘密鍵
- `**/*token*`, `**/*key*` - トークン・キーファイル

### 書き込み禁止
- `.env` - 環境変数ファイル
- `**/secrets/**` - シークレットディレクトリ