// ============================================
// AI Work Suite — Speech to Text Page
// ============================================

import { icons } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';
import { transcribeAudio, getApiKey } from '../api/gemini.js';
import { requirePremium, isPremium, premiumBadge } from '../utils/premium.js';
import { exportToSrt } from '../utils/export.js';

let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let selectedFile = null;

export function render() {
  return `
    <div class="page-enter">
      <div class="page-header">
        <div class="page-badge">${icons.sparkles} Professional AI Work Suite</div>
        <h1>Trợ lý Chuyển đổi Âm thanh AI</h1>
        <p>Chuyển đổi các cuộc họp, ghi âm thành văn bản tức thì với độ chính xác vượt trội từ Gemini Pro.</p>
      </div>

      <div class="content-grid cols-3">
        <!-- Upload File -->
        <div class="card" id="upload-card">
          <div class="card-label">${icons.upload} Tải lên File</div>
          <div class="drop-zone" id="drop-zone">
            ${icons.upload}
            <p>Nhấn hoặc kéo thả tài liệu<br>vào đây</p>
            <input type="file" id="audio-file-input" accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac" />
            <div class="file-info" id="file-info"></div>
          </div>
        </div>

        <!-- Live Recording -->
        <div class="card">
          <div class="card-label">${icons.mic} Ghi âm trực tiếp</div>
          <div class="record-area">
            <button class="record-btn" id="record-btn">
              ${icons.mic}
            </button>
            <span class="record-label" id="record-label">TAP TO RECORD</span>
            <span class="recording-timer" id="recording-timer" style="display: none;">00:00</span>
          </div>
        </div>

        <!-- Result -->
        <div class="card">
          <div class="card-label">${icons.sparkles} Kết quả AI Transcription</div>
          <div class="result-area" id="result-area">
            <p class="placeholder">Văn bản chép lời sẽ hiển thị tại đây sau khi phân tích...</p>
          </div>
          <div class="audio-actions" id="result-actions" style="display: none; margin-top: 16px;">
            <button class="btn-secondary" id="copy-result">${icons.copy} Sao chép</button>
            <button class="btn-secondary" id="download-result">${icons.download} Tải TXT</button>
            <button class="btn-secondary ${isPremium() ? '' : 'btn-premium-locked'}" id="summary-result">${icons.sparkles} AI Tóm tắt ${isPremium() ? '' : premiumBadge()}</button>
            <button class="btn-secondary ${isPremium() ? '' : 'btn-premium-locked'}" id="download-srt">${icons.download} Xuất SRT ${isPremium() ? '' : premiumBadge()}</button>
          </div>
        </div>
      </div>

      <button class="btn-primary" id="process-btn">
        ${icons.processing} Bắt đầu xử lý
      </button>
    </div>
  `;
}

export function init() {
  const fileInput = document.getElementById('audio-file-input');
  const dropZone = document.getElementById('drop-zone');
  const recordBtn = document.getElementById('record-btn');
  const processBtn = document.getElementById('process-btn');

  // File upload
  fileInput?.addEventListener('change', handleFileSelect);
  
  // Drag & drop
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect({ target: fileInput });
    }
  });

  // Recording
  recordBtn?.addEventListener('click', toggleRecording);

  // Process
  processBtn?.addEventListener('click', processAudio);

  // Copy result
  document.getElementById('copy-result')?.addEventListener('click', () => {
    const text = document.getElementById('result-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      showToast('Đã sao chép vào clipboard!', 'success');
    }
  });

  // Download result
  document.getElementById('download-result')?.addEventListener('click', () => {
    const text = document.getElementById('result-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, 'transcript.txt');
      showToast('Đã tải file!', 'success');
    }
  });

  // Premium: AI Summary
  document.getElementById('summary-result')?.addEventListener('click', () => {
    if (!requirePremium('stt_summary')) return;
    const text = document.getElementById('result-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      showToast('Tính năng AI Tóm tắt sẽ sớm khả dụng!', 'info');
    }
  });

  // Premium: SRT Export
  document.getElementById('download-srt')?.addEventListener('click', () => {
    if (!requirePremium('stt_srt_export')) return;
    const text = document.getElementById('result-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      exportToSrt(text, 'transcript.srt');
      showToast('Đã xuất phụ đề SRT!', 'success');
    }
  });
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  
  selectedFile = file;
  const dropZone = document.getElementById('drop-zone');
  const fileInfo = document.getElementById('file-info');
  
  dropZone.classList.add('has-file');
  fileInfo.textContent = `📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
  showToast(`Đã chọn: ${file.name}`, 'success');
}

async function toggleRecording() {
  const recordBtn = document.getElementById('record-btn');
  const label = document.getElementById('record-label');
  const timer = document.getElementById('recording-timer');

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    // Stop
    mediaRecorder.stop();
    recordBtn.classList.remove('recording');
    label.textContent = 'TAP TO RECORD';
    timer.style.display = 'none';
    clearInterval(recordingTimer);
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      selectedFile = new Blob(audioChunks, { type: 'audio/webm' });
      selectedFile.name = 'recording.webm';
      
      const dropZone = document.getElementById('drop-zone');
      const fileInfo = document.getElementById('file-info');
      dropZone.classList.add('has-file');
      fileInfo.textContent = `🎙️ Ghi âm (${recordingSeconds}s)`;
      showToast('Ghi âm hoàn tất!', 'success');
    };

    mediaRecorder.start(1000);
    recordBtn.classList.add('recording');
    label.textContent = 'ĐANG GHI...';
    timer.style.display = 'block';
    recordingSeconds = 0;
    
    recordingTimer = setInterval(() => {
      recordingSeconds++;
      const m = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
      const s = String(recordingSeconds % 60).padStart(2, '0');
      timer.textContent = `${m}:${s}`;
    }, 1000);

  } catch (err) {
    showToast('Không thể truy cập microphone: ' + err.message, 'error');
  }
}

async function processAudio() {
  if (!getApiKey()) {
    showToast('Vui lòng thiết lập API Key trước!', 'error');
    document.getElementById('api-key-btn')?.click();
    return;
  }

  if (!selectedFile) {
    showToast('Vui lòng tải lên file hoặc ghi âm trước!', 'error');
    return;
  }

  const processBtn = document.getElementById('process-btn');
  const resultArea = document.getElementById('result-area');
  const resultActions = document.getElementById('result-actions');

  processBtn.classList.add('loading');
  processBtn.innerHTML = `<span class="spinner"></span> Đang phân tích...`;
  processBtn.disabled = true;
  resultArea.innerHTML = '<p class="placeholder">⏳ AI đang phân tích âm thanh, vui lòng chờ...</p>';

  try {
    const mimeType = selectedFile.type || 'audio/webm';
    const blob = selectedFile instanceof Blob ? selectedFile : selectedFile;
    const transcript = await transcribeAudio(blob, mimeType);
    
    resultArea.innerHTML = `<div class="transcript">${transcript}</div>`;
    resultActions.style.display = 'flex';
    showToast('Chuyển đổi thành công!', 'success');
  } catch (err) {
    resultArea.innerHTML = `<p class="placeholder" style="color: var(--error);">❌ ${err.message}</p>`;
    showToast(err.message, 'error');
  } finally {
    processBtn.classList.remove('loading');
    processBtn.innerHTML = `${icons.processing} Bắt đầu xử lý`;
    processBtn.disabled = false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
