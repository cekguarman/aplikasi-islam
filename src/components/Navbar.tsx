import React from 'react';
import { BookOpen, Mic, FileText, Settings, ExternalLink, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'khutbah' | 'openings' | 'sources';
  setActiveTab: (tab: 'search' | 'khutbah' | 'openings' | 'sources') => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  hasApiKey
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-md border border-amber-300/40">
              🕌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                  Al-Bayan <span className="font-arabic text-amber-300 text-xl font-normal">البيان</span>
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-400/30 font-medium">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Pencarian Dalil
            </button>

            <button
              onClick={() => setActiveTab('khutbah')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'khutbah'
                  ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              Studio Khutbah & Ceramah
            </button>

            <button
              onClick={() => setActiveTab('openings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'openings'
                  ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              10 Contoh Pembuka MC
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'sources'
                  ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              6 Sumber Utama
            </button>
          </nav>

          {/* Settings & AI Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasApiKey
                  ? 'bg-emerald-800/80 border-emerald-600 text-amber-300 hover:bg-emerald-700'
                  : 'bg-emerald-950/60 border-emerald-700 text-emerald-200 hover:bg-emerald-800'
              }`}
              title="Pengaturan API Key Gemini"
            >
              <Sparkles className={`w-3.5 h-3.5 ${hasApiKey ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{hasApiKey ? 'AI Aktif' : 'Atur Gemini AI'}</span>
              <Settings className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-emerald-800 gap-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'search' ? 'bg-emerald-800 text-amber-300' : 'text-emerald-100'
            }`}
          >
            Pencarian Dalil
          </button>
          <button
            onClick={() => setActiveTab('khutbah')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'khutbah' ? 'bg-emerald-800 text-amber-300' : 'text-emerald-100'
            }`}
          >
            Khutbah & Ceramah
          </button>
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'openings' ? 'bg-emerald-800 text-amber-300' : 'text-emerald-100'
            }`}
          >
            10 Pembuka MC
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'sources' ? 'bg-emerald-800 text-amber-300' : 'text-emerald-100'
            }`}
          >
            6 Rujukan
          </button>
        </div>
      </div>
    </header>
  );
};
