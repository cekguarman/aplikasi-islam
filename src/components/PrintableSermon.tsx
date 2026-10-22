import React from 'react';
import { KhutbahResult, SavedSermon } from '../types';

interface PrintableSermonProps {
  sermon: KhutbahResult | SavedSermon;
  dateMeta?: {
    dayName: string;
    formattedDate: string;
    formattedTime: string;
    fullDisplay: string;
  };
}

export const PrintableSermon: React.FC<PrintableSermonProps> = ({ sermon, dateMeta }) => {
  const isKhutbah = sermon.type === 'khutbah_jumat';

  // Render markdown paragraphs into clean HTML structures
  const lines = sermon.fullMarkdown.split('\n');

  return (
    <div
      id="printable-a4-document"
      className="bg-white text-slate-900 mx-auto w-full max-w-[210mm] p-8 sm:p-12 shadow-none border-none"
      style={{
        boxSizing: 'border-box',
        overflow: 'visible',
      }}
    >
      {/* Basmalah Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-slate-900">
        <div
          dir="rtl"
          className="font-arabic text-3xl sm:text-4xl text-slate-900 mb-2 font-bold leading-relaxed"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
          Naskah {isKhutbah ? 'Khutbah Jum\'at Lengkap' : 'Ceramah & Kultum Agama Islam'}
        </p>
      </div>

      {/* Sermon Meta Header */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <span className="font-bold text-sm text-slate-900">
            Topik: {sermon.topic}
          </span>
          <span className="font-semibold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-300">
            Durasi: {sermon.durationMinutes} Menit (~{sermon.wordCount} Kata)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-slate-700">
          <div>
            <strong>Waktu / Tanggal:</strong>{' '}
            {dateMeta?.fullDisplay || (sermon as SavedSermon).fullDisplay || 'Hari & Waktu Terjadwal'}
          </div>
          <div>
            <strong>Format Naskah:</strong>{' '}
            {isKhutbah ? 'Khutbah 1 & 2 (Lengkap 5 Rukun Fiqih)' : 'Ceramah Tematik & Doa Kafaratul Majelis'}
          </div>
          <div className="sm:col-span-2 text-[11px] text-slate-500 pt-1">
            <strong>Rujukan Utama:</strong> Al-Qur'anul Karim (QuranWeb.id/TafsirWeb.com), Hadits 9 Imam (CariHadits.id/Hadits Tazkia), Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah (shamela.ws/book/23604), & Arsip Armansyah (arsiparmansyah.wordpress.com).
          </div>
        </div>
      </div>

      {/* Structured Content with Justified Paragraphs and Large Arabic */}
      <div className="space-y-6 text-sm text-slate-900 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          // H1
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl font-bold text-slate-950 pb-2 border-b border-slate-300 mt-6 mb-3">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          // H2
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="text-base font-bold text-slate-900 uppercase tracking-wide bg-slate-100 p-2.5 rounded border border-slate-300 mt-8 mb-4 break-after-avoid"
              >
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          // H3
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-bold text-slate-800 mt-5 mb-2 border-l-3 border-slate-700 pl-2">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // Horizontal rule
          if (trimmed === '---') {
            return <hr key={idx} className="border-t border-slate-300 my-6" />;
          }

          // Check if string is predominantly Arabic text
          const isArabic = /[\u0600-\u06FF]/.test(trimmed) && trimmed.length > 10;

          if (isArabic) {
            return (
              <div
                key={idx}
                dir="rtl"
                className="font-arabic text-right my-4 text-emerald-950 font-bold leading-loose select-text"
                style={{ fontSize: '18pt', lineHeight: 2.3 }}
              >
                {trimmed}
              </div>
            );
          }

          // Quote or Dalil
          if (trimmed.startsWith('>')) {
            return (
              <blockquote key={idx} className="border-l-4 border-slate-400 pl-4 py-1 italic my-3 text-slate-700 bg-slate-50">
                {trimmed.replace(/^>\s*/, '')}
              </blockquote>
            );
          }

          // Normal Paragraph: Strictly Justified
          return (
            <p
              key={idx}
              className="text-justify-custom text-slate-800 mb-3 text-[13px] leading-[1.8] hyphens-auto"
              style={{
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              {trimmed.replace(/^\*\*(.*?)\*\*/g, '$1')}
            </p>
          );
        })}
      </div>

      {/* Printable Running Footer */}
      <div className="mt-12 pt-4 border-t-2 border-slate-400 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="font-bold text-slate-900">Al-Bayan (البيان)</span> &bull; Dikembangkan oleh <strong>Armansyah</strong>
        </div>
        <div className="text-[11px] text-slate-500">
          arsiparmansyah.wordpress.com &bull; Sumber Fiqih & Hadits Mu'tamad
        </div>
      </div>
    </div>
  );
};
