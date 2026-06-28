# ロードマップ

中高一貫校 統合認証基盤の開発ロードマップです。

凡例: ✅ 完了 / 🔧 進行中 / ⬜ 未着手 / 📋 計画中

---

## Phase 1: 基盤構築（MVP）⬜

統合認証の核となる Google ログインと最小限のアカウント管理を実装します。

### ✅ 完了済み

- Cloudflare Workers + Hono のプロジェクトセットアップ
- D1 + Drizzle ORM による11テーブルのスキーマ定義とマイグレーション
- Google OAuth コールバックエンドポイント（トークン交換 → プロフィール取得 → ユーザー作成）
- レスポンスヘルパー (`src/libs/response.ts`)
- 統一APIレスポンス型 (`src/types/api.ts`)

### 🔧 現在進行中

- OAuth `state` パラメータのCSRF検証（セッションストアとの突合）
- アカウント作成時のメール重複チェックの堅牢化
- エラーハンドリングの改善

### ⬜ 未着手

- **Googleログインページへのリダイレクトエンドポイント**
  - `GET /oauth/login` — state を生成してセッションに保存し、Google 認証URLへリダイレクト
- **アカウントアクティベーションフロー**
  - 管理画面で suspended ユーザーを enrolled に変更するエンドポイント
  - またはメール確認リンクによる自動アクティベーション
- **JWTアクセストークン + リフレッシュトークン発行**
  - `POST /auth/token` — 認可コード or リフレッシュトークンから JWT を発行
- **ログアウト / セッション無効化**
  - `POST /auth/revoke` — リフレッシュトークンを無効化
- **エラーハンドリングの改善**
  - `console.log` を構造化ログに置き換え
  - エラーレスポンスの詳細制御（開発/本番で出し分け）

---

## Phase 2: 認証機能の拡充 📋

OAuth2.0 / OpenID Connect 準拠の認証サーバー機能を実装します。

- **認可コードフロー (PKCE対応)**
  - `GET /oauth/authorize` — 認可リクエストの受付
  - `POST /oauth/token` — 認可コード → トークン発行
- **OAuthクライアント管理**
  - `GET/POST /api/clients` — 外部アプリケーションの登録・一覧
- **ユーザー情報API**
  - `GET /userinfo` — OpenID Connect の UserInfo エンドポイント
- **JWTアクセストークン検証**
  - `GET /.well-known/jwks.json` — 公開鍵の提供
  - トークン検証ミドルウェア
- **リフレッシュトークンローテーション**
  - リフレッシュトークン使用時の自動ローテーション（古いトークンを無効化）

---

## Phase 3: 学校管理機能 📋

生徒・教員・クラス管理のマスター管理機能を実装します。

- **学年マスタ管理**
  - `GET/PUT /api/grade-levels`
- **教員管理**
  - `GET/POST/PUT /api/teachers`
  - 部署マスタ管理 (`GET/PUT /api/departments`)
- **生徒管理**
  - `GET/POST/PUT /api/students`
  - 在籍情報の管理 (`GET/POST /api/enrollments`)
- **クラス管理**
  - `GET/POST/PUT /api/classes`
  - 担任割り当て
  - 年度ごとのクラス編成
- **ユーザー検索**
  - 名前・ロール・ステータスなどでの絞り込み検索
  - ページネーション

---

## Phase 4: セキュリティ・運用 📋

- **Rate Limiting**
  - ログイン試行制限（同一IP or 同一アカウントあたり）
- **監査ログ**
  - 管理者操作のログ記録
- **メール通知**
  - アカウント作成時／停止時の通知（Resend API）
- **セッション管理**
  - 全セッション一覧・強制ログアウト
- **CSP・セキュリティヘッダー**
  - 各エンドポイントへの適切なセキュリティヘッダー設定
- **Observability**
  - Cloudflare Observability によるトレーシング
  - エラーレート・レイテンシーの監視

---

## Phase 5: 外部連携・拡張 📋

- **Microsoft系プロバイダ対応**
  - Microsoft Entra ID（旧Azure AD）との連携
- **SAML / SCIM 対応**
  - 他システムとのユーザー同期
- **LDAP連携**
  - 既存オンプレミスシステムとの連携
- **CSV一括インポート/エクスポート**
  - 年度初めの一括ユーザー登録

---

## 技術的改善（継続的）

- テスト基盤の整備 (Vitest)
- E2Eテスト (Cloudflare Workers のテストランナー)
- 型安全性の向上（Repository層の型改善）
- CI/CDパイプラインの構築 (GitHub Actions)
- APIドキュメント (OpenAPI / Scalar)
- パフォーマンス最適化（D1クエリのチューニング）
