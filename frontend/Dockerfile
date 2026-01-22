FROM node:20-alpine
WORKDIR /app

# 先に設定ファイルだけコピーして install する（キャッシュを効かせるため）
COPY package*.json ./
RUN npm install

# 残りのファイルをコピー
COPY . .

# 開発用サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
