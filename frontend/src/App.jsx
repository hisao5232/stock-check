import React, { useState } from 'react';

// マシン情報の判定ロジック
const getMachineSpec = (no) => {
  if (no >= 100 && no <= 110) return { model: "ZX110", spec: "0.4㎥" };
  if (no >= 111 && no <= 120) return { model: "ZX135US", spec: "0.5㎥" };
  if (no >= 121 && no <= 140) return { model: "ZX200", spec: "0.8㎥" };
  return { model: "その他", spec: "-" };
};

const attachments = ["標準バケット", "ブレーカー", "フォーク", "グラップル"];
const statuses = ["良", "要点検", "修理中", "未実施"];

function App() {
  // 60台分のデータを管理するための「箱（State）」
  const [sheetData, setSheetData] = useState({});

  // 入力が変更された時にデータを更新する関数
  const handleChange = (no, field, value) => {
    setSheetData(prev => ({
      ...prev,
      [no]: { ...prev[no], [field]: value }
    }));
  };

  const machineNumbers = Array.from({ length: 41 }, (_, i) => 100 + i);
  let lastModel = "";

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '20px', backgroundColor: '#f4f4f9' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>重機在庫チェックシート</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#004085', color: 'white' }}>
              <th style={{ width: '80px', padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0 }}>機番</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0 }}>アタッチメント</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0 }}>点検状態</th>
              <th style={{ padding: '12px', border: '1px solid #ccc', position: 'sticky', top: 0 }}>備考</th>
            </tr>
          </thead>
          <tbody>
  {machineNumbers.map((no) => {
    const specData = getMachineSpec(no);
    const showDivider = specData.model !== lastModel;
    lastModel = specData.model;

    return (
      <React.Fragment key={no}> {/* keyはここに置く */}
        {showDivider && (
          <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>
            <td colSpan="4" style={{ padding: '12px', border: '1px solid #ccc', borderTop: '3px solid #64748b' }}>
              ■ {specData.model} ({specData.spec})
            </td>
          </tr>
        )}
        <tr style={{ backgroundColor: 'white' }}> {/* 背景を白に固定 */}
          <td style={{ textAlign: 'center', padding: '8px', border: '1px solid #ccc', color: '#333' }}>
            <strong>{no}</strong>
          </td>
          <td style={{ padding: '8px', border: '1px solid #ccc' }}>
            <select 
              style={{ width: '95%', padding: '5px' }}
              onChange={(e) => handleChange(no, 'attachment', e.target.value)}
            >
              <option value="">選択...</option>
              {attachments.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </td>
          <td style={{ padding: '8px', border: '1px solid #ccc' }}>
            <select 
              style={{ width: '95%', padding: '5px' }}
              onChange={(e) => handleChange(no, 'status', e.target.value)}
            >
              <option value="">選択...</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
          <td style={{ padding: '8px', border: '1px solid #ccc' }}>
            <input 
              type="text" 
              style={{ width: '95%', padding: '5px' }}
              onChange={(e) => handleChange(no, 'remarks', e.target.value)}
            />
          </td>
        </tr>
      </React.Fragment>
    );
  })}
</tbody>
        </table>

        {/* 保存ボタン */}
        <div style={{ position: 'fixed', bottom: '20px', right: '40px' }}>
          <button 
            onClick={() => console.log("現在のデータ:", sheetData)}
            style={{ 
              padding: '15px 40px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '30px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              cursor: 'pointer', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)' 
            }}
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
