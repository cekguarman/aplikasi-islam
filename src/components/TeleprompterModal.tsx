import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Plus, Minus, Sun, Moon, Clock } from 'lucide-react';
import { KhutbahResult, SavedSermon } from '../types';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermon: KhutbahResult | SavedSermon | null;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  sermon
}) => {
  if (!isOpen || !sermon) return null;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 to 5
  const [fontSize, setFontSize] = useState<number>(28); // text size in px
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Timer countdown
  const initialSeconds = (sermon.durationMinutes || 15) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);

  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, secondsRemaining]);

  // Auto-scroll loop effect
  useEffect(() => {
    const scrollStep = () => {
      if (isPlaying && contentRef.current) {
        contentRef.current.scrollTop += scrollSpeed * 0.8;
      }
      animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(scrollStep);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, scrollSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    setSecondsRemaining(initialSeconds);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const lines = sermon.fullMarkdown.split('\n\n');

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-black text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Floating Controls Bar */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Left: Sermon Info & Countdown Timer */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              {sermon.topic}
            </h3>
            <span className="text-xs opacity-70">
              {sermon.type === 'khutbah_jumat' ? 'Khutbah Jum\'at' : 'Ceramah'} &bull; Target {sermon.durationMinutes} Menit
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-base font-bold border ${
            secondsRemaining < 120
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : isDarkMode ? 'bg-slate-900 text-amber-300 border-slate-700' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        {/* Center: Play/Pause, Speed & Font Controls */}
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Jeda (Pause)' : 'Mulai Gulir (Play)'}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className={`p-2 rounded-xl border transition ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
            title="Reset Posisi & Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Controls */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="opacity-70 font-semibold mr-1">Kecepatan:</span>
            <button
              onClick={() => setScrollSpeed(s => Math.max(1, s - 1))}
              className="p-1 hover:bg-white/10 rounded"
              title="Perlambat"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold w-4 text-center">{scrollSpeed}x</span>
            <button
              onClick={() => setScrollSpeed(s => Math.min(6, s + 1))}
              className="p-1 hover:bg-white/10 rounded"
              title="Percepat"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Controls */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="opacity-70 font-semibold mr-1">Huruf:</span>
            <button
              onClick={() => setFontSize(f => Math.max(18, f - 2))}
              className="p-1 hover:bg-white/10 rounded"
              title="Perkecil Font"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold w-6 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(f => Math.min(48, f + 2))}
              className="p-1 hover:bg-white/10 rounded"
              title="Perbesar Font"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
            title="Ganti Tema Layar"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Right: Close Teleprompter */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
          title="Tutup Mode Mimbar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Teleprompter Scrollable Viewport */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 sm:px-16 py-12 scroll-smooth"
        style={{
          scrollBehavior: 'smooth'
        }}
      >
        <div className="max-w-4xl mx-auto space-y-8 pb-48">
          {lines.map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            // H1 or Title
            if (trimmed.startsWith('# ')) {
              return (
                <div key={idx} className="text-center pb-4 border-b border-amber-500/40">
                  <h1
                    className="font-bold text-amber-400 tracking-wide"
                    style={{ fontSize: `${fontSize * 1.3}px` }}
                  >
                    {trimmed.replace('# ', '')}
                  </h1>
                </div>
              );
            }

            // H2 section (e.g. KHUTBAH PERTAMA / KEDUA)
            if (trimmed.startsWith('## ')) {
              return (
                <div
                  key={idx}
                  className="p-3 text-center uppercase tracking-widest font-black bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/20 my-6"
                  style={{ fontSize: `${fontSize * 0.9}px` }}
                >
                  {trimmed.replace('## ', '')}
                </div>
              );
            }

            // H3 subsection
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3 my-4"
                  style={{ fontSize: `${fontSize * 0.85}px` }}
                >
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            // Arabic text block (Extra Large with Harakat)
            const isArabic = /[\u0600-\u06FF]/.test(trimmed) && trimmed.length > 8;
            if (isArabic) {
              return (
                <div
                  key={idx}
                  dir="rtl"
                  className="font-arabic font-bold text-right leading-loose p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-emerald-300 select-text my-6"
                  style={{ fontSize: `${fontSize * 1.35}px`, lineHeight: 2.3 }}
                >
                  {trimmed}
                </div>
              );
            }

            // Normal justified speech paragraph
            return (
              <p
                key={idx}
                className="text-justify-custom leading-relaxed hyphens-auto font-normal"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.85,
                  textAlign: 'justify',
                  textJustify: 'inter-word'
                }}
              >
                {trimmed.replace(/^\*\*(.*?)\*\*/g, '$1')}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
