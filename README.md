# Stock-Check App 🏗️

建設機械の在庫・点検状態をリアルタイムで管理するためのフルスタックWebアプリケーションです。
現場での使い勝手を最優先し、機番ごとのアタッチメント管理や点検ステータスの可視化を行います。

## 🛠 技術スタック
- **Frontend:** React (Vite), JavaScript
- **Backend:** Python (FastAPI), SQLite
- **Infrastructure:** Docker / Docker Compose
- **Reverse Proxy:** Traefik (HTTPS / Let's Encrypt)
- **Deployment:** VPS (Ubuntu 24.04) / Cloudflare

## 🚀 現在の機能
- **自動機番生成:** 100番〜140番の機番を自動リスト化。
- **型式別セクション:** ZX110, ZX135US, ZX200などの型式に応じた自動仕切り表示。
- **入力フォーム:** アタッチメント選択、点検状態（良/要点検/修理中など）、備考欄の入力。

## 📈 今後の拡張予定 (Roadmap)
- [ ] **データ永続化:** SQLiteを用いた入力データの保存・読み込み機能の実装。
- [ ] **認証機能:** 関係者のみが閲覧・編集できるログイン機能。
- [ ] **写真アップロード:** 修理が必要な箇所の写真をスマホから直接アップロード。
- [ ] **QRコード連携:** 各機体に貼られたQRコードから該当機番の入力画面へダイレクトジャンプ。
- [ ] **履歴管理:** 過去の点検記録をタイムラインで表示。

## 🏗 インフラ構成
本プロジェクトは、VPS上でDockerコンテナを使用して稼働しています。
Traefikをフロントに置くことで、SSL証明書の自動更新とサブドメイン運用を実現しています。

```bash
# 起動方法
docker compose up -d --build
```

Developed by hisao5232
