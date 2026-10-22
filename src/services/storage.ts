import { SavedSermon, SavedSearchHistory, SavedExploration } from '../types';

const SERMONS_STORAGE_KEY = 'al_bayan_saved_sermons_v1';
const SEARCH_HISTORY_KEY = 'al_bayan_search_history_v1';
const EXPLORATIONS_STORAGE_KEY = 'al_bayan_saved_explorations_v1';

export function getIndonesianDateTime(date = new Date()) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {
    dayName,
    formattedDate: `${dayNum} ${monthName} ${year}`,
    formattedTime: `${hours}:${minutes} WIB`,
    fullDisplay: `${dayName}, ${dayNum} ${monthName} ${year} pukul ${hours}:${minutes} WIB`
  };
}

// Sermons Management
export function getSavedSermons(): SavedSermon[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SERMONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed reading saved sermons:', err);
    return [];
  }
}

export function saveSermon(sermon: SavedSermon): SavedSermon[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedSermons();
    const index = list.findIndex(s => s.id === sermon.id);
    let updated: SavedSermon[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = sermon;
    } else {
      updated = [sermon, ...list];
    }
    localStorage.setItem(SERMONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed saving sermon:', err);
    return [];
  }
}

export function deleteSermon(id: string): SavedSermon[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedSermons().filter(s => s.id !== id);
    localStorage.setItem(SERMONS_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (err) {
    console.error('Failed deleting sermon:', err);
    return [];
  }
}

// Search History Management
export function getSavedSearchHistory(): SavedSearchHistory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed reading search history:', err);
    return [];
  }
}

export function saveSearchHistory(query: string, category: string, resultCount: number): SavedSearchHistory[] {
  if (typeof window === 'undefined' || !query.trim()) return [];
  try {
    const dt = getIndonesianDateTime();
    const newItem: SavedSearchHistory = {
      id: `search-${Date.now()}`,
      query: query.trim(),
      category,
      timestamp: new Date().toISOString(),
      fullDisplay: dt.fullDisplay,
      resultCount
    };

    const list = getSavedSearchHistory().filter(h => h.query.toLowerCase() !== query.trim().toLowerCase());
    const updated = [newItem, ...list].slice(0, 30); // keep last 30
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed saving search history:', err);
    return [];
  }
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}

// Exploration Snapshots Management
export function getSavedExplorations(): SavedExploration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EXPLORATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed reading saved explorations:', err);
    return [];
  }
}

export function saveExploration(exploration: SavedExploration): SavedExploration[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedExplorations();
    const index = list.findIndex(e => e.id === exploration.id || e.topic.toLowerCase() === exploration.topic.toLowerCase());
    let updated: SavedExploration[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = exploration;
    } else {
      updated = [exploration, ...list];
    }
    localStorage.setItem(EXPLORATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed saving exploration:', err);
    return [];
  }
}

export function deleteExploration(id: string): SavedExploration[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedExplorations().filter(e => e.id !== id);
    localStorage.setItem(EXPLORATIONS_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (err) {
    console.error('Failed deleting exploration:', err);
    return [];
  }
}

export function getExplorationById(id: string): SavedExploration | undefined {
  const list = getSavedExplorations();
  return list.find(e => e.id === id);
}

