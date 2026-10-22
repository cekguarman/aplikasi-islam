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
        let focusInstruction = "EKSPLORASI KOMPREHENSIF LINTAS SELURUH SUMBER ISLAM";
        if (category === 'quran') {
          focusInstruction = "FOKUS KHUSUS: AYAT AL-QUR'AN, ASBABUN NUZUL, RAGAM MAKNA LEKSIKAL & TAFSIR MUKTAMAD (Ibnu Katsir, Ath-Thabari, Al-Qurthubi).";
        } else if (category === 'hadith') {
          focusInstruction = "FOKUS KHUSUS: HADITS 9 IMAM, TAKHRIJ SANAD, DERAJAT KESAHIHAN & SYARAH ULAMA (Fathul Bari & Syarah Shahih Muslim).";
        } else if (category === 'fiqh') {
          focusInstruction = "FOKUS KHUSUS: ENSIKLOPEDIA FIQIH 4 MAZHAB (AL-MAWSU'AH AL-FIQHIYYAH AL-KUWAITIYYAH 45 JILID: HANAFI, MALIKI, SYAFI'I, HANBALI).";
        } else if (category === 'artikel') {
          focusInstruction = "FOKUS KHUSUS: REPOSITORI RISET BUKU ARSIP ARMANSYAH (arsiparmansyah.wordpress.com: kristologi Isa Al-Masih, kecerdasan syahadat, eskatologi, sains Israk Mikraj, hukum anjing).";
        }

        const prompt = `Anda adalah seorang ilmuwan dan pakar riset studi Islam multidisipliner tingkat tinggi (spesialisasi komparasi tafsir Al-Qur'an, takhrij hadits 9 imam, fiqih 4 mazhab, dan perbandingan agama/kristologi).

Kueri pencarian pengguna: "${query}".
Fokus Pencarian: ${focusInstruction}.

SUMBER RUJUKAN RESMI YANG DIJELAJAHI:
1. https://arsiparmansyah.wordpress.com/ (Blog pribadi Armansyah - riset buku & kajian kritis: Rekonstruksi Sejarah Isa Al-Masih, Misteri Kecerdasan Syahadat, Jejak Nabi Palsu, Ramalan Imam Mahdi, Israk Mikraj Tinjauan Sains, Dan Tuhan Ciptakan Anjing, kristologi & dialektika teologis).
2. https://shamela.ws/book/23604 (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah - 45 jilid ensiklopedia fiqih 4 mazhab).
3. https://hadits.tazkia.ac.id/ & https://www.carihadits.id/imam (Hadits 9 Imam: Shahih Bukhari, Muslim, Abu Daud, Tirmidzi, Nasa'i, Ibnu Majah, Musnad Ahmad, dll).
4. https://quranweb.id/ & https://tafsirweb.com/ (Tafsir Ibnu Katsir, Thabari, Al-Qurthubi, As-Sa'di, Kemenag).
5. Jurnal ilmiah studi Islam kredibel & fatwa ulama otoritatif.

MANDAT UTAMA PENELITIAN ILMIAH SECARA JUJUR, PANJANG & KOMPREHENSIF:
Pengguna menuntut kajian ilmiah berkualitas tinggi yang BUKAN sekadar retorika normatif/positif saja, melainkan:
1. BENANG MERAH ILMIAH (Titik Temu Konsensus):
   - Rangkum secara jelas prinsip pokok, ijma', atau substansi fundamental yang disepakati oleh seluruh pihak, mufassir, dan fuqaha tanpa silang pendapat.
2. PETA PERBEDAAN PANDANGAN & IKHTILAF SECARA JUJUR & TRANSPARAN:
   - Paparkan secara objektif, jujur, dan berimbang titik-titik perselisihan (ikhtilaf).
   - Perbedaan penafsiran ayat/hadits (misalnya penafsiran tekstual vs rasional/kontekstual/alegoris; bil ma'tsur vs bir ra'yi).
   - Perbedaan ragam terjemahan atau leksikal bahasa Arab (perbedaan makna mufradat kata).
   - Perbedaan hukum dan metodologi istinbath antara 4 mazhab (Hanafi, Maliki, Syafi'i, Hanbali) hingga pandangan ulama kontemporer.
   - Dialektika kritis (khususnya kritik dari buku-buku dan artikel Arsip Armansyah terkait fakta sejarah, rekonstruksi Isa Al-Masih, isu sains, takhrij hadits polemik, dan hukum anjing).
   - Jangan menyensor atau menyembunyikan perbedaan atau pandangan kontra; hadirkan argumen masing-masing kubu dengan dalil pendukungnya.
3. STANDAR AKADEMIS TINGGI:
   - Teks Arab WAJIB BERHARAKAT LENGKAP & SEMPURNA.
   - Uraian 'tafsir', 'benangMerah', dan 'perbedaanPandangan' wajib panjang, detil, kaya rujukan literatur, dan berformat multi-paragraf yang mendalam.
   - Tautkan 'rujukanList' yang presisi dengan URL aktif.

KEMBALIKAN HANYA FORMAT JSON VALID BERIKUT:
{
  "synthesis": {
    "topic": "${query}",
    "kesimpulanUtama": "Kesimpulan komprehensif berstandar ilmiah...",
    "benangMerah": "Uraian titik temu konsensus ilmiah yang disepakati bersama...",
    "titikPerbedaan": "Peta jujur dan objektif tentang perbedaan tafsir, terjemahan, mazhab fiqih, dan polemik akademis...",
    "tinjauanDalil": "Intisari landasan dalil Al-Qur'an dan Sunnah...",
    "tinjauanMazhab": "Komparasi fiqih 4 mazhab dari Al-Mawsu'ah al-Kuwaitiyyah...",
    "catatanKritisArmansyah": "Telaah kritis dan kontekstual dari repositori buku Arsip Armansyah...",
    "rujukanPrimer": [
      { "name": "Arsip Armansyah", "url": "https://arsiparmansyah.wordpress.com/", "note": "Kajian Kritis & Komparasi Agama" },
      { "name": "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah", "url": "https://shamela.ws/book/23604", "note": "Ensiklopedia 45 Jilid Fiqih 4 Mazhab" },
      { "name": "Hadits 9 Imam & CariHadits.id", "url": "https://www.carihadits.id/imam", "note": "Kutubus Sittah & Musnad Ahmad" },
      { "name": "QuranWeb & TafsirWeb", "url": "https://quranweb.id/", "note": "Mushaf Utsmani & Tafsir Muktamad" }
    ]
  },
  "results": [
    {
      "id": "ai-res-1",
      "title": "Judul Kajian Akademis",
      "sourceCategory": "${category === 'all' ? 'quran' : category}",
      "sourceName": "Nama Sumber Kitab / Rujukan",
      "sourceUrl": "URL Rujukan Terkait",
      "reference": "Referensi Bab, Juz, No. Hadits / Surah",
      "topicTag": "Topik Kajian",
      "arabicText": "Teks Arab Lengkap Berharakat Sempurna",
      "latinTransliteration": "Transliterasi Latin",
      "indonesianTranslation": "Terjemahan Bahasa Indonesia",
      "englishTranslation": "English Translation",
      "benangMerah": "Titik temu dan konsensus pokok dalil ini...",
      "perbedaanPandangan": "Uraian jujur perbedaan tafsir, variasi terjemahan leksikal, serta ikhtilaf mazhab/kritik ilmiah...",
      "tafsir": "Uraian ilmiah panjang, detil, komprehensif (multi-paragraf)...",
      "authenticity": "Derajat Keabsahan Dalil / Metodologi Mazhab",
      "madzhab": "Keterangan Mazhab Fiqih jika ada",
      "rujukanList": [
        { "name": "Nama Kitab / Sumber", "url": "URL Rujukan", "detail": "Keterangan Rujukan" }
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
