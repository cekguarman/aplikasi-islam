import React, { useState } from 'react';
import { Search, Sparkles, Filter, X, BookOpen, Scroll, Scale, FileText, Globe } from 'lucide-react';
import { SearchResult, SourceCategory } from '../types';
import { searchIslamicContent } from '../services/api';
import { saveSearchHistory } from '../services/storage';
import { SearchResultCard } from './SearchResultCard';

export const SearchSection: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchSource, setSearchSource] = useState<string>('local');

  const popularKeywords = [
    "Misteri Kecerdasan Syahadat",
    "Rekonstruksi Isa Al-Masih",
    "Hukum Anjing dalam Fiqih",
    "Rukun Khutbah Jumat 4 Mazhab",
    "Menjaga Lisan (Qawlan Sadida)",
    "Adab dan Fiqih Berhutang",
    "Niat Penentu Amal (Innamal A'mal)",
    "Ramalan Imam Mahdi",
    "Israk Mikraj Tinjauan Sains",
    "Larangan Riba & Jual Beli Halal"
  ];

  const handleSearch = async (searchTerm?: string, selectedCat?: string) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    const cat = selectedCat !== undefined ? selectedCat : category;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchIslamicContent(q, cat);
      setResults(data.results);
      setSearchSource(data.source);
      if (q.trim()) {
        saveSearchHistory(q, cat, data.results.length);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    handleSearch(query, cat);
  };

  const handleQuickKeyword = (kw: string) => {
    setQuery(kw);
    handleSearch(kw, category);
  };

  // Initial load
  React.useEffect(() => {
    handleSearch('', 'all');
  }, []);

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        {/* Background Decorative Motif */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Multi-Source Islamic Knowledge Engine
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Pencarian Dalil, Ayat, Hadits & Masail Fiqih
          </h1>

          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed text-justify-custom">
            Telusuri ayat Al-Qur'an dan tafsir, hadits 9 imam, ensiklopedia fiqih 4 mazhab Al-Mawsu'ah al-Kuwaitiyyah, serta repositori riset Islam & perbandingan agama <strong>Arsip Armansyah</strong> dan literatur kredibel lainnya.
          </p>

          {/* Search Input Box */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white"
            >
              <div className="pl-4 sm:pl-5 text-slate-400">
                <Search className="w-5 h-5 text-emerald-700" />
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kata/kalimat, topik, surah, nomor hadits, masalah fiqih..."
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

          {/* Popular Tag Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-emerald-300 font-semibold mr-1">Rekomendasi Topik:</span>
            {popularKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickKeyword(kw)}
                className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-amber-400/20 text-emerald-100 hover:text-amber-200 border border-emerald-700/60 transition-all text-[11px]"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              category === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Sumber
          </button>

          <button
            onClick={() => handleCategoryChange('quran')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              category === 'quran'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Al-Qur'an & Tafsir
          </button>

          <button
            onClick={() => handleCategoryChange('hadith')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              category === 'hadith'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-600" />
            Hadits 9 Imam
          </button>

          <button
            onClick={() => handleCategoryChange('fiqh')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              category === 'fiqh'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 text-blue-600" />
            Fiqih 4 Mazhab
          </button>

          <button
            onClick={() => handleCategoryChange('artikel')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              category === 'artikel'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" />
            Kajian & Arsip Armansyah
          </button>
        </div>

        {/* Results Counter & Source Info */}
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>Menampilkan <strong>{results.length}</strong> rujukan</span>
          <span className="text-slate-300">&bull;</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {searchSource === 'gemini' ? 'AI Grounded Search' : 'Basis Data Otoritatif'}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-800 border-t-amber-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              Menelusuri Al-Qur'an, Hadits, Fiqih 4 Mazhab, Arsip Armansyah & Jurnal Ilmiah...
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
              Tidak Ada Rujukan Langsung Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Coba gunakan kata kunci umum seperti "sholat", "taqwa", "syahadat", "puasa", "zakat", atau pilih kategori "Semua Sumber".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
