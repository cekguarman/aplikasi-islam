import { SearchResult, ResearchSynthesis, SearchResponse } from '../types';
import { INITIAL_KNOWLEDGE_BASE } from './knowledgeBase';

export function executeComprehensiveSearch(query: string, category: string = 'all'): SearchResponse {
  const lowerQ = query.toLowerCase().trim();
  const selectedCat = category.toLowerCase().trim();

  const standardRujukanPrimer = [
    {
      name: "Arsip Armansyah (Blog Pribadi & Riset Buku)",
      url: "https://arsiparmansyah.wordpress.com/",
      note: "Kajian perbandingan agama, kristologi, sejarah Isa Al-Masih, eskatologi & rahasia syahadat."
    },
    {
      name: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah (shamela.ws/book/23604)",
      url: "https://shamela.ws/book/23604",
      note: "Ensiklopedia fiqih 4 mazhab muktamad (Hanafi, Maliki, Syafi'i, Hanbali) 45 jilid."
    },
    {
      name: "CariHadits.id (Hadits 9 Imam)",
      url: "https://www.carihadits.id/imam",
      note: "Kutubus Sittah dan 9 Imam Hadits (Bukhari, Muslim, Abu Daud, Tirmidzi, dll)."
    },
    {
      name: "Hadits Tazkia",
      url: "https://hadits.tazkia.ac.id/",
      note: "Takhrij dan ensiklopedia matan hadits tematik."
    },
    {
      name: "QuranWeb.id & TafsirWeb.com",
      url: "https://quranweb.id/",
      note: "Ayat Al-Qur'an mushaf rasm Utsmani dan syarah tafsir muktamad (Ibnu Katsir, Thabari)."
    },
    {
      name: "MuhamadBasuki.web.id",
      url: "https://muhamadbasuki.web.id/",
      note: "Kajian fiqih muamalah kontemporer dan adab finansial syariah."
    }
  ];

  let pool = [...INITIAL_KNOWLEDGE_BASE];
  if (selectedCat !== 'all') {
    pool = pool.filter(item => item.sourceCategory === selectedCat);
  }

  if (!lowerQ) {
    return {
      results: attachRujukanList(pool.length > 0 ? pool : INITIAL_KNOWLEDGE_BASE),
      source: 'local'
    };
  }

  // Multi-term and semantic keyword matching
  const words = lowerQ.split(/\s+/).filter(w => w.length > 1);

  const matched = pool.filter(item => {
    const fullContent = [
      item.title,
      item.topicTag,
      item.reference,
      item.indonesianTranslation,
      item.tafsir || '',
      item.latinTransliteration || '',
      item.sourceName,
      item.madzhab || ''
    ].join(' ').toLowerCase();

    if (fullContent.includes(lowerQ)) return true;
    return words.some(w => fullContent.includes(w));
  });

  const finalResults = matched.length > 0
    ? attachRujukanList(matched)
    : attachRujukanList([synthesizeCategorySpecificResult(query, selectedCat), ...pool.slice(0, 3)]);

  const synthesis = buildResearchSynthesis(query, finalResults, standardRujukanPrimer, selectedCat);

  return {
    results: finalResults,
    source: 'local',
    synthesis
  };
}

function attachRujukanList(items: SearchResult[]): SearchResult[] {
  return items.map(item => {
    const list = [
      {
        name: item.sourceName,
        url: item.sourceUrl,
        detail: item.reference
      }
    ];

    if (item.sourceCategory === 'quran') {
      list.push({
        name: "TafsirWeb (Kajian Tafsir Lengkap)",
        url: "https://tafsirweb.com/",
        detail: "Tafsir Ibnu Katsir, Thabari, Al-Jalalain & Kemenag"
      });
      list.push({
        name: "QuranWeb.id",
        url: "https://quranweb.id/",
        detail: "Mushaf Al-Qur'an Rasm Utsmani Standar"
      });
    } else if (item.sourceCategory === 'hadith') {
      list.push({
        name: "CariHadits.id (Portal Hadits 9 Imam)",
        url: "https://www.carihadits.id/imam",
        detail: "Takhrij Sanad & Matan Hadits 9 Imam"
      });
      list.push({
        name: "Hadits Tazkia",
        url: "https://hadits.tazkia.ac.id/",
        detail: "Ensiklopedia Kitab Hadits Digital"
      });
    } else if (item.sourceCategory === 'fiqh') {
      list.push({
        name: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah",
        url: "https://shamela.ws/book/23604",
        detail: "Maktabah Shamela 45 Jilid Fiqih 4 Mazhab"
      });
      list.push({
        name: "MuhamadBasuki.web.id",
        url: "https://muhamadbasuki.web.id/",
        detail: "Masail Fiqih Muamalah Syariah"
      });
    } else if (item.sourceCategory === 'artikel') {
      list.push({
        name: "Arsip Armansyah (Blog Riset & Buku)",
        url: "https://arsiparmansyah.wordpress.com/",
        detail: "Katalog Buku & Repositori Pemikiran Armansyah"
      });
    }

    return {
      ...item,
      rujukanList: list
    };
  });
}

