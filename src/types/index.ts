export type SourceCategory = 'quran' | 'hadith' | 'fiqh' | 'artikel';

export interface RujukanItem {
  name: string;
  url: string;
  detail?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  sourceCategory: SourceCategory;
  sourceName: string;
  sourceUrl: string;
  arabicText: string;
  latinTransliteration?: string;
  indonesianTranslation: string;
  englishTranslation?: string;
  tafsir?: string;
  benangMerah?: string; // Titik temu konsensus / benang merah ilmiah
  perbedaanPandangan?: string; // Peta perbedaan pandangan (ikhtilaf), nuansa tafsir, variasi terjemahan & kritik objektif
  reference: string;
  authenticity?: string;
  madzhab?: string;
  topicTag: string;
  rujukanList?: RujukanItem[];
}

export interface ResearchSynthesis {
  topic: string;
  kesimpulanUtama: string;
  benangMerah?: string; // Benang merah ilmiah / titik temu konsensus dalil lintas sumber
  titikPerbedaan?: string; // Peta perbedaan pandangan (ikhtilaf), nuansa terjemahan/tafsir & perdebatan ilmiah secara jujur
  tinjauanDalil: string;
  tinjauanMazhab: string;
  catatanKritisArmansyah?: string;
  rujukanPrimer: Array<{ name: string; url: string; note: string }>;
}

export interface SearchResponse {
  results: SearchResult[];
  source: string;
  synthesis?: ResearchSynthesis;
}

export interface PembukaanOption {
  id: number;
  title: string;
  source: string;
  arabicText: string;
  transliteration: string;
  indonesianTranslation: string;
  contextUsage: string;
}

export interface KhutbahGenerationParams {
  topic: string;
  type: 'khutbah_jumat' | 'ceramah';
  durationMinutes: number;
  openingId: number; // 1-10 or 0 for AI Auto
  additionalNotes?: string;
}

export interface DalilItem {
  arabic: string;
  latin?: string;
  terjemah: string;
  sumber: string;
}

export interface KhutbahResult {
  id: string;
  topic: string;
  type: 'khutbah_jumat' | 'ceramah';
  durationMinutes: number;
  wordCount: number;
  openingSelected?: PembukaanOption;
  khutbahPertama?: {
    mukaddimah: string;
    wasiatTaqwa: {
      arabic: string;
      terjemah: string;
    };
    dalilUtama: DalilItem[];
    isiKajian: string[];
    penutup: {
      arabic: string;
      terjemah: string;
    };
  };
  antaraDuaKhutbah?: {
    petunjuk: string;
    doa: {
      arabic: string;
      terjemah: string;
    };
  };
  khutbahKedua?: {
    hamdalahShalawat: {
      arabic: string;
      terjemah: string;
    };
    wasiatTaqwa: {
      arabic: string;
      terjemah: string;
    };
    pesanInti: string;
    doaKaumMuslimin: {
      arabic: string;
      latin: string;
      terjemah: string;
    };
    doaKebaikan: {
      arabic: string;
      terjemah: string;
    };
    penutupKhutbah: {
      arabic: string;
      terjemah: string;
    };
  };
  ceramahData?: {
    mukaddimah: string;
    penghormatan: string;
    poinPembahasan: {
      nomor: number;
      judul: string;
      penjelasan: string;
      dalil?: DalilItem;
    }[];
    kesimpulan: string;
    doaKafaratulMajelis: {
      arabic: string;
      latin: string;
      terjemah: string;
    };
  };
  fullMarkdown: string;
  englishTranslation?: string;
  createdMeta?: {
    dayName: string;
    formattedDate: string;
    formattedTime: string;
    fullDisplay: string;
  };
}

export interface SavedSermon {
  id: string;
  title: string;
  topic: string;
  type: 'khutbah_jumat' | 'ceramah';
  durationMinutes: number;
  wordCount: number;
  openingTitle: string;
  openingSelected?: PembukaanOption;
  fullMarkdown: string;
  englishTranslation?: string;
  timestamp: string;
  dayName: string;
  formattedDate: string;
  formattedTime: string;
  fullDisplay: string;
  isCustomEdited: boolean;
  notes?: string;
  createdMeta?: {
    dayName: string;
    formattedDate: string;
    formattedTime: string;
    fullDisplay: string;
  };
}

export interface SavedSearchHistory {
  id: string;
  query: string;
  category: string;
  timestamp: string;
  fullDisplay: string;
  resultCount: number;
}
