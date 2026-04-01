// ============================================
// AI Work Suite — API Key Modal
// ============================================

import { icons } from '../utils/icons.js';
import { getApiKey, setApiKey } from '../api/gemini.js';
import { showToast } from '../utils/toast.js';

export function renderApiKeyModal() {
  return `
    <div class="modal-overlay" id="api-key-overlay">
      <div class="modal">
        <h3>${icons.key} Thiết lập API Key</h3>
        <p class="modal-desc">
          Nhập Google Gemini API Key của bạn để sử dụng các tính năng AI. 
          Key được lưu an toàn trong trình duyệt.
        </p>
        <input 
          type="password" 
          id="api-key-input" 
          placeholder="AIza..."
          value="${getApiKey()}"
          autocomplete="off"
        />
        <div class="modal-actions">
          <button class="btn-secondary" id="api-key-cancel">Hủy</button>
          <button class="btn-primary" style="width: auto; margin: 0; padding: 10px 24px;" id="api-key-save">
            ${icons.check} Lưu
          </button>
        </div>
        <div class="modal-note">
          💡 Lấy API Key miễn phí tại 
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style="color: var(--primary-600); text-decoration: underline;">
            Google AI Studio
          </a>. 
          Key chỉ được lưu trên trình duyệt của bạn.
        </div>
      </div>
    </div>
  `;
}

export function initApiKeyModal() {
  const overlay = document.getElementById('api-key-overlay');
  const openBtn = document.getElementById('api-key-btn');
  const cancelBtn = document.getElementById('api-key-cancel');
  const saveBtn = document.getElementById('api-key-save');
  const input = document.getElementById('api-key-input');

  function open() {
    input.value = getApiKey();
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 300);
  }

  function close() {
    overlay.classList.remove('open');
  }

  openBtn?.addEventListener('click', open);
  cancelBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  saveBtn?.addEventListener('click', () => {
    const key = input.value.trim();
    setApiKey(key);
    close();
    if (key) {
      showToast('API Key đã được lưu thành công!', 'success');
    } else {
      showToast('API Key đã được xóa.', 'info');
    }
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') close();
  });
}
