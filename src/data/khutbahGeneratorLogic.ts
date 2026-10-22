import { KhutbahGenerationParams, KhutbahResult } from '../types';
import { PEMBUKAAN_OPTIONS } from './pembukaanData';

export function generateLocalKhutbah(params: KhutbahGenerationParams): KhutbahResult {
  const { topic, type, durationMinutes, openingId, additionalNotes } = params;

  // Determine opening
  let opening = PEMBUKAAN_OPTIONS.find(p => p.id === openingId);
  if (!opening) {
    // If 0 or invalid, choose best suited: Khutbatul Hajah (id: 7) for Khutbah Jumat, or id: 1 for ceramah
    opening = type === 'khutbah_jumat' ? PEMBUKAAN_OPTIONS[6] : PEMBUKAAN_OPTIONS[0];
  }

  const isKhutbahJumat = type === 'khutbah_jumat';
  const targetWords = Math.round(durationMinutes * 130);

  if (isKhutbahJumat) {
    return generateFridaySermon(topic, durationMinutes, opening, targetWords, additionalNotes);
  } else {
    return generateLectureSpeech(topic, durationMinutes, opening, targetWords, additionalNotes);
  }
}

function generateFridaySermon(
  topic: string,
  durationMinutes: number,
  opening: typeof PEMBUKAAN_OPTIONS[0],
  targetWords: number,
  notes?: string
): KhutbahResult {
  const id = `khutbah-${Date.now()}`;

  const wasiatTaqwaArab = "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ";
  const wasiatTaqwaTerjemah = "Wahai orang-orang yang beriman! Bertakwalah kepada Allah dengan sebenar-benar takwa kepada-Nya dan janganlah kamu mati kecuali dalam keadaan muslim. (QS. Ali 'Imran: 102)";

  const ayatQuranArab = "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا ۝ يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَمَنْ يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا";
  const ayatQuranTerjemah = "Wahai orang-orang yang beriman! Bertakwalah kamu kepada Allah dan ucapkanlah perkataan yang benar, niscaya Allah memperbaiki amal-amalmu dan mengampuni dosa-dosamu. Dan barang siapa menaati Allah dan Rasul-Nya, maka sungguh ia telah menang dengan kemenangan yang agung. (QS. Al-Ahzab: 70-71)";

  const haditsArab = "عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»";
  const haditsTerjemah = "Dari Umar bin Khaththab radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wasallam bersabda: 'Sesungguhnya segala amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan.' (HR. Bukhari No. 1 & Muslim No. 1907)";

  const penutupKhutbah1Arab = "بَارَكَ اللهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيْمِ، وَنَفَعَنِي وَإِيَّاكُمْ بِمَا فِيْهِ مِنَ الآيَاتِ وَالذِّكْرِ الْحَكِيْمِ. أَقُوْلُ قَوْلِي هَذَا وَأَسْتَغْفِرُ اللهَ الْعَظِيْمَ لِي وَلَكُمْ وَلِسَائِرِ الْمُسْلِمِيْنَ مِنْ كُلِّ ذَنْبٍ، فَاسْتَغْفِرُوْهُ إِنَّهُ هُوَ الْغَفُوْرُ الرَّحِيْمُ.";
  const penutupKhutbah1Arti = "Semoga Allah memberkahi saya dan jamaah sekalian dalam Al-Qur'an yang agung, dan memberi manfaat kepada kita dengan ayat-ayat dan peringatan yang bijaksana di dalamnya. Saya menyampaikan perkataan ini dan memohon ampunan kepada Allah Yang Maha Agung untuk saya dan jamaah sekalian serta seluruh kaum muslimin dari setiap dosa. Maka mohonlah ampunan kepada-Nya, sungguh Dia Maha Pengampun lagi Maha Penyayang.";

  const pembukaKhutbah2Arab = "الْحَمْدُ للهِ حَمْدًا كَثِيرًا كَمَا أَمَرَ. وَأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ إِرْغَامًا لِمَنْ جَحَدَ بِهِ وَكَفَرَ. وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ سَيِّدُ الْإِنْسِ وَالْبَشَرِ. اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ مَا اتَّصَلَتْ عَيْنٌ بِنَظَرٍ وَأُذُنٌ بِخَبَرٍ.";
  const wasiatKhutbah2Arab = "عِبَادَ اللهِ، اتَّقُوا اللهَ تَعَالَى فِيمَا أَمَرَ، وَانْتَهُوا عَمَّا نَهَى عَنْهُ وَزَجَرَ، وَاعْلَمُوا أَنَّ اللهَ أَمَرَكُمْ بِأَمْرٍ بَدَأَ فِيهِ بِنَفْسِهِ، وَثَنَّى بِمَلَائِكَتِهِ الْمُسَبِّحَةِ بِقُدْسِهِ، فَقَالَ تَعَالَى: ﴿إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا﴾";

  const doaKaumMusliminArab = "اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ، وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ، إِنَّكَ سَمِيعٌ قَرِيبٌ مُجِيبُ الدَّعَوَاتِ يَا قَاضِيَ الْحَاجَاتِ. اللَّهُمَّ أَصْلِحْ لَنَا دِينَنَا الَّذِي هُوَ عِصْمَةُ أَمْرِنَا، وَأَصْلِحْ لَنَا دُنْيَانَا الَّتِي فِيهَا مَعَاشُنَا، وَأَصْلِحْ لَنَا آخِرَتَنَا الَّتِي فِيهَا مَعَادُنَا، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لَنَا فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لَنَا مِنْ كُلِّ شَرٍّ.";
  const doaKaumMusliminLatin = "Allahummaghfir lil-muslimiina wal-muslimaat, wal-mu'miniina wal-mu'minaat, al-ahyaa-i minhum wal-amwaat. Innaka samii'un qariibun mujiibud-da'awaat yaa qaadhiyal-haajaat...";
  const doaKaumMusliminArti = "Ya Allah, ampunilah dosa kaum muslimin dan muslimat, mukminin dan mukminat, baik yang masih hidup maupun yang telah wafat. Sesungguhnya Engkau Maha Mendengar, Maha Dekat, lagi Mengabulkan segala doa, wahai Dzat Pemenuh segala kebutuhan...";

  const doaSapuJagadArab = "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.";
  const doaSapuJagadArti = "Ya Tuhan kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa api neraka.";

  const penutupKhutbah2Arab = "عِبَادَ اللهِ، إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ. فَاذْكُرُوا اللَّهَ الْعَظِيمَ يَذْكُرْكُمْ، وَاشْكُرُوهُ عَلَى نِعَمِهِ يَزِدْكُمْ، وَلَذِكْرُ اللَّهِ أَكْبَرُ. أَقِيمُوا الصَّلَاةَ.";
  const penutupKhutbah2Arti = "Hamba-hamba Allah! Sesungguhnya Allah menyuruh (kamu) berlaku adil dan berbuat kebajikan, memberi bantuan kepada kaum kerabat, dan Dia melarang dari perbuatan keji, kemungkaran, dan permusuhan. Dia memberi pengajaran kepadamu agar kamu dapat mengambil pelajaran. Maka ingatlah kepada Allah Yang Maha Agung niscaya Dia mengingatmu, dan bersyukurlah atas nikmat-nikmat-Nya niscaya Dia menambah karunia-Nya kepadamu. Dan sungguh mengingat Allah itu lebih utama. Luruskan dan rapatkan shaf, tegakkanlah shalat!";

  // Elaboration depth based on duration
  const depthParagraphs = [
    `Ma'asyiral Muslimin Rahimakumullah,\n\nTopik khutbah kita pada siang hari yang penuh berkah ini mengangkat tema: "${topic}". Kehidupan manusia di muka bumi senantiasa diuji dengan berbagai dinamika peradaban. Dalam perspektif Al-Qur'an dan As-Sunnah, setiap amanah yang kita emban menuntut ketulusan niat dan komitmen moral yang kukuh.`,
    `Dalam kitab Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah (shamela.ws/book/23604), para fuqaha 4 mazhab menegaskan bahwa setiap perbuatan mukallaf tidak lepas dari lima hukum syar'i: wajib, sunnah, mubah, makruh, atau haram. Dalam mengamalkan prinsip "${topic}", seorang muslim wajib menimbang maslahat dan mafsadat agar langkahnya senantiasa berada dalam ridha Allah SWT.`,
    `Urgensi menjaga integritas dalam "${topic}" juga ditegaskan dalam hadits-hadits Rasulullah ﷺ yang diriwayatkan para imam muhadditsin (Shahih Bukhari, Muslim, Tirmidzi, dan Abu Daud). Nabi ﷺ memberikan teladan terbaik bagaimana nilai keimanan termanifestasi secara nyata dalam muamalah sosial, kejujuran lisan, serta kepedulian terhadap sesama.`,
    `Oleh karena itu, marilah kita senantiasa bermuhasabah: sejauh mana pengamalan "${topic}" telah menjadi hiasan akhlak kita sehari-hari? Jangan sampai kita menjadi orang yang bangkrut di hari kiamat, membawa pahala ibadah ritual namun tergerus oleh kelalaian muamalah dan kezaliman terhadap sesama hamba Allah.`
  ];

  if (durationMinutes >= 15) {
    depthParagraphs.push(
      `Hadirin jamaah Jumat yang berbahagia,\n\nSetidaknya ada 3 langkah praktis yang dapat kita terapkan mulai hari ini:\n1. Senantiasa meluruskan niat lillahi ta'ala dalam setiap aktivitas.\n2. Mengkaji ilmu syariat dan fiqih dari rujukan yang mu'tamad (terpercaya) agar tidak tersesat dalam pemahaman ekstrem maupun menggampangkan.\n3. Membiasakan saling menasihati dalam kebenaran dan kesabaran (tawashaw bil-haqq wa tawashaw bish-shabr).`
    );
  }
  if (durationMinutes >= 30) {
    depthParagraphs.push(
      `Pelajaran berharga dari para ulama salafus shalih mengingatkan kita bahwa barakah suatu ilmu terletak pada pengamalannya. Imam Syafi'i rahimahullah berpesan bahwa ilmu itu bukanlah apa yang semata-mata dihafal, melainkan apa yang mendatangkan kemanfaatan bagi diri dan umat manusia.\n\nSemoga momentum ibadah Jumat ini membangkitkan kembali ruh ketaqwaan kita, menyucikan hati dari noda riya dan hasad, serta mempererat tali ukhuwah islamiyyah di antara kita.`
    );
  }

  const fullMarkdown = `
# Naskah Khutbah Jumat: ${topic}
**Durasi**: ${durationMinutes} Menit | **Estimasi Kata**: ~${targetWords} Kata | **Pembuka**: ${opening.title}

---

## KHUTBAH PERTAMA

### 1. Mukaddimah (Pembukaan)
${opening.arabicText}

*${opening.transliteration}*

Artinya:
"${opening.indonesianTranslation}"

### 2. Wasiat Taqwa (Rukun Khutbah)
${wasiatTaqwaArab}

*${wasiatTaqwaTerjemah}*

### 3. Ayat Al-Qur'an Pilihan (Rukun Khutbah)
${ayatQuranArab}

Artinya:
"${ayatQuranTerjemah}"

### 4. Dalil Hadits Nabawi
${haditsArab}

Artinya:
"${haditsTerjemah}"

### 5. Inti Pembahasan Khutbah
${depthParagraphs.join('\n\n')}

### 6. Penutup Khutbah Pertama
${penutupKhutbah1Arab}

Artinya:
"${penutupKhutbah1Arti}"

---

## DUDUK DI ANTARA DUA KHUTBAH
*(Khatib duduk sejenak di mimbar sambil berdoa dan beristighfar)*

اللَّهُمَّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ

---

## KHUTBAH KEDUA

### 1. Pembuka Khutbah Kedua (Tahmid & Shalawat)
${pembukaKhutbah2Arab}

### 2. Wasiat Taqwa & Perintah Shalawat
${wasiatKhutbah2Arab}

### 3. Doa Kaum Muslimin & Muslimat
${doaKaumMusliminArab}

*${doaKaumMusliminLatin}*

Artinya:
"${doaKaumMusliminArti}"

${doaSapuJagadArab}
"${doaSapuJagadArti}"

### 4. Penutup Khutbah & Seruan Sholat
${penutupKhutbah2Arab}

Artinya:
"${penutupKhutbah2Arti}"
`.trim();

  const englishTranslation = `
# Friday Sermon (Khutbah Jumu'ah): ${topic}
**Duration**: ${durationMinutes} Minutes | **Pillars & Structure Complete**

### Summary of Khutbah 1:
- **Opening**: Praising Allah, testifying to His Oneness and the prophethood of Muhammad (PBUH).
- **Admonition to Taqwa**: Calling the congregation to fear Allah sincerely as outlined in Surah Ali 'Imran (3:102) and speak truth (Surah Al-Ahzab 33:70-71).
- **Core Message**: Exploration of "${topic}" grounded in Quranic teachings, Hadith of intention (Sahih Bukhari #1), and classical jurisprudential insights from the four Sunni schools (Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah).
- **Practical Application**: Cultivating sincerity, adhering to sound knowledge, and embodying moral excellence in daily affairs.

### Summary of Khutbah 2:
- Re-affirming praise to Allah and sending peace upon the Messenger.
- Supplications (Du'a) asking forgiveness for all Muslim men and women, purification of heart, rectitude in faith, and welfare in both this worldly life and the Hereafter.
`.trim();

  return {
    id,
    topic,
    type: 'khutbah_jumat',
    durationMinutes,
    wordCount: targetWords,
    openingSelected: opening,
    khutbahPertama: {
      mukaddimah: opening.arabicText,
      wasiatTaqwa: {
        arabic: wasiatTaqwaArab,
        terjemah: wasiatTaqwaTerjemah
      },
      dalilUtama: [
        {
          arabic: ayatQuranArab,
          terjemah: ayatQuranTerjemah,
          sumber: "QS. Al-Ahzab [33]: 70-71 (TafsirWeb.com & QuranWeb.id)"
        },
        {
          arabic: haditsArab,
          terjemah: haditsTerjemah,
          sumber: "HR. Bukhari No. 1 (CariHadits.id & Hadits Tazkia)"
        }
      ],
      isiKajian: depthParagraphs,
      penutup: {
        arabic: penutupKhutbah1Arab,
        terjemah: penutupKhutbah1Arti
      }
    },
    antaraDuaKhutbah: {
      petunjuk: "Khatib duduk sejenak dengan tenang di mimbar. Disunnahkan memperbanyak istighfar dan doa secara sirr (dalam hati), karena waktu antara dua khutbah termasuk waktu mustajab.",
      doa: {
        arabic: "اللَّهُمَّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
        terjemah: "Ya Allah, ampunilah dan limpahkanlah rahmat, dan Engkau adalah sebaik-baik Pemberi rahmat."
      }
    },
    khutbahKedua: {
      hamdalahShalawat: {
        arabic: pembukaKhutbah2Arab,
        terjemah: "Segala puji bagi Allah dengan pujian yang melimpah sebagaimana yang Dia perintahkan. Aku bersaksi tiada sesembahan selain Allah semata tanpa sekutu bagi-Nya... Dan aku bersaksi junjungan kita Nabi Muhammad adalah hamba dan utusan-Nya."
      },
      wasiatTaqwa: {
        arabic: wasiatKhutbah2Arab,
        terjemah: "Wahai hamba-hamba Allah! Bertakwalah kepada Allah atas apa yang diperintahkan-Nya, dan jauhilah apa yang dilarang-Nya. Dan ketahuilah bahwa Allah telah memerintahkan kalian bershalawat kepada Nabi-Nya."
      },
      pesanInti: `Marilah kita memperbarui tekad kita untuk mengimplementasikan "${topic}" dalam kehidupan nyata keluarga, masyarakat, dan pekerjaan kita.`,
      doaKaumMuslimin: {
        arabic: doaKaumMusliminArab,
        latin: doaKaumMusliminLatin,
        terjemah: doaKaumMusliminArti
      },
      doaKebaikan: {
        arabic: दोबाराSapuJagad(doaSapuJagadArab),
        terjemah: doaSapuJagadArti
      },
      penutupKhutbah: {
        arabic: penutupKhutbah2Arab,
        terjemah: penutupKhutbah2Arti
      }
    },
    fullMarkdown,
    englishTranslation
  };
}

