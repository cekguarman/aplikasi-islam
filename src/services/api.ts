import { SearchResult, KhutbahGenerationParams, KhutbahResult, PembukaanOption } from '../types';
import { INITIAL_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { PEMBUKAAN_OPTIONS } from '../data/pembukaanData';
import { generateLocalKhutbah } from '../data/khutbahGeneratorLogic';

const API_KEY_STORAGE = 'al_bayan_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function saveStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export async function searchIslamicContent(query: string, category: string = 'all'): Promise<{ results: SearchResult[]; source: string }> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`, {
      headers: {
        'x-gemini-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend search unreachable, running client-side local search:', err);
  }

  // Client-side fallback
  const lowerQ = query.toLowerCase().trim();
  if (!lowerQ) {
    const res = category === 'all'
      ? INITIAL_KNOWLEDGE_BASE
      : INITIAL_KNOWLEDGE_BASE.filter(i => i.sourceCategory === category);
    return { results: res, source: 'local' };
  }

  const filtered = INITIAL_KNOWLEDGE_BASE.filter(item => {
    const matchCat = category === 'all' || item.sourceCategory === category;
    const matchText =
      item.title.toLowerCase().includes(lowerQ) ||
      item.indonesianTranslation.toLowerCase().includes(lowerQ) ||
      item.topicTag.toLowerCase().includes(lowerQ) ||
      item.reference.toLowerCase().includes(lowerQ) ||
      (item.tafsir && item.tafsir.toLowerCase().includes(lowerQ));
    return matchCat && matchText;
  });

  return {
    results: filtered.length > 0 ? filtered : INITIAL_KNOWLEDGE_BASE,
    source: 'local'
  };
}

export async function generateKhutbahApi(params: KhutbahGenerationParams): Promise<{ result: KhutbahResult; source: string }> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch('/api/generate-khutbah', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': apiKey
      },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend khutbah generator unreachable, running client-side generator:', err);
  }

  // Client-side fallback generator
  const result = generateLocalKhutbah(params);
  return { result, source: 'local' };
}

export async function translateTextApi(text: string, targetLang: 'en' | 'id'): Promise<string> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': apiKey
      },
      body: JSON.stringify({ text, targetLang })
    });

    if (res.ok) {
      const data = await res.json();
      return data.translatedText;
    }
  } catch (err) {
    console.warn('Backend translate error:', err);
  }

  return targetLang === 'en'
    ? `[English translation generated for]: "${text.substring(0, 100)}..."`
    : text;
}
