import React, { useState } from 'react';
import { FileText, Copy, Check, ExternalLink, Sparkles, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { PEMBUKAAN_OPTIONS } from '../data/pembukaanData';
import { PembukaanOption } from '../types';

interface OpeningsBrowserProps {
  onSelectOpeningForKhutbah: (openingId: number) => void;
}

export const OpeningsBrowser: React.FC<OpeningsBrowserProps> = ({ onSelectOpeningForKhutbah }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [arabicSize, setArabicSize] = useState<number>(26);

  const handleCopy = (opt: PembukaanOption) => {
    const text = `${opt.title}\n\n${opt.arabicText}\n\n${opt.transliteration}\n\nArtinya:\n"${opt.indonesianTranslation}"\n\nSumber: ${opt.source} (https://kalam.sindonews.com/read/1555911/786/10-contoh-teks-pembukaan-mc-innal-hamda-lillah-yang-bisa-dijadikan-referensi-1744797883)`;
    navigator.clipboard.writeText(text);
    setCopiedId(opt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            10 Variasi Mukaddimah Otentik & Sunnah
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            10 Contoh Teks Pembukaan MC / Khutbah Innal Hamda Lillah
          </h1>
          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed text-justify-custom">
            Kumpulan teks pembukaan (mukaddimah) berbahasa Arab lengkap dengan harakat jelas, transliterasi Latin, dan terjemahan Indonesia berdasarkan referensi resmi{' '}
            <a
              href="https://kalam.sindonews.com/read/1555911/786/10-contoh-teks-pembukaan-mc-innal-hamda-lillah-yang-bisa-dijadikan-referensi-1744797883"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 underline underline-offset-4 inline-flex items-center gap-1"
            >
              SINDOnews Kalam <ExternalLink className="w-3 h-3" />
            </a>
            . Siap disalin atau digunakan langsung ke dalam studio generator khutbah.
          </p>
        </div>
      </section>

      {/* Font Size Adjuster Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
        <span className="font-semibold">
          Menampilkan <strong>{PEMBUKAAN_OPTIONS.length}</strong> Variasi Pembukaan
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Ukuran Teks Arab:</span>
          <button
            onClick={() => setArabicSize(p => Math.max(20, p - 2))}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold text-slate-900">{arabicSize}px</span>
          <button
            onClick={() => setArabicSize(p => Math.min(42, p + 2))}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List of 10 Openings Cards */}
      <div className="space-y-6">
        {PEMBUKAAN_OPTIONS.map((opt) => (
          <div
            key={opt.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {opt.id}
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    {opt.title}
                  </h3>
                  <span className="text-xs text-slate-500">{opt.source}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(opt)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedId === opt.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === opt.id ? 'Tersalin' : 'Salin Teks'}</span>
                </button>

                <button
                  onClick={() => onSelectOpeningForKhutbah(opt.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <span>Gunakan untuk Khutbah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Arabic Box */}
            <div className="p-6 bg-amber-50/30 border-b border-slate-100">
              <div
                dir="rtl"
                style={{ fontSize: `${arabicSize}px`, lineHeight: 2.3 }}
                className="font-arabic text-emerald-950 font-bold text-right select-text"
              >
                {opt.arabicText}
              </div>

              {opt.transliteration && (
                <p className="mt-3 text-xs text-slate-600 italic font-serif leading-relaxed border-t border-amber-200/50 pt-2.5">
                  {opt.transliteration}
                </p>
              )}
            </div>

            {/* Translation & Context */}
            <div className="p-5 sm:p-6 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Terjemahan Bahasa Indonesia:
                </span>
                <p className="text-sm text-slate-800 leading-relaxed text-justify-custom font-normal">
                  "{opt.indonesianTranslation}"
                </p>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
                <strong>Rekomendasi Penggunaan:</strong> {opt.contextUsage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
