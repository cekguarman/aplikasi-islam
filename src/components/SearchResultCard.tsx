import React, { useState } from 'react';
import { SearchResult } from '../types';
import { ExternalLink, Copy, Check, Globe, BookOpen, ZoomIn, ZoomOut, Volume2 } from 'lucide-react';

interface SearchResultCardProps {
  result: SearchResult;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [arabicSize, setArabicSize] = useState<number>(26); // default 26px for large, clear Arabic
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'id' | 'en' | 'both'>('id');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryBadge = () => {
    switch (result.sourceCategory) {
      case 'quran':
        return { label: "Al-Qur'an & Tafsir", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case 'hadith':
        return { label: "Hadits Nabawi", bg: "bg-amber-100 text-amber-800 border-amber-300" };
      case 'fiqh':
        return { label: "Fiqih 4 Mazhab", bg: "bg-blue-100 text-blue-800 border-blue-300" };
      case 'artikel':
        return { label: "Riset & Kajian", bg: "bg-purple-100 text-purple-800 border-purple-300" };
      default:
        return { label: "Rujukan Ilmiah", bg: "bg-slate-100 text-slate-800 border-slate-300" };
    }
  };

  const isArmansyahSource = result.sourceUrl.includes('arsiparmansyah.wordpress.com') ||
    result.sourceName.toLowerCase().includes('armansyah');

  const badge = getCategoryBadge();

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${badge.bg}`}>
              {badge.label}
            </span>

            {isArmansyahSource ? (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-500/15 text-amber-900 border border-amber-400/40 flex items-center gap-1">
                ⭐ Arsip Armansyah
              </span>
            ) : null}

            {result.authenticity ? (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {result.authenticity}
              </span>
            ) : null}

            {result.madzhab ? (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-blue-50 text-blue-800 border border-blue-200">
                ⚖️ {result.madzhab}
              </span>
            ) : null}
          </div>

          {/* Arabic Font Zoom Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-[11px] mr-1">Huruf Arab:</span>
            <button
              onClick={() => setArabicSize(prev => Math.max(20, prev - 2))}
              className="p-1 hover:bg-white rounded text-slate-700 transition"
              title="Perkecil Teks Arab"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-slate-800">{arabicSize}px</span>
            <button
              onClick={() => setArabicSize(prev => Math.min(42, prev + 2))}
              className="p-1 hover:bg-white rounded text-slate-700 transition"
              title="Perbesar Teks Arab"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-snug">
          {result.title}
        </h3>
        <p className="text-xs font-semibold text-emerald-800 mt-1 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          {result.reference}
        </p>
      </div>

      {/* Arabic Text Display (Jumbo, High Readability with Harakat) */}
      <div className="p-5 sm:p-6 bg-amber-50/30 border-b border-slate-100">
        <div
          dir="rtl"
          style={{ fontSize: `${arabicSize}px`, lineHeight: 2.3 }}
          className="font-arabic text-emerald-950 font-medium select-text text-right"
        >
          {result.arabicText}
        </div>

        {/* Latin Transliteration if present */}
        {result.latinTransliteration && (
          <p className="mt-3 text-xs text-slate-500 italic font-serif leading-relaxed border-t border-amber-200/50 pt-2.5">
            {result.latinTransliteration}
          </p>
        )}
      </div>

      {/* Translations Area with English Toggle */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Translation Mode Buttons */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Terjemahan & Penjelasan
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('id')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                viewMode === 'id' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇩 Indonesia
            </button>
            <button
              onClick={() => setViewMode('en')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                viewMode === 'en' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                viewMode === 'both' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dua Bahasa
            </button>
          </div>
        </div>

        {/* Indonesian translation */}
        {(viewMode === 'id' || viewMode === 'both') && (
          <div className="space-y-1">
            {viewMode === 'both' && (
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Terjemahan Bahasa Indonesia:
              </span>
            )}
            <p className="text-sm text-slate-800 leading-relaxed text-justify-custom font-normal">
              "{result.indonesianTranslation}"
            </p>
          </div>
        )}

        {/* English translation */}
        {(viewMode === 'en' || viewMode === 'both') && (
          <div className={`space-y-1 ${viewMode === 'both' ? 'bg-slate-50 p-3.5 rounded-xl border border-slate-200/70' : ''}`}>
            {viewMode === 'both' && (
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                English Translation:
              </span>
            )}
            <p className="text-sm text-slate-700 leading-relaxed text-justify-custom italic font-serif">
              "{result.englishTranslation || 'English translation being processed...'}"
            </p>
          </div>
        )}

        {/* Uraian & Penjelasan Lengkap (Tafsir / Syarah / Fiqih) */}
        {result.tafsir && (
          <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base border-b border-emerald-200/70 pb-2.5">
              <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Uraian & Penjelasan Lengkap (Tafsir / Syarah / Fiqih):</span>
            </div>
            <div className="text-sm sm:text-base text-slate-800 leading-relaxed text-justify-custom whitespace-pre-line space-y-2.5 font-normal">
              {result.tafsir}
            </div>
          </div>
        )}
      </div>

      {/* Sumber Rujukan-Rujukan Terverifikasi di Bagian Bawah */}
      <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span>Sumber Rujukan-Rujukan Terverifikasi:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Sumber Utama */}
          <a
            href={result.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition group"
          >
            <div className="space-y-0.5 truncate pr-2">
              <span className="font-bold text-slate-800 group-hover:text-emerald-900 block truncate">
                {result.sourceName}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {result.reference}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
          </a>

          {/* Rujukan Tambahan jika ada */}
          {result.rujukanList?.filter(r => r.url !== result.sourceUrl).map((ruj, idx) => (
            <a
              key={idx}
              href={ruj.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition group"
            >
              <div className="space-y-0.5 truncate pr-2">
                <span className="font-bold text-slate-800 group-hover:text-emerald-900 block truncate">
                  {ruj.name}
                </span>
                {ruj.detail && (
                  <span className="text-[11px] text-slate-500 block truncate">
                    {ruj.detail}
                  </span>
                )}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Card Action Bar */}
      <div className="px-5 sm:px-6 py-3 bg-slate-100/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 text-[11px] font-medium">
          Diverifikasi dengan rujukan kitab otoritatif & literatur ilmiah
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(result.arabicText, 'arab')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors flex items-center gap-1"
            title="Salin Teks Arab"
          >
            {copied === 'arab' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === 'arab' ? 'Tersalin' : 'Arab'}</span>
          </button>

          <button
            onClick={() => handleCopy(`${result.title}\n\n${result.arabicText}\n\nArtinya:\n${result.indonesianTranslation}\n\nEnglish:\n${result.englishTranslation || ''}\n\nUraian Tafsir/Syarah:\n${result.tafsir || ''}\n\nSumber: ${result.reference} (${result.sourceName} - ${result.sourceUrl})`, 'all')}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center gap-1 shadow-xs"
            title="Salin Seluruh Dalil, Terjemah, Penjelasan & Sumber"
          >
            {copied === 'all' ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === 'all' ? 'Tersalin Lengkap' : 'Salin Lengkap'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
