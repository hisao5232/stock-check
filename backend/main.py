import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import os
from datetime import datetime, timedelta, timezone

# 日本時間のタイムゾーン定義
JST = timezone(timedelta(hours=+9), 'JST')

app = FastAPI(root_path="/api")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースの保存先（コンテナ内のパス）
DB_PATH = "/app/data/stock.db"

# 起動時にテーブルを作成する関数
def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # machine_no を主キーにして、最新の1件を保持するシンプルな構成
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock (
            machine_no TEXT PRIMARY KEY,
            attachment TEXT,
            status TEXT,
            remarks TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class MachineStatus(BaseModel):
    attachment: Optional[str] = ""
    status: Optional[str] = ""
    remarks: Optional[str] = ""

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/load")
def load_data():
    conn = sqlite3.connect(DB_PATH)
    # 辞書形式で取得できるように設定
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM stock')
    rows = cursor.fetchall()
    
    # { "100": {"attachment": "...", "status": "..."}, "101": ... } の形式に変換
    result = {}
    for row in rows:
        result[row["machine_no"]] = {
            "attachment": row["attachment"],
            "status": row["status"],
            "remarks": row["remarks"]
        }
    conn.close()
    return result

@app.post("/save")
async def save_data(data: Dict[str, MachineStatus]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_jst = datetime.now(JST).strftime('%Y-%m-%d %H:%M:%S')
    
    try:
        # data.items() の件数を数える
        item_count = len(data)
        for no, info in data.items():
            cursor.execute('''
                INSERT OR REPLACE INTO stock (machine_no, attachment, status, remarks, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (no, info.attachment, info.status, info.remarks, now_jst))
        
        conn.commit()
        # ここで確実に count を返す
        return {"message": "Data saved", "count": item_count}
    except Exception as e:
        conn.rollback()
        return {"message": "Error", "detail": str(e)}
    finally:
        conn.close()
