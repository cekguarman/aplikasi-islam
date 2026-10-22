import React from 'react';
import { ExternalLink, BookOpen, Scroll, Scale, Globe, ShieldCheck, Sparkles } from 'lucide-react';

export const SourcesGuide: React.FC = () => {
  const sources = [
    {
      name: "Arsip Armansyah (Blog Pribadi)",
      url: "https://arsiparmansyah.wordpress.com/",
      category: "Kajian Fiqih, Pemikiran Islam & Perbandingan Agama",
      description: "Repositori resmi pemikiran, riset hukum Islam (fiqih), kristologi, studi perbandingan agama, hadis, dan sains-Islam oleh Armansyah. Menjadi salah satu rujukan utama yang wajib diintegrasikan dalam pencarian dan penyusunan naskah ceramah aplikasi ini.",
      badge: "Sumber Utama Pengembang",
      highlight: true
    },
    {
      name: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah",
      url: "https://shamela.ws/book/23604",
      category: "Fiqih 4 Mazhab (Sunni)",
      description: "Ensiklopedia Fiqih Terbesar dunia Islam kontemporer sebanyak 45 jilid yang diterbitkan oleh Kementerian Wakaf dan Urusan Islam Kuwait. Membahas secara komparatif seluruh cabang fiqih Hanafi, Maliki, Syafi'i, dan Hanbali.",
      badge: "Ensiklopedia Fiqih 45 Jilid",
      highlight: false
    },
    {
      name: "Cari Hadits 9 Imam",
      url: "https://www.carihadits.id/imam",
      category: "Hadits Nabawi Mutabar",
      description: "Portal pencarian hadits terpercaya berbasis 9 kitab induk hadits: Shahih Bukhari, Shahih Muslim, Sunan Abu Daud, Jami' At-Tirmidzi, Sunan An-Nasa'i, Sunan Ibnu Majah, Musnad Ahmad, Muwaththa' Malik, dan Sunan Ad-Darimi.",
      badge: "9 Imam Hadits",
      highlight: false
    },
    {
      name: "Hadits Tazkia",
      url: "https://hadits.tazkia.ac.id/",
      category: "Database Hadits & Muamalah",
      description: "Pusat database dan mesin pencari hadits yang dikembangkan oleh Institut Tazkia, mencakup hadits-hadits aqidah, ibadah, akhlak, serta muamalah dan ekonomi syariah.",
      badge: "Hadits & Ekonomi Syariah",
      highlight: false
    },
    {
      name: "QuranWeb.id",
      url: "https://quranweb.id/",
      category: "Mushaf Al-Qur'an Digital",
      description: "Portal Al-Qur'an online berbahasa Indonesia dengan teks rasm Utsmani berharakat tajwid, transliterasi Latin, terjemahan resmi Kemenag RI, dan navigasi surah yang praktis.",
      badge: "Al-Qur'an Indonesia",
      highlight: false
    },
    {
      name: "TafsirWeb.com",
      url: "https://tafsirweb.com/",
      category: "Tafsir Lengkap Mufassirin",
      description: "Kompilasi tafsir Al-Qur'an terlengkap yang menyajikan Tafsir Kemenag RI, Tafsir Jalalain, Tafsir Al-Muyassar, Tafsir Ibnu Katsir, Tafsir As-Sa'di, dan Zubdatut Tafsir.",
      badge: "Multi-Tafsir Kitab",
      highlight: false
    },
    {
      name: "Kajian Fiqih Muhamad Basuki",
      url: "https://muhamadbasuki.web.id/",
      category: "Fiqih Praktis & Bimbingan Ibadah",
      description: "Website rujukan kajian fiqih praktis, fatwa amaliyah sehari-hari, tuntunan shalat, puasa, muamalah, serta adab-adab keislaman kontekstual oleh Ustadz Muhamad Basuki.",
      badge: "Kajian Fiqih Praktis",
      highlight: false
    },
    {
      name: "Jurnal & Literatur Islam Kredibel Global",
      url: "https://dorar.net",
      category: "Jurnal Ilmiah & Fatwa Dunia Islam",
      description: "Pustaka daring internasional yang mencakup fatwa resmi Al-Azhar, Dar al-Ifta, ensiklopedia hadits & fiqih Mawsu'ah Al-Haditsiyyah Dorar.net, serta jurnal akademik terindeks nasional & internasional.",
      badge: "Riset Ilmiah Global",
      highlight: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Metodologi & Sumber Otoritatif
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sumber Rujukan Utama Aplikasi Al-Bayan
          </h1>
          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed text-justify-custom">
            Aplikasi Al-Bayan dirancang dengan kecerdasan buatan yang tidak hanya mengolah data secara umum, melainkan berpijak kuat pada sumber-sumber primer terpercaya, blog ilmiah <strong>Arsip Armansyah</strong>, ensiklopedia fiqih 4 mazhab, portal hadits 9 imam, dan tafsir Al-Qur'an mu'tamad.
          </p>
        </div>
      </section>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
              src.highlight
                ? 'bg-gradient-to-br from-amber-50 to-emerald-50/60 border-amber-300 shadow-md ring-1 ring-amber-400/30'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  src.highlight ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                }`}>
                  {src.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {src.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {src.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify-custom mb-4">
                {src.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                {src.url.replace('https://', '')}
              </span>

              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>Buka Situs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
