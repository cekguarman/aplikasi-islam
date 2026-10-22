import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchSection } from './components/SearchSection';
import { KhutbahGenerator } from './components/KhutbahGenerator';
import { OpeningsBrowser } from './components/OpeningsBrowser';
import { SourcesGuide } from './components/SourcesGuide';
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { TeleprompterModal } from './components/TeleprompterModal';
import { SavedSermonsModal } from './components/SavedSermonsModal';
import { Footer } from './components/Footer';
import { getStoredApiKey } from './services/api';
import { KhutbahResult, SavedSermon, SavedExploration } from './types';
import { History, BookMarked, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'khutbah' | 'openings' | 'sources'>('search');
  const [hasApiKey, setHasApiKey] = useState<boolean>(Boolean(getStoredApiKey()));

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [teleprompterSermon, setTeleprompterSermon] = useState<KhutbahResult | SavedSermon | null>(null);

  // Active Sermon for Generator
  const [selectedSermonForEdit, setSelectedSermonForEdit] = useState<SavedSermon | KhutbahResult | null>(null);
  const [searchParam, setSearchParam] = useState<{ query: string; category: string } | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<SavedExploration | null>(null);

  const handleSelectOpeningForKhutbah = (openingId: number) => {
    setActiveTab('khutbah');
  };

  const handleSelectSavedSermon = (sermon: SavedSermon) => {
    setSelectedSermonForEdit(sermon);
    setActiveTab('khutbah');
  };

  const handleSelectSearch = (query: string, category: string) => {
    setSelectedExploration(null);
    setSearchParam({ query, category });
    setActiveTab('search');
  };

  const handleSelectExploration = (exploration: SavedExploration) => {
    setSelectedExploration(exploration);
    setActiveTab('search');
  };

  const savedExplorationsCount = typeof window !== 'undefined' && localStorage.getItem('al_bayan_saved_explorations_v1')
    ? (JSON.parse(localStorage.getItem('al_bayan_saved_explorations_v1') || '[]') as any[]).length
    : 0;
  const savedSermonsCount = typeof window !== 'undefined' && localStorage.getItem('al_bayan_saved_sermons_v1')
    ? (JSON.parse(localStorage.getItem('al_bayan_saved_sermons_v1') || '[]') as any[]).length
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Floating Action for Saved Sermons / History */}
      <div className="fixed bottom-6 right-6 z-30 no-print flex flex-col items-end gap-2">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xl border border-slate-700 transition-all hover:scale-105 cursor-pointer"
          title="Buka Riwayat Riset & Naskah Tersimpan"
        >
          <History className="w-4 h-4 text-amber-400" />
          <span>Riwayat & Riset ({savedExplorationsCount + savedSermonsCount})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <SearchSection
            key={selectedExploration ? selectedExploration.id : (searchParam ? `${searchParam.query}-${searchParam.category}` : 'default-search')}
            initialQuery={searchParam?.query}
            initialCategory={searchParam?.category}
            selectedExploration={selectedExploration}
            onClearSelectedExploration={() => setSelectedExploration(null)}
            onOpenHistoryModal={() => setIsHistoryOpen(true)}
          />
        )}

        {activeTab === 'khutbah' && (
          <KhutbahGenerator
            key={selectedSermonForEdit?.id || 'new-generator'}
            initialSermon={selectedSermonForEdit}
            onOpenTeleprompter={(sermon) => setTeleprompterSermon(sermon)}
          />
        )}

        {activeTab === 'openings' && (
          <OpeningsBrowser onSelectOpeningForKhutbah={handleSelectOpeningForKhutbah} />
        )}

        {activeTab === 'sources' && <SourcesGuide />}
      </main>

      {/* Modals */}
      <DeveloperProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={(key) => setHasApiKey(Boolean(key))}
      />

      <SavedSermonsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSermon={handleSelectSavedSermon}
        onSelectSearch={handleSelectSearch}
        onSelectExploration={handleSelectExploration}
      />

      <TeleprompterModal
        isOpen={Boolean(teleprompterSermon)}
        onClose={() => setTeleprompterSermon(null)}
        sermon={teleprompterSermon}
      />

      {/* Footer with required credit 'Dikembangkan oleh Armansyah' */}
      <Footer onOpenDeveloperProfile={() => setIsProfileOpen(true)} />
    </div>
  );
};

export default App;
