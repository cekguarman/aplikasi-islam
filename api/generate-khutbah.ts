import { GoogleGenAI } from '@google/genai';
import { PEMBUKAAN_OPTIONS } from '../src/data/pembukaanData';
import { generateLocalKhutbah } from '../src/data/khutbahGeneratorLogic';

async function generateWithGeminiFast(aiClient: GoogleGenAI, prompt: string, timeoutMs: number = 12000): Promise<string> {
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
        console.warn(`[Speed Engine Khutbah] Model ${model} failed:`, err?.message || err);
      }
    }
    throw lastErr || new Error('All fast Gemini models failed');
  };

  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Khutbah Gemini API timeout (12s)')), timeoutMs)
  );

  return Promise.race([runModels(), timer]);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, type, durationMinutes, openingId, additionalNotes } = req.body;
    const clientApiKey = req.headers?.['x-gemini-key'] as string | undefined;

    const opening = PEMBUKAAN_OPTIONS.find(p => p.id === Number(openingId)) ||
      (type === 'khutbah_jumat' ? PEMBUKAAN_OPTIONS[6] : PEMBUKAAN_OPTIONS[0]);

    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (key && topic) {
      try {
        const aiClient = new GoogleGenAI({ apiKey: key });
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
- Al-Qur'anul Karim & Mushaf Standar Indonesia Kemenag (quran.kemenag.go.id, tafsirweb.com & quranweb.id)
- Hadits Nabawi 9 Imam (carihadits.id/imam & hadits.tazkia.ac.id)
- Fiqih 4 Mazhab (shamela.ws/book/23604 - Al-Mawsu'ah al-Kuwaitiyyah) & Fiqh Muqaran Perbandingan Mazhab Aboebakar Aceh
- Nahj al-Balaghah (balaghah.net - balaghah, etika keadilan & wasiat kepemimpinan Sayyidina Ali bin Abi Thalib)
- Repositori dan riset Arsip Armansyah (arsiparmansyah.wordpress.com) bila relevan
- Fiqih Muamalah, Amaliah & Kutub At-Turats (muhamadbasuki.web.id/hadis/, alkhoirot.org, tarjih.or.id, hadits.nu.or.id)

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

        return res.status(200).json({ result: parsed, source: 'gemini' });
      } catch (aiErr: any) {
        console.warn('Gemini khutbah fast generation error or timeout, falling back to local generator:', aiErr?.message || aiErr);
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

    res.status(200).json({ result: localResult, source: 'local' });
  } catch (error) {
    console.error('Khutbah error:', error);
    res.status(500).json({ error: 'Gagal membuat naskah khutbah' });
  }
}