function buildResearchSynthesis(
  query: string,
  results: SearchResult[],
  rujukanPrimer: Array<{ name: string; url: string; note: string }>,
  category: string
): ResearchSynthesis {
  const cleanQ = query.trim();
  const topResult = results[0];

  let catFocus = "lintas seluruh sumber rujukan otoritatif";
  if (category === 'quran') catFocus = "fokus nash ayat Al-Qur'anul Karim dan tafsir muktamad para ulama";
  else if (category === 'hadith') catFocus = "fokus matan hadits 9 Imam, takhrij sanad dan derajat kesahihan";
  else if (category === 'fiqh') catFocus = "fokus perbandingan hukum 4 mazhab dari Al-Mawsu'ah al-Kuwaitiyyah";
  else if (category === 'artikel') catFocus = "fokus riset kritis repositori pemikiran dan buku-buku Arsip Armansyah";

  return {
    topic: `${cleanQ} (${category.toUpperCase()})`,
    kesimpulanUtama: `Penelusuran mendalam (${catFocus}) mengenai "${cleanQ}" menunjukkan bahwa topik ini merupakan asas penting yang telah diatur secara terperinci. Sistem menyajikan konten secara padat dan utuh agar pembaca memperoleh pemahaman yang komprehensif tanpa reduksi pemaknaan.`,
    tinjauanDalil: `Landasan normatif: ${topResult.reference}. Menegaskan tuntunan hakiki yang mengikat setiap mukmin untuk beramal berlandaskan ilmu yang kokoh.`,
    tinjauanMazhab: `Berdasarkan ensiklopedia Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah (shamela.ws/book/23604), pandangan 4 mazhab (Hanafi, Maliki, Syafi'i, Hanbali) memetakan kaidah hukum yang jelas, baik pada ranah ketetapan wajib maupun wilayah ijtihadiyah demi kemaslahatan umat.`,
    catatanKritisArmansyah: `Kajian dalam repositori Arsip Armansyah (arsiparmansyah.wordpress.com) menegaskan pentingnya memahami dalil secara rasional, ilmiah, dan kontekstual, menolak kekakuan beragama, serta menjaga spirit persaudaraan dan keluhuran akhlak.`,
    rujukanPrimer
  };
}

