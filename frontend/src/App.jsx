import React, { useState, useEffect } from 'react';

// マシン情報の判定ロジック
const getMachineSpec = (no) => {
  if (no >= 100 && no <= 110) return { model: "ZX110", spec: "0.4㎥" };
  if (no >= 111 && no <= 120) return { model: "ZX135US", spec: "0.5㎥" };
  if (no >= 121 && no <= 140) return { model: "ZX200", spec: "0.8㎥" };
  return { model: "その他", spec: "-" };
};

const attachments = ["平バケット", "爪バケット", "なし", "クロー", "大割", "小割", "スケルトン", "ブレーカー"];
const statuses = ["点検済み", "未点検", "故障中"];

function App() {
  const [sheetData, setSheetData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // 【修正ポイント】入力変更を確実に反映させる関数
  const handleChange = (no, field, value) => {
    setSheetData(prev => ({
      ...prev,
      [no]: {
        ...prev[no], // 既存の機番データ（あれば）をコピー
        [field]: value // 変更した項目だけ上書き
      }
    }));
  };

  // ページ読み込み時にデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://stock-check.go-pro-world.net/api/load');
        if (response.ok) {
          const data = await response.json();
          setSheetData(data);
        }
      } catch (error) {
        console.error("データ読み込み失敗:", error);
      }
    };
    fetchData();
  }, []);

  // FastAPIへデータを送信
  const handleSave = async () => {
    if (Object.keys(sheetData).length === 0) {
      alert("入力データがありません。");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('https://stock-check.go-pro-world.net/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`保存成功！受信件数: ${result.count}件`);
      } else {
        throw new Error('サーバーエラーが発生しました。');
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  const machineNumbers = Array.from({ length: 41 }, (_, i) => 100 + i);
  let lastModel = "";

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>重機在庫チェックシート</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#004085', color: 'white' }}>
              <th style={{ width: '80px', padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0, zIndex: 10 }}>機番</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0, zIndex: 10 }}>アタッチメント</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0, zIndex: 10 }}>点検状態</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0, zIndex: 10 }}>備考</th>
            </tr>
          </thead>
          <tbody>
            {machineNumbers.map((no) => {
              const specData = getMachineSpec(no);
              const showDivider = specData.model !== lastModel;
              lastModel = specData.model;

              return (
                <React.Fragment key={no}>
                  {showDivider && (
                    <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>
                      <td colSpan="4" style={{ padding: '12px', border: '1px solid #ccc', borderTop: '3px solid #64748b' }}>
                        ■ {specData.model} ({specData.spec})
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: 'white' }}>
                    <td style={{ textAlign: 'center', padding: '8px', border: '1px solid #ccc', color: '#333' }}>
                      <strong>{no}</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      <select 
                        style={{ width: '95%', padding: '5px' }}
                        onChange={(e) => handleChange(no, 'attachment', e.target.value)}
                        value={sheetData[no]?.attachment || ""}
                      >
                        <option value="">選択...</option>
                        {attachments.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      <select 
                        style={{ width: '95%', padding: '5px' }}
                        onChange={(e) => handleChange(no, 'status', e.target.value)}
                        value={sheetData[no]?.status || ""}
                      >
                        <option value="">選択...</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      <input 
                        type="text" 
                        style={{ width: '95%', padding: '5px' }}
                        placeholder="備考を入力"
                        onChange={(e) => handleChange(no, 'remarks', e.target.value)}
                        value={sheetData[no]?.remarks || ""}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* 保存ボタン */}
        <div style={{ position: 'fixed', bottom: '20px', right: '40px', zIndex: 100 }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
              padding: '15px 40px', 
              backgroundColor: isSaving ? '#6c757d' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '30px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              cursor: isSaving ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)' 
            }}
          >
            {isSaving ? '保存中...' : '内容を保存する'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
