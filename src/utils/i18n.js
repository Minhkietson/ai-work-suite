// ============================================
// AI Work Suite — i18n (Internationalization)
// ============================================

import * as storage from './storage.js';
import viLocale from '../locales/vi.json';
import enLocale from '../locales/en.json';

const LOCALES = {
  vi: viLocale,
  en: enLocale,
};

const LANG_KEY = 'app_language';
const SUPPORTED_LANGS = ['vi', 'en'];

let currentLang = storage.get(LANG_KEY, 'vi');
let currentLocale = LOCALES[currentLang] || LOCALES.vi;

/**
 * Get current language code
 */
export function getLang() {
  return currentLang;
}

/**
 * Set language and reload
 */
export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  currentLocale = LOCALES[lang];
  storage.set(LANG_KEY, lang);
}

/**
 * Get translated string by dot-path
 * Example: t('stt.title') → "Trợ lý Chuyển đổi Âm thanh AI"
 */
export function t(path, fallback = '') {
  const keys = path.split('.');
  let val = currentLocale;
  for (const key of keys) {
    if (val && typeof val === 'object' && key in val) {
      val = val[key];
    } else {
      return fallback || path;
    }
  }
  return val;
}

/**
 * Get supported languages list for UI
 */
export function getSupportedLangs() {
  return [
    { code: 'vi', label: '🇻🇳 Tiếng Việt', short: 'VI' },
    { code: 'en', label: '🇺🇸 English', short: 'EN' },
  ];
}
