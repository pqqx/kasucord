import { useState, useRef } from 'react';
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

  // コピー状態とタイマーの管理
  const [copyStatus, setCopyStatus] = useState({ type: null, active: false });
  const timerRef = useRef(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedUrl('');
    try {
      const response = await fetch('/api/create-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, title, titleUrl, description, imageUrl, color, imageDisplayMode })
      });
      const data = await response.json();
      if (data.id) {
        setGeneratedUrl(`${window.location.origin}/embed/${data.id}`);
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
      let embedId = fetchInput.includes('/embed/') ? fetchInput.split('/embed/')[1].split('/')[0] : fetchInput;
      const response = await fetch(`/api/get-embed?id=${embedId}`);
      if (!response.ok) throw new Error('データが見つかりません');
      const data = await response.json();
      setAuthor(data.author || '');
      setTitle(data.title || '');
      setTitleUrl(data.titleUrl || '');
      setDescription(data.description || '');
      setImageUrl(data.imageUrl || '');
      setColor(data.color || '#000000');
      setImageDisplayMode(data.imageDisplayMode || 'image');
      setActiveTab('create');
      setFetchInput('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // 安定したコピー処理
  const handleCopy = async (text, type) => {
    try {
      // 既存のタイマーがあればクリアしてリセット
      if (timerRef.current) clearTimeout(timerRef.current);
      
      await navigator.clipboard.writeText(text);
      setCopyStatus({ type, active: true });

      timerRef.current = setTimeout(() => {
        setCopyStatus({ type: null, active: false });
        timerRef.current = null;
      }, 1000);
    } catch (err) {
      console.error(err);
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
        body { font-family: -apple-system, sans-serif; background-color: #000; color: var(--text-primary); }
        .main-header { display: flex; justify-content: center; gap: 20px; padding: 20px 0; }
        .tab-button { background: transparent; border: 2px solid var(--tab-active); color: var(--tab-active); padding: 10px 24px; border-radius: 20px; cursor: pointer; font-weight: 700; transition: 0.2s; }
        .tab-button.active { background-color: var(--tab-active); color: #fff; }
        .container { background-color: var(--bg-secondary); border-radius: 10px; padding: 20px; border: 1px solid #222; max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 5px; }
        .subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 25px; font-size: 14px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: var(--text-secondary); font-size: 13px; }
        input, textarea { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: #fff; }
        .action-btn { background: var(--main-accent); color: #fff; border: none; padding: 12px; border-radius: 6px; width: 100%; cursor: pointer; font-weight: bold; margin-top: 10px; }
        .app-layout { display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 1200px; margin: 0 auto; padding: 10px; }
        @media (min-width: 900px) { .app-layout { grid-template-columns: 1.5fr 1fr; } }
        .discord-embed-wrapper { background: #2f3136; border-radius: 4px; display: flex; width: 100%; }
        .embed-sidebar { width: 4px; border-radius: 4px 0 0 4px; }
        .embed-content { padding: 12px; color: #dcddde; font-size: 14px; width: 100%; }
        .embed-title { font-weight: 700; color: #00a8fc; font-size: 16px; margin-bottom: 4px; }
        .generated-url-box { background: var(--bg-primary); border: 1px solid var(--border-color); padding: 15px; border-radius: 8px; margin-top: 20px; }
        .button-group { display: flex; gap: 8px; margin-top: 10px; }
        .copy-btn { flex: 1; padding: 10px; border-radius: 6px; cursor: pointer; background: #222; color: #fff; border: 1px solid #444; transition: 0.2s; font-weight: bold; }
        .copy-btn.success { background: var(--success-color); border-color: var(--success-color); }
        .preview-info { text-align: center; font-size: 12px; color: var(--text-secondary); padding: 10px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 10px; border: 1px solid #222; }
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

            {activeTab === 'fetch' ? (
              <div className="fetch-panel">
                <h2>Embedデータを取得</h2>
                <div className="form-group">
                  <label>EmbedのURL または ID</label>
                  <input type="text" value={fetchInput} onChange={(e) => setFetchInput(e.target.value)} placeholder="https://embd.vercel.app/embed/xxxxxx または xxxxxx" />
                </div>
                <button className="action-btn" onClick={handleFetch} disabled={isFetching}>{isFetching ? '読み込み中...' : 'データを読み込む'}</button>
              </div>
            ) : (
              <>
                <h2>Customize</h2>
                <div className="form-group"><label>Author</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="著者" /></div>
                <div className="form-group"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" /></div>
                <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="詳細" /></div>
                <div className="form-group"><label>Image URL</label><input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" /></div>
                
                <div className="form-group">
                  <label>画像表示タイプ</label>
                  <div style={{display:'flex', gap:'20px'}}>
                    <label><input type="radio" value="image" checked={imageDisplayMode === 'image'} onChange={e => setImageDisplayMode(e.target.value)} /> 大きい画像</label>
                    <label><input type="radio" value="thumbnail" checked={imageDisplayMode === 'thumbnail'} onChange={e => setImageDisplayMode(e.target.value)} /> 小さい画像</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <div style={{display:'flex', gap:'10px'}}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{width:'50px', padding:'2px'}} />
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#000000" />
                  </div>
                </div>

                <div className="form-group"><label>Redirect URL</label><input type="url" value={titleUrl} onChange={(e) => setTitleUrl(e.target.value)} placeholder="https://example.com (option)" /></div>

                <button className="action-btn" onClick={handleGenerate} disabled={isGenerating}>{isGenerating ? '生成中...' : '生成する'}</button>

                {generatedUrl && (
                  <div className="generated-url-box">
                    <h2>生成されたURL</h2>
                    <p style={{fontSize:'12px', color:'#888', marginBottom:'8px'}}>このURLをDiscordに貼り付けてください</p>
                    <div className="url-text">{generatedUrl}</div>
                    <div className="button-group">
                      <button className={`copy-btn ${copyStatus.active && copyStatus.type === 'normal' ? 'success' : ''}`} onClick={() => handleCopy(generatedUrl, 'normal')}>
                        {copyStatus.active && copyStatus.type === 'normal' ? 'コピー完了！' : 'コピー'}
                      </button>
                      <button className={`copy-btn ${copyStatus.active && copyStatus.type === 'hidden' ? 'success' : ''}`} onClick={() => handleCopy(`[\u200B](${generatedUrl})`, 'hidden')}>
                        {copyStatus.active && copyStatus.type === 'hidden' ? 'コピー完了！' : 'URLを隠してコピー'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <aside className="preview-wrapper">
          <div className="preview-info">使用するときはそのサーバーでのEmbed使用権限が必要になります</div>
          <div className="discord-embed-wrapper">
            <div className="embed-sidebar" style={{ backgroundColor: color }} />
            <div className={`embed-content ${imageUrl && imageDisplayMode === 'thumbnail' ? 'with-thumbnail' : ''}`}>
              <div className='embed-main-content'>
                {author && <div style={{fontWeight:'600', color:'#fff', marginBottom:'4px'}}>{author}</div>}
                {title && <div className="embed-title">{title}</div>}
                {description && <div dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />}
                {imageUrl && imageDisplayMode === 'image' && <img src={imageUrl} style={{maxWidth:'100%', borderRadius:'4px', marginTop:'10px'}} />}
              </div>
              {imageUrl && imageDisplayMode === 'thumbnail' && <img src={imageUrl} style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'4px', marginLeft:'12px'}} />}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
