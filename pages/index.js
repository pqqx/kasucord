import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('create');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [titleUrl, setTitleUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [imageDisplayMode, setImageDisplayMode] = useState('image');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchInput, setFetchInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ type: null, active: false });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedUrl('');
    try {
      const response = await fetch('/api/create-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, title, titleUrl, description, imageUrl, color, imageDisplayMode })
      });
      if (!response.ok) {
        throw new Error('Internal Server Error');
      }
      const data = await response.json();
      if (data.id) {
        const url = `${window.location.origin}/embed/${data.id}`;
        setGeneratedUrl(url);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setIsGenerating(false);
  };

  const handleFetch = async () => {
    if (!fetchInput) return;
    setIsFetching(true);
    try {
      let embedId = fetchInput;
      if (fetchInput.includes('/embed/')) {
        const parts = fetchInput.split('/embed/');
        if (parts[1]) {
          embedId = parts[1].split('/')[0];
        }
      }
      const response = await fetch(`/api/get-embed?id=${embedId}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('指定されたEmbedデータが見つかりません');
        throw new Error('データの取得に失敗しました');
      }
      const data = await response.json();
      setAuthor(data.author);
      setTitle(data.title);
      setTitleUrl(data.titleUrl);
      setDescription(data.description);
      setImageUrl(data.imageUrl);
      setColor(data.color);
      setImageDisplayMode(data.imageDisplayMode);
      setActiveTab('create');
      setFetchInput('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ type, active: true });
      setTimeout(() => setCopyStatus({ type: null, active: false }), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDescription = (text) => {
    if (!text) return '';
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
        :root { --main-accent: #1d73b9; --bg-primary: #0a0a0a; --bg-secondary: #111111; --bg-tertiary: #1a1a1a; --border-color: #333; --text-primary: #f5f5f5; --text-secondary: #aaaaaa; --tab-active: #00a8fc; --success-color: #28a745; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: var(--text-primary); line-height: 1.5; }
        .main-header { display: flex; justify-content: center; gap: 20px; padding: 20px 0; margin-bottom: 20px; }
        .tab-button { background: transparent; border: 2px solid var(--tab-active); color: var(--tab-active); padding: 10px 24px; border-radius: 20px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.2s; }
        .tab-button.active { background-color: var(--tab-active); color: #fff; box-shadow: 0 0 15px rgba(0, 168, 252, 0.4); }
        h1 { font-size: 26px; margin: 0 0 15px 0; font-weight: 600; text-align: center; }
        .subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 30px; font-size: 14px; }
        h2 { font-size: 20px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); font-weight: 600; }
        .container { background-color: var(--bg-secondary); border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 1px solid #222; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: var(--text-secondary); font-weight: 500; font-size: 13px; }
        input[type="text"], input[type="url"], textarea { width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 14px; }
        button.action-btn { background-color: var(--main-accent); color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; width: 100%; margin-top: 10px; }
        .app-layout { display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 1200px; margin: 0 auto 20px auto; padding: 10px; }
        @media (min-width: 900px) { .app-layout { grid-template-columns: 1.5fr 1fr; } }
        .discord-embed-wrapper { background-color: #2f3136; border-radius: 4px; display: flex; max-width: 520px; width: 100%; }
        .embed-sidebar { width: 4px; border-radius: 4px 0 0 4px; flex-shrink: 0; }
        .embed-content { padding: 8px 16px 16px 12px; color: #dcddde; font-size: 14px; overflow: hidden; width: 100%; }
        .embed-title { font-weight: 700; color: #00a8fc; font-size: 16px; margin-bottom: 8px; }
        .generated-url-box { background-color: var(--bg-primary); border: 1px solid var(--border-color); padding: 15px; border-radius: 8px; margin-top: 15px; }
        .url-display { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .url-text { background-color: var(--bg-tertiary); padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; border: 1px solid #333; }
        .button-group { display: flex; gap: 8px; }
        .copy-btn { flex: 1; background-color: #222; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; font-weight: 600; }
        .copy-btn:hover { background-color: #333; }
        .copy-btn.success { background-color: var(--success-color); border-color: var(--success-color); }
        .image-mode-selector { display: flex; gap: 20px; margin-top: 5px; }
        .embed-thumbnail img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-top: 8px; }
      `}</style>

      <header className="main-header">
        <button className={`tab-button ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>埋め込み作成</button>
        <button className={`tab-button ${activeTab === 'fetch' ? 'active' : ''}`} onClick={() => setActiveTab('fetch')}>埋め込み取得</button>
      </header>

      <div className="app-layout">
        <main>
          <div className="container">
            <h1>Discord Embed Generator</h1>
            <p className="subtitle">nemtudoのパクリでクカ</p>

            {activeTab === 'fetch' && (
              <div className="fetch-panel">
                <h2>Embedデータを取得</h2>
                <div className="form-group">
                  <label>EmbedのURL または ID</label>
                  <input type="text" value={fetchInput} onChange={(e) => setFetchInput(e.target.value)} placeholder="https://embd.vercel.app/embed/xxxxxx" />
                </div>
                <button className="action-btn" onClick={handleFetch} disabled={isFetching}>{isFetching ? '読み込み中...' : 'データを読み込む'}</button>
              </div>
            )}

            {activeTab === 'create' && (
              <>
                <h2>Customize</h2>
                <div className="form-group"><label>Author</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
                <div className="form-group"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div className="form-group"><label>Image URL</label><input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
                
                <div className="form-group">
                  <label>画像表示タイプ</label>
                  <div className='image-mode-selector'>
                    <label><input type="radio" value="image" checked={imageDisplayMode === 'image'} onChange={e => setImageDisplayMode(e.target.value)} /> 大きい画像</label>
                    <label><input type="radio" value="thumbnail" checked={imageDisplayMode === 'thumbnail'} onChange={e => setImageDisplayMode(e.target.value)} /> 小さい画像</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <div style={{display:'flex', gap:'10px'}}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
                  </div>
                </div>

                <div className="form-group"><label>Redirect URL</label><input type="url" value={titleUrl} onChange={(e) => setTitleUrl(e.target.value)} /></div>

                <button className="action-btn" onClick={handleGenerate} disabled={isGenerating}>{isGenerating ? '生成中' : '生成する'}</button>

                {generatedUrl && (
                  <div className="generated-url-box">
                    <h2>生成されたURL</h2>
                    <div className="url-display">
                      <div className="url-text">{generatedUrl}</div>
                      <div className="button-group">
                        <button 
                          className={`copy-btn ${copyStatus.active && copyStatus.type === 'normal' ? 'success' : ''}`} 
                          onClick={() => handleCopy(generatedUrl, 'normal')}
                        >
                          {copyStatus.active && copyStatus.type === 'normal' ? 'コピー完了！' : 'コピー'}
                        </button>
                        <button 
                          className={`copy-btn ${copyStatus.active && copyStatus.type === 'hidden' ? 'success' : ''}`} 
                          onClick={() => handleCopy(`[\u180E](${generatedUrl})`, 'hidden')}
                        >
                          {copyStatus.active && copyStatus.type === 'hidden' ? 'コピー完了！' : 'URLを隠してコピー'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <aside className="preview-wrapper">
          <div className="discord-embed-wrapper">
            <div className="embed-sidebar" style={{ backgroundColor: color }} />
            <div className={`embed-content ${imageUrl && imageDisplayMode === 'thumbnail' ? 'with-thumbnail' : ''}`}>
              <div className='embed-main-content'>
                {author && <div className="embed-author">{author}</div>}
                {title && <div className="embed-title">{title}</div>}
                {description && <div className="embed-description" dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />}
                {imageUrl && imageDisplayMode === 'image' && <div className="embed-image"><img src={imageUrl} style={{maxWidth:'100%', borderRadius:'4px'}} /></div>}
              </div>
              {imageUrl && imageDisplayMode === 'thumbnail' && <div className="embed-thumbnail"><img src={imageUrl} /></div>}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
