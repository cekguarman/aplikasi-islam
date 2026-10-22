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
      { name: "TafsirWeb", url: "https://tafsirweb.com/", category: "quran" },
      { name: "Kajian Muhamad Basuki", url: "https://muhamadbasuki.web.id/", category: "artikel" },
      { name: "Jurnal & Literatur Islam Kredibel Global", url: "https://dorar.net", category: "fiqh" }
    ]
  });
}
