// ============================================
// AI Work Suite — Premium System
// ============================================

import * as storage from './storage.js';

const PREMIUM_KEY = 'premium_license';
const PREMIUM_ACTIVATED = 'premium_active';

/**
 * Check if user has premium
 */
export function isPremium() {
  return storage.get(PREMIUM_ACTIVATED, false) === true;
}

/**
 * Activate premium with license key
 */
export function activatePremium(licenseKey) {
  if (!licenseKey || licenseKey.length < 8) return false;
  storage.set(PREMIUM_KEY, licenseKey);
  storage.set(PREMIUM_ACTIVATED, true);
  return true;
}

/**
 * Deactivate premium
 */
export function deactivatePremium() {
  storage.set(PREMIUM_ACTIVATED, false);
  storage.set(PREMIUM_KEY, '');
}

/**
 * Get stored license key
 */
export function getLicenseKey() {
  return storage.get(PREMIUM_KEY, '');
}

/**
 * Feature definitions — what's free vs premium
 */
export const FEATURES = {
  // STT
  stt_transcribe: { premium: false, label: 'Chép lời audio' },
  stt_copy: { premium: false, label: 'Sao chép kết quả' },
  stt_download_txt: { premium: false, label: 'Tải TXT' },
  stt_summary: { premium: true, label: 'AI tóm tắt nội dung' },
  stt_srt_export: { premium: true, label: 'Xuất phụ đề SRT/VTT' },
  stt_timestamps: { premium: true, label: 'Timestamps từng câu' },

  // TTS
  tts_generate: { premium: false, label: 'Tạo giọng nói' },
  tts_play: { premium: false, label: 'Nghe trực tiếp' },
  tts_download_wav: { premium: false, label: 'Tải WAV' },
  tts_download_mp3: { premium: true, label: 'Tải MP3 chất lượng cao' },
  tts_speed_control: { premium: true, label: 'Điều chỉnh tốc độ' },
  tts_batch: { premium: true, label: 'Đọc hàng loạt' },

  // Screen Record
  screen_record: { premium: false, label: 'Ghi hình màn hình' },
  screen_analyze: { premium: false, label: 'AI phân tích cuộc họp' },
  screen_download_webm: { premium: false, label: 'Tải WebM' },
  screen_download_minutes: { premium: false, label: 'Tải biên bản TXT' },
  screen_webcam: { premium: true, label: 'Webcam overlay' },
  screen_chapters: { premium: true, label: 'Auto chapters' },

  // Doc Processor
  doc_analyze: { premium: false, label: 'Phân tích tài liệu' },
  doc_copy: { premium: false, label: 'Sao chép kết quả' },
  doc_download_txt: { premium: false, label: 'Tải TXT/CSV' },
  doc_download_docx: { premium: true, label: 'Xuất Word (DOCX)' },
  doc_download_xlsx: { premium: true, label: 'Xuất Excel (XLSX)' },
  doc_batch: { premium: true, label: 'Xử lý hàng loạt' },
};

/**
 * Check if a specific feature is available
 */
export function canUse(featureId) {
  const feature = FEATURES[featureId];
  if (!feature) return true;
  if (!feature.premium) return true;
  return isPremium();
}

/**
 * Render a premium badge
 */
export function premiumBadge() {
  return `<span class="premium-badge">⭐ PREMIUM</span>`;
}

/**
 * Render a premium lock overlay for a button
 * Returns the original content if user has premium, or locked version if not
 */
export function premiumButton(featureId, html, extraClass = '') {
  const feature = FEATURES[featureId];
  if (!feature || !feature.premium || isPremium()) {
    return html;
  }
  // Wrap button with premium lock indicator
  return html.replace('class="btn-secondary', `class="btn-secondary btn-premium-locked ${extraClass}`)
             .replace('class="btn-primary', `class="btn-primary btn-premium-locked ${extraClass}`)
             + `<span class="premium-lock-tag">⭐ Premium</span>`;
}

/**
 * Show premium upgrade prompt
 */
export function showUpgradePrompt() {
  const existing = document.getElementById('premium-upgrade-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'premium-upgrade-modal';
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal premium-modal">
      <div class="premium-modal-icon">⭐</div>
      <h3>Nâng cấp Premium</h3>
      <p class="modal-desc">
        Mở khóa tất cả tính năng nâng cao: export DOCX/XLSX/MP3, phụ đề SRT, 
        AI tóm tắt, xử lý hàng loạt, và nhiều hơn nữa.
      </p>
      
      <div class="premium-price-display">
        <span class="premium-price-tag">$9.99</span>
        <span class="premium-price-note">Mua 1 lần — Dùng mãi mãi</span>
      </div>

      <div class="premium-features-list">
        <div class="premium-feature-item">✅ Export Word, Excel, PowerPoint</div>
        <div class="premium-feature-item">✅ Export MP3 chất lượng cao</div>
        <div class="premium-feature-item">✅ Phụ đề SRT / VTT</div>
        <div class="premium-feature-item">✅ AI tóm tắt nội dung</div>
        <div class="premium-feature-item">✅ Xử lý hàng loạt (batch)</div>
        <div class="premium-feature-item">✅ Bỏ watermark</div>
      </div>

      <div class="modal-actions" style="flex-direction: column; gap: 10px;">
        <button class="btn-primary" id="premium-buy-btn" style="max-width: 100%; margin: 0;">
          ⭐ Mua Premium — $9.99
        </button>
        <button class="btn-secondary" id="premium-activate-btn" style="width: 100%; justify-content: center;">
          🔑 Đã có License Key
        </button>
        <button class="btn-secondary" id="premium-close-btn" style="width: 100%; justify-content: center;">
          Để sau
        </button>
      </div>

      <div id="premium-key-input-area" style="display: none; margin-top: 16px;">
        <input type="text" id="premium-key-input" placeholder="Nhập License Key..." />
        <button class="btn-primary" id="premium-key-submit" style="max-width: 100%; margin: 8px 0 0;">
          Kích hoạt
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close
  document.getElementById('premium-close-btn').addEventListener('click', () => {
    overlay.remove();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Buy — will redirect to LemonSqueezy (placeholder for now)
  document.getElementById('premium-buy-btn').addEventListener('click', () => {
    // TODO: Replace with actual LemonSqueezy checkout URL
    window.open('https://lemonsqueezy.com', '_blank');
  });

  // Show key input
  document.getElementById('premium-activate-btn').addEventListener('click', () => {
    document.getElementById('premium-key-input-area').style.display = 'block';
    document.getElementById('premium-key-input').focus();
  });

  // Submit key
  document.getElementById('premium-key-submit').addEventListener('click', () => {
    const key = document.getElementById('premium-key-input').value.trim();
    if (activatePremium(key)) {
      overlay.remove();
      // Reload to reflect premium state
      window.location.reload();
    } else {
      document.getElementById('premium-key-input').style.borderColor = '#ef4444';
    }
  });
}

/**
 * Guard a premium action — if not premium, show prompt and return false
 */
export function requirePremium(featureId) {
  if (canUse(featureId)) return true;
  showUpgradePrompt();
  return false;
}
