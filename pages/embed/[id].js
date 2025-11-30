import { sql } from '@vercel/postgres';
import Head from 'next/head';
import { useEffect } from 'react';

export default function EmbedPage({ embed, notFound }) {
    // 優先順位: 設定されたRedirect URL > デフォルトのURL
    const redirectTarget = embed?.title_url || 'https://embd.vercel.app';

    useEffect(() => {
        // Embedが見つからない場合はリダイレクトしない、または別途処理
        if (notFound) return;
        
        // 設定されたURLへリダイレクト
        window.location.href = redirectTarget;
    }, [redirectTarget, notFound]);

    if (notFound) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#000'}}>
                <h1>Embed not found</h1>
            </div>
        );
    }

    const embedColor = embed.color || '#1d73b9';
    return (
        <>
            <Head>
                {embed.image_display_mode === 'image' && <meta name="twitter:card" content="summary_large_image" />}
                
                <meta property="og:type" content="website" />
                {embed.author && <meta property="og:site_name" content={embed.author} />}
                {embed.title && <meta property="og:title" content={embed.title} />}
                {embed.title_url && <meta property="og:url" content={embed.title_url} />}
                {embed.description && <meta property="og:description" content={embed.description} />}
                {embed.image_url && <meta property="og:image" content={embed.image_url} />}
                {embedColor && <meta name="theme-color" content={embedColor} />}
                <title>{embed.title || 'Discord Embed'}</title>
            </Head>

            <style jsx global>{`
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
              div { font-size: 18px; text-align: center; }
              a { color: ${embedColor}; }
            `}</style>

            <div>
              <p>
                {/* 手動クリック用のリンクもリダイレクト先に合わせる */}
                <a href={redirectTarget}>redirect</a>.
              </p>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    if (!id || typeof id !== 'string') {
        return { props: { notFound: true } };
    }

    try {
        const result = await sql`SELECT * FROM embeds WHERE id = ${id} LIMIT 1`;
        if (result.rows.length === 0) {
            return { props: { notFound: true } };
        }
        return { props: { embed: result.rows[0] } };
    } catch (error) {
        console.error('Database error in getServerSideProps:', error);
        return { props: { notFound: true } };
    }
}
