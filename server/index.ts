import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_KNOWLEDGE_BASE } from '../src/data/knowledgeBase';
import { executeComprehensiveSearch } from '../src/data/islamicSearchEngine';
import { PEMBUKAAN_OPTIONS } from '../src/data/pembukaanData';
import { generateLocalKhutbah } from '../src/data/khutbahGeneratorLogic';
import { SearchResult } from '../src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to get Gemini client
function getGenAIClient(customApiKey?: string): GoogleGenAI | null {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

// Fast Gemini execution with model cascade and 7.5s timeout for maximum speed on free API keys
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

// 1. Health check & status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '2.1.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    developer: "Armansyah",
    developerBlog: "https://arsiparmansyah.wordpress.com/",
    developerBooksUrl: "https://arsiparmansyah.wordpress.com/daftar-buku-arman/",
    sources: [
      { name: "Arsip Armansyah (Kajian & Buku)", url: "https://arsiparmansyah.wordpress.com/", category: "artikel" },
      { name: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah", url: "https://shamela.ws/book/23604", category: "fiqh" },
      { name: "Hadits Tazkia", url: "https://hadits.tazkia.ac.id/", category: "hadith" },
      { name: "Cari Hadits 9 Imam", url: "https://www.carihadits.id/imam", category: "hadith" },
      { name: "QuranWeb ID", url: "https://quranweb.id/", category: "quran" },
      { name: "TafsirWeb", url: "https://tafsirweb.com/", category: "quran" },
      { name: "Kajian Muhamad Basuki", url: "https://muhamadbasuki.web.id/", category: "artikel" },
      { name: "Jurnal & Literatur Islam Global Kredibel", url: "https://dorar.net", category: "fiqh" }
    ]
  });
});

// 2. Search API
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();
    const category = String(req.query.category || 'all').toLowerCase();
    const clientApiKey = req.headers['x-gemini-key'] as string | undefined;

    if (!query) {
      const data = executeComprehensiveSearch('', category);
      return res.json(data);
    }

    const aiClient = getGenAIClient(clientApiKey);
    if (aiClient) {
      try {
        let focusInstruction = "EKSPLORASI LINTAS SELURUH SUMBER ISLAM";
        if (category === 'quran') {
          focusInstruction = "FOKUS KHUSUS: AYAT AL-QUR'AN, ASBABUN NUZUL & TAFSIR MUKTAMAD (Ibnu Katsir, Thabari). Tampilkan ayat yang presisi dan ulasan tafsir yang SANGAT PADAT & DETIL.";
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

        return res.json({
          results: parsed.results || [],
          source: 'gemini',
          synthesis: parsed.synthesis || null
        });
      } catch (geminiError: any) {
        console.warn('Gemini search fast failed or timed out, instant fallback to scholarly database:', geminiError?.message || geminiError);
      }
    }

    // Local Search fallback
    const fallbackData = executeComprehensiveSearch(query, category);
    res.json(fallbackData);
  } catch (error) {
    console.error('Search error:', error);
    const fallbackData = executeComprehensiveSearch('', 'all');
    res.status(500).json(fallbackData);
  }
});

