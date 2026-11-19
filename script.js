/**
 * ===================================================================
 * PROJECT: HEY, LITTLE BROTHER! - A SPECIAL GIFT FOR LỤC THẾ ANH
 * Big Sister: LỤC THU HUỆ
 * Audio: Dual-mode Web Audio Synthesizer (Playful Marimba & Gentle Piano)
 * Effects: 3D Box Open, Canvas Pastel Confetti, Typewriter Letter, Photo Uploader
 * ===================================================================
 */

(function () {
  'use strict';

  /* ================== DOM ELEMENTS ================== */
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainScreen = document.getElementById('main-screen');
  const giftBoxScene = document.getElementById('giftBoxScene');
  const giftBox3D = document.getElementById('giftBox3D');
  const openGiftBtn = document.getElementById('openGiftBtn');

  // Audio Controls
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioStatusText = document.getElementById('audioStatusText');

  // Character interactive
  const avatarFrame = document.getElementById('avatarFrame');
  const avatarSpeech = document.getElementById('avatarSpeech');

  // Letter Modal
  const floatingLetterWidget = document.getElementById('floatingLetterWidget');
  const openLetterBannerBtn = document.getElementById('openLetterBannerBtn');
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const closeLetterInPaperBtn = document.getElementById('closeLetterInPaperBtn');
  const replayTypingBtn = document.getElementById('replayTypingBtn');
  const modalDimBg = document.getElementById('modalDimBg');
  const letterBodyText = document.getElementById('letterBodyText');

  // Hug Modal
  const finalHugBtn = document.getElementById('finalHugBtn');
  const hugModal = document.getElementById('hugModal');
  const closeHugBtn = document.getElementById('closeHugBtn');
  const hugDimBg = document.getElementById('hugDimBg');
  const confirmHugBtn = document.getElementById('confirmHugBtn');

  // Photo Uploader
  const customPhotoInput = document.getElementById('customPhotoInput');

  // Canvas
  const canvas = document.getElementById('scrapbook-canvas');

  /* ===================================================================
     1. DUAL-MODE WEB AUDIO SYNTHESIZER (PLAYFUL & PIANO)
     =================================================================== */
  class DualAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.currentMode = 'playful'; // 'playful' or 'piano'
      this.timer = null;
      this.step = 0;
      this.masterGain = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, dur = 0.5, type = 'sine', vel = 0.4) {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vel * 0.4, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + dur);
    }

    startMusic() {
      this.init();
      this.isPlaying = true;

      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.7, now + 1.5);
      }

      this.scheduleLoop();
      this.updateUI();
    }

    scheduleLoop() {
      if (this.timer) clearTimeout(this.timer);

      // Playful C major happy scale notes
      const playfulNotes = [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 440.00, 349.23,
        329.63, 261.63, 293.66, 392.00, 523.25, 659.25, 587.33, 523.25
      ];

      // Gentle emotional piano chords
      const pianoNotes = [
        { b: 174.61, c: [349.23, 440.00, 523.25] }, // F
        { b: 164.81, c: [329.63, 392.00, 493.88] }, // Em
        { b: 146.83, c: [293.66, 349.23, 440.00] }, // Dm
        { b: 130.81, c: [261.63, 329.63, 392.00] }, // C
        { b: 116.54, c: [233.08, 293.66, 349.23] }, // Bb
        { b: 130.81, c: [261.63, 329.63, 392.00] }  // C
      ];

      const tick = () => {
        if (!this.isPlaying) return;

        if (this.currentMode === 'playful') {
          const note = playfulNotes[this.step % playfulNotes.length];
          // Marimba / Kalimba style tone (triangle + sine)
          this.playTone(note, 0.45, 'triangle', 0.5);
          if (this.step % 2 === 0) {
            this.playTone(note * 0.5, 0.6, 'sine', 0.35); // Bass
          }
          this.step++;
          this.timer = setTimeout(tick, 280);
        } else {
          // Emotional gentle piano mode
          const chord = pianoNotes[this.step % pianoNotes.length];
          this.playTone(chord.b, 2.5, 'triangle', 0.6); // Deep bass
          chord.c.forEach((n, idx) => {
            setTimeout(() => {
              if (this.isPlaying && this.currentMode === 'piano') {
                this.playTone(n, 2.0, 'sine', 0.4);
              }
            }, idx * 120);
          });
          this.step++;
          this.timer = setTimeout(tick, 1400);
        }
      };

      tick();
    }

    setMode(mode) {
      if (this.currentMode !== mode) {
        this.currentMode = mode;
        this.step = 0;
        if (this.isPlaying) {
          this.scheduleLoop();
        }
      }
    }

    pauseMusic() {
      this.isPlaying = false;
      if (this.timer) clearTimeout(this.timer);
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      }
      this.updateUI();
    }

    toggle() {
      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.startMusic();
      }
    }

    updateUI() {
      if (this.isPlaying) {
        audioToggleBtn.classList.remove('paused');
        audioStatusText.textContent = this.currentMode === 'piano' ? 'Piano êm dịu' : 'Nhạc vui tươi';
      } else {
        audioToggleBtn.classList.add('paused');
        audioStatusText.textContent = 'Bật nhạc nha!';
      }
    }
  }

  const audio = new DualAudioEngine();

  audioToggleBtn.addEventListener('click', () => {
    audio.toggle();
  });

  /* ===================================================================
     2. AMBIENT PASTEL CONFETTI & BUBBLES CANVAS ENGINE
     =================================================================== */
  class ScrapbookCanvas {
    constructor(canvasEl) {
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Initial floating bubbles & stars
      const count = window.innerWidth < 768 ? 20 : 35;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createBubble(true));
      }

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
    }

    createBubble(initial = false) {
      const colors = ['#FFB6C1', '#A8D8EA', '#FFEAA7', '#DED2F9', '#BFFCC6'];
      return {
        type: 'bubble',
        x: Math.random() * this.width,
        y: initial ? Math.random() * this.height : this.height + 20,
        radius: Math.random() * 8 + 4,
        speedY: -(Math.random() * 0.8 + 0.4),
        speedX: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.25,
        pulseAngle: Math.random() * Math.PI * 2
      };
    }

    addConfettiBurst(x, y, count = 45) {
      const colors = ['#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#9B59B6', '#FF6B81'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 3;
        this.particles.push({
          type: 'confetti',
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: Math.random() * 9 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.012
        });
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        if (p.type === 'bubble') {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulseAngle += 0.02;

          if (p.y < -30) {
            this.particles[i] = this.createBubble(false);
          } else {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha * (0.8 + 0.2 * Math.sin(p.pulseAngle));
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
          }
        } else if (p.type === 'confetti') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; // Gravity
          p.vx *= 0.98;
          p.rotation += p.rotSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          } else {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
            this.ctx.restore();
          }
        }
      }

      requestAnimationFrame(this.loop);
    }
  }

  let canvasFX = null;
  if (canvas) {
    canvasFX = new ScrapbookCanvas(canvas);
  }

  /* ===================================================================
     3. 3D GIFT BOX OPENING & TRANSITION TO MAIN SCRAPBOOK
     =================================================================== */
  function openGiftExperience() {
    // 1. Box lid pops off
    giftBox3D.classList.add('opened');

    // 2. Confetti explosion
    const rect = giftBoxScene.getBoundingClientRect();
    if (canvasFX) {
      canvasFX.addConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
    }

    // 3. Play happy music
    audio.setMode('playful');
    audio.startMusic();

    // 4. Smooth transition to main screen
    setTimeout(() => {
      welcomeScreen.style.transform = 'scale(0.95) translateY(-25px)';
      welcomeScreen.style.opacity = '0';

      setTimeout(() => {
        welcomeScreen.classList.remove('active');
        mainScreen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        mainScreen.style.opacity = '0';
        mainScreen.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          mainScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          mainScreen.style.opacity = '1';
          mainScreen.style.transform = 'translateY(0)';
        });
      }, 550);
    }, 600);
  }

  openGiftBtn.addEventListener('click', openGiftExperience);
  giftBoxScene.addEventListener('click', openGiftExperience);

  /* ===================================================================
     4. INTERACTIVE CHARACTER (THẾ ANH QUOTES & REACTIONS)
     =================================================================== */
  const funnyQuotes = [
    "Chị Huệ ơi, em ngoan nhất nhà mà lị! 😎",
    "Chị có trà sữa cho em không đấy? 🧋",
    "Biết ngay chị thương em trai nhất trần đời! 🏆",
    "Lớn rồi nhưng chị vẫn phải lì xì em đấy nhá! 🧧",
    "Em nghịch có tí mà chị nhớ dai thế! 😜",
    "Tuy em hơi bướng nhưng luôn nghe lời chị Huệ! ✌️"
  ];
  let quoteIndex = 0;

  if (avatarFrame && avatarSpeech) {
    avatarFrame.addEventListener('click', (e) => {
      quoteIndex = (quoteIndex + 1) % funnyQuotes.length;
      avatarSpeech.textContent = funnyQuotes[quoteIndex];
      avatarFrame.style.transform = 'scale(1.08) rotate(4deg)';
      setTimeout(() => {
        avatarFrame.style.transform = '';
      }, 300);

      // Confetti burst from avatar
      if (canvasFX) {
        canvasFX.addConfettiBurst(e.clientX, e.clientY, 15);
      }
    });
  }

  /* ===================================================================
     5. POLAROID CUSTOM PHOTO UPLOAD
     =================================================================== */
  if (customPhotoInput) {
    customPhotoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const polaroidImgs = document.querySelectorAll('.photo-img');
      files.forEach((file, idx) => {
        if (idx < polaroidImgs.length) {
          const reader = new FileReader();
          reader.onload = (event) => {
            polaroidImgs[idx].src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      alert('Đã cập nhật ảnh kỷ niệm của hai chị em vào khung Polaroid thành công! 📸✨');
    });
  }

  /* ===================================================================
     6. SECRET LETTER 3D MODAL & TYPEWRITER REVEAL
     =================================================================== */
  const letterParagraphs = [
    { text: "Gửi Lục Thế Anh - cậu em trai nghịch ngợm của chị!", isTitle: true },
    { text: "Thế Anh này!", isSalutation: true },
    { text: "Chị không biết phải bắt đầu từ đâu, nhưng hôm nay chị muốn dành cho em một chút thời gian để nói lời cảm ơn." },
    { text: "Cảm ơn em vì đã luôn hỗ trợ chị trong những năm tháng cấp 3. Cảm ơn vì những lần giúp đỡ, những lúc đồng hành và cả những điều tưởng chừng rất bình thường nhưng lại khiến chị cảm thấy mình không đơn độc." },
    { text: "Chị biết đôi khi em khá nghịch ngợm, có lúc khiến chị phải đau đầu, thậm chí có những lúc hai chị em chẳng thể nào tránh khỏi việc trêu chọc hay cãi nhau. Nhưng đó cũng chính là những điều làm nên những kỷ niệm rất riêng của chúng ta." },
    { text: "Có thể chị không thường xuyên nói ra, nhưng chị thực sự biết ơn vì có em là em trai." },
    { text: "Chị mong em sẽ luôn vui vẻ, khỏe mạnh, tự tin theo đuổi những điều mình thích và ngày càng trưởng thành hơn. Hãy cứ là chính mình, nhưng nhớ sống có trách nhiệm và đừng quên quan tâm đến gia đình nhé!" },
    { text: "Dù sau này mỗi người có con đường riêng, chị vẫn luôn mong chúng ta sẽ giữ được tình cảm chị em thân thiết như bây giờ." },
    { text: "Cảm ơn cậu em trai đặc biệt của chị!", isSub: true },
    { text: "THƯƠNG EM NHIỀU!", isShout: true },
    { text: "Chị gái của em,", isRole: true },
    { text: "LỤC THU HUỆ ❤️", isName: true }
  ];

  let typingTimeouts = [];

  function clearLetterTimeouts() {
    typingTimeouts.forEach(t => clearTimeout(t));
    typingTimeouts = [];
  }

  function renderLetterTypewriter() {
    clearLetterTimeouts();
    letterBodyText.innerHTML = '';

    // Switch music to gentle piano
    audio.setMode('piano');

    let delay = 250;

    letterParagraphs.forEach((item) => {
      if (item.isTitle) return; // Title is in header

      const p = document.createElement('p');
      p.style.opacity = '0';
      p.style.transform = 'translateY(10px)';
      p.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      if (item.isSalutation) {
        p.className = 'salutation-highlight';
      } else if (item.isSub) {
        p.className = 'sign-tag-sub';
      } else if (item.isShout) {
        p.className = 'sign-love-shout';
      } else if (item.isRole) {
        p.className = 'sign-role';
      } else if (item.isName) {
        p.className = 'sign-name';
      } else {
        p.className = 'letter-paragraph';
      }

      p.textContent = item.text;
      letterBodyText.appendChild(p);

      const t = setTimeout(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, delay);
      typingTimeouts.push(t);

      delay += item.isSalutation ? 400 : 550;
    });
  }

  function openLetterModal() {
    letterModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const rect = floatingLetterWidget.getBoundingClientRect();
    if (canvasFX) {
      canvasFX.addConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
    }

    renderLetterTypewriter();
  }

  function closeLetterModal() {
    clearLetterTimeouts();
    letterModal.classList.remove('open');
    document.body.style.overflow = '';
    // Switch music back to playful
    audio.setMode('playful');
  }

  floatingLetterWidget.addEventListener('click', openLetterModal);
  if (openLetterBannerBtn) {
    openLetterBannerBtn.addEventListener('click', openLetterModal);
  }
  closeLetterBtn.addEventListener('click', closeLetterModal);
  closeLetterInPaperBtn.addEventListener('click', closeLetterModal);
  modalDimBg.addEventListener('click', closeLetterModal);

  replayTypingBtn.addEventListener('click', () => {
    renderLetterTypewriter();
  });

  /* ===================================================================
     7. SIBLING HUG CELEBRATION MODAL
     =================================================================== */
  function openHugModal() {
    hugModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Massive confetti burst
    if (canvasFX) {
      canvasFX.addConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 90);
    }
  }

  function closeHugModal() {
    hugModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  finalHugBtn.addEventListener('click', openHugModal);
  closeHugBtn.addEventListener('click', closeHugModal);
  hugDimBg.addEventListener('click', closeHugModal);
  confirmHugBtn.addEventListener('click', closeHugModal);

  // ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (letterModal.classList.contains('open')) closeLetterModal();
      if (hugModal.classList.contains('open')) closeHugModal();
    }
  });

})();
