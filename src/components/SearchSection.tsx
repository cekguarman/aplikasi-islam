import React, { useState } from 'react';
import { Search, Sparkles, X, BookOpen, ExternalLink, Filter } from 'lucide-react';
import { SearchResult, ResearchSynthesis } from '../types';
import { searchIslamicContent } from '../services/api';
import { saveSearchHistory } from '../services/storage';
import { SearchResultCard } from './SearchResultCard';

interface SearchModeOption {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  tagline: string;
  placeholder: string;
}

const SEARCH_MODES: SearchModeOption[] = [
  {
    id: 'all',
    label: 'Semua Rujukan',
    icon: '🌐',
    tagline: "Eksplorasi lintas Al-Qur'an, Hadits, Fiqih 4 Mazhab, Arsip Armansyah & Jurnal",
    placeholder: 'Cari kata/kalimat, topik, surah, nomor hadits, masalah fiqih, tafsir...'
  },
  {
    id: 'quran',
    label: "Ayat Al-Qur'an",
    icon: '📖',
    badge: 'Tafsir Muktamad',
    tagline: "Teks Arab berharakat lengkap, asbabun nuzul & syarah tafsir Ibnu Katsir/Thabari",
    placeholder: "Cari ayat Al-Qur'an, nama surah, nomor ayat, atau tema (misal: Al-Baqarah 183, riba, sabar)..."
  },
  {
    id: 'hadith',
    label: 'Hadits Nabawi',
    icon: '📜',
    badge: '9 Imam',
    tagline: 'Kutubus Sittah & 9 Imam, sanad, derajat kesahihan & syarah Fathul Bari/Nawawi',
    placeholder: 'Cari hadits 9 imam, matan sabda Nabi ﷺ, nomor hadits (misal: Arbain 1, Bukhari niat, Muslim)...'
  },
  {
    id: 'fiqh',
    label: 'Fiqih 4 Mazhab',
    icon: '⚖️',
    badge: "Al-Mawsu'ah",
    tagline: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah 45 jilid: Hanafi, Maliki, Syafi'i, Hanbali",
    placeholder: 'Cari masalah fiqih 4 mazhab, hukum ibadah/muamalah (misal: hukum anjing, rukun wudhu, khutbah)...'
  },
  {
    id: 'artikel',
    label: 'Tafsir & Kajian',
    icon: '📚',
    badge: 'Arsip Armansyah',
    tagline: 'Riset buku Armansyah, telaah kritis, eskatologi, sains Islam & kristologi',
    placeholder: 'Cari riset buku Armansyah, misteri syahadat, Isa Al-Masih, sains Israk Mikraj, jejak nabi palsu...'
  }
];

