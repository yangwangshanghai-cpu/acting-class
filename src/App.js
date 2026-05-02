import { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请先输入表演主题。');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/acting-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-5.5',
          topic: topic.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败，请稍后再试。');
      }

      const data = await response.json();
      setResult(data?.content || '已接入 GPT5.5 接口，请完善后端返回结构。');
    } catch (err) {
      setError(err.message || '请求失败，请检查接口配置。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="card">
        <h1>表演排练工具</h1>
        <label htmlFor="topic-input">请输入表演主题</label>
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：失而复得的重逢场景"
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? '生成中…' : '写作表演创意幕表'}
        </button>

        {error && <p className="error">{error}</p>}
        {result && <pre className="result">{result}</pre>}
      </section>
    </main>
  );
}

export default App;
