// ============================================
// VoxDesk — Landing Page (Commercial)
// ============================================

import { icons } from '../utils/icons.js';

const FEATURES = [
  {
    icon: icons.mic,
    title: 'Chuyển Âm thanh → Văn bản',
    desc: 'Upload file hoặc ghi âm trực tiếp — AI chép lời với độ chính xác vượt trội, hỗ trợ nhiều ngôn ngữ.',
    badge: 'STT'
  },
  {
    icon: icons.speaker,
    title: 'Đọc Văn bản → Giọng nói',
    desc: '5+ giọng AI tự nhiên, 3 ngôn ngữ. Phù hợp cho video, podcast, và thuyết trình chuyên nghiệp.',
    badge: 'TTS'
  },
  {
    icon: icons.screenRecord,
    title: 'Ghi hình Cuộc họp',
    desc: 'Quay màn hình kèm âm thanh — AI tự động tạo biên bản cuộc họp chi tiết chỉ bằng 1 click.',
    badge: 'RECORD'
  },
  {
    icon: icons.fileConvert,
    title: 'Chuyển đổi Tài liệu',
    desc: 'PDF, ảnh chụp → Word, Excel, PowerPoint. Giữ nguyên bảng biểu và cấu trúc gốc.',
    badge: 'DOC AI'
  }
];

const STEPS = [
  { num: '01', title: 'Nhập API Key miễn phí', desc: 'Lấy key từ Google AI Studio trong 30 giây — hoàn toàn miễn phí.' },
  { num: '02', title: 'Chọn công cụ AI', desc: 'Truy cập ngay 4 module chuyên nghiệp, không giới hạn sử dụng.' },
  { num: '03', title: 'Nhận kết quả tức thì', desc: 'AI xử lý nhanh chóng, tải xuống ngay các định dạng phổ biến.' }
];

const PRICING = [
  {
    name: 'Free',
    tagline: 'Mãi mãi miễn phí',
    price: '$0',
    period: '',
    desc: 'Dùng key riêng, không giới hạn',
    features: [
      'Tất cả 4 modules',
      'Dùng API key riêng (BYOK)',
      'Không giới hạn requests',
      'Export TXT / CSV',
      'Light & Dark mode',
      '5 color themes'
    ],
    cta: 'Bắt đầu ngay',
    ctaAction: 'start-free',
    highlighted: false
  },
  {
    name: 'Premium',
    tagline: 'Mua 1 lần, dùng mãi',
    price: '$9.99',
    period: 'trọn đời',
    desc: 'Mọi thứ trong Free, cộng thêm:',
    features: [
      'Export DOCX, XLSX, PPTX',
      'Export MP3 (cao hơn WAV)',
      'Phụ đề SRT / VTT',
      'AI tóm tắt nội dung',
      'Xử lý hàng loạt (batch)',
      'Bỏ watermark',
      'Ưu tiên hỗ trợ'
    ],
    cta: 'Nâng cấp Premium',
    ctaAction: 'buy-premium',
    highlighted: true
  }
];

const TESTIMONIALS = [
  { name: 'Minh Tuấn', role: 'Content Creator, YouTube', text: 'Trước phải dùng 3-4 tools riêng lẻ, giờ VoxDesk gộp hết. Tiết kiệm cả triệu đồng/tháng!', avatar: 'MT' },
  { name: 'Lan Phương', role: 'Freelancer, Fiverr', text: 'Feature chuyển đổi tài liệu quá ấn tượng. PDF scan ra Excel giữ nguyên bảng — đỡ nhập liệu cả ngày.', avatar: 'LP' },
  { name: 'Đức Anh', role: 'Project Manager', text: 'Ghi hình họp xong AI tự tạo biên bản. Đội mình ai cũng thích, meeting outcomes rõ ràng hơn rất nhiều.', avatar: 'ĐA' }
];

const FAQS = [
  { q: 'BYOK (Bring Your Own Key) là gì?', a: 'Bạn tự tạo API key miễn phí từ Google AI Studio, nhập vào app và dùng không giới hạn. Chi phí API bạn tự thanh toán trực tiếp với Google (rất rẻ, ~$0.01/request).' },
  { q: 'Có cần trả phí hàng tháng không?', a: 'Bản Free hoàn toàn miễn phí mãi mãi. Premium chỉ trả 1 lần $9.99, không subscription, không phí ẩn.' },
  { q: 'Dữ liệu của tôi có an toàn không?', a: 'Tuyệt đối. Audio, video, tài liệu được xử lý trực tiếp trên trình duyệt → gửi thẳng Google API bằng key riêng của bạn. Chúng tôi không lưu bất kỳ dữ liệu nào.' },
  { q: 'Hỗ trợ những ngôn ngữ nào?', a: 'Tiếng Việt, English, Bahasa Indonesia. STT hỗ trợ gần 100 ngôn ngữ thông qua Gemini AI.' },
  { q: 'Khác gì so với Otter.ai, ElevenLabs?', a: 'VoxDesk gộp 4 tools (STT + TTS + Record + Doc) trong 1 app, giá từ $0. Otter.ai + ElevenLabs riêng lẻ tổng > $100/tháng.' }
];

