import React from 'react';
import { X, BookOpen, ExternalLink, Award, UserCheck, Globe, Calendar, CheckCircle } from 'lucide-react';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const books = [
    {
      title: "Rekonstruksi Sejarah Isa Al-Masih",
      subtitle: "Sebuah Pelurusan Sejarah & Jawaban untuk Dinasti Yesus",
      publisher: "Restu Agung Jakarta",
      year: "2008",
      isbn: "979-007-048-9",
      endorsement: "Kata Sambutan oleh Masyhud SM (Dewan Pakar FAKTA) & Muhammad Singgih Ghazali (Pengasuh SwaraMuslim)",
      theme: "Sejarah Nabi Isa Al-Masih, Kristologi Al-Qur'an & Menjawab buku James D. Tabor (The Jesus Dynasty)",
      badge: "Kristologi & Sejarah",
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "Jejak Nabi \"Palsu\"",
      subtitle: "Dari Mirza Ghulam Ahmad, Lia Aminudin hingga Ahmad Musaddiq",
      publisher: "Hikmah (Mizan Publika)",
      year: "2007",
      isbn: "978-979-114-143-7",
      endorsement: "Kata Pengantar oleh Abu Deedat Syihab MH (Ketum FAKTA) & Aris Hardinanto (Pengamat Agama Semitik)",
      theme: "Kajian Aliran Sempalan dalam Islam (Ingkar Sunnah, Syiah, Sunni, Ahmadiyah, Lia Eden, Al-Qiyadah Al-Islamiyah)",
      badge: "Kritik Pemikiran & Firqah",
      color: "from-emerald-600 to-teal-700"
    },
    {
      title: "Ramalan Imam Mahdi",
      subtitle: "Kritik Terhadap Prediksi & Kontroversi Eskatologi",
      publisher: "Serambi Ilmu Semesta",
      year: "2008",
      isbn: "978-979-024-081-0",
      endorsement: "Ulasan Kritis Menjawab buku 'Jaber Bolushi: 2015 Imam Mahdi Akan Datang'",
      theme: "Eskatologi Islam, Takhrij Hadits Tanda Kiamat, Meluruskan Klaim-klaim Penanggalan Palsu",
      badge: "Eskatologi & Hadits",
      color: "from-purple-600 to-violet-800"
    },
    {
      title: "Misteri Kecerdasan Syahadat",
      subtitle: "Memahami Rangkaian Takdir agar Sukses Dunia Akhirat",
      publisher: "Ufuq Press",
      year: "2009",
      isbn: "978-602-8224-73-4",
      endorsement: "Eksplorasi Kedahsyatan Dua Kalimat Syahadat Melampaui Pemahaman Intelektual",
      theme: "Psikologi Islam, Rahasia Takdir, Benteng Spiritual Jiwa, & Hikmah Keimanan",
      badge: "Psikologi Islam & Tauhid",
      color: "from-amber-600 to-amber-800"
    },
    {
      title: "Israk & Mikraj: Tinjauan Saintifik di Sebalik Kontroversi",
      subtitle: "Jawaban Terhadap Golongan Ingkar Hadits & Keraguan Ilmiah",
      publisher: "PTS Islamika Sdn Bhd (Malaysia)",
      year: "2011",
      isbn: "978-967-5137-91-5",
      endorsement: "Diterbitkan dan beredar luas di Malaysia dan kawasan serantau Nusantara",
      theme: "Mukjizat Kenabian, Integrasi Fisika Modern & Relativitas dengan Nash Al-Qur'an dan Sunnah",
      badge: "Sains & Mukjizat",
      color: "from-cyan-600 to-blue-800"
    },
    {
      title: "Hukum Anjing Didalam Islam",
      subtitle: "Kajian Komprehensif Fiqih Komparatif & Takhrij Hadits",
      publisher: "Publikasi Mandiri & E-Book",
      year: "2016",
      isbn: "978-131-0289-255",
      endorsement: "Membedah persepsi tunggal tafsir fiqih dengan rujukan 4 Mazhab (khususnya Mazhab Maliki)",
      theme: "Fiqih Muamalah Hewan, Thaharah, Kajian Hadits Bejana, & Kritik Sosial Perlakuan Terhadap Hewan",
      badge: "Fiqih Komparatif",
      color: "from-rose-600 to-rose-800"
    },
    {
      title: "Dan Tuhan Ciptakan Anjing",
      subtitle: "Perspektif Lengkap Ulama Salaf & Khalaf",
      publisher: "Dubook Press Sdn Bhd (Malaysia)",
      year: "2018",
      isbn: "978-967-2108-18-4",
      endorsement: "Diterbitkan khusus untuk pembaca Malaysia dan Asia Tenggara",
      theme: "Fiqih Komparatif Lintas Mazhab, Dalil Pro dan Kontra, Hakikat Air Liur dan Kenajisan",
      badge: "Fiqih & Hak Asasi Hewan",
      color: "from-orange-600 to-amber-700"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300/50 flex items-center justify-center text-4xl shadow-lg shrink-0">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Armansyah
                </h2>
                <span className="bg-amber-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Penulis & Peneliti
                </span>
              </div>
              <p className="text-emerald-200 text-sm mt-1">
                Kajian Islam, Hukum Islam (Fiqih), Kristologi & Perbandingan Agama
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-emerald-100 flex-wrap">
                <a
                  href="https://arsiparmansyah.wordpress.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 underline underline-offset-4"
                >
                  <Globe className="w-3.5 h-3.5" />
                  arsiparmansyah.wordpress.com
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://arsiparmansyah.wordpress.com/daftar-buku-arman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-amber-300 font-semibold hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Katalog Resmi Buku Armansyah
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Bio intro */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed text-justify-custom">
            <p>
              <strong>Armansyah</strong> adalah seorang penulis dan pengamat kajian Islam, hukum Islam (fiqih), serta perbandingan agama yang aktif menuangkan hasil riset dan analisis ilmiahnya melalui berbagai buku yang diterbitkan oleh penerbit nasional terkemuka di Indonesia dan Malaysia (seperti <em>Mizan Publika / Hikmah</em>, <em>Serambi Ilmu Semesta</em>, <em>Ufuq Press</em>, <em>Restu Agung</em>, serta <em>PTS Islamika</em> & <em>Dubook Press</em> di Malaysia). Beliau juga mengasuh repositori daring <strong>Arsip Armansyah</strong> yang memuat ratusan artikel pemikiran Islam, hadits, fikih, sains-Islam, dan dialog antar-agama.
            </p>
          </div>

          {/* Book Showcase */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Daftar Buku Karya Armansyah yang Telah Terbit
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Sumber: arsiparmansyah.wordpress.com/daftar-buku-arman/
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((b, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {b.badge}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> {b.year}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-xs text-amber-800 font-medium italic mt-0.5">
                      {b.subtitle}
                    </p>

                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <p>
                        <strong className="text-slate-800">Penerbit:</strong> {b.publisher}
                      </p>
                      <p>
                        <strong className="text-slate-800">ISBN:</strong> {b.isbn}
                      </p>
                      <p className="text-justify-custom text-[11px] text-slate-500 mt-1">
                        <strong className="text-slate-700">Fokus:</strong> {b.theme}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded-lg">
                    <span className="font-medium">{b.endorsement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-slate-500">
            Aplikasi Al-Bayan v2.1.0 dikembangkan oleh <strong>Armansyah</strong>
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://arsiparmansyah.wordpress.com/daftar-buku-arman/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Kunjungi Arsip Armansyah <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
