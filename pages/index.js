// pages/index.js

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [titleUrl, setTitleUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('#1d73b9');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/create-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, title, titleUrl, description, imageUrl, color })
      });
      const data = await response.json();
      if (data.id) {
        const url = `${window.location.origin}/embed/${data.id}`;
        setGeneratedUrl(url);
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error.message);
    }
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    alert('URLをコピーしました！');
  };

  const formatDescription = (text) => {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      <Head>
        <title>Discord Embed Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        :root {
          --main-accent: #1d73b9;
          --bg-primary: #0a0a0a;
          --bg-secondary: #111111;
          --bg-tertiary: #1a1a1a;
          --border-color: #333;
          --text-primary: #f5f5f5;
          --text-secondary: #aaaaaa;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #000;
          color: var(--text-primary);
          line-height: 1.5;
        }
        h1 {
          font-size: 26px;
          margin: 0 0 15px 0;
          font-weight: 600;
          text-align: center;
        }
        .subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 30px;
          font-size: 14px;
        }
        h2 {
          font-size: 20px;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
          font-weight: 600;
        }
        .container {
          background-color: var(--bg-secondary);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          border: 1px solid #222;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 13px;
        }
        input[type="text"],
        input[type="url"],
        textarea {
          width: 100%;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: var(--main-accent);
          box-shadow: 0 0 0 2px rgba(29, 115, 185, 0.3);
        }
        input[type="color"] {
          border: none;
          width: 40px;
          height: 25px;
          border-radius: 6px;
          cursor: pointer;
        }
        textarea {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }
        button {
          background-color: var(--main-accent);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          width: 100%;
          margin-top: 10px;
          transition: all 0.2s;
        }
        button:hover:not(:disabled) {
          background-color: #2980d1;
          transform: translateY(-1px);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .app-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 1200px;
          margin: 20px auto;
          padding: 10px;
        }
        @media (min-width: 900px) {
          .app-layout {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        .preview-wrapper {
          position: sticky;
          top: 20px;
          height: fit-content;
        }
        .preview-info {
          text-align: center;
          font-size: 12px;
          color: var(--text-secondary);
          padding: 10px;
          background: var(--bg-secondary);
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid #222;
        }
        .discord-embed-wrapper {
          background-color: #2f3136;
          border-radius: 4px;
          display: flex;
          max-width: 520px;
          width: 100%;
        }
        .embed-sidebar {
          width: 4px;
          border-radius: 4px 0 0 4px;
          flex-shrink: 0;
        }
        .embed-content {
          padding: 8px 16px 16px 12px;
          color: #dcddde;
          font-size: 14px;
          overflow: hidden; /* はみ出し防止 */
        }
        .embed-author {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .embed-title {
          font-weight: 700;
          color: #00a8fc; 
          font-size: 16px;
          margin-bottom: 8px;
        }
        .embed-title a {
          color: inherit;
          text-decoration: none;
        }
        .embed-title a:hover {
          text-decoration: underline;
        }
        .embed-description {
          font-size: 14px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .embed-image {
          margin-top: 16px;
        }
        .embed-image img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 4px;
          display: block;
        }
        .color-input-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .generated-url-box {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
        }
        .url-display {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .url-text {
          flex: 1;
          background-color: var(--bg-tertiary);
          padding: 8px 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          word-break: break-all;
        }
        .copy-btn {
          flex-shrink: 0;
          width: auto;
          margin: 0;
        }
      `}</style>

      <div className="app-layout">
        <main>
          <div className="container">
            <h1>Discord Embed Generator</h1>
            <p className="subtitle">nemtudoのパクリでクカ</p>

            <h2>Customize</h2>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="ねこ"
              />
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="12歳です"
              />
            </div>
            
            <div className="form-group">
              <label>Title URL</label>
              <input
                type="url"
                value={titleUrl}
                onChange={(e) => setTitleUrl(e.target.value)}
                placeholder="https://example.com (optional)"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="未成年との淫行を楽しむ✅️"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      setColor(e.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? '生成中' : '生成する'}
            </button>

            {generatedUrl && (
              <div className="generated-url-box">
                <h2>生成されたURL</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  このURLをDiscordに貼り付けてください
                </p>
                <div className="url-display">
                  <div className="url-text">{generatedUrl}</div>
                  <button className="copy-btn" onClick={copyToClipboard}>
                    コピー
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="preview-wrapper">
          <div className="preview-info">
            使う前にチェックしろどわー
          </div>
          <div className="discord-embed-wrapper">
            <div className="embed-sidebar" style={{ backgroundColor: color }} />
            <div className="embed-content">
              {author && <div className="embed-author">{author}</div>}
              {title && (
                <div className="embed-title">
                  {titleUrl ? (
                    <a href={titleUrl} target="_blank" rel="noopener noreferrer">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </div>
              )}
              {description && (
                <div
                  className="embed-description"
                  dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
                />
              )}
              {imageUrl && (
                <div className="embed-image">
                  <img src={imageUrl} alt="Embed preview" />
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
