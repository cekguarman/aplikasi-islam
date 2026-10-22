import { GoogleGenAI } from '@google/genai';
import { executeComprehensiveSearch } from '../src/data/islamicSearchEngine';
import { SearchResult, ResearchSynthesis } from '../src/types';

async function generateWithGeminiFast(aiClient: GoogleGenAI, prompt: string, timeoutMs: number = 10000): Promise<string> {
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
    setTimeout(() => reject(new Error('Gemini API timeout (10s)')), timeoutMs)
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
