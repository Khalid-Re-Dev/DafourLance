// types/mascot-guide.ts

export type GuideState =
  | { status: 'idle' }
  | { status: 'welcome_prompt' }
  | { status: 'guided_mode' }
  | { status: 'observing' }
  | { status: 'section_dwell'; sectionId: string }
  | { status: 'preparing_message'; sectionId: string }
  | { status: 'speaking'; sectionId?: string }
  | { status: 'interaction_paused' }
  | { status: 'chat_open' }
  | { status: 'dismissed' }
  | { status: 'reduced_motion' };

export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'error';

export interface GuidePreferences {
  hasSeenWelcome: boolean;
  guideEnabled: boolean;
  mutedNarration: boolean;
  narratedSections: string[];
  guideCycleId?: string;
}

export interface GuideSectionMeta {
  sectionId: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  enabled: boolean;
  priority?: number;
}
