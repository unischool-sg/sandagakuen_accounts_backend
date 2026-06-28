# 三田学園高等学校 統合認証基盤

Cloudflare Workers 上で動作する中高一貫校向け統合認証基盤のバックエンドAPIです。
生徒・教員・職員・管理者の統一的なアカウント管理、OAuth2.0認証、外部ID連携を提供します。

## 技術スタック

| カテゴリ | 技術 | バージョン |
|----------|------|------------|
| ランタイム | Cloudflare Workers | — |
| Webフレームワーク | Hono | ^4.12.27 |
| データベース | Cloudflare D1 (SQLite) | — |
| ORM | Drizzle ORM | ^1.0.0-beta.22 |
| スキーマ検証 | Zod | ^4.4.3 |
| OAuth認証 | Google OAuth (`google-oauth-lib`) | ^1.0.6 |
| JWT | jose | ^6.2.3 |
| 言語 | TypeScript | ESNext, strict |
| デプロイ | Wrangler | ^4.105.0 |

## アーキテクチャ

### レイヤー構造

```
src/
├── index.ts                  # エントリーポイント
├── types/                    # 型定義
│   ├── api.ts                # APIレスポンス型 (APIResponse<ST, ET>)
│   └── env.ts                # 環境変数/バインディング型
├── libs/                     # 共通ユーティリティ
│   ├── crypto.ts             # UUID生成
│   └── response.ts           # レスポンスヘルパー (success / failure)
├── middlewares/
│   └── root.ts               # グローバルミドルウェア (DB / OAuth Client の注入)
├── db/
│   └── scheme.ts             # データベーススキーマ (全11テーブル)
└── features/                 # 機能モジュール
    └── oauth/
        ├── index.ts          # OAuthルーター（/oauth/*）
        └── callback/
            ├── index.ts      # ルートハンドラー (GET /oauth/callback)
            ├── scheme.ts     # Zodバリデーションスキーマ
            ├── service.ts    # ビジネスロジック
            └── repository.ts # DBアクセス層
```

### レイヤーパターン

各機能は **Route → Service → Repository** の3層で構成されます。

| レイヤー | 役割 | ファイル |
|----------|------|----------|
| **Route** | リクエスト/レスポンスの取り扱い、Zodバリデーション | `features/*/index.ts` |
| **Service** | ビジネスロジック、外部API呼び出し | `features/*/service.ts` |
| **Repository** | Drizzle ORM を介したDB操作 | `features/*/repository.ts` |

Service は `[APIResponse, HTTPステータスコード]` のタプルを返却し、Route が `c.json(body, code)` でレスポンスします。

### レスポンス形式

統一された discriminated union 形式です。

```typescript
// 成功
{ error: false, message: string, data: T }

// エラー
{ error: true, message: string, details: T }
```

## 開発セットアップ

### 必要条件

- [Bun](https://bun.sh/) (推奨) または npm
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (CLI)
- Cloudflare アカウント (D1データベース用)

### 環境変数

`.dev.vars` ファイルを作成し、以下の変数を設定します。

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BASE_URL=your_deployed_backend_url
JWT_SECRET=your_jwt_secret
```

### インストールと起動

```bash
bun install
wrangler dev
```

### データベースマイグレーション

```bash
# スキーマ変更を検出してマイグレーションファイルを生成
bunx drizzle-kit generate

# ローカルD1にマイグレーションを適用
bunx drizzle-kit migrate

# D1 Studio でデータを確認
bunx drizzle-kit studio
```

## デプロイ

```bash
wrangler deploy --minify
```

## API仕様

### 現在のエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| `GET` | `/` | ヘルスチェック (Hello Hono!) |
| `GET` | `/oauth/callback` | Google OAuth コールバック |

### GET /oauth/callback

Google OAuth認可コードを受け取り、トークン交換 → ユーザープロフィール取得 → アカウント作成 を行います。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `code` | string | ✓ | Googleから発行された認可コード |
| `state` | string | ✓ | CSRF対策トークン |

**成功レスポンス (201)**

```json
{
  "error": false,
  "message": "Success to create user",
  "data": { "id": "uuid", "username": "..." }
}
```

**エラーレスポンス**

| ステータス | 条件 |
|------------|------|
| 400 | トークン交換失敗 / メール取得失敗 / 登録エラー |
| 409 | メールアドレスが既に登録済み |

## データベース

11テーブル構成。詳細は [docs/tables.md](docs/tables.md) を参照してください。

## プロジェクトロードマップ

進行状況や今後の計画については [ROADMAP.md](ROADMAP.md) を参照してください。
