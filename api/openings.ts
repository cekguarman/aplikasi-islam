import { PEMBUKAAN_OPTIONS } from '../src/data/pembukaanData';

export default function handler(req: any, res: any) {
  res.status(200).json({
    openings: PEMBUKAAN_OPTIONS,
    sourceUrl: "https://kalam.sindonews.com/read/1555911/786/10-contoh-teks-pembukaan-mc-innal-hamda-lillah-yang-bisa-dijadikan-referensi-1744797883"
  });
}
