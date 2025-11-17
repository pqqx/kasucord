// pages/embed/[id].js

import { sql } from '@vercel/postgres';
import Head from 'next/head';

export default function EmbedPage({ embed, notFound }) {
    if (notFound) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: 'sans-serif',
                color: '#fff',
                backgroundColor: '#000'
            }}>
                <h1>Embed not found</h1>
            </div>
        );
    }

    const embedColor = embed.color || '#1d73b9';

    return (
        <>
            <Head>
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
                body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #000;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
                }
            `}</style>
                  
            <style jsx>{`
                .embed-container {
                max-width: 600px;
                width: 100%;
                background: #111;
                border-radius: 10px;
                padding: 30px;
                border: 1px solid #333;
                border-left: 4px solid ${embedColor};
                }
                h1 {
                font-size: 24px;
                margin-bottom: 15px;
                color: ${embedColor};
                }
                .author {
                font-size: 14px;
                color: #aaa;
                margin-bottom: 10px;
                }
                .description {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
                white-space: pre-wrap;
                }
                .image {
                max-width: 100%;
                border-radius: 8px;
                margin-top: 15px;
                }
            `}</style>

            <div className="embed-container">
                {embed.author && <div className="author">{embed.author}</div>}
                {embed.title && <h1>{embed.title}</h1>}
                {embed.description && <div className="description">{embed.description}</div>}
                {embed.image_url && <img src={embed.image_url} alt="Embed" className="image" />}
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const result = await sql`
      SELECT * FROM embeds WHERE id = ${id} LIMIT 1
    `;

        if (result.rows.length === 0) {
            return { props: { notFound: true } };
        }

        return {
            props: {
                embed: result.rows[0]
            }
        };
    } catch (error) {
        console.error('Database error:', error);
        return { props: { notFound: true } };
    }
}
