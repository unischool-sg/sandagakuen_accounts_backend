# データベーステーブル定義

中高一貫校 統合認証基盤 — 全11テーブル

---

## 1. `users` — ユーザー

全ユーザー（生徒・教員・職員・管理者）の共通アカウント情報。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| username | text | UNIQUE | ログイン用ユーザー名 |
| name | text | | 氏名 |
| name_kana | text | | 氏名（かな） |
| email | text | UNIQUE | メールアドレス |
| email_verified | integer(boolean) | default false | メール検証済みフラグ |
| avatar_url | text | | アバター画像URL |
| role | text | enum | `student:junior` / `student:high` / `teacher` / `staff` / `admin` |
| status | text | enum, default `enrolled` | `enrolled` / `graduated` / `transferred` / `withdrawn` / `suspended` |
| is_banned | integer(boolean) | default false | アカウント停止フラグ |
| permission_bitfield | text | default `'0'` | パーミッションビットフィールド |
| created_at | integer(timestamp) | | 作成日時 |
| updated_at | integer(timestamp) | | 更新日時 |

---

## 2. `grade_levels` — 学年マスタ

中1〜高3までの学年定義。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| code | integer | UNIQUE | コード値（1=中1, 2=中2, …, 6=高3） |
| name | text | | 正式名称（例: 中学1年） |
| short_name | text | | 短縮名（例: 中1） |
| category | text | enum | `junior_high` / `senior_high` |
| sort_order | integer | | 並び順 |

---

## 3. `departments` — 教員部署マスタ

教員の所属部署・教科。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| name | text | UNIQUE | 部署名（例: 数学科） |
| short_name | text | | 短縮名 |

---

## 4. `teachers` — 教員拡張情報

`users` に1:1で紐づく教員固有情報。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK, FK → users.id | UUID（users.id と同一） |
| employee_number | text | UNIQUE | 職員番号 |
| department_id | text | FK → departments.id | 所属部署 |
| updated_at | integer(timestamp) | | 更新日時 |

---

## 5. `classes` — クラス/組

年度ごとのクラス定義。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| academic_year | integer | | 年度（例: 2025） |
| grade_level_id | text | FK → grade_levels.id | 学年 |
| name | text | | 組名（例: A, 1） |
| homeroom_teacher_id | text | FK → users.id | 担任 |
| created_at | integer(timestamp) | | 作成日時 |

---

## 6. `students` — 生徒拡張情報

`users` に1:1で紐づく生徒固有情報。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK, FK → users.id | UUID（users.id と同一） |
| student_number | integer | | 出席番号 |
| entered_year | integer | | 入学年度 |
| updated_at | integer(timestamp) | | 更新日時 |

---

## 7. `enrollments` — 在籍履歴

年度ごとの生徒のクラス所属を記録する履歴テーブル。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| student_id | text | FK → students.id | 生徒 |
| class_id | text | FK → classes.id | クラス |
| academic_year | integer | | 年度 |
| status | text | enum, default `enrolled` | `enrolled` / `graduated` / `transferred` / `withdrawn` / `suspended` |
| created_at | integer(timestamp) | | 作成日時 |

---

## 8. `sessions` — 認証セッション

ユーザーのログインセッション管理。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| user_id | text | FK → users.id | ユーザー |
| refresh_token | text | UNIQUE | リフレッシュトークン |
| user_agent | text | | ユーザーエージェント |
| ip_address | text | | IPアドレス |
| expires_at | integer(timestamp) | | 有効期限 |
| last_used_at | integer(timestamp) | | 最終利用日時 |
| created_at | integer(timestamp) | | 作成日時 |

---

## 9. `external_identities` — 外部ID連携

Google / Microsoft 等の外部OAuthプロバイダとのID紐付け。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| user_id | text | FK → users.id | 内部ユーザー |
| provider | text | | プロバイダ名（例: google, microsoft） |
| provider_account_id | text | | プロバイダ側のアカウントID |
| access_token | text | | アクセストークン（暗号化推奨） |
| refresh_token | text | | リフレッシュトークン（暗号化推奨） |
| token_expires_at | integer(timestamp) | | トークン有効期限 |
| created_at | integer(timestamp) | | 作成日時 |
| updated_at | integer(timestamp) | | 更新日時 |

---

## 10. `oauth_clients` — OAuthクライアント

外部アプリケーションのOAuthクライアント登録。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| name | text | default `'unknown app'` | アプリケーション名 |
| description | text | | 説明 |
| redirect_urls | text(json) | | 許可するリダイレクトURL一覧 |
| client_id | text | UNIQUE | クライアントID |
| client_secret | text | | クライアントシークレット |
| created_at | integer(timestamp) | | 作成日時 |
| updated_at | integer(timestamp) | | 更新日時 |

---

## 11. `authorization_codes` — OAuth認可コード

OAuth2.0 認可コードフローで発行したコードの管理（PKCE対応）。

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | text | PK | UUID |
| client_id | text | FK → oauth_clients.client_id | クライアント |
| user_id | text | FK → users.id | 認可したユーザー |
| code | text | UNIQUE | 認可コード |
| redirect_url | text | | 発行時のリダイレクトURL |
| code_challenge | text | | PKCE code_challenge |
| code_challenge_method | text | | PKCE challenge method（S256 / plain） |
| scopes | text(json) | | 要求スコープ一覧 |
| expires_at | integer(timestamp) | | 有効期限 |
| created_at | integer(timestamp) | | 作成日時 |

---

## リレーション図（概要）

```
users ──1:1──> students
users ──1:1──> teachers ──N:1──> departments
users ──1:N──> sessions
users ──1:N──> external_identities
users ──1:N──> authorization_codes

grade_levels ──1:N──> classes
users(teacher) ──1:N──> classes (homeroom)

students ──1:N──> enrollments ──N:1──> classes

oauth_clients ──1:N──> authorization_codes
```
