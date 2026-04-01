// ============================================
// AI Work Suite — Gemini API Wrapper
// ============================================

import * as storage from '../utils/storage.js';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.5-pro-preview-05-06';

export function getApiKey() {
  return storage.get('api_key', '');
}

export function setApiKey(key) {
  storage.set('api_key', key);
}

function ensureKey() {
  const key = getApiKey();
  if (!key) throw new Error('Vui lòng thiết lập API Key trước khi sử dụng.');
  return key;
}

/**
 * Transcribe audio file using Gemini
 */
export async function transcribeAudio(audioBlob, mimeType = 'audio/webm') {
  const key = ensureKey();
  
  // Convert blob to base64
  const base64 = await blobToBase64(audioBlob);
  
  const response = await fetch(`${API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          },
          {
            text: `Hãy chép lời (transcribe) nội dung âm thanh này một cách chính xác nhất có thể. 
Quy tắc:
- Giữ nguyên ngôn ngữ gốc của audio
- Phân đoạn theo câu và ý nghĩa
- Thêm dấu chấm câu phù hợp
- Nếu có nhiều người nói, ghi rõ [Người nói 1], [Người nói 2]...
- Chỉ trả về nội dung chép lời, không thêm giải thích

Bắt đầu chép lời:`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192
      }
    })
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể nhận diện nội dung âm thanh.';
}

/**
 * Generate speech from text using Gemini TTS
 */
export async function textToSpeech(text, voiceName = 'Puck', lang = 'vi') {
  const key = ensureKey();
  
  const langInstruction = {
    vi: 'Đọc bằng tiếng Việt với giọng tự nhiên, rõ ràng.',
    en: 'Read in English with natural intonation.',
    id: 'Baca dalam bahasa Indonesia dengan intonasi alami.'
  };

  const response = await fetch(`${API_BASE}/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${langInstruction[lang] || langInstruction.vi}\n\n${text}`
        }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `TTS Error: ${response.status}`);
  }

  const data = await response.json();
  const audioPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  
  if (!audioPart) throw new Error('Không nhận được audio từ API.');
  
  // Convert base64 to blob
  const audioBytes = atob(audioPart.inlineData.data);
  const audioArray = new Uint8Array(audioBytes.length);
  for (let i = 0; i < audioBytes.length; i++) {
    audioArray[i] = audioBytes.charCodeAt(i);
  }
  
  return new Blob([audioArray], { type: audioPart.inlineData.mimeType || 'audio/wav' });
}

/**
 * Analyze document (PDF/Image) using Gemini Vision
 */
export async function analyzeDocument(fileBlob, mimeType, outputFormat = 'word') {
  const key = ensureKey();
  const base64 = await blobToBase64(fileBlob);
  
  const formatInstructions = {
    word: `Trích xuất toàn bộ nội dung từ tài liệu này và định dạng lại thành văn bản có cấu trúc.
Quy tắc:
- Giữ nguyên toàn bộ bảng (dùng markdown table)
- Giữ nguyên tiêu đề, danh sách, bullet points
- Giữ nguyên thứ tự và phân cấp nội dung  
- Ghi chú vị trí hình ảnh nếu có [Hình ảnh: mô tả]`,
    
    excel: `Trích xuất tất cả dữ liệu dạng bảng từ tài liệu này.
Quy tắc:  
- Mỗi bảng trả về dưới dạng CSV (delimiter là tab)
- Giữ nguyên header và tên cột
- Giữ nguyên số liệu chính xác
- Nếu có nhiều bảng, phân cách bằng dòng trống + tên bảng`,
    
    pptx: `Trích xuất nội dung từ tài liệu này dưới dạng outline cho slide trình bày.
Quy tắc:
- Mỗi phần chính = 1 slide
- Slide title: ## Tiêu đề
- Bullet points cho nội dung
- Ghi chú hình ảnh phù hợp cho mỗi slide`
  };

  const response = await fetch(`${API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          },
          {
            text: formatInstructions[outputFormat] || formatInstructions.word
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Vision Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể phân tích tài liệu.';
}

/**
 * Generate meeting minutes from audio
 */
export async function generateMeetingMinutes(audioBlob, mimeType = 'audio/webm') {
  const key = ensureKey();
  const base64 = await blobToBase64(audioBlob);

  const response = await fetch(`${API_BASE}/models/${DEFAULT_MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          },
          {
            text: `Phân tích cuộc họp trong audio này và tạo biên bản chi tiết theo format:

# BIÊN BẢN CUỘC HỌP

## Thông tin chung
- Thời gian: [ước tính]
- Số người tham gia: [ước tính]

## Tóm tắt nội dung
[Tóm tắt ngắn gọn các điểm chính]

## Nội dung chi tiết
[Chi tiết từng vấn đề được thảo luận]

## Quyết định & Kết luận
[Liệt kê các quyết định]

## Công việc tiếp theo
[Action items nếu có]`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể phân tích cuộc họp.';
}

// ---------- Helpers ----------

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
