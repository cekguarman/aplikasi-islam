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

// 1. Health check & status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
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
    const clientApiKey = req.headers['x-gemini-key'] as string | undefined;

    if (!query) {
      const data = executeComprehensiveSearch('');
      return res.json(data);
    }

    const aiClient = getGenAIClient(clientApiKey);
    if (aiClient) {
      try {
        const prompt = `Anda adalah asisten pakar studi Islam multidisipliner, tafsir Al-Qur'an, hadits 9 imam, fiqih 4 mazhab, dan perbandingan agama.
Kueri pencarian pengguna: "${query}".

SUMBER RUJUKAN UTAMA & WAJIB DIJELAJAHI:
1. https://arsiparmansyah.wordpress.com/ (Blog pribadi Armansyah - riset buku: Rekonstruksi Sejarah Isa Al-Masih, Misteri Kecerdasan Syahadat, Jejak Nabi Palsu, Ramalan Imam Mahdi, Israk Mikraj Tinjauan Sains, Hukum Anjing dalam Islam. Wajib dieksplorasi jika relevan).
2. https://shamela.ws/book/23604 (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah - 45 jilid ensiklopedia fiqih 4 mazhab).
3. https://hadits.tazkia.ac.id/
4. https://www.carihadits.id/imam (Hadits 9 Imam)
5. https://quranweb.id/
6. https://tafsirweb.com/
7. https://muhamadbasuki.web.id/
8. Literatur jurnal ilmiah & fatwa otoritatif.

ATURAN PALING KRUSIAL (PENTING SEKALI):
- Pengguna menginginkan penjelasan yang LANGSUNG UTUH, MENDALAM, DAN KOMPREHENSIF (BUKAN SINGKAT-SINGKAT, BUKAN RINGKASAN SATU DUA KALIMAT, DAN BUKAN HANYA MENAMPILKAN LINK SAJA!).
- Setiap entri pada 'results' WAJIB memuat 'tafsir' yang SANGAT UTUH (minimal 3 sampai 5 paragraf berbobot), membedah asbabun nuzul/wurud, syarah lafadz per kata, perbandingan 4 mazhab (Hanafi, Maliki, Syafi'i, Hanbali) dari Mawsu'ah Kuwaitiyyah, dan catatan riset kritis Arsip Armansyah jika terkait.
- Bagian bawah setiap entri wajib memuat 'rujukanList' yang berisi daftar nama kitab/surah dan tautan URL asli rujukan yang bisa diklik.
- Sertakan juga 'synthesis' (kesimpulan dan analisis cerdas dari seluruh rujukan).
- Teks Arab HARUS 100% akurat dan BERHARAKAT LENGKAP & SEMPURNA.

KEMBALIKAN FORMAT JSON VALID:
{
  "synthesis": {
    "topic": "${query}",
    "kesimpulanUtama": "Kesimpulan komprehensif dari penelusuran seluruh sumber",
    "tinjauanDalil": "Intisari dalil Al-Qur'an dan Sunnah",
    "tinjauanMazhab": "Peta perbandingan fatwa 4 mazhab",
    "catatanKritisArmansyah": "Telaah kontekstual dan riset Arsip Armansyah jika ada",
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
      "sourceCategory": "quran",
      "sourceName": "Nama Sumber Rujukan",
      "sourceUrl": "URL Sumber Asli",
      "reference": "Referensi Kitab/Surah/Buku",
      "topicTag": "Topik",
      "arabicText": "Teks Arab Lengkap Berharakat Sempurna",
      "latinTransliteration": "Transliterasi Latin",
      "indonesianTranslation": "Terjemahan Bahasa Indonesia yang Utuh",
      "englishTranslation": "Complete English Translation",
      "tafsir": "Uraian Penjelasan Utuh, Panjang, dan Komprehensif (Multi-paragraf)",
      "authenticity": "Derajat Dalil / Mazhab / Validitas Ilmiah",
      "madzhab": "Keterangan Mazhab Fiqih jika ada",
      "rujukanList": [
        { "name": "Nama Sumber Rujukan", "url": "URL Rujukan", "detail": "Detail Rujukan" }
      ]
    }
  ]
}
Hanya keluarkan JSON valid tanpa tanda kutip markdown (```json).`;

        const interaction = await aiClient.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });

        const outputText = interaction.output_text || '';
        const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return res.json({
          results: parsed.results || [],
          source: 'gemini',
          synthesis: parsed.synthesis || null
        });
      } catch (geminiError) {
        console.warn('Gemini search failed or fallback to local:', geminiError);
      }
    }

    // Local Search fallback
    const fallbackData = executeComprehensiveSearch(query);
    res.json(fallbackData);
  } catch (error) {
    console.error('Search error:', error);
    const fallbackData = executeComprehensiveSearch('');
    res.status(500).json(fallbackData);
  }
});

// 3. Khutbah Generator API
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
Tugas Anda adalah menyusun naskah lengkap, utuh, dan berbobot untuk ${formatLabel}.

SPESIFIKASI NASKAH:
- Tema / Topik: "${topic}"
- Durasi Bicara: ${durationMinutes} Menit (Target panjang naskah: ~${targetWords} kata agar pas dengan tempo berbicara ~130 kata/menit).
- Teks Pembuka Terpilih:
  Arab: ${opening.arabicText}
  Transliterasi: ${opening.transliteration}
  Terjemah: ${opening.indonesianTranslation}

RUJUKAN ILMIAH & FIQIH YANG HARUS DISERTAKAN:
- Al-Qur'anul Karim (tafsir mengacu https://tafsirweb.com/ dan https://quranweb.id/)
- Hadits Nabawi 9 Imam (mengacu https://www.carihadits.id/imam dan https://hadits.tazkia.ac.id/)
- Fiqih 4 Mazhab (mengacu https://shamela.ws/book/23604 - Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah)
- Tulisan dan riset hukum Islam dari Arsip Armansyah (https://arsiparmansyah.wordpress.com/) bila relevan dengan topik
- Panduan praktis Ustadz Muhamad Basuki (https://muhamadbasuki.web.id/)
- Jurnal dan fatwa otoritatif.

KETENTUAN KHUSUS KHUTBAH JUMAT (HARUS MEMENUHI 5 RUKUN FIQIH):
1. KHUTBAH PERTAMA:
   - Mukaddimah pilihan di atas.
   - Wasiat Taqwa (dengan ayat taqwa QS. Ali 'Imran: 102 teks Arab berharakat sempurna + terjemah).
   - Pembacaan ayat Al-Qur'an utama dengan harakat lengkap.
   - Uraian isi khutbah berbobot (${durationMinutes} menit), terbagi 3-4 poin dalil hadits Arab + arti.
   - Nasihat penutup Khutbah Pertama (Barakallahu li walakum... Fastaghfiruh).
2. DUDUK ANTARA DUA KHUTBAH: Petunjuk istirahat khatib & doa istighfar.
3. KHUTBAH KEDUA:
   - Hamdalah & Shalawat ringkas.
   - Wasiat taqwa & perintah bershalawat.
   - Doa untuk kaum muslimin & muslimat (Arab berharakat lengkap, latin, dan terjemahan).
   - Doa sapu jagad dunia akhirat.
   - Penutup khutbah (Ibadallah... Aqimish sholah).

FORMAT PARAGRAF: Naskah teks narasi dibuat mengalir dan tertata rapi sehingga saat dicetak dalam format justify terlihat indah dan elegan.
Teks Arab HARUS berharakat lengkap, jelas, dan akurat!

Sediakan juga versi terjemahan bahasa Inggris (English translation) lengkap.

KEMBALIKAN DALAM FORMAT JSON BERIKUT:
{
  "id": "ai-khutbah-${Date.now()}",
  "topic": "${topic}",
  "type": "${type}",
  "durationMinutes": ${durationMinutes},
  "wordCount": ${targetWords},
  "fullMarkdown": "Isi lengkap naskah khutbah/ceramah dalam format Markdown dengan teks Arab berharakat rapi",
  "englishTranslation": "Complete English translation of the lecture or sermon"
}
Hanya keluarkan JSON valid tanpa kutip markdown.`;

        const interaction = await aiClient.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });

        const outputText = interaction.output_text || '';
        const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed.openingSelected = opening;

        return res.json({ result: parsed, source: 'gemini' });
      } catch (aiErr) {
        console.warn('Gemini generation error, falling back to local generator:', aiErr);
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
    console.error('Khutbah generator error:', error);
    res.status(500).json({ error: 'Gagal membuat naskah khutbah' });
  }
});

// 4. Translate API
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = req.body;
    const clientApiKey = req.headers['x-gemini-key'] as string | undefined;

    const aiClient = getGenAIClient(clientApiKey);
    if (aiClient && text) {
      const interaction = await aiClient.interactions.create({
        model: 'gemini-3.8-flash',
        input: `Terjemahkan teks berikut ke dalam bahasa ${targetLang === 'en' ? 'Inggris (English)' : 'Indonesia'}. Pertahankan istilah keislaman dengan hormat dan akurat:\n\n${text}`
      });
      return res.json({ translatedText: interaction.output_text });
    }

    res.json({
      translatedText: targetLang === 'en'
        ? `[English Translation]: ${text}`
        : `[Terjemahan Indonesia]: ${text}`
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Gagal menerjemahkan' });
  }
});

// 5. Openings Reference API
app.get('/api/openings', (req: Request, res: Response) => {
  res.json({
    openings: PEMBUKAAN_OPTIONS
  });
});

app.listen(PORT, () => {
  console.log(`Server Islamic App running on http://localhost:${PORT}`);
});
