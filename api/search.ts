import { GoogleGenAI } from '@google/genai';
import { executeComprehensiveSearch } from '../src/data/islamicSearchEngine';
import { SearchResult, ResearchSynthesis, DeepSourceAnalysis } from '../src/types';

async function generateWithGeminiFast(aiClient: GoogleGenAI, prompt: string, timeoutMs: number = 10000): Promise<string> {
  const models = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-1.5-flash'];
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
          focusInstruction = "FOKUS KHUSUS: ENSIKLOPEDIA FIQIH 4 MAZHAB (AL-MAWSU'AH AL-FIQHIYYAH AL-KUWAITIYYAH 45 JILID: HANAFI, MALIKI, SYAFI'I, HANBALI) & PUSTAKA TSIRWAH.";
        } else if (category === 'artikel') {
          focusInstruction = "FOKUS KHUSUS: REPOSITORI RISET BUKU ARSIP ARMANSYAH (arsiparmansyah.wordpress.com: kristologi Isa Al-Masih, kecerdasan syahadat, eskatologi, sains Israk Mikraj, hukum anjing).";
        }

        const prompt = `Anda adalah seorang ilmuwan dan pakar riset studi Islam multidisipliner tingkat tinggi (spesialisasi komparasi tafsir Al-Qur'an, takhrij hadits 9 imam, fiqih 4 mazhab, dan perbandingan agama/kristologi).

Kueri pencarian pengguna: "${query}".
Fokus Pencarian: ${focusInstruction}.

SITUS UTAMA YANG WAJIB DIBEDAH SECARA DETIL & MENDALAM:
1. https://tsirwah.com & https://tsirwah.com/pustaka/ (Pusat Studi Islam Tsirwah: Bedah pustaka kitab turats seperti Hasyiyah Al-Bajuri, Jami'us Shaghir, Qawa'idul 'Ilal, Safinatun Naja, Risalah Aswaja KH Hasyim Asy'ari, ilmu tafsir ushuluhu wa manajihuhu, dan kajian fiqih tematik).
2. https://arsiparmansyah.wordpress.com/ & https://arsiparmansyah.wordpress.com/daftar-buku-arman/ (Blog pribadi Armansyah - bedah mendalam karya buku & artikel riset: Rekonstruksi Sejarah Isa Al-Masih, Misteri Kecerdasan Syahadat, Jejak Nabi Palsu, Ramalan Imam Mahdi, Israk Mikraj Tinjauan Sains, Dan Tuhan Ciptakan Anjing, telaah kritis naskah apokrif & sains modern).
3. https://shamela.ws/book/23604 (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah - 45 jilid ensiklopedia komparasi fiqih 4 mazhab: Hanafi, Maliki, Syafi'i, Hanbali).
4. https://www.carihadits.id/ (Ensiklopedia 9 Imam Hadits: eksplorasi /imam/1 Bukhari, /imam/2 Muslim, /imam/3 Abu Daud, /imam/4 Tirmidzi, /imam/5 Nasa'i, /imam/6 Ibnu Majah, /imam/7 Ahmad, /imam/8 Malik, /imam/9 Ad-Darimi, serta /perawi/statistik, /perawi, dan /eksplorasi).
5. https://quranweb.id/ (Mushaf Rasm Utsmani per surah /1 dst) & https://tafsirweb.com/ (Tafsir Muktamad Ibnu Katsir, Thabari, Al-Qurthubi, As-Sa'di).
6. https://muhamadbasuki.web.id/hadis/#gsc.tab=0 (Indeks Hadits Tematik) & https://muhamadbasuki.web.id/kutub-al-turats/#gsc.tab=0 (Digitalisasi Kutub At-Turats Klasik).
7. https://tarjih.or.id/ (Majelis Tarjih & Tajdid Muhammadiyah: Fikih Informasi https://tarjih.or.id/wp-content/uploads/2020/09/52.-Nilai-nilai-dasar-Fikih-Informasi.-converted.pdf, Sekolah Tarjih https://pusattarjih.uad.ac.id/category/artikel-sekolah-tarjih/, Jurnal Tarjih https://jurnal.tarjih.or.id/index.php/tarjih, Arsip Fatwa https://arsip.tarjih.or.id/i, dan Kalender Hijriah Global Tunggal https://khgt.muhammadiyah.or.id/ & https://tarjih.or.id/khgt/index.html).
8. https://hadits.nu.or.id/ & https://quran.nu.or.id/ (NU Online: Musnad Syafi'i /musnad-syafii, Syamail /shamail-muhammadiyah, Bulughul Maram /bulugh-al-maram, Hadits Qudsi /hadits-qudsi, Shahih Ibnu Hibban /shahih-ibnu-hibban, Shahih Ibnu Khuzaimah /shahih-ibnu-khuzaimah, Sunan Daraquthni /sunan-daraquthni, Al-Adab Al-Mufrad /al-adab-al-mufrad, Mustadrak Al-Hakim /mustadrak-al-hakim, serta Tahlil https://quran.nu.or.id/tahlil, Doa https://quran.nu.or.id/doa, Wirid https://quran.nu.or.id/wirid).
9. https://www.alkhoirot.org/ (Pesantren Al-Khoirot: Terjemah Fathul Mu'in https://www.alkhoirot.org/2018/11/terjemah-fathul-muin.html & https://www.alkhoirot.org/2022/09/bab-shalat-fathul-muin.html, Safinatun Naja https://www.alkhoirot.org/2012/12/terjemah-kitab-safinah.html, Tafsir Jalalain https://www.alkhoirot.org/2017/11/terjemah-kitab-tafsir-jalalain.html, Nurul Yaqin https://www.alkhoirot.org/2017/04/terjemah-nurul-yaqin-sejarah-nabi.html, Akhlak lil Banin https://www.alkhoirot.org/2017/01/terjemah-akhlak-lil-banin-juz-1.html, Aqidatul Awam https://www.alkhoirot.org/2017/06/terjemah-aqidatul-awam.html, Nurudh Dholam https://www.alkhoirot.org/2023/12/terjemah-nurud-dholam.html, Sullamut Taufiq https://www.alkhoirot.org/2017/05/terjemah-sullamut-taufiq.html, dan At-Tahdzib fi Adillati Matan Taqrib https://www.alkhoirot.org/2018/01/al-tahdzib-fi-adillat-matan-taqrib.html).
10. https://quran.kemenag.go.id/ (Qur'an Kemenag RI: Mushaf Standar Indonesia, Terjemahan Resmi Kemenag Edisi Penyempurnaan, Tafsir Tahlili, Tafsir Wajiz, dan Asbabun Nuzul resmi LPMQ).
11. http://103.44.149.34/elib/assets/buku/Aboebokar_Aceh_-_Perbandingan_Mazhab.pdf (Perbandingan Mazhab karya Prof. K.H. Aboebakar Aceh: kajian komparatif fiqih muqaran, ushul fiqih, genealogi mazhab Hanafi, Maliki, Syafi'i, Hanbali, Zahiri, Ja'fari, serta sebab ikhtilaf ulama).
12. https://balaghah.net/old/nahj-htm/id/id/01/main.htm (Nahj al-Balaghah: Himpunan khutbah tauhid, risalah instruksi kenegaraan kepada Malik Al-Ashtar, wasiat keadilan sosial, dan kata hikmah balaghah Sayyidina Ali bin Abi Thalib r.a.).
13. https://ahmadiyah.id/category/topik/nabi-isa (Kajian Komparatif Topik Nabi Isa: pemetaan doktrin wafat vs rafa' QS. Ali 'Imran: 55, riwayat Kashmir/Rozabal, dan eskatologi Masih Mau'ud yang disandingkan secara objektif dan kritis dengan Al-Qur'an, Hadits, dan telaah buku kristologi Armansyah).

ATURAN KRUSIAL:
- ISOLASI HASIL (JANGAN DIGABUNG DENGAN TOPIK LAIN): Hasil dalam 'results' HANYA boleh berisi pembahasan yang relevan dengan topik "${query}". DILARANG memasukkan topik lain yang tidak berhubungan!
- BEDAH SITUS UTAMA: Berikan rincian eksplorasi spesifik per situs di 'sourceAnalyses' (termasuk Tsirwah Pustaka, Indeks Hadits & Kutub At-Turats, Al-Khoirot, Tarjih Muhammadiyah, NU Online, CariHadits 9 Imam, Arsip Armansyah, Al-Mawsu'ah Shamela, QuranWeb/TafsirWeb, Qur'an Kemenag, Perbandingan Mazhab Aboebakar Aceh, Nahj al-Balaghah, dan Ahmadiyah.id).
- JANGAN TAMPILKAN teks nama perorangan "Muhamad Basuki"; jika merujuk link terkait gunakan label fungsional "Indeks Hadits & Kutub At-Turats".
- BENANG MERAH & IKHTILAF SECARA JUJUR: Tampilkan titik temu konsensus (benangMerah) dan peta perbedaan pendapat secara jujur dan berimbang (titikPerbedaan/perbedaanPandangan), mencakup perbedaan tafsir, variasi terjemahan, komparasi mazhab, dan polemik teologis.
- Teks Arab WAJIB BERHARAKAT LENGKAP & SEMPURNA.

KEMBALIKAN HANYA FORMAT JSON VALID:
{
  "synthesis": {
    "topic": "${query}",
    "kesimpulanUtama": "Kesimpulan komprehensif berstandar ilmiah...",
    "benangMerah": "Uraian titik temu konsensus ilmiah yang disepakati bersama...",
    "titikPerbedaan": "Peta jujur dan objektif tentang perbedaan tafsir, terjemahan, mazhab fiqih, dan polemik akademis...",
    "tinjauanDalil": "Intisari landasan dalil Al-Qur'an dan Sunnah...",
    "tinjauanMazhab": "Komparasi fiqih 4 mazhab dari Al-Mawsu'ah al-Kuwaitiyyah & Perbandingan Mazhab Aboebakar Aceh...",
    "catatanKritisArmansyah": "Telaah kritis dan kontekstual dari repositori buku Arsip Armansyah...",
    "rujukanPrimer": [
      { "name": "Pustaka Tsirwah", "url": "https://tsirwah.com/pustaka/", "note": "Kitab Turats & Studi Islam Tematik" },
      { "name": "Katalog Hadits & Kutub At-Turats", "url": "https://muhamadbasuki.web.id/hadis/#gsc.tab=0", "note": "Indeks Hadits & Kutub Al-Turats" },
      { "name": "Qur'an Kemenag RI", "url": "https://quran.kemenag.go.id/", "note": "Mushaf Standar Indonesia & Terjemahan Resmi LPMQ" },
      { "name": "Majelis Tarjih Muhammadiyah", "url": "https://tarjih.or.id/", "note": "Manhaj Tarjih, Fikih Informasi & KHGT" },
      { "name": "NU Online Hadits & Amaliah", "url": "https://hadits.nu.or.id/", "note": "Kutub Hadits Mu'tabarah, Tahlil, Doa & Wirid" },
      { "name": "Pesantren Al-Khoirot", "url": "https://www.alkhoirot.org/", "note": "Terjemah Fathul Mu'in, Safinah, Taqrib & Kitab Kuning" },
      { "name": "Perbandingan Mazhab (Aboebakar Aceh)", "url": "http://103.44.149.34/elib/assets/buku/Aboebokar_Aceh_-_Perbandingan_Mazhab.pdf", "note": "Kajian Fiqh Muqaran & Sejarah Mazhab" },
      { "name": "Nahj al-Balaghah", "url": "https://balaghah.net/old/nahj-htm/id/id/01/main.htm", "note": "Khutbah Balaghah & Wasiat Ali bin Abi Thalib" },
      { "name": "Kajian Komparatif Nabi Isa (Ahmadiyah.id)", "url": "https://ahmadiyah.id/category/topik/nabi-isa", "note": "Studi Komparasi Teologis Wafat vs Rafa' & Eskatologi" },
      { "name": "CariHadits.id 9 Imam", "url": "https://www.carihadits.id/eksplorasi", "note": "Kutubus Sittah & 9 Imam Hadits" },
      { "name": "Arsip Armansyah", "url": "https://arsiparmansyah.wordpress.com/", "note": "Kajian Kritis & Komparasi Agama" },
      { "name": "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah", "url": "https://shamela.ws/book/23604", "note": "Ensiklopedia 45 Jilid Fiqih 4 Mazhab" },
      { "name": "QuranWeb & TafsirWeb", "url": "https://quranweb.id/", "note": "Mushaf Utsmani & Tafsir Muktamad" }
    ]
  },
  "sourceAnalyses": [
    {
      "siteName": "Pustaka Tsirwah",
      "siteUrl": "https://tsirwah.com",
      "specificPathUrl": "https://tsirwah.com/pustaka/",
      "subTopicsFound": ["Kitab Turats & Fiqih", "Kajian Tematik"],
      "findingsSummary": "Uraian temuan dari penelusuran pustaka Tsirwah terkait topik ini...",
      "dalilOrQuotes": "Kutipan atau kaidah dari khazanah pustaka Tsirwah...",
      "status": "verified"
    },
    {
      "siteName": "Indeks Hadits & Kutub At-Turats",
      "siteUrl": "https://muhamadbasuki.web.id",
      "specificPathUrl": "https://muhamadbasuki.web.id/hadis/#gsc.tab=0",
      "subTopicsFound": ["Indeks Hadis Tematik", "Kutub Al-Turats"],
      "findingsSummary": "Pemetaan tema hadits dan katalog kutub at-turats...",
      "dalilOrQuotes": "Takhrij sanad atau matan dari naskah turats...",
      "status": "verified"
    },
    {
      "siteName": "Pesantren Al-Khoirot",
      "siteUrl": "https://www.alkhoirot.org",
      "specificPathUrl": "https://www.alkhoirot.org/2018/11/terjemah-fathul-muin.html",
      "subTopicsFound": ["Fathul Mu'in", "Safinatun Naja", "At-Tahdzib Matan Taqrib", "Tafsir Jalalain"],
      "findingsSummary": "Uraian fiqih Syafi'iyah dan dalil dari naskah terjemahan Al-Khoirot...",
      "dalilOrQuotes": "Kutipan matan kitab turats Syafi'i...",
      "status": "verified"
    },
    {
      "siteName": "Majelis Tarjih & Tajdid Muhammadiyah",
      "siteUrl": "https://tarjih.or.id",
      "specificPathUrl": "https://tarjih.or.id/wp-content/uploads/2020/09/52.-Nilai-nilai-dasar-Fikih-Informasi.-converted.pdf",
      "subTopicsFound": ["Fikih Informasi", "KHGT", "Sekolah Tarjih", "Jurnal Tarjih"],
      "findingsSummary": "Fatwa tarjih, nilai etika informasi, atau unifikasi hisab...",
      "dalilOrQuotes": "Keputusan Manhaj Tarjih...",
      "status": "verified"
    },
    {
      "siteName": "NU Online Hadits & Amaliah",
      "siteUrl": "https://hadits.nu.or.id",
      "specificPathUrl": "https://hadits.nu.or.id/bulugh-al-maram",
      "subTopicsFound": ["Bulughul Maram", "Musnad Syafi'i", "Tahlil & Doa", "Hadits Qudsi"],
      "findingsSummary": "Takhrij hadits mu'tabarah dan tuntunan amaliah...",
      "dalilOrQuotes": "Matan hadits atau susunan doa ma'tsur...",
      "status": "verified"
    },
    {
      "siteName": "CariHadits.id - Ensiklopedia 9 Kitab Imam",
      "siteUrl": "https://www.carihadits.id",
      "specificPathUrl": "https://www.carihadits.id/eksplorasi",
      "subTopicsFound": ["9 Imam Hadits (/imam/1 s.d. /9)", "Statistik Perawi (/perawi/statistik)"],
      "findingsSummary": "Riwayat dan takhrij derajat kesahihan dari 9 imam...",
      "dalilOrQuotes": "Matan hadits berharakat...",
      "status": "verified"
    },
    {
      "siteName": "Arsip Armansyah",
      "siteUrl": "https://arsiparmansyah.wordpress.com/",
      "specificPathUrl": "https://arsiparmansyah.wordpress.com/daftar-buku-arman/",
      "subTopicsFound": ["Riset Buku", "Kritik Historis & Perbandingan Agama"],
      "findingsSummary": "Analisis dari buku atau artikel Arsip Armansyah...",
      "dalilOrQuotes": "Catatan kritis / kutipan buku Armansyah...",
      "status": "verified"
    },
    {
      "siteName": "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah",
      "siteUrl": "https://shamela.ws/book/23604",
      "specificPathUrl": "https://shamela.ws/book/23604",
      "subTopicsFound": ["Muqaranah 4 Mazhab"],
      "findingsSummary": "Peta komparasi 4 mazhab Hanafi, Maliki, Syafi'i, Hanbali...",
      "dalilOrQuotes": "Kaidah ushul atau nash fatwa...",
      "status": "verified"
    },
    {
      "siteName": "QuranWeb & TafsirWeb",
      "siteUrl": "https://quranweb.id/",
      "specificPathUrl": "https://tafsirweb.com/",
      "subTopicsFound": ["Ayat Al-Qur'an (quranweb.id/1 dst)", "Tafsir Muktamad (tafsirweb.com)"],
      "findingsSummary": "Kajian tafsir Ibnu Katsir, Thabari, Qurthubi...",
      "dalilOrQuotes": "Ayat suci Al-Qur'an...",
      "status": "verified"
    }
  ],
  "results": [
    {
      "id": "ai-res-1",
      "title": "Judul Kajian Akademis Khusus Topik Ini",
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
          synthesis: parsed.synthesis || null,
          sourceAnalyses: parsed.sourceAnalyses || []
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
