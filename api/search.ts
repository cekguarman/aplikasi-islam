import { GoogleGenAI } from '@google/genai';
import { INITIAL_KNOWLEDGE_BASE } from '../src/data/knowledgeBase';
import { SearchResult } from '../src/types';

export default async function handler(req: any, res: any) {
  try {
    const query = String(req.query?.q || '').trim();
    const category = String(req.query?.category || 'all').toLowerCase();
    const clientApiKey = req.headers?.['x-gemini-key'] as string | undefined;

    if (!query) {
      let results = [...INITIAL_KNOWLEDGE_BASE];
      if (category !== 'all') {
        results = results.filter(r => r.sourceCategory === category);
      }
      return res.status(200).json({ results, source: 'local' });
    }

    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (key) {
      try {
        const aiClient = new GoogleGenAI({ apiKey: key });
        const prompt = `Anda adalah asisten pakar studi Islam multidisipliner, tafsir Al-Qur'an, hadits 9 imam, fiqih 4 mazhab, dan perbandingan agama.
Cari dalil/hukum untuk kueri: "${query}".
Kategori: "${category}".

SUMBER RUJUKAN UTAMA:
1. https://arsiparmansyah.wordpress.com/ (Blog pribadi Armansyah - berisi riset buku: Rekonstruksi Sejarah Isa Al-Masih, Misteri Kecerdasan Syahadat, Jejak Nabi Palsu, Ramalan Imam Mahdi, Israk Mikraj Tinjauan Sains, Hukum Anjing dalam Islam. Wajib cari dan sertakan jika relevan).
2. https://shamela.ws/book/23604 (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah - 45 jilid ensiklopedia fiqih).
3. https://hadits.tazkia.ac.id/
4. https://www.carihadits.id/imam (Hadits 9 Imam)
5. https://quranweb.id/
6. https://tafsirweb.com/
7. https://muhamadbasuki.web.id/
8. Jurnal ilmiah dan fatwa resmi otoritatif.

ATURAN WAJIB:
- Teks Arab berharakat LENGKAP dan SEMPURNA (rasm Utsmani / imla'i tanpa salah tulis).
- Terjemahan Bahasa Indonesia akurat.
- Sertakan terjemahan Bahasa Inggris (English translation).
- URL sumber asli dan referensi kitab/surah.

KEMBALIKAN FORMAT JSON (array of objects):
[
  {
    "id": "ai-res-1",
    "title": "Judul",
    "sourceCategory": "quran" | "hadith" | "fiqh" | "artikel",
    "sourceName": "Nama Sumber",
    "sourceUrl": "URL Sumber",
    "reference": "Referensi Kitab/Ayat/Buku",
    "topicTag": "Topik",
    "arabicText": "Teks Arab Berharakat",
    "latinTransliteration": "Transliterasi",
    "indonesianTranslation": "Terjemahan Indonesia",
    "englishTranslation": "English Translation",
    "tafsir": "Penjelasan / Syarah",
    "authenticity": "Derajat / Mazhab"
  }
]
Hanya keluarkan JSON tanpa tanda kutip markdown.`;

        const interaction = await aiClient.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });

        const outputText = interaction.output_text || '';
        const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResults: SearchResult[] = JSON.parse(cleaned);

        return res.status(200).json({ results: parsedResults, source: 'gemini' });
      } catch (geminiError) {
        console.warn('Gemini search failed or fallback to local:', geminiError);
      }
    }

    // Local Search
    const lowerQ = query.toLowerCase();
    let filtered = INITIAL_KNOWLEDGE_BASE.filter(item => {
      const matchCat = category === 'all' || item.sourceCategory === category;
      const matchText =
        item.title.toLowerCase().includes(lowerQ) ||
        item.indonesianTranslation.toLowerCase().includes(lowerQ) ||
        item.topicTag.toLowerCase().includes(lowerQ) ||
        item.reference.toLowerCase().includes(lowerQ) ||
        (item.tafsir && item.tafsir.toLowerCase().includes(lowerQ)) ||
        (item.sourceName && item.sourceName.toLowerCase().includes(lowerQ)) ||
        (item.latinTransliteration && item.latinTransliteration.toLowerCase().includes(lowerQ));
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      filtered = INITIAL_KNOWLEDGE_BASE.filter(item => category === 'all' || item.sourceCategory === category);
    }

    res.status(200).json({ results: filtered, source: 'local' });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Gagal melakukan pencarian', results: INITIAL_KNOWLEDGE_BASE });
  }
}
