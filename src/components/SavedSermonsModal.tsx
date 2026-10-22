import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, Calendar, Trash2, Edit3, Download, Printer, Search, FileText } from 'lucide-react';
import { SavedSermon, SavedSearchHistory } from '../types';
import { getSavedSermons, deleteSermon, getSavedSearchHistory, clearSearchHistory } from '../services/storage';

interface SavedSermonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSermon: (sermon: SavedSermon) => void;
  onSelectSearch?: (query: string, category: string) => void;
}

export const SavedSermonsModal: React.FC<SavedSermonsModalProps> = ({
  isOpen,
  onClose,
  onSelectSermon,
  onSelectSearch
}) => {
  const [activeTab, setActiveTab] = useState<'sermons' | 'searches'>('sermons');
  const [sermons, setSermons] = useState<SavedSermon[]>([]);
  const [searches, setSearches] = useState<SavedSearchHistory[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSermons(getSavedSermons());
      setSearches(getSavedSearchHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteSermon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus naskah ini dari riwayat tersimpan?')) {
      const updated = deleteSermon(id);
      setSermons(updated);
    }
  };

  const handleClearSearches = () => {
    if (confirm('Bersihkan seluruh riwayat pencarian?')) {
      clearSearchHistory();
      setSearches([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Riwayat Naskah & Pencarian Tersimpan
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Buka kembali, edit naskah, atau unduh ulang apa yang pernah Anda buat dan cari sebelumnya.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('sermons')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sermons'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Naskah Khutbah/Ceramah</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {sermons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('searches')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'searches'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Riwayat Pencarian Dalil</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {searches.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'sermons' ? (
            sermons.length > 0 ? (
              <div className="space-y-4">
                {sermons.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSermon(s);
                      onClose();
                    }}
                    className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          s.type === 'khutbah_jumat' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.type === 'khutbah_jumat' ? 'Khutbah Jum\'at' : 'Ceramah'}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {s.durationMinutes} Menit
                        </span>
                        {s.isCustomEdited && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">
                            Kustom Diedit
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition">
                        {s.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-emerald-900 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {s.fullDisplay || `${s.dayName}, ${s.formattedDate} pukul ${s.formattedTime}`}
                        </span>
                        <span>&bull;</span>
                        <span>{s.wordCount} Kata</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSermon(s);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Buka & Edit
                      </button>

                      <button
                        onClick={(e) => handleDeleteSermon(s.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Belum Ada Naskah yang Disimpan</p>
                <p className="text-xs">
                  Buat naskah khutbah atau ceramah baru di tab Studio Khutbah, lalu klik tombol "Simpan".
                </p>
              </div>
            )
          ) : (
            searches.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Riwayat kata kunci pencarian dalil terakhir:
                  </span>
                  <button
                    onClick={handleClearSearches}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Hapus Semua Riwayat
                  </button>
                </div>

                {searches.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      if (onSelectSearch) {
                        onSelectSearch(h.query, h.category);
                        onClose();
                      }
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition bg-white flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          "{h.query}"
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Kategori: {h.category}</span>
                          <span>&bull;</span>
                          <span>{h.fullDisplay}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      Cari Ulang &rarr;
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Belum Ada Riwayat Pencarian</p>
                <p className="text-xs">
                  Pencarian kata kunci dalil, ayat, atau fiqih akan otomatis dicatat di sini.
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
