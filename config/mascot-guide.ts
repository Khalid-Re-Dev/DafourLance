import { GuideSectionMeta } from '@/types/mascot-guide';

export const WELCOME_DELAY_MS = 5000;
export const WELCOME_AUTO_DISMISS_MS = 25000;
export const DWELL_NARRATION_THRESHOLD_MS = 10000;
export const BUBBLE_LINGER_MS = 4000;
export const GUIDE_STORAGE_KEY = 'dafourlance-guide-preferences';

export const WELCOME_TEXTS = {
  ar: {
    message: 'مرحباً بك في Dafourlance. هل ترغب أن أعرّفك سريعاً على الموقع؟',
    spokenMessage: 'مرحباً بك في دافورلانس. هل ترغب أن أعرّفك سريعاً على الموقع؟',
    accept: 'ابدأ الجولة',
    decline: 'ليس الآن',
  },
  en: {
    message: 'Welcome to Dafourlance. Would you like me to give you a quick tour?',
    spokenMessage: 'Welcome to Da four lance. Would you like me to give you a quick tour?',
    accept: 'Start Tour',
    decline: 'Not Now',
  },
};

export const GUIDE_SECTIONS: Record<string, GuideSectionMeta> = {
  hero: {
    sectionId: 'hero',
    titleAr: 'الرئيسية',
    titleEn: 'Hero',
    messageAr: 'مرحباً بك في دافورلانس. نحن نقدم حلولاً متكاملة لتحويل رؤيتك إلى واقع رقمي.',
    messageEn: 'Welcome to Dafourlance. We provide comprehensive solutions to turn your vision into digital reality.',
    enabled: true,
    priority: 10,
  },
  about: {
    sectionId: 'about',
    titleAr: 'من نحن',
    titleEn: 'About',
    messageAr: 'تعرف على دافورلانس، فريقنا الشغوف وخبرتنا في تقديم أفضل الخدمات الاستشارية.',
    messageEn: 'Discover Dafourlance, our passionate team, and our expertise in providing the best consulting services.',
    enabled: true,
    priority: 9,
  },
  services: {
    sectionId: 'services',
    titleAr: 'خدماتنا',
    titleEn: 'Services',
    messageAr: 'نقدم مجموعة متنوعة من الخدمات من الاستشارات إلى التطوير لضمان نجاح مشروعك.',
    messageEn: 'We offer a variety of services from consulting to development to ensure your project\'s success.',
    enabled: true,
    priority: 8,
  },
  consultants: {
    sectionId: 'consultants',
    titleAr: 'المستشارون',
    titleEn: 'Consultants',
    messageAr: 'نخبة من المستشارين والخبراء جاهزون لتقديم أفضل الاستراتيجيات والحلول.',
    messageEn: 'An elite group of consultants and experts ready to provide the best strategies and solutions.',
    enabled: true,
    priority: 7,
  },
  projects: {
    sectionId: 'projects',
    titleAr: 'المشاريع',
    titleEn: 'Projects',
    messageAr: 'تصفح سابقة أعمالنا وتعرف على قصص نجاح مشاريعنا المتميزة.',
    messageEn: 'Browse our portfolio and discover the success stories of our outstanding projects.',
    enabled: true,
    priority: 6,
  },
  partners: {
    sectionId: 'partners',
    titleAr: 'شركاء النجاح',
    titleEn: 'Partners',
    messageAr: 'نعتز بشراكاتنا الاستراتيجية مع نخبة من المؤسسات لتقديم أفضل النتائج.',
    messageEn: 'We pride ourselves on our strategic partnerships with leading organizations to deliver the best results.',
    enabled: true,
    priority: 5,
  },
  contact: {
    sectionId: 'contact',
    titleAr: 'اتصل بنا',
    titleEn: 'Contact',
    messageAr: 'تواصل معنا اليوم لبدء رحلة نجاحك الرقمي. نحن هنا لمساعدتك.',
    messageEn: 'Contact us today to start your digital success journey. We are here to help.',
    enabled: true,
    priority: 4,
  },
};