// 3. Khutbah Generator API (Optimized for speed)
app.post('/api/generate-khutbah', async (req: Request, res: Response) => {
  try {
    const { topic, type, durationMinutes, openingId, additionalNotes } = req.body;
    const clientApiKey = req.headers['x-gemini-key'] as string | undefined;

    const opening = PEMBUKAAN_OPTIONS.find(p => p.id === Number(openingId)) ||
      (type === 'khutbah_jumat' ? PEMBUKAAN_OPTIONS[6] : PEMBUKAAN_OPTIONS[0]);

    const aiClient = getGenAIClient(clientApiKey);

    if (aiClient && topic) {
      try {
        const targetWords = Math.round(Number(durationMinutes || 15) * 130);
        const formatLabel = type === 'khutbah_jumat' ? 'Khutbah Jumat Lengkap (Dua Khutbah Sesuai Rukun Fiqih)' : 'Ceramah / Pengajian Agama Islam';

        const prompt = `Anda adalah ulama khatib dan da'i pakar berwawasan luas, mumpuni dalam fiqih 4 mazhab dan ilmu hadits.
Susun naskah lengkap, utuh, dan berbobot untuk ${formatLabel}.

SPESIFIKASI NASKAH:
- Tema / Topik: "${topic}"
- Durasi Bicara: ${durationMinutes} Menit (Target panjang naskah: ~${targetWords} kata).
- Teks Pembuka Terpilih:
  Arab: ${opening.arabicText}
  Transliterasi: ${opening.transliteration}
  Terjemah: ${opening.indonesianTranslation}

RUJUKAN ILMIAH & FIQIH:
- Al-Qur'anul Karim (tafsirweb.com & quranweb.id)
- Hadits Nabawi 9 Imam (carihadits.id/imam & hadits.tazkia.ac.id)
- Fiqih 4 Mazhab (shamela.ws/book/23604 - Al-Mawsu'ah al-Kuwaitiyyah)
- Repositori dan riset Arsip Armansyah (arsiparmansyah.wordpress.com) bila relevan
- Panduan praktis Ustadz Muhamad Basuki (muhamadbasuki.web.id)

KETENTUAN KHUTBAH JUMAT (5 RUKUN FIQIH LENGKAP):
1. KHUTBAH PERTAMA:
   - Mukaddimah pilihan di atas.
   - Wasiat Taqwa (QS. Ali 'Imran: 102 Arab berharakat + terjemah).
   - Ayat Al-Qur'an utama dengan harakat lengkap.
   - Uraian isi khutbah berbobot (${durationMinutes} menit) dengan dalil hadits Arab + arti.
   - Nasihat penutup Khutbah Pertama (Barakallahu li walakum... Fastaghfiruh).
2. DUDUK ANTARA DUA KHUTBAH: Petunjuk istirahat khatib & doa istighfar.
3. KHUTBAH KEDUA:
   - Hamdalah & Shalawat ringkas.
   - Wasiat taqwa & perintah bershalawat.
   - Doa untuk kaum muslimin & muslimat (Arab berharakat lengkap, latin, dan terjemahan).
   - Doa sapu jagad dunia akhirat.
   - Penutup khutbah (Ibadallah... Aqimish sholah).

FORMAT PARAGRAF: Rapi mengalir, siap dicetak dalam format justify. Teks Arab HARUS berharakat lengkap, jelas, dan akurat.

KEMBALIKAN DALAM FORMAT JSON BERIKUT:
{
  "id": "ai-khutbah-${Date.now()}",
  "topic": "${topic}",
  "type": "${type}",
  "durationMinutes": ${durationMinutes},
  "wordCount": ${targetWords},
  "fullMarkdown": "Isi lengkap naskah khutbah/ceramah dalam format Markdown dengan teks Arab berharakat rapi",
  "englishTranslation": "Complete English translation of the lecture or sermon"
}`;

        const rawJson = await generateWithGeminiFast(aiClient, prompt, 12000);
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed.openingSelected = opening;

        return res.json({ result: parsed, source: 'gemini' });
      } catch (aiErr: any) {
        console.warn('Gemini khutbah generation error or timeout, falling back to local generator:', aiErr?.message || aiErr);
      }
    }

    // Local Generator
    const localResult = generateLocalKhutbah({
      topic: topic || 'Ketaqwaan dan Kejujuran dalam Kehidupan',
      type: type || 'khutbah_jumat',
      durationMinutes: Number(durationMinutes || 15),
      openingId: Number(openingId || 7),
      additionalNotes
    });

    res.json({ result: localResult, source: 'local' });
  } catch (error) {
    console.error('Khutbah error:', error);
    res.status(500).json({ error: 'Gagal membuat naskah khutbah' });
  }
});

// 4. Translate API (Optimized for speed)
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = req.body;
    const clientApiKey = req.headers['x-gemini-key'] as string | undefined;

    const aiClient = getGenAIClient(clientApiKey);
    if (aiClient && text) {
      try {
        const prompt = `Terjemahkan teks ke ${targetLang === 'en' ? 'Bahasa Inggris' : 'Bahasa Indonesia'}. Kembalikan JSON {"translatedText": "..."} tanpa markdown: "${text}"`;
        const rawJson = await generateWithGeminiFast(aiClient, prompt, 5000);
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ translatedText: parsed.translatedText || text });
      } catch (err) {
        console.warn('Translate error:', err);
      }
    }

    res.json({ translatedText: text });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

// 5. Openings Reference API
app.get('/api/openings', (req: Request, res: Response) => {
  res.json({
    openings: PEMBUKAAN_OPTIONS
  });
});

app.listen(PORT, () => {
  console.log(`Server Islamic App v2.1.0 running on http://localhost:${PORT}`);
});
