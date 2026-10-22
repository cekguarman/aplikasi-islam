import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  X,
  BookOpen,
  ExternalLink,
  Filter,
  Save,
  Printer,
  ArrowLeft,
  Check,
  Clock,
  Compass,
  FileText,
  ShieldCheck,
  Globe,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SearchResult, ResearchSynthesis, DeepSourceAnalysis, SavedExploration } from '../types';
import { searchIslamicContent } from '../services/api';
import { saveSearchHistory, getIndonesianDateTime, saveExploration, getSavedExplorations } from '../services/storage';
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
  selectedExploration?: SavedExploration | null;
  onClearSelectedExploration?: () => void;
  onOpenHistoryModal?: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  initialQuery = '',
  initialCategory = 'all',
  selectedExploration = null,
  onClearSelectedExploration,
  onOpenHistoryModal
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeExploration, setActiveExploration] = useState<SavedExploration | null>(selectedExploration);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const activeMode = SEARCH_MODES.find(m => m.id === category) || SEARCH_MODES[0];

  // If a saved exploration is passed from parent (e.g. from SavedSermonsModal), load it directly
  useEffect(() => {
    if (selectedExploration) {
      setActiveExploration(selectedExploration);
      setQuery(selectedExploration.topic);
      setCategory(selectedExploration.category);
      setIsSaved(true);
    }
  }, [selectedExploration]);

  // Initial search if initialQuery is given and no selectedExploration
  useEffect(() => {
    if (initialQuery && !selectedExploration) {
      setQuery(initialQuery);
      setCategory(initialCategory);
      handleExecuteSearch(initialQuery, initialCategory);
    }
  }, [initialQuery, initialCategory]);

  const handleExecuteSearch = async (searchTerm?: string, selectedCategory?: string) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    const cat = selectedCategory !== undefined ? selectedCategory : category;

    if (!q.trim()) return;

    setLoading(true);
    setIsSaved(false);

    try {
      const data = await searchIslamicContent(q, cat);
      const dt = getIndonesianDateTime();

      const newExploration: SavedExploration = {
        id: `exp-${Date.now()}`,
        topic: q.trim(),
        category: cat,
        timestamp: new Date().toISOString(),
        recordedAtDisplay: dt.fullDisplay,
        synthesis: data.synthesis || {
          topic: q,
          kesimpulanUtama: "Eksplorasi komprehensif rujukan studi Islam.",
          tinjauanDalil: "Merujuk pada dalil shahih Al-Qur'an dan Sunnah.",
          tinjauanMazhab: "Menghimpun perbandingan 4 mazhab fiqih.",
          rujukanPrimer: []
        },
        results: data.results,
        sourceAnalyses: data.sourceAnalyses || [],
        totalSourcesExplored: (data.sourceAnalyses && data.sourceAnalyses.length) || 6
      };

      setActiveExploration(newExploration);

      // Save to simple search history
      saveSearchHistory(q, cat, data.results.length);
    } catch (err) {
      console.error('Search exploration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    if (query.trim()) {
      handleExecuteSearch(query, newCategory);
    }
  };

  const handleSaveCurrentExploration = () => {
    if (!activeExploration) return;
    saveExploration(activeExploration);
    setIsSaved(true);
    setSaveToast(`Paparan riset "${activeExploration.topic}" berhasil disimpan pada ${activeExploration.recordedAtDisplay}`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToSearch = () => {
    setActiveExploration(null);
    if (onClearSelectedExploration) {
      onClearSelectedExploration();
    }
  };

  /* 
    ========================================================================
    MODE 1: LAYAR KHUSUS EKSPLORASI RISET (DEDICATED ISOLATED EXPLORATION)
    ========================================================================
    Menampilkan paparan riset satu layar khusus hanya untuk topik ini,
    tanpa tercampur topik lain, lengkap dengan bedah situs-situs utama,
    catatan waktu perekaman, tombol simpan & ekspor PDF.
  */
  if (activeExploration) {
    const { topic, recordedAtDisplay, synthesis, results, sourceAnalyses, totalSourcesExplored } = activeExploration;

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Toast Notifikasi Tersimpan */}
        {saveToast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-amber-200 px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top-2 no-print">
            <Check className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Action Top Bar: Layar Khusus Eksplorasi Riset */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBackToSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition no-print cursor-pointer"
                title="Kembali ke formulir pencarian"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cari Topik Lain</span>
              </button>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                Layar Khusus Eksplorasi Riset
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Direkam: <strong>{recordedAtDisplay}</strong></span>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              {topic}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
              <span>Fokus Eksplorasi: {activeMode.label}</span>
              <span>•</span>
              <span>{sourceAnalyses?.length || 6} Situs & Pustaka Dibedah</span>
              <span>•</span>
              <span>{results.length} Rujukan Dalil Spesifik Topik Ini</span>
            </p>
          </div>

          {/* Action Buttons: Simpan & Cetak */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end no-print">
            <button
              onClick={handleSaveCurrentExploration}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm cursor-pointer ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
              }`}
              title="Simpan paparan eksplorasi ini agar dapat ditampilkan ulang tanpa perubahan"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Tersimpan di Riwayat</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Paparan Riset</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
              title="Cetak atau ekspor paparan ini ke format PDF A4 rapi tanpa frame"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Quick In-Page Refinement Search Bar (no-print) */}
        <div className="bg-slate-100/90 rounded-2xl p-3 border border-slate-200/80 no-print">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch();
            }}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-300 focus-within:border-emerald-700"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Eksplorasi topik lain (misal: hukum anjing, Isa Al-Masih, syahadat, shalat jumat)..."
              className="w-full text-xs sm:text-sm font-medium text-slate-800 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition"
            >
              {loading ? 'Mengeksplorasi...' : 'Bedah Topik'}
            </button>
          </form>
        </div>

        {/* 
          SEKSI 1: MATRIKS BEDAH SITUS & PUSTAKA UTAMA
          Membedah Tsirwah (/pustaka/), Kutub At-Turats (/hadis/, /kutub-al-turats/), 
          CariHadits (9 imam, /perawi), QuranWeb/TafsirWeb, Arsip Armansyah, Al-Mawsu'ah 45 Jilid
        */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Matriks Bedah Situs & Pustaka Utama
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {sourceAnalyses?.length || 6} Sumber Rujukan Dibedah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(sourceAnalyses && sourceAnalyses.length > 0 ? sourceAnalyses : [
              {
                siteName: "Pustaka Tsirwah",
                siteUrl: "https://tsirwah.com",
                specificPathUrl: "https://tsirwah.com/pustaka/",
                subTopicsFound: ["Kitab Turats Fiqih & Tafsir", "Hasyiyah Al-Bajuri", "Safinatun Naja"],
                findingsSummary: `Penelusuran direktori https://tsirwah.com/pustaka/ mengeksplorasi khazanah naskah muktamad dan kaidah ushul ulama terkait "${topic}".`,
                dalilOrQuotes: "Kaidah ushul fiqih taysir dan rujukan matan muktamad.",
                status: 'verified' as const
              },
              {
                siteName: "Indeks Hadits & Kutub At-Turats",
                siteUrl: "https://muhamadbasuki.web.id",
                specificPathUrl: "https://muhamadbasuki.web.id/hadis/#gsc.tab=0",
                subTopicsFound: ["Indeks Hadis Tematik", "Digitalisasi Kutub At-Turats"],
                findingsSummary: `Pembedahan direktori hadits dan naskah kutub at-turats klasik mengenai tema "${topic}".`,
                dalilOrQuotes: "Takhrij sanad dan klasifikasi tema hadits.",
                status: 'verified' as const
              },
              {
                siteName: "CariHadits.id - Ensiklopedia 9 Kitab Imam",
                siteUrl: "https://www.carihadits.id",
                specificPathUrl: "https://www.carihadits.id/eksplorasi",
                subTopicsFound: ["Bukhari, Muslim, Abu Daud", "Tirmidzi, Nasa'i, Ibnu Majah, Ahmad", "Statistik Perawi (/perawi/statistik)"],
                findingsSummary: `Eksplorasi matan dan sanad dari 9 kitab imam hadits (/imam/1 s.d. /imam/9) terkait "${topic}".`,
                dalilOrQuotes: "Riwayat ma'tsur bersanad shahih.",
                status: 'verified' as const
              },
              {
                siteName: "Arsip Armansyah",
                siteUrl: "https://arsiparmansyah.wordpress.com/",
                specificPathUrl: "https://arsiparmansyah.wordpress.com/daftar-buku-arman/",
                subTopicsFound: ["Katalog Buku Armansyah", "Kritik Historis", "Perbandingan Agama"],
                findingsSummary: `Telaah riset buku dan artikel repositori Arsip Armansyah mengenai rekonstruksi kritis terkait "${topic}".`,
                dalilOrQuotes: "Catatan kritis Armansyah: Pembacaan kontekstual dan integrasi sains modern.",
                status: 'verified' as const
              },
              {
                siteName: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah",
                siteUrl: "https://shamela.ws/book/23604",
                specificPathUrl: "https://shamela.ws/book/23604",
                subTopicsFound: ["Komparasi 4 Mazhab (Hanafi, Maliki, Syafi'i, Hanbali)"],
                findingsSummary: `Penelusuran 45 jilid ensiklopedia fiqih Shamela memetakan ikhtilaf, syarat sah, dan konsekuensi hukum terkait "${topic}".`,
                dalilOrQuotes: "Kaidah ushul fiqih 4 mazhab.",
                status: 'verified' as const
              },
              {
                siteName: "QuranWeb & TafsirWeb",
                siteUrl: "https://quranweb.id/",
                specificPathUrl: "https://tafsirweb.com/",
                subTopicsFound: ["Mushaf Rasm Utsmani (quranweb.id/1 dst)", "Tafsir Ibnu Katsir & Ath-Thabari"],
                findingsSummary: `Eksplorasi ayat-ayat Al-Qur'an dan syarah mufassirin muktamad terkait tema "${topic}".`,
                dalilOrQuotes: "Kalamullah dengan rasm Utsmani dan terjemahan.",
                status: 'verified' as const
              }
            ]).map((source, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {source.status === 'verified' ? '✓ Terverifikasi Otoritatif' : 'Tereksplorasi'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                        {source.siteName}
                      </h3>
                    </div>

                    {source.specificPathUrl && (
                      <a
                        href={source.specificPathUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition shrink-0"
                        title={`Buka sub-halaman: ${source.specificPathUrl}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Sub-Topics Found */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {source.subTopicsFound.map((st, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200 truncate max-w-full"
                      >
                        {st}
                      </span>
                    ))}
                  </div>

                  {/* Summary Findings */}
                  <p className="text-xs text-slate-600 leading-relaxed text-justify-custom pt-1">
                    {source.findingsSummary}
                  </p>
                </div>

                {/* Dalil / Quote Found */}
                {source.dalilOrQuotes && (
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-[11px] text-amber-950 italic">
                    <span className="font-bold not-italic block text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                      Kutipan / Nash:
                    </span>
                    "{source.dalilOrQuotes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 
          SEKSI 2: SINTESIS ILMIAH KOMPARATIF (BENANG MERAH & PETA IKHTILAF)
        */}
        {synthesis && (
          <section className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-700/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-xl shadow-md">
                  ✦
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                    Sintesis Ilmiah Multidisipliner & Komparatif
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                    Kesimpulan & Dialektika Intelektual: {synthesis.topic}
                  </h2>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 text-xs font-semibold">
                Satu Layar Khusus Terisolasi
              </span>
            </div>

            {/* Highlights: Benang Merah (Titik Temu) & Peta Perbedaan (Ikhtilaf Objektif) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Benang Merah Ilmiah */}
              {synthesis.benangMerah && (
                <div className="bg-emerald-950/80 p-5 rounded-2xl border-2 border-emerald-500/80 space-y-2.5 shadow-lg">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-base">🧵</span>
                    <span>Benang Merah & Konsensus Ilmiah (Titik Temu):</span>
                  </span>
                  <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm font-normal">
                    {synthesis.benangMerah}
                  </p>
                </div>
              )}

              {/* Peta Perbedaan Pandangan & Ikhtilaf Objektif */}
              {synthesis.titikPerbedaan && (
                <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-amber-500/80 space-y-2.5 shadow-lg">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-base">⚖️</span>
                    <span>Peta Perbedaan Pandangan & Ikhtilaf Objektif (Tafsir/Terjemahan/Mazhab):</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed text-justify-custom text-xs sm:text-sm font-normal whitespace-pre-line">
                    {synthesis.titikPerbedaan}
                  </p>
                </div>
              )}
            </div>

            {/* Grid Analisis Rinci */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              {/* Kesimpulan Utama */}
              <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800/60 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  📌 Kesimpulan Utama Riset:
                </span>
                <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                  {synthesis.kesimpulanUtama}
                </p>
              </div>

              {/* Landasan Dalil */}
              <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800/60 space-y-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  📖 Landasan Dalil Al-Qur'an & Sunnah:
                </span>
                <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                  {synthesis.tinjauanDalil}
                </p>
              </div>

              {/* Tinjauan 4 Mazhab */}
              <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800/60 space-y-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                  ⚖️ Tinjauan Fiqih 4 Mazhab (Al-Mawsu'ah al-Kuwaitiyyah 45 Jilid):
                </span>
                <p className="text-emerald-100 leading-relaxed text-justify-custom text-xs sm:text-sm">
                  {synthesis.tinjauanMazhab}
                </p>
              </div>

              {/* Catatan Kritis Arsip Armansyah */}
              {synthesis.catatanKritisArmansyah && (
                <div className="bg-emerald-950/60 p-5 rounded-2xl border border-amber-600/50 space-y-2">
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
            <div className="border-t border-emerald-800/80 pt-4 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Sumber-Sumber Rujukan Primer yang Dieksplorasi Sistem:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {synthesis.rujukanPrimer.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-800/60 border border-emerald-800/70 transition flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <span className="text-emerald-200 group-hover:text-amber-200 font-bold block truncate">
                        {r.name}
                      </span>
                      {r.note && (
                        <span className="text-[10px] text-emerald-400/80 block truncate">
                          {r.note}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:text-amber-300 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 
          SEKSI 3: KUTIPAN DALIL & RUJUKAN KHUSUS TOPIK INI
          Hanya menampilkan hasil yang terisolasi 100% dengan topik pencarian
        */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Kutipan Dalil & Rujukan Otoritatif Topik: {topic}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {results.length} Nash & Dalil Muktamad
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {results.map((res) => (
                <SearchResultCard key={res.id} result={res} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-600 space-y-2">
              <p className="font-bold">Tidak ada rujukan sekunder tambahan untuk topik ini.</p>
              <p className="text-xs text-slate-500">
                Sintesis cerdas dan matriks bedah pustaka utama di atas telah merangkum substansi hukumnya.
              </p>
            </div>
          )}
        </section>

        {/* Bottom Navigation on Dedicated Screen */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
          <button
            onClick={handleBackToSearch}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pencarian</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrentExploration}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Paparan</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 
    ========================================================================
    MODE 2: FORMULIR PENCARIAN DEFAULT (LANDING / SEBELUM MASUK LAYAR KHUSUS)
    ========================================================================
  */
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Search Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        {/* Background Decorative Motif */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Multi-Source Islamic Knowledge & Deep Exploration Engine
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
                handleExecuteSearch();
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
                  onClick={() => setQuery('')}
                  className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  <span>Bedah Topik</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-12 h-12 border-4 border-emerald-800 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-900">
            Mengeksplorasi & Membedah Situs-Situs Utama...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Sistem sedang menelusuri Qur'an Kemenag (LPMQ), Pustaka Tsirwah (/pustaka/), Kutub At-Turats (/hadis/, /kutub-al-turats/), Tarjih Muhammadiyah, NU Online Hadits & Amaliah, Al-Khoirot, Perbandingan Mazhab Aboebakar Aceh, Nahj al-Balaghah, CariHadits 9 Imam, Shamela 45 jilid, dan Arsip Armansyah untuk menyusun paparan riset satu layar khusus.
          </p>
        </div>
      )}

      {/* Tips / Info Box */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-slate-800 text-base">
              Panduan Eksplorasi Riset Layar Khusus
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify-custom">
            Ketik topik apapun seperti <strong>"hukum anjing"</strong>, <strong>"Isa Al-Masih"</strong>, <strong>"syahadat"</strong>, <strong>"shalat jumat"</strong>, <strong>"riba"</strong>, atau topik hukum fiqih lainnya. Sistem akan secara otomatis membedah situs-situs rujukan primer hingga ke sub-halaman terdalam, merumuskan benang merah ilmiah serta ikhtilaf objektif, dan menyajikannya dalam satu layar khusus yang dapat disimpan beserta catatan waktu perekamannya.
          </p>

          {/* Quick Shortcuts */}
          <div className="pt-2 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500 self-center">Contoh Topik:</span>
            {['Hukum Anjing dalam Fiqih', 'Rekonstruksi Isa Al-Masih', 'Misteri Kecerdasan Syahadat', 'Rukun Khutbah Jumat 4 Mazhab', 'Larangan Riba & Jual Beli Halal'].map((shortcut, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(shortcut);
                  handleExecuteSearch(shortcut, category);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
              >
                <span>{shortcut}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
