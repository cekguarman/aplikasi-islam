import React, { useState } from 'react';
import {
  Mic, BookOpen, Clock, Sparkles, Printer, Share2, Copy, Check,
  Download, Edit3, Eye, Save, Globe, AlertCircle, ChevronDown, CheckCircle, FileText
} from 'lucide-react';
import { KhutbahResult, SavedSermon } from '../types';
import { PEMBUKAAN_OPTIONS } from '../data/pembukaanData';
import { generateKhutbahApi } from '../services/api';
import { getIndonesianDateTime, saveSermon } from '../services/storage';
import { PrintableSermon } from './PrintableSermon';

interface KhutbahGeneratorProps {
  onOpenTeleprompter: (sermon: KhutbahResult | SavedSermon) => void;
  initialSermon?: KhutbahResult | SavedSermon | null;
  onSavedSermonSuccess?: () => void;
}

export const KhutbahGenerator: React.FC<KhutbahGeneratorProps> = ({
  onOpenTeleprompter,
  initialSermon,
  onSavedSermonSuccess
}) => {
  // Input States
  const [topic, setTopic] = useState<string>(initialSermon?.topic || '');
  const [type, setType] = useState<'khutbah_jumat' | 'ceramah'>(initialSermon?.type || 'khutbah_jumat');
  const [duration, setDuration] = useState<number>(initialSermon?.durationMinutes || 15);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [openingId, setOpeningId] = useState<number>(7); // Default Khutbatul Hajah
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'read' | 'edit' | 'print' | 'english'>('read');

  // Result & Edit States
  const [result, setResult] = useState<KhutbahResult | SavedSermon | null>(initialSermon || null);
  const [editableMarkdown, setEditableMarkdown] = useState<string>(initialSermon?.fullMarkdown || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [arabicSize, setArabicSize] = useState<number>(26);

  const estimatedWordCount = Math.round(duration * 130);

  // Suggested Topics
  const topicSuggestions = [
    "Kejujuran dan Integritas dalam Bekerja dan Bermuamalah",
    "Menjaga Lisan dan Adab Bermedia Sosial di Era Digital",
    "Birrul Walidain: Menghormati dan Berbakti pada Orang Tua",
    "Misteri Kedahsyatan Dua Kalimat Syahadat dan Takdir",
    "Fadhilah dan Keutamaan Sholat Berjamaah di Masjid",
    "Pentingnya Menuntut Ilmu Agama dan Menjaga Akidah",
    "Tanggung Jawab Menjaga Hak Sesama dan Bahaya Kezaliman"
  ];

  const handleDurationPreset = (mins: number) => {
    setDuration(mins);
    setCustomMinutes('');
  };

  const handleCustomMinutesChange = (val: string) => {
    setCustomMinutes(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setDuration(num);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setSavedSuccess(false);

    try {
      const data = await generateKhutbahApi({
        topic: topic.trim(),
        type,
        durationMinutes: duration,
        openingId
      });

      const dt = getIndonesianDateTime();
      const withMeta: KhutbahResult = {
        ...data.result,
        createdMeta: dt
      };

      setResult(withMeta);
      setEditableMarkdown(data.result.fullMarkdown);
      setActiveTab('read');
    } catch (err) {
      console.error('Failed generating khutbah:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCollection = () => {
    if (!result) return;
    const dt = getIndonesianDateTime();

    const toSave: SavedSermon = {
      id: result.id || `sermon-${Date.now()}`,
      title: `${type === 'khutbah_jumat' ? 'Khutbah Jumat' : 'Ceramah'}: ${result.topic}`,
      topic: result.topic,
      type: result.type,
      durationMinutes: result.durationMinutes,
      wordCount: Math.round(editableMarkdown.split(/\s+/).length),
      openingTitle: result.openingSelected?.title || 'Mukaddimah',
      fullMarkdown: editableMarkdown,
      englishTranslation: result.englishTranslation,
      timestamp: new Date().toISOString(),
      dayName: dt.dayName,
      formattedDate: dt.formattedDate,
      formattedTime: dt.formattedTime,
      fullDisplay: dt.fullDisplay,
      isCustomEdited: editableMarkdown !== result.fullMarkdown
    };

    saveSermon(toSave);
    setSavedSuccess(true);
    if (onSavedSermonSuccess) onSavedSermonSuccess();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(editableMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!editableMarkdown) return;
    const textToShare = `*${type === 'khutbah_jumat' ? 'NASKAH KHUTBAH JUMAT' : 'NASKAH CERAMAH ISLAM'}*\n*Topik:* ${topic}\n*Durasi:* ${duration} Menit\n\n${editableMarkdown.substring(0, 1800)}...\n\n_Dibuat dengan Al-Bayan - Dikembangkan oleh Armansyah_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
  };

  const handleDownloadDoc = () => {
    if (!editableMarkdown) return;
    const element = document.createElement("a");
    const file = new Blob([editableMarkdown], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}_${topic.replace(/[^a-zA-Z0-9]/g, '_')}_${duration}menit.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedOpening = PEMBUKAAN_OPTIONS.find(p => p.id === openingId) || PEMBUKAAN_OPTIONS[6];

  return (
    <div className="space-y-8">
      {/* Configuration Form Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Mic className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Studio Generator Khutbah & Ceramah
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Buat naskah khutbah Jumat 5 rukun fiqih atau ceramah terstruktur dengan durasi kustom dan 10 opsi pembukaan.
            </p>
          </div>

          {/* Type Selector (Khutbah Jumat vs Ceramah) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setType('khutbah_jumat')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                type === 'khutbah_jumat'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🕌 Khutbah Jum'at (Lengkap)
            </button>
            <button
              onClick={() => setType('ceramah')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                type === 'ceramah'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎙️ Ceramah / Kultum
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Left Column: Topic & Presets */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Topik / Tema Khutbah atau Ceramah <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Misal: Kejujuran dalam Bekerja dan Muamalah..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Quick Topic Suggestions */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Inspirasi Tema Pilihan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topicSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(s)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 transition text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mukaddimah / Opening Selection from 10 Sindonews options */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pilih Teks Pembuka (Mukaddimah Innal Hamda Lillah)
              </label>
              <div className="relative">
                <select
                  value={openingId}
                  onChange={(e) => setOpeningId(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition appearance-none"
                >
                  {PEMBUKAAN_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>

              {/* Preview of selected opening */}
              <div className="mt-2.5 p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-xl text-xs space-y-1.5">
                <div
                  dir="rtl"
                  className="font-arabic text-lg text-emerald-950 font-bold leading-relaxed text-right"
                >
                  {selectedOpening.arabicText}
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  "{selectedOpening.indonesianTranslation}"
                </p>
                <span className="text-[10px] text-amber-800 font-medium block">
                  Konteks: {selectedOpening.contextUsage}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Duration & Word Calibration */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Durasi Waktu Berbicara
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                  {duration} Menit
                </span>
              </div>

              {/* Duration Presets */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDurationPreset(7)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    duration === 7 && !customMinutes
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">Kultum</div>
                  <div className="text-[11px] opacity-80">7 Menit</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDurationPreset(15)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    duration === 15 && !customMinutes
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">Ceramah Kilat</div>
                  <div className="text-[11px] opacity-80">15 Menit</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDurationPreset(30)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    duration === 30 && !customMinutes
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">Khutbah Standar</div>
                  <div className="text-[11px] opacity-80">30 Menit</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDurationPreset(40)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    duration === 40 && !customMinutes
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">Kajian Mendalam</div>
                  <div className="text-[11px] opacity-80">40 Menit</div>
                </button>
              </div>

              {/* Custom Duration Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Atau Masukkan Menit Kustom:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="3"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => handleCustomMinutesChange(e.target.value)}
                    placeholder="Contoh: 10, 25, 45..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-xs text-slate-500 font-medium">Menit</span>
                </div>
              </div>

              {/* Realtime Word Count Calibration */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Panjang Teks:</span>
                  <strong className="text-emerald-800">~{estimatedWordCount} Kata</strong>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Tempo Baca Rata-rata:</span>
                  <span>130 kata/menit</span>
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Meracik Naskah Berdasar Fiqih & Dalil...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Buat Naskah {type === 'khutbah_jumat' ? 'Khutbah' : 'Ceramah'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Result Section */}
      {result && (
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Result Toolbar (Screen Only) */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                {result.type === 'khutbah_jumat' ? 'Khutbah Jum\'at' : 'Ceramah'}
              </span>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                  {result.topic}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Durasi: {result.durationMinutes} Menit | Panjang: ~{result.wordCount} Kata
                </p>
              </div>
            </div>

            {/* Tabs & View Modes */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  onClick={() => setActiveTab('read')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeTab === 'read' ? 'bg-emerald-800 text-amber-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Pratinjau Layar
                </button>

                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeTab === 'edit' ? 'bg-emerald-800 text-amber-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Teks
                </button>

                <button
                  onClick={() => setActiveTab('print')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeTab === 'print' ? 'bg-emerald-800 text-amber-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Pratinjau Cetak A4
                </button>

                <button
                  onClick={() => setActiveTab('english')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeTab === 'english' ? 'bg-emerald-800 text-amber-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  English Version
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenTeleprompter(result)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                  title="Buka Mode Mimbar Teleprompter Layar Penuh"
                >
                  <Mic className="w-3.5 h-3.5 text-slate-950" />
                  Mode Mimbar
                </button>

                <button
                  onClick={handleSaveToCollection}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-600 transition flex items-center gap-1.5 cursor-pointer"
                  title="Simpan Naskah Lengkap dengan Tanggal & Waktu"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Tersimpan!' : 'Simpan'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Cetak Naskah ke PDF atau Kertas A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak / PDF
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition cursor-pointer"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  title="Salin Teks Naskah"
                >
                  {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleDownloadDoc}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  title="Unduh File Naskah (.md)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Tab View Body */}
          <div className="p-6 sm:p-8">
            {/* 1. Mode Edit */}
            {activeTab === 'edit' && (
              <div className="space-y-4 no-print">
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <span>
                      Anda dapat mengubah teks ceramah di bawah ini secara bebas. Klik <strong>Simpan</strong> untuk memperbarui riwayat.
                    </span>
                  </div>
                  <button
                    onClick={handleSaveToCollection}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>

                <textarea
                  value={editableMarkdown}
                  onChange={(e) => setEditableMarkdown(e.target.value)}
                  rows={25}
                  className="w-full p-4 font-mono text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                />
              </div>
            )}

            {/* 2. Mode Pratinjau Layar */}
            {activeTab === 'read' && (
              <div className="space-y-6">
                {/* Visual Header */}
                <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div>
                    <strong>Topik:</strong> {result.topic} &bull; <strong>Waktu Dibuat:</strong>{' '}
                    {result.createdMeta?.fullDisplay || 'Baru saja'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">Ukuran Teks Arab:</span>
                    <button
                      onClick={() => setArabicSize(p => Math.max(20, p - 2))}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 font-bold"
                    >
                      A-
                    </button>
                    <span className="font-mono font-bold text-slate-800">{arabicSize}px</span>
                    <button
                      onClick={() => setArabicSize(p => Math.min(40, p + 2))}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 font-bold"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Rendered Sermon Text with Justified Paragraphs */}
                <div className="prose max-w-none text-slate-800">
                  {editableMarkdown.split('\n\n').map((block, idx) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;

                    // H1
                    if (trimmed.startsWith('# ')) {
                      return (
                        <h1 key={idx} className="text-2xl font-bold text-slate-900 pb-2 border-b border-slate-200 mt-6 mb-4">
                          {trimmed.replace('# ', '')}
                        </h1>
                      );
                    }

                    // H2
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 mt-8 mb-4">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }

                    // H3
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base font-bold text-slate-800 mt-5 mb-2 border-l-4 border-emerald-700 pl-3">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }

                    // Arabic block
                    const isArabic = /[\u0600-\u06FF]/.test(trimmed) && trimmed.length > 8;
                    if (isArabic) {
                      return (
                        <div
                          key={idx}
                          dir="rtl"
                          style={{ fontSize: `${arabicSize}px`, lineHeight: 2.3 }}
                          className="font-arabic text-emerald-950 font-bold text-right p-4 bg-amber-50/40 rounded-xl border border-amber-200/50 my-4 select-text"
                        >
                          {trimmed}
                        </div>
                      );
                    }

                    // Normal paragraph: Justified
                    return (
                      <p
                        key={idx}
                        className="text-justify-custom text-slate-800 leading-relaxed text-sm sm:text-base mb-4 hyphens-auto"
                        style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                      >
                        {trimmed.replace(/^\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Mode Pratinjau Cetak A4 (Zero scrollbars, Zero frames, Justified text) */}
            {activeTab === 'print' && (
              <div className="space-y-4">
                <div className="no-print bg-slate-100 border border-slate-300 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-700">
                    <strong>Format Lembar A4 Siap Cetak:</strong> Seluruh teks paragraf di-justify rapi, teks Arab berharakat besar dan bersih, bebas dari scrollbar atau bingkai tangkapan layar.
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Sekarang / Simpan PDF
                  </button>
                </div>

                {/* Isolated Clean A4 Sheet */}
                <div className="border border-slate-300 rounded-xl bg-white shadow-md p-2 overflow-visible">
                  <PrintableSermon
                    sermon={{
                      ...result,
                      fullMarkdown: editableMarkdown
                    }}
                    dateMeta={result.createdMeta}
                  />
                </div>
              </div>
            )}

            {/* 4. English Version */}
            {activeTab === 'english' && (
              <div className="space-y-4 font-serif text-slate-800">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900">
                  <strong>English Translation & Summary:</strong> Complete English rendering of the sermon suitable for international congregations or dual-language study.
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-justify-custom leading-relaxed">
                  {result.englishTranslation?.split('\n\n').map((p, idx) => (
                    <p key={idx} className="text-sm text-slate-700 leading-relaxed text-justify-custom">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hidden printable A4 element for native window.print() */}
      {result && (
        <div className="hidden print:block">
          <PrintableSermon
            sermon={{
              ...result,
              fullMarkdown: editableMarkdown
            }}
            dateMeta={result.createdMeta}
          />
        </div>
      )}
    </div>
  );
};
