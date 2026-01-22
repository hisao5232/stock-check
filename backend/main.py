from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional

# root_path="/api" を追加することで、TraefikのPathPrefixと整合性を取ります
app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MachineStatus(BaseModel):
    attachment: Optional[str] = None
    status: Optional[str] = None
    remarks: Optional[str] = None

# 【重要】FastAPI側では "/api" を書かずにルートを定義します
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI is running!"}

@app.post("/save")
async def save_data(data: Dict[str, MachineStatus]):
    print(f"Received data: {data}")
    return {"message": "Data received successfully", "count": len(data)}
    