interface SearchSectionProps {
  initialQuery?: string;
  initialCategory?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  initialQuery = '',
  initialCategory = 'all'
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [synthesis, setSynthesis] = useState<ResearchSynthesis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchSource, setSearchSource] = useState<string>('local');

  const activeMode = SEARCH_MODES.find(m => m.id === category) || SEARCH_MODES[0];

  const handleSearch = async (searchTerm?: string, selectedCategory?: string) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    const cat = selectedCategory !== undefined ? selectedCategory : category;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchIslamicContent(q, cat);
      setResults(data.results);
      setSearchSource(data.source);
      if (data.synthesis) {
        setSynthesis(data.synthesis);
      } else {
        setSynthesis(null);
      }
      if (q.trim()) {
        saveSearchHistory(q, cat, data.results.length);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    handleSearch(query, newCategory);
  };

  // Initial load
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setCategory(initialCategory);
      handleSearch(initialQuery, initialCategory);
    } else {
      handleSearch('', category);
    }
  }, [initialQuery, initialCategory]);

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        {/* Background Decorative Motif */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Multi-Source Islamic Knowledge Engine
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Pencarian Dalil, Ayat, Hadits & Masail Fiqih
          </h1>

          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed text-justify-custom">
            Telusuri ayat Al-Qur'an, tafsir dan hadits  serta ensiklopedia fiqih mazhab
          </p>

          {/* Search Category Selector Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                Pilih Kategori Pencarian Terfokus:
              </span>
              <span className="hidden sm:inline text-emerald-300/90 text-[11px] font-medium">
                {activeMode.tagline}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SEARCH_MODES.map((mode) => {
                const isActive = category === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleCategorySelect(mode.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isActive
                        ? 'bg-amber-400 text-emerald-950 font-bold shadow-md scale-[1.02] ring-2 ring-amber-300/70'
                        : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800 hover:text-white border border-emerald-700/60'
                    }`}
                  >
                    <span className="text-sm sm:text-base">{mode.icon}</span>
                    <span>{mode.label}</span>
                    {mode.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-950/20 text-emerald-950'
                            : 'bg-emerald-800/90 text-amber-300 border border-amber-300/30'
                        }`}
                      >
                        {mode.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input Box */}
          <div className="pt-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white border-2 border-emerald-500/20 focus-within:border-amber-400 transition"
            >
              <div className="pl-4 sm:pl-5 text-slate-400 flex items-center gap-2 shrink-0">
                <Search className="w-5 h-5 text-emerald-700" />
                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span>{activeMode.icon}</span>
                  <span>{activeMode.label}</span>
                </span>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={activeMode.placeholder}
                className="w-full py-4 px-3 sm:px-4 text-slate-800 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    handleSearch('', category);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                  title="Bersihkan kata kunci"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-5 sm:px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Cari</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Exploration Source Coverage Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 border-b border-slate-200/90 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-300/70">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Mode: {activeMode.icon} {activeMode.label}
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline text-slate-600">{activeMode.tagline}</span>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong>{results.length}</strong> rujukan riset detil & padat
        </div>
      </div>

      {/* Kesimpulan & Sintesis Riset Cerdas (AI Multi-Source Research Intelligence) */}
      {synthesis && (
        <section className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-700/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-sm">
                ✦
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Sintesis Cerdas Riset Islam Lintas Rujukan
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Kesimpulan & Analisis: {synthesis.topic}
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 text-xs font-medium">
              Eksplorasi Otomatis Terpadu
            </span>
          </div>

          {/* Grid Kesimpulan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* Kesimpulan Utama */}
            <div className="bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-800/60 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                📌 Kesimpulan Utama:
              </span>
              <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                {synthesis.kesimpulanUtama}
              </p>
            </div>

            {/* Landasan Dalil */}
            <div className="bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-800/60 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                📖 Landasan Dalil Al-Qur'an & Sunnah:
              </span>
              <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                {synthesis.tinjauanDalil}
              </p>
            </div>

            {/* Tinjauan 4 Mazhab */}
            <div className="bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-800/60 space-y-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                ⚖️ Tinjauan Fiqih 4 Mazhab (Al-Mawsu'ah al-Kuwaitiyyah):
              </span>
              <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                {synthesis.tinjauanMazhab}
              </p>
            </div>

            {/* Catatan Kritis Arsip Armansyah */}
            {synthesis.catatanKritisArmansyah && (
              <div className="bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-amber-600/40 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  ⭐ Riset & Catatan Kritis Arsip Armansyah:
                </span>
                <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                  {synthesis.catatanKritisArmansyah}
                </p>
              </div>
            )}
          </div>

          {/* Rujukan Primer yang Dieksplorasi */}
          <div className="border-t border-emerald-800/80 pt-4 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Sumber-Sumber Rujukan Primer yang Dieksplorasi Sistem:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {synthesis.rujukanPrimer.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-800/50 border border-emerald-800/60 transition flex items-center justify-between group"
                >
                  <span className="text-emerald-200 group-hover:text-amber-200 truncate font-medium">
                    {r.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:text-amber-300 shrink-0 ml-1.5" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-800 border-t-amber-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              Mengeksplorasi {activeMode.label} & Seluruh Rujukan Otoritatif Terkait...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {results.map((res) => (
              <SearchResultCard key={res.id} result={res} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-lg text-slate-800">
              Tidak Ada Rujukan Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ketikkan kata kunci apapun seperti "sholat", "anjing", "syahadat", "puasa", "zakat", atau topik hukum lainnya untuk eksplorasi instan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
