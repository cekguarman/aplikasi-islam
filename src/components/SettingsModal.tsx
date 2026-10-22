import React, { useState } from 'react';
import { X, Key, Sparkles, Check, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredApiKey(apiKey.trim());
    onKeySaved(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Pengaturan Gemini AI
              </h2>
              <p className="text-xs text-slate-400">
                Hubungkan Google Gemini API untuk kecerdasan pencarian & khutbah dinamis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Aplikasi Tetap Berfungsi Offline & Tanpa API Key
            </div>
            <p className="text-slate-600 text-justify-custom text-[11px] leading-relaxed">
              Al-Bayan telah dilengkapi dengan basis data lokal ribuan dalil, ayat, hadits 9 imam, fiqih 4 mazhab Mawsu'ah Kuwaitiyyah, dan katalog buku Arsip Armansyah. Menambahkan Google Gemini API Key gratis (menggunakan model resmi Gemini 2.5 Flash berkecepatan tinggi) akan mengaktifkan eksplorasi cerdas secara instan, terjemahan kilat, dan analisis teks mendalam yang padat dan detil.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Tersimpan aman di browser Anda (localStorage).</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                Dapatkan API Key Gratis <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4 text-amber-300" /> : <Key className="w-4 h-4" />}
            <span>{saved ? 'Berhasil Disimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
