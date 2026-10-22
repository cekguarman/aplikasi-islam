import { PEMBUKAAN_OPTIONS } from '../src/data/pembukaanData';

export default function handler(req: any, res: any) {
  res.status(200).json({
    openings: PEMBUKAAN_OPTIONS
  });
}
