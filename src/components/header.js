// ============================================
// AI Work Suite — Header Component
// ============================================

import { icons } from '../utils/icons.js';
import { isPremium } from '../utils/premium.js';
import { t, getLang, getSupportedLangs } from '../utils/i18n.js';

export function renderHeader(activeTab) {
  const tabs = [
    { id: 'speech-to-text', label: t('nav.stt'), icon: icons.mic },
    { id: 'text-to-speech', label: t('nav.tts'), icon: icons.speaker },
    { id: 'screen-record', label: t('nav.record'), icon: icons.screenRecord },
    { id: 'doc-processor', label: t('nav.doc'), icon: icons.fileConvert },
  ];

  const currentLang = getLang();
  const langShort = getSupportedLangs().find(l => l.code === currentLang)?.short || 'VI';

  return `
    <header class="header" id="app-header">
      <div class="header-left">
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
          ${icons.menu}
        </button>
        <div class="logo-icon">AI</div>
        <div class="logo-text">
          <span class="brand">${t('app.title').toUpperCase()}</span>
          <span class="sub">${t('app.subtitle')}</span>
        </div>
      </div>

      <nav class="header-nav" id="header-nav">
        ${tabs.map(tab => `
          <button 
            class="nav-btn ${activeTab === tab.id ? 'active' : ''}" 
            data-tab="${tab.id}"
            id="nav-${tab.id}"
          >
            ${tab.icon}
            <span>${tab.label}</span>
          </button>
        `).join('')}
      </nav>

      <div class="header-actions">
        <button class="action-btn settings-btn" id="settings-btn" title="${t('nav.settings')}">
          ${icons.settings}
        </button>
        <button class="action-btn" id="api-key-btn">
          ${icons.key}
          <span>${t('nav.apiKey')}</span>
        </button>
        ${isPremium() 
          ? '<span class="header-premium-badge">⭐ Premium</span>' 
          : `<button class="action-btn" id="upgrade-btn" title="${t('premium.upgrade')}">⭐</button>`
        }
        <button class="lang-btn" id="lang-display-btn">
          ${icons.globe}
          <span>${langShort}</span>
        </button>
      </div>
    </header>
  `;
}
