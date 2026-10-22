export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    developer: "Armansyah",
    developerBlog: "https://arsiparmansyah.wordpress.com/",
    developerBooksUrl: "https://arsiparmansyah.wordpress.com/daftar-buku-arman/",
    sources: [
      { name: "Arsip Armansyah (Blog & Karya Buku)", url: "https://arsiparmansyah.wordpress.com/", category: "artikel" },
      { name: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah", url: "https://shamela.ws/book/23604", category: "fiqh" },
      { name: "Hadits Tazkia", url: "https://hadits.tazkia.ac.id/", category: "hadith" },
      { name: "Cari Hadits 9 Imam", url: "https://www.carihadits.id/imam", category: "hadith" },
      { name: "QuranWeb ID", url: "https://quranweb.id/", category: "quran" },
      { name: "Katalog Hadits & Kutub At-Turats", url: "https://muhamadbasuki.web.id/hadis/#gsc.tab=0", category: "hadith" },
      { name: "Pesantren Al-Khoirot", url: "https://www.alkhoirot.org/", category: "fiqh" },
      { name: "Majelis Tarjih Muhammadiyah", url: "https://tarjih.or.id/", category: "fiqh" },
      { name: "NU Online Hadits & Amaliah", url: "https://hadits.nu.or.id/", category: "hadith" },
      { name: "Qur'an Kemenag RI (LPMQ)", url: "https://quran.kemenag.go.id/", category: "quran" },
      { name: "Perbandingan Mazhab (Prof. K.H. Aboebakar Aceh)", url: "http://103.44.149.34/elib/assets/buku/Aboebokar_Aceh_-_Perbandingan_Mazhab.pdf", category: "fiqh" },
      { name: "Nahj al-Balaghah (Balaghah.net)", url: "https://balaghah.net/old/nahj-htm/id/id/01/main.htm", category: "artikel" },
      { name: "Kajian Komparatif Topik Nabi Isa (Ahmadiyah.id)", url: "https://ahmadiyah.id/category/topik/nabi-isa", category: "artikel" },
      { name: "Jurnal & Literatur Islam Kredibel Global", url: "https://dorar.net", category: "fiqh" }
    ]
  });
}
