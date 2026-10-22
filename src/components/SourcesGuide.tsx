import React from 'react';
import { ExternalLink, BookOpen, Scroll, Scale, Globe, ShieldCheck, Sparkles, Layers, Compass } from 'lucide-react';

interface SubLink {
  title: string;
  url: string;
  desc?: string;
}

interface SourceItem {
  name: string;
  url: string;
  category: string;
  description: string;
  badge: string;
  highlight: boolean;
  subLinks?: SubLink[];
}

export const SourcesGuide: React.FC = () => {
  const sources: SourceItem[] = [
    {
      name: "Arsip Armansyah (Blog Pribadi & Riset)",
      url: "https://arsiparmansyah.wordpress.com/",
      category: "Kajian Fiqih, Pemikiran Islam & Perbandingan Agama",
      description: "Repositori resmi pemikiran, riset hukum Islam (fiqih), kristologi, studi perbandingan agama, hadits, dan sains-Islam oleh Armansyah. Menjadi salah satu rujukan utama yang diintegrasikan dalam pencarian dan penyusunan naskah ceramah aplikasi ini.",
      badge: "Sumber Utama Pengembang",
      highlight: true,
      subLinks: [
        { title: "Daftar Buku Riset Armansyah", url: "https://arsiparmansyah.wordpress.com/daftar-buku-arman/", desc: "Rekonstruksi Isa Al-Masih, Misteri Kecerdasan Syahadat, Dan Tuhan Ciptakan Anjing, dll" }
      ]
    },
    {
      name: "Majelis Tarjih & Tajdid Muhammadiyah",
      url: "https://tarjih.or.id/",
      category: "Manhaj Tarjih, Fatwa, Fikih Informasi & Astronomi Islam",
      description: "Pusat rujukan fatwa dan manhaj tarjih Muhammadiyah berlandaskan Al-Qur'an dan As-Sunnah Ash-Shahihah dengan pendekatan bayani, burhani, dan irfani. Mencakup Fikih Informasi, Jurnal Tarjih, Sekolah Tarjih UAD, serta Kalender Hijriah Global Tunggal (KHGT).",
      badge: "Manhaj Tarjih & Tajdid",
      highlight: false,
      subLinks: [
        { title: "Nilai Dasar Fikih Informasi (PDF)", url: "https://tarjih.or.id/wp-content/uploads/2020/09/52.-Nilai-nilai-dasar-Fikih-Informasi.-converted.pdf", desc: "Prinsip etika literasi dan komunikasi digital Islami" },
        { title: "Pusat Tarjih UAD - Sekolah Tarjih", url: "https://pusattarjih.uad.ac.id/category/artikel-sekolah-tarjih/", desc: "Kajian manhaj tarjih dan fatwa kontemporer" },
        { title: "Jurnal Tarjih (OJS)", url: "https://jurnal.tarjih.or.id/index.php/tarjih", desc: "Jurnal ilmiah studi Islam dan kemuhammadiyahan" },
        { title: "Arsip Fatwa Tarjih", url: "https://arsip.tarjih.or.id/i", desc: "Koleksi keputusan dan tanya jawab agama" },
        { title: "Kalender Hijriah Global Tunggal (KHGT)", url: "https://khgt.muhammadiyah.or.id/", desc: "Sistem hisab unifikatif kalender Islam global" },
        { title: "Portal KHGT Tarjih", url: "https://tarjih.or.id/khgt/index.html", desc: "Dokumen resmi dan dasar astronomis KHGT" }
      ]
    },
    {
      name: "NU Online - Khazanah Hadits & Kutub Mu'tabarah",
      url: "https://hadits.nu.or.id/",
      category: "Kutubul Hadits, Takhrij & Syarah Ulama Aswaja",
      description: "Pusat digitalisasi kitab-kitab hadits mu'tabarah yang diasuh oleh Lembaga Falakiyah / Lajnah Ta'lif wan Nasyr Nahdlatul Ulama. Menyajikan matan Arab berharakat, sanad, terjemahan Indonesia, dan syarah para ulama.",
      badge: "Kutub Hadits Ahlussunnah",
      highlight: false,
      subLinks: [
        { title: "Musnad Al-Imam Asy-Syafi'i", url: "https://hadits.nu.or.id/musnad-syafii", desc: "Koleksi hadits periwayatan Imam Syafi'i" },
        { title: "Asy-Syamail Al-Muhammadiyyah", url: "https://hadits.nu.or.id/shamail-muhammadiyah", desc: "Kepribadian dan fisik luhur Rasulullah ﷺ oleh Imam At-Tirmidzi" },
        { title: "Bulughul Maram min Adillatil Ahkam", url: "https://hadits.nu.or.id/bulugh-al-maram", desc: "Kitab induk dalil fiqih hukum karya Ibnu Hajar Al-Asqalani" },
        { title: "Koleksi Hadits Qudsi", url: "https://hadits.nu.or.id/hadits-qudsi", desc: "Firman Allah SWT yang diriwayatkan Rasulullah ﷺ" },
        { title: "Shahih Ibnu Hibban", url: "https://hadits.nu.or.id/shahih-ibnu-hibban", desc: "Al-Taqasim wat-Anwa' karya Ibnu Hibban" },
        { title: "Shahih Ibnu Khuzaimah", url: "https://hadits.nu.or.id/shahih-ibnu-khuzaimah", desc: "Kitab hadits shahih karya Imam Ibnu Khuzaimah" },
        { title: "Sunan Ad-Daraquthni", url: "https://hadits.nu.or.id/sunan-daraquthni", desc: "Rujukan penting ilalul hadits dan fiqih dalil" },
        { title: "Al-Adab Al-Mufrad", url: "https://hadits.nu.or.id/al-adab-al-mufrad", desc: "Hadits-hadits akhlak & adab karya Imam Al-Bukhari" },
        { title: "Al-Mustadrak 'alas-Shahihain", url: "https://hadits.nu.or.id/mustadrak-al-hakim", desc: "Karya Al-Hakim An-Naisaburi dengan telaah Adz-Dzahabi" }
      ]
    },
    {
      name: "NU Online - Amaliah, Tahlil, Doa & Wirid",
      url: "https://quran.nu.or.id/",
      category: "Amaliah Aswaja, Dzikir, Doa & Wirid Mu'tabarah",
      description: "Panduan ibadah dan amaliah ritual praktis masyarakat Muslim Ahlussunnah wal Jama'ah an-Nahdliyyah, lengkap dengan teks Arab berharakat, transliterasi Latin, fadhilah, serta sanad doa ma'tsur.",
      badge: "Amaliah & Doa Muktamad",
      highlight: false,
      subLinks: [
        { title: "Panduan Tahlil & Doa Arwah Lengkap", url: "https://quran.nu.or.id/tahlil", desc: "Susunan bacaan tahlil resmi dan doa penutup" },
        { title: "Ensiklopedia Doa Ma'tsur Harian", url: "https://quran.nu.or.id/doa", desc: "Kumpulan doa ibadah, hajat, dan keselamatan" },
        { title: "Kumpulan Wirid, Ratib & Hizib", url: "https://quran.nu.or.id/wirid", desc: "Wirid sesudah shalat, Ratib Al-Haddad, Ratib Al-Athas" }
      ]
    },
    {
      name: "Pusat Studi Islam Tsirwah (Pustaka Turats)",
      url: "https://tsirwah.com/pustaka/",
      category: "Kutub At-Turats Fiqih, Aqidah & Ushul Fiqih",
      description: "Pusat telaah kitab kuning (turats) Islam klasik dan muta'akhkhirin: Hasyiyah Al-Bajuri, Jami'us Shaghir, Qawa'idul 'Ilal, Safinatun Naja, Risalah Aswaja KH Hasyim Asy'ari, dan ilmu ushul tafsir.",
      badge: "Pustaka Turats Klasik",
      highlight: false,
      subLinks: [
        { title: "Direktori Pustaka Kitab Tsirwah", url: "https://tsirwah.com/pustaka/", desc: "Katalog kitab fiqih, tafsir, dan akidah muta'akhkhirin" }
      ]
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
      name: "CariHadits.id (9 Imam & Statistik Perawi)",
      url: "https://www.carihadits.id/eksplorasi",
      category: "Hadits Nabawi 9 Kitab Induk & Rijalul Hadits",
      description: "Portal pencarian hadits komprehensif berbasis 9 kitab induk hadits: Shahih Bukhari (/imam/1), Shahih Muslim (/imam/2), Sunan Abu Daud (/imam/3), Tirmidzi (/imam/4), Nasa'i (/imam/5), Ibnu Majah (/imam/6), Musnad Ahmad (/imam/7), Muwaththa' Malik (/imam/8), dan Ad-Darimi (/imam/9), lengkap dengan statistik biografi perawi (/perawi/statistik).",
      badge: "9 Imam & Rijalul Hadits",
      highlight: false,
      subLinks: [
        { title: "Eksplorasi Hadits Tematik", url: "https://www.carihadits.id/eksplorasi", desc: "Pencarian matan lintas kitab" },
        { title: "Statistik & Biografi Perawi", url: "https://www.carihadits.id/perawi/statistik", desc: "Data tingkatan thabaqat rijalul hadits" }
      ]
    },
    {
      name: "Indeks Hadits & Kutub At-Turats",
      url: "https://muhamadbasuki.web.id/hadis/#gsc.tab=0",
      category: "Indeks Hadits & Naskah Digital Turats",
      description: "Katalog tematik hadits nabawi dan digitalisasi naskah kutub at-turats klasik mengenai fiqih muamalah, ibadah, dan syariah kontemporer.",
      badge: "Indeks Hadis & Turats",
      highlight: false,
      subLinks: [
        { title: "Indeks Hadis Tematik", url: "https://muhamadbasuki.web.id/hadis/#gsc.tab=0", desc: "Klasifikasi tema hadits nabawi" },
        { title: "Katalog Kutub At-Turats", url: "https://muhamadbasuki.web.id/kutub-al-turats/#gsc.tab=0", desc: "Digitalisasi naskah kitab ulama klasik" }
      ]
    },
    {
      name: "QuranWeb.id & TafsirWeb.com",
      url: "https://quranweb.id/",
      category: "Mushaf Al-Qur'an Rasm Utsmani & Multi-Tafsir Muktamad",
      description: "Kompilasi Al-Qur'an online per surah (quranweb.id/1 dst) lengkap dengan mushaf rasm Utsmani berharakat, transliterasi Latin, dan syarah tafsir muktamad dari Ibnu Katsir, Ath-Thabari, Al-Qurthubi, As-Sa'di, dan Tafsir Jalalain di tafsirweb.com.",
      badge: "Al-Qur'an & Multi-Tafsir",
      highlight: false,
      subLinks: [
        { title: "Mushaf QuranWeb (Surah 1 dst)", url: "https://quranweb.id/1", desc: "Teks ayat rasm Utsmani" },
        { title: "TafsirWeb Komprehensif", url: "https://tafsirweb.com/", desc: "Tafsir Ibnu Katsir, Thabari, Sa'di" }
      ]
    },
    {
      name: "Pesantren Al-Khoirot (Pustaka Terjemah Kitab Kuning)",
      url: "https://www.alkhoirot.org/",
      category: "Kutubut Turats Fiqih Syafi'iyah, Aqidah, Tafsir & Akhlak",
      description: "Pusat rujukan terjemahan kitab kuning klasik pesantren salafiyah muktamad: Fiqih Syafi'i (Fathul Mu'in, Safinah, Taqrib/At-Tahdzib, Sullamut Taufiq), Aqidah Ahlussunnah (Aqidatul Awam, Nurudh Dholam), Tafsir Jalalain, Sirah Nabawiyah (Nurul Yaqin), dan Akhlak lil Banin.",
      badge: "Pustaka Kitab Kuning Pesantren",
      highlight: false,
      subLinks: [
        { title: "Terjemah Kitab Safinatun Naja", url: "https://www.alkhoirot.org/2012/12/terjemah-kitab-safinah.html", desc: "Matan dasar fiqih ibadah mazhab Syafi'i" },
        { title: "Terjemah Khulashah Nurul Yaqin (Sejarah Nabi)", url: "https://www.alkhoirot.org/2017/04/terjemah-nurul-yaqin-sejarah-nabi.html", desc: "Sirah Nabawiyah karya Syaikh Umar Abdul Jabbar" },
        { title: "Terjemah Kitab Tafsir Jalalain", url: "https://www.alkhoirot.org/2017/11/terjemah-kitab-tafsir-jalalain.html", desc: "Karya Imam Jalaluddin Al-Mahalli & As-Suyuthi" },
        { title: "Terjemah Akhlak lil Banin (Juz 1)", url: "https://www.alkhoirot.org/2017/01/terjemah-akhlak-lil-banin-juz-1.html", desc: "Panduan adab dan akhlak budi pekerti Islam" },
        { title: "Bab Shalat Kitab Fathul Mu'in", url: "https://www.alkhoirot.org/2022/09/bab-shalat-fathul-muin.html", desc: "Kajian detail rukun dan syarat shalat" },
        { title: "Terjemah Lengkap Fathul Mu'in", url: "https://www.alkhoirot.org/2018/11/terjemah-fathul-muin.html", desc: "Kitab induk fiqih Syafi'iyah karya Syaikh Zainuddin Al-Malibari" },
        { title: "Terjemah Matan Aqidatul Awam", url: "https://www.alkhoirot.org/2017/06/terjemah-aqidatul-awam.html", desc: "Nadhom dasar akidah 50 aqaid Asy'ariyah" },
        { title: "Terjemah Nurudh Dholam", url: "https://www.alkhoirot.org/2023/12/terjemah-nurud-dholam.html", desc: "Syarah Aqidatul Awam karya Syaikh Nawawi Al-Bantani" },
        { title: "Terjemah Sullamut Taufiq", url: "https://www.alkhoirot.org/2017/05/terjemah-sullamut-taufiq.html", desc: "Panduan tauhid, fiqih dan tasawuf Al-Habib Abdullah bin Husain bin Thahir" },
        { title: "Al-Tahdzib fi Adillati Matan Al-Ghayah wat-Taqrib", url: "https://www.alkhoirot.org/2018/01/al-tahdzib-fi-adillat-matan-taqrib.html", desc: "Dalil-dalil nash Al-Qur'an dan Sunnah Matan Taqrib oleh Dr. Mustafa Dib Al-Bugha" }
      ]
    },
    {
      name: "Qur'an Kemenag (Lajnah Pentashihan Mushaf Al-Qur'an RI)",
      url: "https://quran.kemenag.go.id/",
      category: "Mushaf Standar Indonesia, Terjemahan Resmi & Tafsir Kemenag",
      description: "Portal resmi Al-Qur'an digital Kementerian Agama Republik Indonesia yang dikelola oleh Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ). Menyajikan teks ayat Mushaf Standar Indonesia (MSI) berharakat rasm Utsmani, Terjemahan Al-Qur'an Kemenag Edisi Penyempurnaan, Tafsir Tahlili, Tafsir Wajiz, dan asbabun nuzul resmi.",
      badge: "Mushaf & Terjemah Resmi RI",
      highlight: false,
      subLinks: [
        { title: "Portal Qur'an Kemenag RI", url: "https://quran.kemenag.go.id/", desc: "Mushaf Standar Indonesia & Terjemahan Resmi LPMQ" }
      ]
    },
    {
      name: "Perbandingan Mazhab (Prof. K.H. Aboebakar Aceh)",
      url: "http://103.44.149.34/elib/assets/buku/Aboebokar_Aceh_-_Perbandingan_Mazhab.pdf",
      category: "Fiqih Perbandingan (Fiqh Muqaran) & Sejarah Mazhab Islam",
      description: "Karya monumental Prof. K.H. Aboebakar Aceh yang mengulas secara komparatif genealogi madrasah fiqih, metodologi istinbath hukum, ushul fiqih, serta titik temu dan perbedaan antara mazhab-mazhab besar dalam Islam (Ahlus Sunnah: Hanafi, Maliki, Syafi'i, Hanbali, Dawud Az-Zahiri, serta Mazhab Ja'fari dan Zaidiyah). Fondasi ilmiah studi komparasi mazhab di Indonesia.",
      badge: "Fiqh Muqaran & Mazhab Islam",
      highlight: false,
      subLinks: [
        { title: "Naskah Digital Buku Perbandingan Mazhab (PDF)", url: "http://103.44.149.34/elib/assets/buku/Aboebokar_Aceh_-_Perbandingan_Mazhab.pdf", desc: "Karya komparatif fiqih 4 mazhab dan mazhab Islam lainnya" }
      ]
    },
    {
      name: "Nahj al-Balaghah (Puncak Kefasihan - Balaghah.net)",
      url: "https://balaghah.net/old/nahj-htm/id/id/01/main.htm",
      category: "Khutbah, Surat & Hikmah Amirul Mukminin Ali bin Abi Thalib",
      description: "Himpunan khutbah-khutbah tauhid dan moral, risalah instruksi kenegaraan kepada gubernur (seperti Surat kepada Malik Al-Ashtar), wasiat keadilan sosial, dan kata mutiara hikmah Sayyidina Ali bin Abi Thalib Karramallahu Wajhah yang dikumpulkan oleh Asy-Syarif Ar-Radhi. Diterjemahkan ke Bahasa Indonesia di Balaghah.net sebagai sumber otentik sastra Arab tinggi, retorika dakwah, etika kepemimpinan, dan nasehat zuhud/taqwa.",
      badge: "Khutbah & Sastra Balaghah",
      highlight: false,
      subLinks: [
        { title: "Indeks Nahjul Balaghah Bahasa Indonesia", url: "https://balaghah.net/old/nahj-htm/id/id/01/main.htm", desc: "Himpunan khutbah, surat kenegaraan, dan mutiara hikmah" }
      ]
    },
    {
      name: "Kajian Komparatif Topik Nabi Isa (Ahmadiyah.id)",
      url: "https://ahmadiyah.id/category/topik/nabi-isa",
      category: "Studi Komparatif Teologi & Eskatologi Kenabian Isa AS",
      description: "Repositori artikel dan riset dokumentatif Jemaat Ahmadiyah Indonesia mengenai riwayat wafat, makam di Kashmir, dan pemahaman eskatologis Al-Masih Al-Mau'ud. Dijadikan komparasi kritis dalam studi perbandingan pemikiran teologi Islam, polemik tafsir wafat vs rafa' (QS. Ali 'Imran: 55 & QS. An-Nisa: 157-158), serta rekonstruksi sejarah kenabian Isa AS yang disandingkan secara jujur dan ilmiah bersama karya buku Armansyah.",
      badge: "Studi Komparatif Teologi",
      highlight: false,
      subLinks: [
        { title: "Direktori Artikel Topik Nabi Isa (Ahmadiyah.id)", url: "https://ahmadiyah.id/category/topik/nabi-isa", desc: "Kajian tafsir, riwayat historis Kashmir, dan eskatologi Isa AS" }
      ]
    },
    {
      name: "Hadits Tazkia & Jurnal Islam Global",
      url: "https://hadits.tazkia.ac.id/",
      category: "Hadits Ekonomi Syariah & Fatwa Global",
      description: "Database hadits ekonomi syariah Tazkia serta portal rujukan ensiklopedia hadits Mawsu'ah Al-Haditsiyyah Dorar.net dan fatwa otoritatif dunia Islam.",
      badge: "Muamalah & Fatwa Global",
      highlight: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrasi Sumber Otoritatif Multidisipliner
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sumber Rujukan Utama Aplikasi Al-Bayan
          </h1>
          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed text-justify-custom">
            Aplikasi Al-Bayan memadukan khazanah keislaman nusantara dan global: <strong>Arsip Armansyah</strong>, <strong>Qur'an Kemenag RI (LPMQ)</strong>, <strong>Majelis Tarjih Muhammadiyah (Fikih Informasi & KHGT)</strong>, <strong>NU Online (Kutub Hadits Mu'tabarah, Tahlil, Doa & Wirid)</strong>, <strong>Pesantren Al-Khoirot</strong>, <strong>Perbandingan Mazhab (Prof. Aboebakar Aceh)</strong>, <strong>Nahj al-Balaghah (Balaghah.net)</strong>, <strong>Kajian Komparatif Nabi Isa (Ahmadiyah.id)</strong>, <strong>Pustaka Tsirwah</strong>, <strong>CariHadits 9 Imam & Statistik Perawi</strong>, <strong>Kutub At-Turats Klasik</strong>, <strong>QuranWeb/TafsirWeb</strong>, serta <strong>Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah 45 Jilid</strong>.
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
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

              {/* Sub-Links if any */}
              {src.subLinks && src.subLinks.length > 0 && (
                <div className="mb-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Sub-Halaman & Dokumen Otoritatif Terkait:
                  </span>
                  <div className="space-y-1.5">
                    {src.subLinks.map((sl, sIdx) => (
                      <a
                        key={sIdx}
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 transition flex items-center justify-between group text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-800 truncate block">
                            {sl.title}
                          </span>
                          {sl.desc && (
                            <span className="text-[10px] text-slate-500 block truncate">
                              {sl.desc}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
                <span>Kunjungi Portal Utama</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