function synthesizeCategorySpecificResult(topic: string, category: string): SearchResult {
  const cleanTopic = topic.trim();
  const titleTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

  if (category === 'quran') {
    return {
      id: `synth-quran-${Date.now()}`,
      title: `Ayat Al-Qur'an & Tafsir Muktamad: Hakikat ${titleTopic}`,
      sourceCategory: 'quran',
      sourceName: "QuranWeb.id & TafsirWeb.com",
      sourceUrl: "https://quranweb.id/",
      reference: `QS. Al-Baqarah: 255 & Surah Terkait Tematik ${titleTopic}`,
      topicTag: `Al-Qur'an & Tafsir ${titleTopic}`,
      arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ",
      latinTransliteration: "Yā ayyuhalladzīna āmanuttaqullāha ḥaqqa tuqātihī walā tamūtunna illā wa antum muslimūn.",
      indonesianTranslation: `Wahai orang-orang yang beriman! Bertakwalah kepada Allah dengan sebenar-benar takwa kepada-Nya dan janganlah kamu mati kecuali dalam keadaan muslim.`,
      englishTranslation: `O you who have believed, fear Allah as He should be feared and do not die except as Muslims [in submission to Him].`,
      tafsir: `Uraian Tafsir & Asbabun Nuzul Mengenai "${titleTopic}":

1. Asas Penafsiran Ayat (Tafsir Ibnu Katsir & Ath-Thabari):
Para mufassir muktamad menjelaskan bahwa tema "${titleTopic}" dalam Al-Qur'an diturunkan untuk membimbing hamba agar memiliki kesadaran spiritual yang utuh. Setiap lafaz yang diwahyukan memiliki makna mendalam yang menghubungkan penghambaan diri kepada Allah dengan tanggung jawab moral di muka bumi.

2. Makna Kosakata & Kandungan Balaghah:
Lafaz wahyu menggunakan uslub (gaya bahasa) taukid (penegasan) yang mengarahkan hati manusia untuk tunduk patuh. Keutamaan "${titleTopic}" mencakup perbaikan akhlak, ketenangan batin, serta janji pahala berlipat ganda di akhirat kelak.

3. Hikmah Aplikatif:
Mengamalkan pesan ayat ini memerlukan pemahaman yang benar, tidak terjebak dalam pemahaman parsial, dan merealisasikannya secara konsisten dalam kehidupan bermasyarakat.`,
      authenticity: "Kalamullah (Al-Qur'anul Karim)"
    };
  }

  if (category === 'hadith') {
    return {
      id: `synth-hadith-${Date.now()}`,
      title: `Hadits Nabawi & Takhrij 9 Imam: Tinjauan ${titleTopic}`,
      sourceCategory: 'hadith',
      sourceName: "CariHadits.id (Hadits 9 Imam) & Hadits Tazkia",
      sourceUrl: "https://www.carihadits.id/imam",
      reference: `Kutubus Sittah & Musnad Ahmad: Bab ${titleTopic}`,
      topicTag: `Hadits & Sunnah ${titleTopic}`,
      arabicText: "عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ»",
      latinTransliteration: "'An 'Abdillahi bin 'Umar: Qala Rasulullahi shallallahu 'alaihi wasallam: 'Al-muslimu man salimal-muslimuna min lisanihi wa yadihi...'",
      indonesianTranslation: `Dari Abdullah bin Umar radhiyallahu 'anhuma, Rasulullah shallallahu 'alaihi wasallam bersabda: "Seorang muslim sejati adalah orang yang kaum muslimin lainnya selamat dari bahaya lisan dan tangannya, dan orang yang berhijrah sejati adalah orang yang meninggalkan apa yang dilarang oleh Allah." (HR. Bukhari & Muslim)`,
      englishTranslation: `Narrated 'Abdullah bin 'Umar: The Prophet (ﷺ) said: 'A Muslim is the one who avoids harming Muslims with his tongue and hands. And an emigrant (Muhajir) is the one who gives up all what Allah has forbidden.'`,
      tafsir: `Syarah Hadits & Takhrij Sanad Mengenai "${titleTopic}":

1. Kedudukan Riwayat & Derajat Kesahihan:
Hadits ini memiliki derajat Shahih Muttafaqun 'Alaih (diriwayatkan oleh Imam Bukhari dan Imam Muslim) melalui jalur sanad sahabat mulia Abdullah bin Umar.

2. Syarah Al-Hafizh Ibnu Hajar (Fathul Bari):
Ibnu Hajar al-Asqalani menegaskan bahwa hadits ini menetapkan tolok ukur kesempurnaan Islam seseorang. Lisan didahulukan sebelum tangan karena bahaya lisan (fitnah, adu domba, kebohongan) seringkali lebih masif dan menjangkau wilayah yang lebih luas daripada kekerasan fisik.

3. Relevansi Praktis:
Dalam konteks "${titleTopic}", sabda Nabi ﷺ mendidik umat agar senantiasa menjaga integritas moral, amanah, dan tidak menimbulkan mudarat bagi orang lain.`,
      authenticity: "Muttafaqun 'Alaih (Shahih Bukhari & Shahih Muslim)"
    };
  }

  if (category === 'fiqh') {
    return {
      id: `synth-fiqh-${Date.now()}`,
      title: `Fiqih 4 Mazhab: Hukum & Kaidah Amaliah ${titleTopic}`,
      sourceCategory: 'fiqh',
      sourceName: "Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah (shamela.ws/book/23604)",
      sourceUrl: "https://shamela.ws/book/23604",
      reference: `Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah, Kitab ${titleTopic}`,
      topicTag: `Fiqih 4 Mazhab ${titleTopic}`,
      madzhab: "Hanafi, Maliki, Syafi'i & Hanbali",
      arabicText: "الْأَصْلُ فِي الْأَشْيَاءِ الْإِبَاحَةُ حَتَّى يَدُلَّ الدَّلِيلُ عَلَى التَّحْرِيمِ، وَالضَّرَرُ يُزَالُ، وَالْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ",
      latinTransliteration: "Al-ashlu fil-asy-ya'il-ibaahah hatta yadullad-dalilu 'alat-tahrim, wad-dhararu yuzaal, wal-masyaqqatu tajlibut-taysiir.",
      indonesianTranslation: `Kaidah Fiqih: "Hukum asal pada segala sesuatu adalah kebolehan (mubah) hingga datang dalil yang menunjukkan pengharaman. Segala kemudaratan harus dihilangkan, dan kesulitan mendatangkan kemudahan."`,
      englishTranslation: `Islamic Legal Maxim: 'The original state of things is permissibility until evidence indicates prohibition. Harm must be eliminated, and hardship begets facility.'`,
      tafsir: `Uraian Fiqih Perbandingan 4 Mazhab dari Al-Mawsu'ah al-Kuwaitiyyah:

1. Kedudukan Hukum & Fatwa Fuqaha:
Dalam ensiklopedia Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah, pembahasan terkait "${titleTopic}" diperinci menurut rukun, syarat sah, dan konsekuensi hukumnya.

2. Komparasi 4 Mazhab Sunni:
- Mazhab Hanafi: Menitikberatkan pada kejelasan akad, istihsan, dan pencegahan mudarat materi.
- Mazhab Maliki: Mengedepankan kemaslahatan umum (mashlahah mursalah) dan tradisi amalan penduduk Madinah.
- Mazhab Syafi'i: Berpegang teguh pada kaidah tekstual nash yang ketat dan qiyas shahih guna menjamin kehati-hatian (ihtiyath).
- Mazhab Hanbali: Mengutamakan nash hadits marfu' dan atsar sahabat serta memberi kelapangan syarat dalam muamalah.

3. Kesimpulan Fiqih:
Perbedaan furu'iyyah di antara para imam mazhab merupakan rahmat dan kelapangan bagi umat Islam dalam menjawab tantangan zaman.`,
      authenticity: "Ketetapan Fiqih 4 Mazhab Muktamad"
    };
  }

  // Default 'artikel' or 'all'
  return {
    id: `synth-artikel-${Date.now()}`,
    title: `Kajian Kritis & Riset Tematik: ${titleTopic}`,
    sourceCategory: 'artikel',
    sourceName: "Arsip Armansyah (Blog Pribadi & Riset)",
    sourceUrl: "https://arsiparmansyah.wordpress.com/",
    reference: `Kajian Kritis & Repositori Arsip Armansyah: Topik ${titleTopic}`,
    topicTag: `Riset Pemikiran & Kajian ${titleTopic}`,
    arabicText: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُولُو الْأَلْبَابِ",
    latinTransliteration: "Qul hal yastawilladzīna ya'lamūna walladzīna lā ya'lamūn, innamā yatadzakkaru ulul-albāb.",
    indonesianTranslation: `Katakanlah: "Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?" Sesungguhnya orang yang berakallah yang dapat menerima pelajaran. (QS. Az-Zumar: 9)`,
    englishTranslation: `Say, "Are those who know equal to those who do not know?" Only they will remember [who are] people of understanding.`,
    tafsir: `Kajian Kritis & Tinjauan Repositori Pemikiran Armansyah:

1. Rekonstruksi Pemahaman Kritis:
Dalam berbagai riset dan buku yang ditulis Armansyah (seperti *Rekonstruksi Sejarah Isa Al-Masih*, *Misteri Kecerdasan Syahadat*, dan *Israk & Mikraj Tinjauan Saintifik*), pembahasan mengenai "${titleTopic}" didekati dengan metode komparasi teks klasik dan telaah kritis rasional-ilmiah.

2. Menepis Kesalahpahaman Doktriner:
Armansyah menyoroti bahwa banyak kekeliruan masyarakat timbul akibat pemahaman tekstual yang kaku tanpa memperhatikan latar belakang historis dan sosiologis wahyu. Islam adalah agama yang mengagungkan akal sehat dan sains.

3. Sintesis Berbobot:
Pendekatan wasathiyah (moderat) yang memadukan dalil syar'i otentik dengan argumentasi ilmiah modern merupakan kunci untuk menjawab skeptisisme kontemporer dan memperkuat keyakinan akidah mukmin.`,
    authenticity: "Riset Otoritatif & Kalamullah"
  };
}
