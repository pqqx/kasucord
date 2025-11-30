import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Embed ID is required' });
    }

    try {
        // IDに基づいてEmbedデータを検索
        const result = await sql`SELECT * FROM embeds WHERE id = ${id} LIMIT 1`;

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Embed not found' });
        }

        const embed = result.rows[0];

        // クライアント側で使いやすいようにデータを整形して返す
        res.status(200).json({
            author: embed.author || '',
            title: embed.title || '',
            titleUrl: embed.title_url || '',
            description: embed.description || '',
            imageUrl: embed.image_url || '',
            color: embed.color || '#000000',
            imageDisplayMode: embed.image_display_mode || 'image',
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch embed data.' });
    }
}

