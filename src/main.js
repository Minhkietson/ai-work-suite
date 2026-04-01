// ============================================
// AI Work Suite — Main Entry Point
// by Trịnh Ngọc Hà
// ============================================

import './style.css';
import * as storage from './utils/storage.js';
import { renderHeader } from './components/header.js';
import { renderSettings, initSettings } from './components/settings.js';
import { renderApiKeyModal, initApiKeyModal } from './components/api-key-modal.js';

// Page modules
import * as SpeechToText from './pages/speech-to-text.js';
import * as TextToSpeech from './pages/text-to-speech.js';
import * as ScreenRecord from './pages/screen-record.js';
import * as DocProcessor from './pages/doc-processor.js';

// ---------- Page Registry ----------
const PAGES = {
  'speech-to-text': SpeechToText,
  'text-to-speech': TextToSpeech,
  'screen-record': ScreenRecord,
  'doc-processor': DocProcessor,
};

let currentPage = 'speech-to-text';

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
  const hash = window.location.hash.replace('#', '') || 'speech-to-text';
  return PAGES[hash] ? hash : 'speech-to-text';
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

  app.innerHTML = `
    <div class="app-bg"></div>
    ${renderHeader(currentPage)}
    <main class="main-content">
      ${page.render()}
    </main>
    <footer class="footer">
      <p>© 2026 AI Work Suite — Tạo bởi <strong>Trịnh Ngọc Hà</strong> | Powered by Google Gemini</p>
    </footer>
    ${renderSettings()}
    ${renderApiKeyModal()}
  `;

  // Init page
  page.init();
  
  // Init global components
  initSettings();
  initApiKeyModal();
  initNavigation();
  initMobileMenu();
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