export function render() {
  return `
    <div class="landing page-enter">

      <!-- ===== HERO ===== -->
      <section class="hero-section" id="hero">
        <div class="hero-badge">${icons.sparkles} POWERED BY GOOGLE GEMINI AI</div>
        <h1 class="hero-title">
          4 Công cụ AI.<br>
          <span class="hero-gradient">1 Nền tảng. Miễn phí.</span>
        </h1>
        <p class="hero-desc">
          Chuyển âm thanh, tạo giọng đọc, ghi hình cuộc họp, xử lý tài liệu — 
          tất cả trong một ứng dụng web đẹp, nhanh, và hoàn toàn miễn phí với API key riêng.
        </p>
        <div class="hero-ctas">
          <button class="btn-hero-primary" id="hero-cta-start">
            ${icons.sparkles} Dùng thử ngay — Miễn phí
          </button>
          <a href="#features" class="btn-hero-secondary">
            Xem tính năng ↓
          </a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <strong>4</strong>
            <span>AI Modules</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <strong>$0</strong>
            <span>Bắt đầu</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <strong>100+</strong>
            <span>Ngôn ngữ</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <strong>0</strong>
            <span>Dữ liệu lưu trữ</span>
          </div>
        </div>
      </section>

      <!-- ===== FEATURES ===== -->
      <section class="landing-section" id="features">
        <div class="section-label">${icons.sparkles} TÍNH NĂNG CHÍNH</div>
        <h2 class="section-title">Mọi thứ bạn cần, trong một nền tảng</h2>
        <p class="section-desc">Không cần đăng ký 4 dịch vụ khác nhau. VoxDesk tích hợp tất cả.</p>
        <div class="features-grid">
          ${FEATURES.map((f, i) => `
            <div class="feature-card" style="animation-delay: ${i * 0.1}s">
              <div class="feature-icon">${f.icon}</div>
              <span class="feature-badge">${f.badge}</span>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ===== HOW IT WORKS ===== -->
      <section class="landing-section" id="how-it-works">
        <div class="section-label">${icons.processing} CÁCH HOẠT ĐỘNG</div>
        <h2 class="section-title">Bắt đầu trong 30 giây</h2>
        <p class="section-desc">Không cần tài khoản. Không cần thẻ tín dụng. Chỉ cần 1 API key miễn phí.</p>
        <div class="steps-grid">
          ${STEPS.map(s => `
            <div class="step-card">
              <div class="step-num">${s.num}</div>
              <h3>${s.title}</h3>
              <p>${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ===== PRICING ===== -->
      <section class="landing-section" id="pricing">
        <div class="section-label">${icons.sparkles} BẢNG GIÁ</div>
        <h2 class="section-title">Đơn giản. Minh bạch. Không phí ẩn.</h2>
        <p class="section-desc">Dùng miễn phí mãi mãi, hoặc nâng cấp Premium chỉ 1 lần.</p>
        <div class="pricing-grid">
          ${PRICING.map(p => `
            <div class="pricing-card ${p.highlighted ? 'highlighted' : ''}">
              ${p.highlighted ? '<div class="pricing-popular">⭐ PHỔ BIẾN NHẤT</div>' : ''}
              <h3>${p.name}</h3>
              <p class="pricing-tagline">${p.tagline}</p>
              <div class="pricing-price">
                <span class="pricing-amount">${p.price}</span>
                ${p.period ? `<span class="pricing-period">/ ${p.period}</span>` : ''}
              </div>
              <p class="pricing-desc">${p.desc}</p>
              <ul class="pricing-features">
                ${p.features.map(f => `<li>${icons.check} ${f}</li>`).join('')}
              </ul>
              <button class="btn-pricing ${p.highlighted ? 'primary' : 'secondary'}" data-action="${p.ctaAction}">
                ${p.cta}
              </button>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ===== TESTIMONIALS ===== -->
      <section class="landing-section" id="testimonials">
        <div class="section-label">${icons.sparkles} ĐÁNH GIÁ</div>
        <h2 class="section-title">Được tin dùng bởi hàng nghìn người</h2>
        <div class="testimonials-grid">
          ${TESTIMONIALS.map(t => `
            <div class="testimonial-card">
              <p>"${t.text}"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t.avatar}</div>
                <div>
                  <strong>${t.name}</strong>
                  <span>${t.role}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ===== FAQ ===== -->
      <section class="landing-section" id="faq">
        <div class="section-label">${icons.sparkles} CÂU HỎI THƯỜNG GẶP</div>
        <h2 class="section-title">Giải đáp thắc mắc</h2>
        <div class="faq-list">
          ${FAQS.map((f, i) => `
            <div class="faq-item" id="faq-item-${i}">
              <button class="faq-question" data-faq="${i}">
                <span>${f.q}</span>
                <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="faq-answer">
                <p>${f.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ===== FINAL CTA ===== -->
      <section class="cta-section">
        <h2>Sẵn sàng làm việc hiệu quả hơn?</h2>
        <p>Tham gia hàng nghìn người dùng đang tiết kiệm thời gian và chi phí mỗi ngày.</p>
        <button class="btn-hero-primary" id="final-cta-start">
          ${icons.sparkles} Bắt đầu miễn phí ngay
        </button>
      </section>

    </div>
  `;
}

export function init() {
  // CTA buttons → navigate to app
  document.getElementById('hero-cta-start')?.addEventListener('click', () => {
    window.location.hash = 'speech-to-text';
  });
  document.getElementById('final-cta-start')?.addEventListener('click', () => {
    window.location.hash = 'speech-to-text';
  });

  // Pricing buttons
  document.querySelectorAll('.btn-pricing').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'start-free') {
        window.location.hash = 'speech-to-text';
      } else if (action === 'buy-premium') {
        // TODO: LemonSqueezy checkout
        window.location.hash = 'speech-to-text';
      }
    });
  });

  // FAQ toggles
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