function दोबाराSapuJagad(text: string) {
  return text;
}

function generateLectureSpeech(
  topic: string,
  durationMinutes: number,
  opening: typeof PEMBUKAAN_OPTIONS[0],
  targetWords: number,
  notes?: string
): KhutbahResult {
  const id = `ceramah-${Date.now()}`;

  const dalil1 = {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ",
    terjemah: "Wahai orang-orang yang beriman! Bertakwalah kepada Allah dengan sebenar-benar takwa kepada-Nya dan janganlah kamu mati kecuali dalam keadaan muslim. (QS. Ali 'Imran: 102)",
    sumber: "QS. Ali 'Imran: 102 (QuranWeb.id & TafsirWeb.com)"
  };

  const dalil2 = {
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ»",
    terjemah: "Dari Abu Hurairah radhiyallahu 'anhu, Rasulullah shallallahu 'alaihi wasallam bersabda: 'Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam.' (HR. Bukhari & Muslim)",
    sumber: "HR. Bukhari No. 6018 & Muslim No. 47 (CariHadits.id)"
  };

  const poinPembahasan = [
    {
      nomor: 1,
      judul: `Landasan Syariat dan Hakikat ${topic}`,
      penjelasan: `Islam mengajarkan bahwa setiap perbuatan manusia bersumber dari kesadaran tauhid. Dalam pembahasan "${topic}", Al-Qur'an dan Sunnah menempatkannya sebagai salah satu pilar pembentukan karakter seorang mukmin yang bertakwa. Berdasarkan Al-Mawsu'ah al-Fiqhiyyah al-Kuwaitiyyah, menjaga keselarasan antara ilmu syar'i dan amal saleh merupakan syarat mutlak meraih kebahagiaan hakiki.`,
      dalil: dalil1
    },
    {
      nomor: 2,
      judul: `Dampak Positif dan Keberkahan dalam Kehidupan`,
      penjelasan: `Ketika seseorang mempraktikkan "${topic}" dengan penuh keikhlasan, Allah SWT akan membukakan pintu-pintu kemudahan, ketenangan batin (thuma'ninah), dan kerukunan sosial. Sebagaimana dijelaskan dalam hadits Rasulullah ﷺ, kebaikan yang ditebarkan akan kembali kepada pelakunya berlipat ganda.`,
      dalil: dalil2
    },
    {
      nomor: 3,
      judul: `Tantangan Kontemporer dan Solusi Nabawi`,
      penjelasan: `Di zaman modern dengan derasnya arus informasi dan godaan materialisme, mempertahankan komitmen terhadap "${topic}" tentu menghadapi tantangan. Solusi terbaik adalah mempererat hubungan dengan Al-Qur'an, memilih lingkungan sahabat yang saleh, serta senantiasa menuntut ilmu di majelis-majelis yang berdasar rujukan yang shahih.`
    }
  ];

  if (durationMinutes >= 20) {
    poinPembahasan.push({
      nomor: 4,
      judul: `Langkah Aksi Nyata (Action Plan) Jamaah`,
      penjelasan: `Tidak cukup materi hanya dipahami sebagai wacana intelektual semata. Mulailah dari lingkungan terkecil: diri sendiri dan keluarga. Evaluasi amalan harian, hindari sikap meremehkan dosa kecil, dan perbanyak sedekah serta istighfar di waktu pagi dan petang.`
    });
  }

  const sapaan = "Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nAlhamdulillahi Rabbil 'Alamin, puji dan syukur kita panjatkan ke hadirat Allah Subhanahu wa Ta'ala. Shalawat serta salam semoga senantiasa tercurah kepada baginda Nabi Agung Muhammad Shallallahu 'Alaihi Wasallam, para keluarga, sahabat, dan pengikutnya yang setia hingga akhir zaman.\n\nBapak-bapak, Ibu-ibu, hadirin hadirat jamaah majelis taklim yang insya Allah dirahmati dan dimuliakan oleh Allah SWT.";

  const kesimpulan = `Sebagai kesimpulan dari ceramah kita tentang "${topic}":\nMarilah kita jadikan majelis ilmu ini sebagai titik tolak perbaikan diri (ishlahun nafs). Ilmu yang barakah adalah ilmu yang membuahkan rasa takut kepada Allah dan akhlak mulia kepada sesama makhluk.`;

  const doaKafaratulMajelis = {
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    latin: "Subhaanakallaahumma wa bihamdika, asyhadu allaa ilaaha illaa anta, astaghfiruka wa atuubu ilaik.",
    terjemah: "Maha Suci Engkau, ya Allah, dan dengan memuji-Mu. Aku bersaksi bahwa tiada sesembahan yang berhak disembah selain Engkau. Aku memohon ampunan-Mu dan bertaubat kepada-Mu."
  };

  const fullMarkdown = `
# Naskah Ceramah / Pengajian: ${topic}
**Format**: Ceramah Agama / Majelis Taklim | **Durasi**: ${durationMinutes} Menit (~${targetWords} Kata)
**Mukaddimah Terpilih**: ${opening.title}

---

## 1. Pembukaan (Mukaddimah)
${sapaan}

${opening.arabicText}

*${opening.transliteration}*

Artinya:
"${opening.indonesianTranslation}"

---

## 2. Poin-Poin Inti Ceramah

${poinPembahasan.map(p => `### Poin ${p.nomor}: ${p.judul}
${p.penjelasan}

${p.dalil ? `**Dalil Rujukan:**\n> ${p.dalil.arabic}\n>\n> *Artinya: "${p.dalil.terjemah}"*\n> *(Sumber: ${p.dalil.sumber})*` : ''}
`).join('\n\n')}

---

## 3. Kesimpulan & Penutup
${kesimpulan}

Hadirin yang berbahagia, demikianlah materi yang dapat saya sampaikan. Segala kebenaran datangnya semata dari Allah SWT, dan kekhilafan semata karena keterbatasan diri al-faqir. Marilah kita akhiri majelis yang mulia ini dengan bersama-sama membaca doa kafaratul majelis:

${doaKafaratulMajelis.arabic}

*${doaKafaratulMajelis.latin}*

Artinya:
"${doaKafaratulMajelis.terjemah}"

Wassalamu’alaikum Warahmatullahi Wabarakatuh.
`.trim();

  const englishTranslation = `
# Islamic Lecture / Sermon: ${topic}
**Duration**: ${durationMinutes} Minutes (~${targetWords} Words)

### Structure & Main Points:
1. **Opening Supplication & Praise**: Exalting Allah and honoring Prophet Muhammad (PBUH) with authentic Innal Hamdalillah invocation.
2. **Core Essence**: Exploration of "${topic}" referencing the Noble Quran (Ali 'Imran 3:102) and Sahih Hadith on righteous conduct and guarding the tongue.
3. **Virtues & Social Impact**: How practicing sincere devotion brings inner tranquility (sakina), divine blessings (barakah), and strengthens community brotherhood.
4. **Conclusion**: Calling for personal repentance, daily application in family life, and concluding with the Sunnah Kafaratul Majlis supplication (*Subhanakallahumma wa bihamdika...*).
`.trim();

  return {
    id,
    topic,
    type: 'ceramah',
    durationMinutes,
    wordCount: targetWords,
    openingSelected: opening,
    ceramahData: {
      mukaddimah: opening.arabicText,
      penghormatan: sapaan,
      poinPembahasan,
      kesimpulan,
      doaKafaratulMajelis
    },
    fullMarkdown,
    englishTranslation
  };
}
