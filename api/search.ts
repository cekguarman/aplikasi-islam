import { GoogleGenAI } from '@google/genai';
import { executeComprehensiveSearch } from '../src/data/islamicSearchEngine';
import { SearchResult, ResearchSynthesis } from '../src/types';

async function generateWithGeminiFast(aiClient: GoogleGenAI, prompt: string, timeoutMs: number = 7500): Promise<string> {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastErr: any = null;

  const runModels = async () => {
    for (const model of models) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastErr = err;
        console.warn(`[Speed Engine] Model ${model} failed:`, err?.message || err);
      }
    }
    throw lastErr || new Error('All fast Gemini models failed');
  };

  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout (7.5s)')), timeoutMs)
  );

  return Promise.race([runModels(), timer]);
}

export default async function handler(req: any, res: any) {
  try {
    const query = String(req.query?.q || '').trim();
    const category = String(req.query?.category || 'all').toLowerCase();
    const clientApiKey = req.headers?.['x-gemini-key'] as string | undefined;

    if (!query) {
      const data = executeComprehensiveSearch('', category);
      return res.status(200).json(data);
    }

    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (key) {
      try {
        const aiClient = new GoogleGenAI({ apiKey: key });

        let focusInstruction = "EKSPLORASI LINTAS SELURUH SUMBER ISLAM";
        if (category === 'quran') {
          focusInstruction = "FOKUS KHUSUS: AYAT AL-QUR'AN, ASBABUN NUZUL & TAFSIR MUKTAMAD (Ibnu Katsir, Thabari). Tampilkan ayat-ayat yang presisi dan ulasan tafsir yang SANGAT PADAT & DETIL.";
        } else if (category === 'hadith') {
          focusInstruction = "FOKUS KHUSUS: HADITS 9 IMAM & TAKHRIJ SANAD. Tampilkan matan hadits berharakat lengkap, nomor hadits, derajat kesahihan (Shahih/Hasan), dan syarah hadits mendalam (Fathul Bari & Syarah Muslim Imam Nawawi) yang SANGAT PADAT & DETIL.";
        } else if (category === 'fiqh') {
          focusInstruction = "FOKUS KHUSUS: FIQIH 4 MAZHAB (AL-MAWSU'AH AL-FIQHIYYAH AL-KUWAITIYYAH 45 JILID). Tampilkan rincian hukum, dalil, syarat, rukun, dan komparasi mazhab Hanafi, Maliki, Syafi'i, Hanbali yang SANGAT PADAT & DETIL.";
        } else if (category === 'artikel') {
          focusInstruction = "FOKUS KHUSUS: REPOSITORI RISET & BUKU ARSIP ARMANSYAH (arsiparmansyah.wordpress.com). Tampilkan analisis kritis, kristologi, sejarah Isa Al-Masih, eskatologi, sains Israk Mikraj, atau hukum anjing secara SANGAT PADAT & DETIL.";
        }

        const prompt = `Anda adalah asisten pakar studi Islam multidisipliner, tafsir Al-Qur'an, hadits 9 imam, fiqih 4 mazhab, dan perbandingan agama.
Kueri pencarian pengguna: "${query}".
Petunjuk Fokus: ${focusInstruction}.

SUMBER RUJUKAN UTAMA:
1. https://arsiparmansyah.wordpress.com/ (Blog pribadi Armansyah - riset buku: Rekonstruksi Sejarah Isa Al-Masih, Misteri Kecerdasan Syahadat, Jejak Nabi Palsu, Ramalan Imam Mahdi, Israk Mikraj Tinjauan Sains, Hukum Anjing dalam Islam).
2. https://shamela.ws/book/23604 (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah - 45 jilid ensiklopedia fiqih 4 mazhab).
3. https://hadits.tazkia.ac.id/
4. https://www.carihadits.id/imam (Hadits 9 Imam)
5. https://quranweb.id/
6. https://tafsirweb.com/
7. https://muhamadbasuki.web.id/
8. Literatur jurnal ilmiah & fatwa otoritatif.

ATURAN KRUSIAL (PENJELASAN PADAT & DETIL):
- Penjelasan pada kolom 'tafsir' WAJIB SANGAT UTUH, PADAT, DAN DETIL (multi-paragraf mendalam), bukan sekadar ringkasan singkat satu kalimat dan BUKAN hanya menampilkan link saja!
- Teks Arab WAJIB BERHARAKAT LENGKAP & SEMPURNA.
- Cantumkan 'rujukanList' pada tiap entri dengan nama kitab/surah dan tautan URL asli yang bisa diklik.
- Sertakan 'synthesis' berisi kesimpulan padat dari seluruh dalil.

KEMBALIKAN FORMAT JSON VALID:
{
  "synthesis": {
    "topic": "${query}",
    "kesimpulanUtama": "Kesimpulan padat dan mendalam dari seluruh sumber",
    "tinjauanDalil": "Intisari dalil Al-Qur'an dan Sunnah",
    "tinjauanMazhab": "Peta fatwa dan komparasi 4 mazhab",
    "catatanKritisArmansyah": "Telaah kontekstual dan riset Arsip Armansyah jika relevan",
    "rujukanPrimer": [
      { "name": "Arsip Armansyah", "url": "https://arsiparmansyah.wordpress.com/", "note": "Riset Buku & Kajian Kritis" },
      { "name": "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah", "url": "https://shamela.ws/book/23604", "note": "Ensiklopedia Fiqih 4 Mazhab" },
      { "name": "Hadits 9 Imam", "url": "https://www.carihadits.id/imam", "note": "Kutubus Sittah & 9 Imam" },
      { "name": "QuranWeb & TafsirWeb", "url": "https://quranweb.id/", "note": "Tafsir Muktamad" }
    ]
  },
  "results": [
    {
      "id": "ai-res-1",
      "title": "Judul Pembahasan Lengkap",
      "sourceCategory": "${category === 'all' ? 'quran' : category}",
      "sourceName": "Nama Sumber Rujukan",
      "sourceUrl": "URL Sumber Asli",
      "reference": "Referensi Kitab/Surah/Buku",
      "topicTag": "Topik",
      "arabicText": "Teks Arab Lengkap Berharakat Sempurna",
      "latinTransliteration": "Transliterasi Latin",
      "indonesianTranslation": "Terjemahan Bahasa Indonesia yang Utuh",
      "englishTranslation": "Complete English Translation",
      "tafsir": "Uraian Penjelasan SANGAT PADAT & DETIL (Multi-paragraf)",
      "authenticity": "Derajat Dalil / Mazhab / Validitas Ilmiah",
      "madzhab": "Keterangan Mazhab Fiqih jika ada",
      "rujukanList": [
        { "name": "Nama Sumber Rujukan", "url": "URL Rujukan", "detail": "Detail Rujukan" }
      ]
    }
  ]
}`;

        const rawJson = await generateWithGeminiFast(aiClient, prompt);
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return res.status(200).json({
          results: parsed.results || [],
          source: 'gemini',
          synthesis: parsed.synthesis || null
        });
      } catch (geminiError: any) {
        console.warn('Gemini fast search error or timeout, instant fallback to scholarly database:', geminiError?.message || geminiError);
      }
    }

    // Instant local scholarly database fallback
    const fallbackData = executeComprehensiveSearch(query, category);
    res.status(200).json(fallbackData);
  } catch (error) {
    console.error('Search handler error:', error);
    const fallbackData = executeComprehensiveSearch('', 'all');
    res.status(500).json(fallbackData);
  }
}
