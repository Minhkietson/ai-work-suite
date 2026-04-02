// ============================================
// AI Work Suite — Main Entry Point
// by Trịnh Ngọc Hà
// ============================================

import './style.css';
import { showUpgradePrompt } from './utils/premium.js';
import { t, getLang, setLang, getSupportedLangs } from './utils/i18n.js';
import * as storage from './utils/storage.js';
import { renderHeader } from './components/header.js';
import { renderSettings, initSettings } from './components/settings.js';
import { renderApiKeyModal, initApiKeyModal } from './components/api-key-modal.js';

// Page modules
import * as Landing from './pages/landing.js';
import * as SpeechToText from './pages/speech-to-text.js';
import * as TextToSpeech from './pages/text-to-speech.js';
import * as ScreenRecord from './pages/screen-record.js';
import * as DocProcessor from './pages/doc-processor.js';

// ---------- Page Registry ----------
const PAGES = {
  'landing': Landing,
  'speech-to-text': SpeechToText,
  'text-to-speech': TextToSpeech,
  'screen-record': ScreenRecord,
  'doc-processor': DocProcessor,
};

const APP_PAGES = ['speech-to-text', 'text-to-speech', 'screen-record', 'doc-processor'];

let currentPage = 'landing';

// ---------- Initialize Theme ----------
function initTheme() {
  const theme = storage.get('theme', 'light');
  const color = storage.get('color', 'green');
  const bg = storage.get('bg', 'abstract');
  
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.color = color;
  document.documentElement.dataset.bg = bg;
}

// ---------- Router ----------
function getPageFromHash() {
  const hash = window.location.hash.replace('#', '') || 'landing';
  return PAGES[hash] ? hash : 'landing';
}

function navigate(pageId) {
  if (!PAGES[pageId]) return;
  currentPage = pageId;
  window.location.hash = pageId;
  renderApp();
}

// ---------- Render ----------
function renderApp() {
  const app = document.getElementById('app');
  const page = PAGES[currentPage];
  const isAppPage = APP_PAGES.includes(currentPage);

  app.innerHTML = `
    <div class="app-bg"></div>
    ${isAppPage ? renderHeader(currentPage) : ''}
    <main class="${isAppPage ? 'main-content' : 'landing-content'}">
      ${page.render()}
    </main>
    <footer class="footer">
      <p>${t('app.footer')}</p>
    </footer>
    ${isAppPage ? renderSettings() : ''}
    ${isAppPage ? renderApiKeyModal() : ''}
  `;

  // Init page
  page.init();
  
  // Init global components (only for app pages)
  if (isAppPage) {
    initSettings();
    initApiKeyModal();
    initNavigation();
    initMobileMenu();
    
    // Premium upgrade button
    document.getElementById('upgrade-btn')?.addEventListener('click', showUpgradePrompt);
    
    // Language toggle
    document.getElementById('lang-display-btn')?.addEventListener('click', () => {
      const langs = getSupportedLangs();
      const currentIdx = langs.findIndex(l => l.code === getLang());
      const nextLang = langs[(currentIdx + 1) % langs.length];
      setLang(nextLang.code);
      renderApp();
    });
  }
}

// ---------- Navigation ----------
function initNavigation() {
  document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.tab);
    });
  });
}

// ---------- Mobile Menu ----------
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const header = document.getElementById('app-header');
  
  menuBtn?.addEventListener('click', () => {
    header.classList.toggle('mobile-nav-open');
  });

  // Close mobile nav when tab selected
  document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      header?.classList.remove('mobile-nav-open');
    });
  });
}

// ---------- Boot ----------
function boot() {
  initTheme();
  currentPage = getPageFromHash();
  renderApp();
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    currentPage = getPageFromHash();
    renderApp();
  });
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
