import { GoogleGenAI } from '@google/genai';
import { executeComprehensiveSearch } from '../src/data/islamicSearchEngine';
import { SearchResult, ResearchSynthesis } from '../src/types';

export default async function handler(req: any, res: any) {
  try {
    const query = String(req.query?.q || '').trim();
    const clientApiKey = req.headers?.['x-gemini-key'] as string | undefined;

    if (!query) {
      const data = executeComprehensiveSearch('');
      return res.status(200).json(data);
    }

    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (key) {
      try {
        const aiClient = new GoogleGenAI({ apiKey: key });
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

        return res.status(200).json({
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
    res.status(200).json(fallbackData);
  } catch (error) {
    console.error('Search error:', error);
    const fallbackData = executeComprehensiveSearch('');
    res.status(500).json(fallbackData);
  }
}
