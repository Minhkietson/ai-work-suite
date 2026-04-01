// ============================================
// AI Work Suite — Settings Panel
// ============================================

import { icons } from '../utils/icons.js';
import * as storage from '../utils/storage.js';

export function renderSettings() {
  const theme = storage.get('theme', 'light');
  const color = storage.get('color', 'green');
  const bg = storage.get('bg', 'abstract');

  return `
    <div class="settings-overlay" id="settings-overlay"></div>
    <div class="settings-panel" id="settings-panel">
      <h3>
        <span>⚙️ Giao diện</span>
        <button id="close-settings">${icons.x}</button>
      </h3>

      <div class="settings-section">
        <label>Chế độ giao diện</label>
        <div class="theme-toggle">
          <button class="theme-option ${theme === 'light' ? 'active' : ''}" data-theme-val="light">
            ${icons.sun} Sáng
          </button>
          <button class="theme-option ${theme === 'dark' ? 'active' : ''}" data-theme-val="dark">
            ${icons.moon} Tối
          </button>
        </div>
      </div>

      <div class="settings-section">
        <label>Màu chủ đạo</label>
        <div class="color-options">
          <button class="color-circle green ${color === 'green' ? 'active' : ''}" data-color-val="green" title="Xanh lá"></button>
          <button class="color-circle blue ${color === 'blue' ? 'active' : ''}" data-color-val="blue" title="Xanh dương"></button>
          <button class="color-circle red ${color === 'red' ? 'active' : ''}" data-color-val="red" title="Đỏ"></button>
          <button class="color-circle brown ${color === 'brown' ? 'active' : ''}" data-color-val="brown" title="Nâu"></button>
          <button class="color-circle purple ${color === 'purple' ? 'active' : ''}" data-color-val="purple" title="Tím"></button>
        </div>
      </div>

      <div class="settings-section">
        <label>Hình nền</label>
        <div class="bg-options">
          <button class="bg-option ${bg === 'abstract' ? 'active' : ''}" data-bg-val="abstract">🎨 Abstract</button>
          <button class="bg-option ${bg === 'soft-wave' ? 'active' : ''}" data-bg-val="soft-wave">🌊 Soft Wave</button>
          <button class="bg-option ${bg === 'elegant' ? 'active' : ''}" data-bg-val="elegant">✨ Elegant</button>
          <button class="bg-option ${bg === 'modern-tech' ? 'active' : ''}" data-bg-val="modern-tech">🔮 Modern Tech</button>
        </div>
      </div>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center;">
        <p style="font-size: 12px; color: var(--text-tertiary);">
          AI Work Suite v1.0<br>
          Tạo bởi <strong>Trịnh Ngọc Hà</strong>
        </p>
      </div>
    </div>
  `;
}

export function initSettings() {
  const overlay = document.getElementById('settings-overlay');
  const panel = document.getElementById('settings-panel');
  const openBtn = document.getElementById('settings-btn');
  const closeBtn = document.getElementById('close-settings');

  function open() {
    overlay.classList.add('open');
    panel.classList.add('open');
  }

  function close() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Theme toggle
  panel.querySelectorAll('[data-theme-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.themeVal;
      storage.set('theme', val);
      document.documentElement.dataset.theme = val;
      panel.querySelectorAll('[data-theme-val]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Color toggle
  panel.querySelectorAll('[data-color-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.colorVal;
      storage.set('color', val);
      document.documentElement.dataset.color = val;
      panel.querySelectorAll('[data-color-val]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Background toggle
  panel.querySelectorAll('[data-bg-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.bgVal;
      storage.set('bg', val);
      document.documentElement.dataset.bg = val;
      panel.querySelectorAll('[data-bg-val]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
