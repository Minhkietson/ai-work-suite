// ============================================
// AI Work Suite — Header Component
// ============================================

import { icons } from '../utils/icons.js';

export function renderHeader(activeTab) {
  const tabs = [
    { id: 'speech-to-text', label: 'Chuyển Âm thanh', icon: icons.mic },
    { id: 'text-to-speech', label: 'Đọc Văn bản', icon: icons.speaker },
    { id: 'screen-record', label: 'Quay Màn hình', icon: icons.screenRecord },
    { id: 'doc-processor', label: 'Chuyển đổi File', icon: icons.fileConvert },
  ];

  return `
    <header class="header" id="app-header">
      <div class="header-left">
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
          ${icons.menu}
        </button>
        <div class="logo-icon">AI</div>
        <div class="logo-text">
          <span class="brand">AI WORK SUITE</span>
          <span class="sub">Bộ công cụ phục vụ công việc</span>
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
        <button class="action-btn settings-btn" id="settings-btn" title="Cài đặt giao diện">
          ${icons.settings}
        </button>
        <button class="action-btn" id="api-key-btn">
          ${icons.key}
          <span>API KEY MIỄN PHÍ</span>
        </button>
        <button class="lang-btn" id="lang-display-btn">
          ${icons.globe}
          <span>VI</span>
        </button>
      </div>
    </header>
  `;
}
