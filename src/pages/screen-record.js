// ============================================
// AI Work Suite — Screen Recording Page
// ============================================

import { icons } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';
import { generateMeetingMinutes, getApiKey } from '../api/gemini.js';

let mediaRecorder = null;
let recordedChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let recordedVideoUrl = null;
let recordedAudioBlob = null;

export function render() {
  return `
    <div class="page-enter">
      <div class="page-header">
        <div class="page-badge">${icons.sparkles} Professional AI Work Suite</div>
        <h1>Ghi hình Cuộc họp thông minh</h1>
        <p>Ghi lại màn hình và tự động trích xuất nội dung thảo luận thành biên bản họp chi tiết.</p>
      </div>

      <div class="content-grid cols-1-2">
        <!-- Controls -->
        <div class="card">
          <div class="card-label">${icons.screenRecord} Bảng điều khiển ghi hình</div>
          
          <div class="tip-box">
            💡 Mẹo: Chọn 'Chia sẻ âm thanh' để AI có thể nghe và chép lời nội dung họp.
          </div>

          <div class="record-area" style="margin-top: 24px;">
            <button class="btn-primary" id="screen-record-btn" style="margin: 0;">
              ${icons.screenRecord} Bắt đầu xử lý
            </button>
            <span class="recording-timer" id="screen-timer" style="display: none;">00:00</span>
          </div>

          <p class="tip-note">
            Mẹo: Ghi hình tối đa 60 phút để AI phân tích tốt nhất. 
            Việc ghi hình không tốn API, chỉ khi 'Phân tích cuộc họp' mới tính phí.
          </p>

          <div id="meeting-actions" style="display: none; margin-top: 20px;">
            <button class="btn-primary" id="analyze-meeting-btn" style="margin: 0; background: var(--primary-600);">
              ${icons.sparkles} Phân tích cuộc họp
            </button>
          </div>
        </div>

        <!-- Preview + Result -->
        <div class="card">
          <div class="card-label">${icons.play} Xem trước & Kết quả</div>
          
          <div class="video-preview" id="video-preview">
            <div class="preview-placeholder" id="preview-placeholder">
              ${icons.screenRecord}
              <p>Video sẽ hiển thị tại đây</p>
            </div>
            <video id="preview-video" style="display: none;" controls></video>
          </div>

          <div id="minutes-result" style="display: none; margin-top: 20px;">
            <div class="card-label">${icons.fileText} Biên bản cuộc họp</div>
            <div class="result-area" id="minutes-area"></div>
            <div class="audio-actions" style="margin-top: 12px;">
              <button class="btn-secondary" id="copy-minutes">${icons.copy} Sao chép</button>
              <button class="btn-secondary" id="download-minutes">${icons.download} Tải TXT</button>
              <button class="btn-secondary" id="download-video">${icons.download} Tải Video</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  document.getElementById('screen-record-btn')?.addEventListener('click', toggleScreenRecording);
  document.getElementById('analyze-meeting-btn')?.addEventListener('click', analyzeMeeting);

  document.getElementById('copy-minutes')?.addEventListener('click', () => {
    const text = document.getElementById('minutes-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      showToast('Đã sao chép biên bản!', 'success');
    }
  });

  document.getElementById('download-minutes')?.addEventListener('click', () => {
    const text = document.getElementById('minutes-area')?.querySelector('.transcript')?.textContent;
    if (text) {
      downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'bien-ban-hop.txt');
    }
  });

  document.getElementById('download-video')?.addEventListener('click', () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = 'screen-recording.webm';
      a.click();
      showToast('Đã tải video!', 'success');
    }
  });
}

async function toggleScreenRecording() {
  const btn = document.getElementById('screen-record-btn');
  const timer = document.getElementById('screen-timer');

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    // Stop
    mediaRecorder.stop();
    btn.innerHTML = `${icons.screenRecord} Bắt đầu xử lý`;
    btn.style.background = '';
    timer.style.display = 'none';
    clearInterval(recordingTimer);
    return;
  }

  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: true
    });

    // Also try to get microphone audio
    let audioStream;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      // Microphone not available, use display audio only
    }

    // Combine streams
    const tracks = [...displayStream.getTracks()];
    if (audioStream) {
      tracks.push(...audioStream.getAudioTracks());
    }

    const combinedStream = new MediaStream(tracks);
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9,opus' });
    recordedChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      combinedStream.getTracks().forEach(t => t.stop());
      
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedVideoUrl = URL.createObjectURL(videoBlob);
      recordedAudioBlob = videoBlob; // webm contains audio

      const video = document.getElementById('preview-video');
      const placeholder = document.getElementById('preview-placeholder');
      video.src = recordedVideoUrl;
      video.style.display = 'block';
      placeholder.style.display = 'none';

      document.getElementById('meeting-actions').style.display = 'block';
      showToast('Ghi hình hoàn tất!', 'success');
    };

    // When user stops sharing
    displayStream.getVideoTracks()[0].onended = () => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        btn.innerHTML = `${icons.screenRecord} Bắt đầu xử lý`;
        btn.style.background = '';
        timer.style.display = 'none';
        clearInterval(recordingTimer);
      }
    };

    mediaRecorder.start(1000);
    btn.innerHTML = `${icons.stop} Dừng ghi hình`;
    btn.style.background = '#ef4444';
    timer.style.display = 'block';
    recordingSeconds = 0;

    recordingTimer = setInterval(() => {
      recordingSeconds++;
      const m = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
      const s = String(recordingSeconds % 60).padStart(2, '0');
      timer.textContent = `${m}:${s}`;
    }, 1000);

  } catch (err) {
    if (err.name !== 'NotAllowedError') {
      showToast('Lỗi ghi hình: ' + err.message, 'error');
    }
  }
}

async function analyzeMeeting() {
  if (!getApiKey()) {
    showToast('Vui lòng thiết lập API Key trước!', 'error');
    document.getElementById('api-key-btn')?.click();
    return;
  }

  if (!recordedAudioBlob) {
    showToast('Chưa có bản ghi để phân tích!', 'error');
    return;
  }

  const btn = document.getElementById('analyze-meeting-btn');
  const resultSection = document.getElementById('minutes-result');
  const minutesArea = document.getElementById('minutes-area');

  btn.classList.add('loading');
  btn.innerHTML = `<span class="spinner"></span> Đang phân tích cuộc họp...`;
  btn.disabled = true;
  resultSection.style.display = 'block';
  minutesArea.innerHTML = '<p class="placeholder">⏳ AI đang phân tích nội dung cuộc họp...</p>';

  try {
    const minutes = await generateMeetingMinutes(recordedAudioBlob, 'video/webm');
    minutesArea.innerHTML = `<div class="transcript">${minutes.replace(/\n/g, '<br>')}</div>`;
    showToast('Phân tích cuộc họp thành công!', 'success');
  } catch (err) {
    minutesArea.innerHTML = `<p class="placeholder" style="color: var(--error);">❌ ${err.message}</p>`;
    showToast(err.message, 'error');
  } finally {
    btn.classList.remove('loading');
    btn.innerHTML = `${icons.sparkles} Phân tích cuộc họp`;
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
