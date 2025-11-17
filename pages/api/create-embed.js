import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { author, title, description, imageUrl, color } = req.body;
    
    const id = Math.random().toString(36).substring(2, 8);
    
    await sql`
      INSERT INTO embeds (id, author, title, description, image_url, color, created_at)
      VALUES (${id}, ${author}, ${title}, ${description}, ${imageUrl}, ${color}, NOW())
    `;
    
    res.status(200).json({ id });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to create embed' });
  }
}
