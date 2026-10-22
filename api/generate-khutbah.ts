import { GoogleGenAI } from '@google/genai';
import { PEMBUKAAN_OPTIONS } from '../src/data/pembukaanData';
import { generateLocalKhutbah } from '../src/data/khutbahGeneratorLogic';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type, durationMinutes, openingId, additionalNotes } = req.body || {};
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

        return res.status(200).json({ result: parsed, source: 'gemini' });
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

    res.status(200).json({ result: localResult, source: 'local' });
  } catch (error) {
    console.error('Khutbah generator error:', error);
    res.status(500).json({ error: 'Gagal membuat naskah khutbah' });
  }
}
