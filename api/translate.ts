import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, targetLang } = req.body || {};
    const clientApiKey = req.headers?.['x-gemini-key'] as string | undefined;

    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (key && text) {
      const aiClient = new GoogleGenAI({ apiKey: key });
      const interaction = await aiClient.interactions.create({
        model: 'gemini-3.8-flash',
        input: `Terjemahkan teks berikut ke dalam bahasa ${targetLang === 'en' ? 'Inggris (English)' : 'Indonesia'}. Pertahankan istilah keislaman dengan hormat dan akurat:\n\n${text}`
      });
      return res.status(200).json({ translatedText: interaction.output_text });
    }

    res.status(200).json({
      translatedText: targetLang === 'en'
        ? `[English Translation]: ${text}`
        : `[Terjemahan Indonesia]: ${text}`
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Gagal menerjemahkan' });
  }
}
