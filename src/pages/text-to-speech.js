// ============================================
// AI Work Suite — Text to Speech Page
// ============================================

import { icons } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';
import { textToSpeech, getApiKey } from '../api/gemini.js';

let currentVoice = 'Puck';
let currentLang = 'vi';
let generatedAudioUrl = null;

const VOICES = [
  { id: 'Puck', name: 'Puck', desc: 'Giọng nam trầm ấm, phát âm cực chuẩn.', gender: 'male', genderLabel: 'NAM' },
  { id: 'Charon', name: 'Charon', desc: 'Giọng nam đầy uy tín. Rất tốt cho tin tức.', gender: 'male', genderLabel: 'NAM' },
  { id: 'Zephyr', name: 'Zephyr', desc: 'Giọng nữ quốc tế, phát âm tiếng Anh tự nhiên.', gender: 'female', genderLabel: 'NỮ' },
  { id: 'Kore', name: 'Kore', desc: 'Giọng nữ trong trẻo, thân thiện.', gender: 'female', genderLabel: 'NỮ' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Giọng nam mạnh mẽ, phong cách thuyết trình.', gender: 'male', genderLabel: 'NAM' },
];

const LANGS = [
  { id: 'vi', label: '🇻🇳 Tiếng Việt', flag: 'VN' },
  { id: 'en', label: '🇺🇸 English', flag: 'US' },
  { id: 'id', label: '🇮🇩 Bahasa Indo', flag: 'ID' },
];

export function render() {
  return `
    <div class="page-enter">
      <div class="page-header">
        <div class="page-badge">${icons.sparkles} Professional AI Work Suite</div>
        <h1>Trình tạo Giọng nói AI Tự nhiên</h1>
        <p>Tạo giọng đọc chuyên nghiệp, truyền cảm từ văn bản phục vụ báo cáo, thuyết trình và sáng tạo nội dung.</p>
      </div>

      <div class="content-grid cols-2-1">
        <!-- Text Input -->
        <div class="card">
          <div class="card-label" style="justify-content: space-between; flex-wrap: wrap;">
            <span style="display: flex; align-items: center; gap: 10px;">${icons.quote} Nội dung văn bản</span>
            <div class="lang-tabs">
              ${LANGS.map(l => `
                <button class="lang-tab ${l.id === currentLang ? 'active' : ''}" data-lang="${l.id}">
                  <span>${l.flag}</span> ${l.label.split(' ').slice(1).join(' ')}
                </button>
              `).join('')}
            </div>
          </div>
          <textarea 
            class="text-input" 
            id="tts-text-input" 
            placeholder="Nhập nội dung cần chuyển đổi thành giọng nói tại đây..."
          ></textarea>

          <div class="audio-player" id="audio-player" style="display: none;">
            <audio controls id="tts-audio"></audio>
            <div class="audio-actions">
              <button class="btn-secondary" id="download-audio">${icons.download} Tải MP3</button>
            </div>
          </div>
        </div>

        <!-- Voice Selection -->
        <div class="card">
          <div class="card-label">${icons.headphones} Tùy chọn giọng AI</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${VOICES.map(v => `
              <div class="voice-card ${v.id === currentVoice ? 'active' : ''}" data-voice="${v.id}">
                <div class="voice-info">
                  <h4>${v.name} <span class="check">${icons.check}</span></h4>
                  <p>${v.desc}</p>
                </div>
                <span class="gender-badge ${v.gender}">${v.genderLabel}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <button class="btn-primary" id="tts-process-btn">
        ${icons.speaker} Tạo giọng nói AI
      </button>
    </div>
  `;
}

export function init() {
  // Voice selection
  document.querySelectorAll('.voice-card').forEach(card => {
    card.addEventListener('click', () => {
      currentVoice = card.dataset.voice;
      document.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Language selection
  document.querySelectorAll('.lang-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentLang = tab.dataset.lang;
      document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Process
  document.getElementById('tts-process-btn')?.addEventListener('click', generateSpeech);

  // Download
  document.getElementById('download-audio')?.addEventListener('click', () => {
    if (generatedAudioUrl) {
      const a = document.createElement('a');
      a.href = generatedAudioUrl;
      a.download = 'ai-speech.wav';
      a.click();
      showToast('Đã tải file audio!', 'success');
    }
  });
}

async function generateSpeech() {
  const text = document.getElementById('tts-text-input')?.value?.trim();
  if (!text) {
    showToast('Vui lòng nhập văn bản cần đọc!', 'error');
    return;
  }

  if (!getApiKey()) {
    showToast('Vui lòng thiết lập API Key trước!', 'error');
    document.getElementById('api-key-btn')?.click();
    return;
  }

  const btn = document.getElementById('tts-process-btn');
  btn.classList.add('loading');
  btn.innerHTML = `<span class="spinner"></span> Đang tạo giọng nói...`;
  btn.disabled = true;

  try {
    const audioBlob = await textToSpeech(text, currentVoice, currentLang);
    
    if (generatedAudioUrl) URL.revokeObjectURL(generatedAudioUrl);
    generatedAudioUrl = URL.createObjectURL(audioBlob);
    
    const audioEl = document.getElementById('tts-audio');
    const playerEl = document.getElementById('audio-player');
    
    audioEl.src = generatedAudioUrl;
    playerEl.style.display = 'flex';
    audioEl.play();
    
    showToast('Tạo giọng nói thành công!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.classList.remove('loading');
    btn.innerHTML = `${icons.speaker} Tạo giọng nói AI`;
    btn.disabled = false;
  }
}
