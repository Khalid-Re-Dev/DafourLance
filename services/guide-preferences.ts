import { GuidePreferences } from '@/types/mascot-guide';
import { GUIDE_STORAGE_KEY } from '@/config/mascot-guide';

export const defaultPreferences: GuidePreferences = {
  hasSeenWelcome: false,
  guideEnabled: true,
  mutedNarration: false,
  narratedSections: [],
};

// Module-level state survives React unmounts (client navigations) 
// but is cleared on a full page reload.
let memorySessionState = {
  hasSeenWelcome: false,
  narratedSections: [] as string[],
  guideCycleId: undefined as string | undefined,
};

export const guidePreferencesService = {
  getPreferences(): GuidePreferences {
    if (typeof window === 'undefined') {
      return { ...defaultPreferences, ...memorySessionState };
    }

    try {
      const stored = localStorage.getItem(GUIDE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { 
          ...defaultPreferences, 
          guideEnabled: parsed.guideEnabled ?? true,
          mutedNarration: parsed.mutedNarration ?? false,
          ...memorySessionState 
        };
      }
    } catch (e) {
      console.warn('Failed to read guide preferences from localStorage', e);
    }
    return { ...defaultPreferences, ...memorySessionState };
  },

  savePreferences(prefs: GuidePreferences): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Update memory session state
    memorySessionState = {
      hasSeenWelcome: prefs.hasSeenWelcome,
      narratedSections: prefs.narratedSections,
      guideCycleId: prefs.guideCycleId,
    };

    try {
      // Only persist long-term user preferences
      const persistentState = {
        guideEnabled: prefs.guideEnabled,
        mutedNarration: prefs.mutedNarration,
      };
      localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(persistentState));
    } catch (e) {
      console.warn('Failed to save guide preferences to localStorage', e);
    }
  },

  updatePreference<K extends keyof GuidePreferences>(key: K, value: GuidePreferences[K]): void {
    const current = this.getPreferences();
    const updated = { ...current, [key]: value };
    this.savePreferences(updated);
  },

  clearPreferences(): void {
    if (typeof window === 'undefined') {
      return;
    }

    memorySessionState = {
      hasSeenWelcome: false,
      narratedSections: [],
      guideCycleId: undefined,
    };

    try {
      localStorage.removeItem(GUIDE_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear guide preferences from localStorage', e);
    }
  },
};
