import React from 'react';
import { BookOpen, ExternalLink, Globe, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onOpenDeveloperProfile: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDeveloperProfile }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 no-print mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow">
                🕌
              </div>
              <span className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
                Al-Bayan <span className="font-arabic text-amber-400 text-lg font-normal">البيان</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg text-justify-custom">
              Portal kecerdasan buatan studi Islam komprehensif untuk pencarian kata/kalimat, topik, ayat Al-Qur'an, hadits, dan fiqih 4 mazhab dengan rujukan otoritatif, serta studio generator khutbah Jumat dan ceramah berdurasi kustom.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenDeveloperProfile}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 rounded-lg text-xs font-semibold border border-emerald-600/40 transition-all shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                Lihat Profil & Buku Karya Armansyah
              </button>
            </div>
          </div>

          {/* Sumber Rujukan Utama */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Rujukan Otoritatif Utama
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://arsiparmansyah.wordpress.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-amber-400" /> Arsip Armansyah (Blog Pribadi)
                </a>
              </li>
              <li>
                <a href="https://shamela.ws/book/23604" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> Shamela (Mawsu'ah Fiqhiyyah)
                </a>
              </li>
              <li>
                <a href="https://www.carihadits.id/imam" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> Cari Hadits 9 Imam
                </a>
              </li>
              <li>
                <a href="https://hadits.tazkia.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> Hadits Tazkia
                </a>
              </li>
              <li>
                <a href="https://quranweb.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> QuranWeb Indonesia
                </a>
              </li>
              <li>
                <a href="https://tafsirweb.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> TafsirWeb Lengkap
                </a>
              </li>
              <li>
                <a href="https://muhamadbasuki.web.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" /> Muhamad Basuki Fiqih
                </a>
              </li>
            </ul>
          </div>

          {/* Fitur Utama */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Fitur Aplikasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Pencarian Lintas 7 Rujukan & Jurnal</li>
              <li>Teks Arab Berharakat Jelas & Terjemahan ID/EN</li>
              <li>Generator Khutbah Jumat 5 Rukun Fiqih</li>
              <li>Kultum & Ceramah Durasi Kustom (7, 15, 30, 40+ mnt)</li>
              <li>10 Contoh Pembukaan MC & Khutbah Innal Hamda Lillah</li>
              <li>Format Siap Cetak A4 Justify Rapi & Bebas Scrollbar</li>
              <li>Mode Mimbar / Teleprompter dengan Countdown Timer</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with required credit */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-sm">
              Dikembangkan oleh Armansyah
            </span>
            <span className="text-slate-600">|</span>
            <a
              href="https://arsiparmansyah.wordpress.com/daftar-buku-arman/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Katalog Buku & Tulisan
            </a>
          </div>

          <p className="text-slate-500">
            Al-Bayan v2.0 &bull; Didedikasikan untuk kemaslahatan dakwah Islam & penuntut ilmu.
          </p>
        </div>
      </div>
    </footer>
  );
};
