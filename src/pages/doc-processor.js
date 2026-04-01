// ============================================
// AI Work Suite — Document Processor Page
// ============================================

import { icons } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';
import { analyzeDocument, getApiKey } from '../api/gemini.js';

let selectedFile = null;
let currentFormat = 'word';

const FORMATS = [
  { id: 'word', name: 'Microsoft Word', desc: 'PRESERVE TABLES & LAYOUT', icon: icons.fileText },
  { id: 'excel', name: 'Microsoft Excel', desc: 'EXTRACT DATA GRID', icon: icons.table },
  { id: 'pptx', name: 'PowerPoint Outline', desc: 'PRESENTATION STRUCTURE', icon: icons.presentation },
];

export function render() {
  return `
    <div class="page-enter">
      <div class="page-header">
        <div class="page-badge">${icons.sparkles} Professional AI Work Suite</div>
        <h1>Bộ xử lý Tài liệu Đa năng</h1>
        <p>Trích xuất và chuyển đổi PDF, hình ảnh sang Word/Excel giữ nguyên cấu trúc bảng biểu.</p>
      </div>

      <div class="content-grid cols-2">
        <!-- Upload -->
        <div class="card">
          <div class="card-label">${icons.upload} 1. Tải lên tài liệu</div>
          <div class="drop-zone" id="doc-drop-zone">
            ${icons.upload}
            <p>Nhấn hoặc kéo thả tài liệu<br>vào đây</p>
            <input type="file" id="doc-file-input" accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff" />
            <div class="file-info" id="doc-file-info"></div>
          </div>
          <p class="tip-note" style="margin-top: 12px;">Hỗ trợ: PDF, PNG, JPG, JPEG, WebP, GIF, BMP, TIFF</p>
        </div>

        <!-- Format Selection -->
        <div class="card">
          <div class="card-label">${icons.fileConvert} 2. Chọn định dạng</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${FORMATS.map(f => `
              <div class="format-card ${f.id === currentFormat ? 'active' : ''}" data-format="${f.id}">
                <div class="format-icon">${f.icon}</div>
                <div class="format-info">
                  <h4>${f.name}</h4>
                  <p>${f.desc}</p>
                </div>
                <svg class="format-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <button class="btn-primary" id="doc-process-btn">
        ${icons.processing} Bắt đầu chuyển đổi
      </button>

      <!-- Result -->
      <div class="card" id="doc-result-card" style="display: none; margin-top: 32px;">
        <div class="card-label">${icons.sparkles} Kết quả chuyển đổi</div>
        <div class="result-area" id="doc-result-area"></div>
        <div class="audio-actions" style="margin-top: 16px;">
          <button class="btn-secondary" id="doc-copy-result">${icons.copy} Sao chép</button>
          <button class="btn-secondary" id="doc-download-result">${icons.download} Tải xuống</button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const fileInput = document.getElementById('doc-file-input');
  const dropZone = document.getElementById('doc-drop-zone');

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

  // Format selection
  document.querySelectorAll('.format-card').forEach(card => {
    card.addEventListener('click', () => {
      currentFormat = card.dataset.format;
      document.querySelectorAll('.format-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Process
  document.getElementById('doc-process-btn')?.addEventListener('click', processDocument);

  // Copy
  document.getElementById('doc-copy-result')?.addEventListener('click', () => {
    const text = document.getElementById('doc-result-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      showToast('Đã sao chép!', 'success');
    }
  });

  // Download
  document.getElementById('doc-download-result')?.addEventListener('click', () => {
    const text = document.getElementById('doc-result-area')?.querySelector('.transcript')?.textContent;
    if (!text) return;
    
    const ext = { word: 'txt', excel: 'csv', pptx: 'txt' };
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `converted.${ext[currentFormat] || 'txt'}`);
    showToast('Đã tải file!', 'success');
  });
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  
  selectedFile = file;
  const dropZone = document.getElementById('doc-drop-zone');
  const fileInfo = document.getElementById('doc-file-info');
  
  dropZone.classList.add('has-file');
  const icon = file.type.includes('pdf') ? '📄' : '🖼️';
  fileInfo.textContent = `${icon} ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
  showToast(`Đã chọn: ${file.name}`, 'success');
}

async function processDocument() {
  if (!getApiKey()) {
    showToast('Vui lòng thiết lập API Key trước!', 'error');
    document.getElementById('api-key-btn')?.click();
    return;
  }

  if (!selectedFile) {
    showToast('Vui lòng tải lên tài liệu trước!', 'error');
    return;
  }

  const btn = document.getElementById('doc-process-btn');
  const resultCard = document.getElementById('doc-result-card');
  const resultArea = document.getElementById('doc-result-area');

  btn.classList.add('loading');
  btn.innerHTML = `<span class="spinner"></span> Đang xử lý tài liệu...`;
  btn.disabled = true;
  resultCard.style.display = 'block';
  resultArea.innerHTML = '<p class="placeholder">⏳ AI đang phân tích tài liệu...</p>';

  try {
    const mimeType = selectedFile.type || 'application/pdf';
    const result = await analyzeDocument(selectedFile, mimeType, currentFormat);
    
    resultArea.innerHTML = `<div class="transcript">${result.replace(/\n/g, '<br>')}</div>`;
    showToast('Chuyển đổi thành công!', 'success');
  } catch (err) {
    resultArea.innerHTML = `<p class="placeholder" style="color: var(--error);">❌ ${err.message}</p>`;
    showToast(err.message, 'error');
  } finally {
    btn.classList.remove('loading');
    btn.innerHTML = `${icons.processing} Bắt đầu chuyển đổi`;
    btn.disabled = false;
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
