// ============================================================
// 🚀 Main Application Logic: Birthday Album Experience
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // 0. Welcome Overlay (Autoplay Gate)
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeStartBtn = document.getElementById("welcomeStartBtn");

  if (welcomeStartBtn && welcomeOverlay) {
    welcomeStartBtn.addEventListener("click", () => {
      welcomeOverlay.classList.add("hidden");
      setTimeout(() => {
        welcomeOverlay.style.display = "none";
      }, 650);
      // Start music after user gesture - will be picked up by audio event listeners
      const bgAudio = document.getElementById("bgAudio");
      if (bgAudio) {
        bgAudio.play().catch(() => {});
      }
    });
  }

  // 1. Lightbox Logic
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxDate = document.getElementById("lightboxDate");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");

  function openLightbox(src, date, caption, isVideo = false) {
    if (!lightboxModal) return;

    if (isVideo) {
      if (lightboxImg) lightboxImg.style.display = "none";
      if (lightboxVideo) {
        lightboxVideo.style.display = "block";
        lightboxVideo.src = src;
        lightboxVideo.play().catch(() => {});
      }
      if (audio && !audio.paused) {
        audio.pause();
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();
        lightboxVideo.src = "";
      }
      if (lightboxImg) {
        lightboxImg.style.display = "block";
        lightboxImg.src = src;
      }
    }

    if (lightboxDate) lightboxDate.textContent = date || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightboxModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = "";
    }
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = "";
    }, 200);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Attach Lightbox to all pre-rendered album cards & magic scene card
  const cards = document.querySelectorAll(".album-card, .magic-lightbox-card");
  cards.forEach((card) => {
    function handleOpen(e) {
      if (e && e.target && e.target.closest(".user-slot-actions, .user-slot-caption-input")) {
        return;
      }
      const src = card.getAttribute("data-src") || card.querySelector("video")?.getAttribute("src") || null;
      if (card.classList.contains("user-editable-card") && !src) {
        card.querySelector(".user-slot-file-input")?.click();
        return;
      }
      const date = card.getAttribute("data-date") || card.querySelector(".card-date")?.textContent || "ذكرى";
      const caption = card.getAttribute("data-caption") || card.querySelector(".card-caption")?.textContent || "";
      const isVideo = card.classList.contains("video-card") || card.classList.contains("is-video") || (src && (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov") || src.startsWith("data:video/")));
      openLightbox(src, date, caption, isVideo);
    }

    card.addEventListener("click", handleOpen);

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  // 2. Dedicated Floating Emojis & Hearts Shower Animation
  function launchHeartsShower() {
    const festiveEmojis = ["🫂", "😘", "🐥", "💃", "❤️", "🔥", "💖", "🎉", "✨", "🎈"];
    const container = document.createElement("div");
    container.className = "floating-hearts-container";
    document.body.appendChild(container);

    const count = 75;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = festiveEmojis[Math.floor(Math.random() * festiveEmojis.length)];
      
      const startX = Math.random() * 94 + 3;
      const size = Math.random() * 30 + 22;
      const duration = Math.random() * 2.8 + 2.5;
      const delay = Math.random() * 0.9;
      const drift = (Math.random() - 0.5) * 150;

      heart.style.left = `${startX}vw`;
      heart.style.fontSize = `${size}px`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.setProperty("--drift", `${drift}px`);

      container.appendChild(heart);
    }

    setTimeout(() => {
      container.remove();
    }, 6500);
  }

  function launchConfetti(intensity = "big") {
    if (typeof confetti === "function") {
      const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
      if (intensity === "big") {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: colors
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: colors
          });
        }, 350);
      } else {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: colors
        });
      }
    }
  }

  // 3. Blow Candle Action
  const blowBtn = document.getElementById("blowCandleBtn");
  const wishFeedback = document.getElementById("wishFeedback");
  const flames = document.querySelectorAll(".flame");
  const smokes = document.querySelectorAll(".smoke");
  let candlesBlown = false;

  if (blowBtn) {
    blowBtn.addEventListener("click", () => {
      if (!candlesBlown) {
        flames.forEach(flame => flame.classList.add("extinguished"));
        smokes.forEach(smoke => smoke.classList.add("active"));
        candlesBlown = true;
        
        launchHeartsShower();
        launchConfetti("big");

        blowBtn.innerHTML = `<span class="btn-icon">💖</span><span class="btn-text">تم إطفاء الشمع وتحقيق أمنية الـ 23 سنة!</span>`;
        if (wishFeedback) {
          wishFeedback.innerHTML = `صاحبي واخويا وصديقي الاقرب الى قلبي ❤️✨`;
          wishFeedback.classList.add("celebrate");
        }

        startMusicIfConfigured();
      } else {
        launchHeartsShower();
        launchConfetti("big");
      }
    });
  }

  // Celebrate Again Button
  const celebrateAgainBtn = document.getElementById("celebrateAgainBtn");
  if (celebrateAgainBtn) {
    celebrateAgainBtn.addEventListener("click", () => {
      launchHeartsShower();
      launchConfetti("big");
    });
  }

  setTimeout(() => {
    launchConfetti("small");
  }, 900);

  // 4. Music Player Logic (Reliable Toggle / Mute)
  const audio = document.getElementById("bgAudio");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const vinylDisc = document.getElementById("vinylDisc");
  const musicStatus = document.getElementById("musicStatus");
  const musicMuteIcon = document.getElementById("musicMuteIcon");
  const vinylCenterIcon = document.getElementById("vinylCenterIcon");

  function updateMusicUI(playing) {
    if (playing) {
      if (musicToggleBtn) musicToggleBtn.classList.add("is-active");
      if (vinylDisc) vinylDisc.classList.add("playing");
      if (musicStatus) musicStatus.textContent = "شغّالة 🔊 (اضغط للإيقاف)";
      if (musicMuteIcon) musicMuteIcon.textContent = "🔊";
      if (vinylCenterIcon) vinylCenterIcon.textContent = "🎵";
    } else {
      if (musicToggleBtn) musicToggleBtn.classList.remove("is-active");
      if (vinylDisc) vinylDisc.classList.remove("playing");
      if (musicStatus) musicStatus.textContent = "مكتوم 🔇 (اضغط للتشغيل)";
      if (musicMuteIcon) musicMuteIcon.textContent = "🔇";
      if (vinylCenterIcon) vinylCenterIcon.textContent = "⏸";
    }
  }

  function toggleMusic() {
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      updateMusicUI(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateMusicUI(true);
        }).catch((err) => {
          console.log("Audio play error:", err);
          if (musicStatus) musicStatus.textContent = "تأكد من السماح بالصوت 🔇";
        });
      } else {
        updateMusicUI(true);
      }
    }
  }

  function startMusicIfConfigured() {
    if (audio && audio.paused) {
      audio.play().then(() => {
        updateMusicUI(true);
      }).catch(() => {});
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleMusic);
  }

  if (audio) {
    audio.addEventListener("play", () => updateMusicUI(true));
    audio.addEventListener("pause", () => updateMusicUI(false));
  }

  // 5. Voice Note Player
  const voiceAudio = document.getElementById("voiceAudio");
  const voicePlayBtn = document.getElementById("voicePlayBtn");
  const voiceBtnIcon = document.getElementById("voiceBtnIcon");
  const voiceCurrentTime = document.getElementById("voiceCurrentTime");
  const voiceDuration = document.getElementById("voiceDuration");
  const voiceCardPlayer = document.querySelector(".voicenote-player");

  if (voiceAudio && voicePlayBtn) {
    let isVoicePlaying = false;

    function formatTime(sec) {
      if (isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    voiceAudio.addEventListener("loadedmetadata", () => {
      if (voiceDuration) voiceDuration.textContent = formatTime(voiceAudio.duration);
    });

    voiceAudio.addEventListener("timeupdate", () => {
      if (voiceCurrentTime) voiceCurrentTime.textContent = formatTime(voiceAudio.currentTime);
    });

    voiceAudio.addEventListener("ended", () => {
      isVoicePlaying = false;
      if (voiceBtnIcon) voiceBtnIcon.textContent = "▶";
      if (voiceCardPlayer) voiceCardPlayer.classList.remove("is-playing");
    });

    voicePlayBtn.addEventListener("click", () => {
      if (isVoicePlaying) {
        voiceAudio.pause();
        isVoicePlaying = false;
        if (voiceBtnIcon) voiceBtnIcon.textContent = "▶";
        if (voiceCardPlayer) voiceCardPlayer.classList.remove("is-playing");
      } else {
        if (audio && !audio.paused) {
          audio.pause();
        }

        voiceAudio.play().then(() => {
          isVoicePlaying = true;
          if (voiceBtnIcon) voiceBtnIcon.textContent = "⏸";
          if (voiceCardPlayer) voiceCardPlayer.classList.add("is-playing");
        }).catch((err) => {
          console.log("Voice audio file not uploaded yet:", err);
          if (voiceCurrentTime) {
            voiceCurrentTime.textContent = "حطي voice.mp3 في assets/music";
          }
        });
      }
    });
  }

  // 6. Scratch Card Logic
  const scratchCanvas = document.getElementById("scratchCanvas");
  const scratchContainer = document.getElementById("scratchContainer");
  const revealSecretBtn = document.getElementById("revealSecretBtn");

  if (scratchCanvas && scratchCanvas.getContext) {
    const ctx = scratchCanvas.getContext("2d");
    let isScratching = false;
    let scratchedRatio = 0;

    function initScratchCard() {
      const rect = scratchContainer.getBoundingClientRect();
      scratchCanvas.width = rect.width || 500;
      scratchCanvas.height = rect.height || 300;

      const grad = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.3, '#fef08a');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#b45309');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 20px "Alexandria", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ اخربش هنا لكشف 🎁', scratchCanvas.width / 2, scratchCanvas.height / 2 - 8);

      ctx.font = '14px "Alexandria", sans-serif';
      ctx.fillText('(حرّك الماوس أو صباعك على الكارت)', scratchCanvas.width / 2, scratchCanvas.height / 2 + 26);
    }

    initScratchCard();

    function scratch(e) {
      if (!isScratching) return;
      const rect = scratchCanvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      scratchedRatio++;
      if (scratchedRatio > 22) {
        revealSecret();
      }
    }

    function revealSecret() {
      scratchCanvas.style.transition = "opacity 0.6s ease";
      scratchCanvas.style.opacity = "0";
      setTimeout(() => {
        scratchCanvas.style.display = "none";
      }, 600);
      launchHeartsShower();
      launchConfetti("small");
    }

    scratchCanvas.addEventListener("mousedown", (e) => { isScratching = true; scratch(e); });
    scratchCanvas.addEventListener("mousemove", scratch);
    window.addEventListener("mouseup", () => { isScratching = false; });

    scratchCanvas.addEventListener("touchstart", (e) => { isScratching = true; scratch(e); }, { passive: true });
    scratchCanvas.addEventListener("touchmove", scratch, { passive: true });
    window.addEventListener("touchend", () => { isScratching = false; });

    if (revealSecretBtn) {
      revealSecretBtn.addEventListener("click", revealSecret);
    }
  }

  // 7. Mini Game 1: Pop the Balloons 🎈
  const balloonArena = document.getElementById("balloonArena");
  const balloonCounter = document.getElementById("balloonCounter");
  const balloonMessageBox = document.getElementById("balloonMessageBox");
  const balloonReplayBtn = document.getElementById("balloonReplayBtn");

  if (balloonArena && balloonCounter && balloonMessageBox) {
    const balloonColors = [
      "linear-gradient(135deg, #f43f5e, #e11d48)",
      "linear-gradient(135deg, #f59e0b, #d97706)",
      "linear-gradient(135deg, #ec4899, #be185d)",
      "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      "linear-gradient(135deg, #10b981, #059669)",
      "linear-gradient(135deg, #a855f7, #7e22ce)"
    ];
    const balloonEmojis = ["🫂", "😘", "🐥", "💃", "❤️‍🔥", "💖"];
    const balloonMessages = [
      "بجد أنت أجمل وأغلى هدية ربنا بعتهالي 💃❤️",
      "شكرا يا صاحبي على كل حاجه🫂🫂",
      "كل سنة وإحنا سوا وربنا يديمنا في حياة بعض 🐥💖",
      "دايماً سوا ومهما حصل إحنا سند لبعض ❤️‍🔥",
      "ضحكة عايودي الحلوة اللي بحبها ربنا يديمها عليك دايما😘✨",
      "أجدع صاحب وأخ في الدنيا كلها ربنا يخليك ليااا 🫂"
    ];

    let poppedCount = 0;

    function setupBalloons() {
      balloonArena.innerHTML = "";
      poppedCount = 0;
      balloonCounter.textContent = `0 / ${balloonColors.length}`;
      balloonMessageBox.textContent = "دوس على أي بالونة عشان تفرقعها وتطلعلك مفاجأة! 🎉";
      balloonMessageBox.classList.remove("pop-highlight");
      if (balloonReplayBtn) balloonReplayBtn.style.display = "none";

      balloonColors.forEach((bg, idx) => {
        const b = document.createElement("div");
        b.className = "game-balloon";
        b.style.background = bg;
        b.style.animationDelay = `${(idx * 0.35).toFixed(2)}s`;
        b.textContent = balloonEmojis[idx];

        b.addEventListener("click", () => {
          if (b.classList.contains("popped")) return;
          b.classList.add("popped");
          poppedCount++;
          balloonCounter.textContent = `${poppedCount} / ${balloonColors.length}`;

          balloonMessageBox.textContent = balloonMessages[idx];
          balloonMessageBox.classList.remove("pop-highlight");
          void balloonMessageBox.offsetWidth; // trigger reflow for pop pulse
          balloonMessageBox.classList.add("pop-highlight");

          launchConfetti("small");

          if (poppedCount === balloonColors.length) {
            setTimeout(() => {
              launchHeartsShower();
              launchConfetti("big");
              if (balloonReplayBtn) balloonReplayBtn.style.display = "inline-flex";
            }, 300);
          }
        });

        balloonArena.appendChild(b);
      });
    }

    setupBalloons();
    if (balloonReplayBtn) {
      balloonReplayBtn.addEventListener("click", setupBalloons);
    }
  }

  // 8. Mini Game 2: Friendship Quiz 🧠❤️
  const quizQuestionEl = document.getElementById("quizQuestion");
  const quizOptionsEl = document.getElementById("quizOptions");
  const quizProgressEl = document.getElementById("quizProgress");
  const quizBodyEl = document.getElementById("quizBody");
  const quizResultEl = document.getElementById("quizResult");
  const quizReplayBtn = document.getElementById("quizReplayBtn");

  if (quizQuestionEl && quizOptionsEl && quizProgressEl) {
    const quizQuestions = [
      {
        q: "أول هدية جبتهالها كانت إيه؟ 🎁",
        options: ["سماعة 🎧", "ساعة ⌚", "مج ☕", "محفظة 👛"],
        correct: 0
      },
      {
        q: "أول يوم شوفتك فيه كان في امتحان إيه؟ 👀",
        options: ["امتحان الكمبيوتر 💻", "امتحان الكيمستري 🧪", "امتحان الرسم 🎨"],
        correct: 0
      },
      {
        q: "أول مادة اشتركنا فيها مع بعض إيه؟ 📚",
        options: ["رسم 🎨", "ستاتكس 📐", "كيمستري 🧪"],
        correct: 0
      },
      {
        q: "أول خروجة مع بعض كانت في شهر كام؟ 🚗",
        options: ["شهر 4 🌸", "شهر 1 ❄️", "شهر 7 ☀️"],
        correct: 0
      },
      {
        q: "مين أكتر حد بيحبه عايودي في الدنيا؟ ❤️",
        options: ["عايوديييي صاحبي 👑", "عايودي حبيب قلبي ❤️", "all of the above 💯"],
        correct: 0
      },
      {
        q: "إيه أكتر أكلة بتحبها؟ 😋",
        options: ["مكرونة وايت صوص 🍝", "ملوخية 🍵", "فراخ 🍗", "كفتة 🥩"],
        correct: 0
      },
      {
        q: "أكتر كرتون بتحبه إيه؟ 🎬",
        options: ["رابونزل 🌟", "سندريلا 👠", "فروزن ❄️", "ياسمين 🌙"],
        correct: 0
      },
      {
        q: "أكتر مغني أنا بحبه مين؟ 🎵",
        options: ["بهاء سلطان 🎤", "عمرو دياب 🎶", "تامر حسني 🎸", "محمد حماقي 🎵"],
        correct: 0
      },
      {
        q: "مين فينا اللي بيتأخر دايماً؟ ⏰",
        options: ["انا 😇", "انت 😂👆"],
        correct: 1
      }
    ];

    let currentQ = 0;
    let correctCount = 0;
    let wrongCount = 0;

    function renderQuizQuestion() {
      if (quizBodyEl) quizBodyEl.style.display = "block";
      if (quizResultEl) quizResultEl.style.display = "none";

      const item = quizQuestions[currentQ];
      quizProgressEl.textContent = `${currentQ + 1} / ${quizQuestions.length}`;
      quizQuestionEl.textContent = item.q;
      quizOptionsEl.innerHTML = "";

      item.options.forEach((optText) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = optText;

        btn.addEventListener("click", () => {
          const allBtns = quizOptionsEl.querySelectorAll(".quiz-option-btn");
          allBtns.forEach(b => b.disabled = true);
          const correctIdx = quizQuestions[currentQ].correct ?? 0;
          const isCorrect = Array.from(allBtns).indexOf(btn) === correctIdx;
          if (isCorrect) {
            btn.classList.add("selected-correct");
            correctCount++;
            launchConfetti("small");
          } else {
            btn.classList.add("selected-wrong");
            allBtns[correctIdx].classList.add("selected-correct");
            wrongCount++;
          }

          setTimeout(() => {
            currentQ++;
            if (currentQ < quizQuestions.length) {
              renderQuizQuestion();
            } else {
              showQuizResult();
            }
          }, 900);
        });

        quizOptionsEl.appendChild(btn);
      });
    }

    function showQuizResult() {
      if (quizBodyEl) quizBodyEl.style.display = "none";
      if (quizResultEl) quizResultEl.style.display = "block";

      const total = quizQuestions.length;
      const emojiEl = quizResultEl.querySelector(".quiz-result-emoji");
      const titleEl = quizResultEl.querySelector(".quiz-result-title");
      const textEl  = quizResultEl.querySelector(".quiz-result-text");

      quizProgressEl.textContent = `${correctCount} / ${total} ✅`;

      if (wrongCount === 0) {
        // كل الإجابات صح
        if (emojiEl) emojiEl.textContent = "🏆🎉";
        if (titleEl) titleEl.textContent = `النتيجة: ${correctCount}/${total} — أجدع صاحب وأخ في الدنيا!`;
        if (textEl)  textEl.textContent  = "ماشاء الله عارفني كويس جداً.. كل سنة وإحنا سوا يا عايودي ❤️🐥";
        launchHeartsShower();
        launchConfetti("big");
      } else if (wrongCount <= 2) {
        // غلط سؤال أو اتنين
        if (emojiEl) emojiEl.textContent = "😅💛";
        if (titleEl) titleEl.textContent = `النتيجة: ${correctCount}/${total} — قريب بس مش 100%!`;
        if (textEl)  textEl.textContent  = `غلطت ${wrongCount} بس.. مش مشكلة إحنا لسه صحاب 😄🫂`;
        launchConfetti("small");
      } else {
        // أكتر من اتنين غلط
        if (emojiEl) emojiEl.textContent = "😂🤨";
        if (titleEl) titleEl.textContent = `النتيجة: ${correctCount}/${total} — لا شكلك مش صاحبي بجد!`;
        if (textEl)  textEl.textContent  = `غلطت ${wrongCount} أسئلة؟! إيه ده 😂😂 تعيد تاني وتذاكر أحسن!`;
      }
    }

    renderQuizQuestion();
    if (quizReplayBtn) {
      quizReplayBtn.addEventListener("click", () => {
        currentQ = 0;
        correctCount = 0;
        wrongCount = 0;
        renderQuizQuestion();
      });
    }
  }

  // 8. 3 User-Editable Extra Album Slots (For Ayouda)
  const userEditableCards = document.querySelectorAll(".user-editable-card");
  if (userEditableCards.length > 0 && window.MemoriesStore) {
    let userSlotsData = [
      { src: "", caption: "صورتك المفضلة هنا يا عايودي ✨" },
      { src: "", caption: "ذكرى من اختيارك يا صاحبي 🫂" },
      { src: "", caption: "أحلى لقطة تحب تضيفها 🎉" }
    ];

    function applySlotToCard(card, slotObj) {
      const imgEl = card.querySelector(".user-slot-img");
      const placeholder = card.querySelector(".user-slot-placeholder");
      const captionInput = card.querySelector(".user-slot-caption-input");
      const uploadBtnText = card.querySelector(".user-slot-upload-btn span");

      if (slotObj && slotObj.src) {
        if (imgEl) {
          imgEl.src = slotObj.src;
          imgEl.style.display = "block";
        }
        if (placeholder) placeholder.style.display = "none";
        card.setAttribute("data-src", slotObj.src);
        if (uploadBtnText) uploadBtnText.textContent = "🔄 تغيير الصورة";
      } else {
        if (imgEl) imgEl.style.display = "none";
        if (placeholder) placeholder.style.display = "flex";
        card.removeAttribute("data-src");
        if (uploadBtnText) uploadBtnText.textContent = "📷 اختار صورة";
      }

      if (slotObj && slotObj.caption !== undefined) {
        if (captionInput) captionInput.value = slotObj.caption;
        card.setAttribute("data-caption", slotObj.caption);
      }
    }

    (async () => {
      try {
        userSlotsData = await window.MemoriesStore.getUserSlots();
        userEditableCards.forEach((card) => {
          const idx = parseInt(card.getAttribute("data-slot"), 10);
          if (!isNaN(idx) && userSlotsData[idx]) {
            applySlotToCard(card, userSlotsData[idx]);
          }
        });
      } catch (e) {}
    })();

    userEditableCards.forEach((card) => {
      const idx = parseInt(card.getAttribute("data-slot"), 10);
      const fileInput = card.querySelector(".user-slot-file-input");
      const captionInput = card.querySelector(".user-slot-caption-input");
      const statusEl = card.querySelector(".user-slot-status");

      if (fileInput) {
        fileInput.addEventListener("change", async (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (statusEl) statusEl.textContent = "جاري الحفظ...";
          try {
            const compressedDataUrl = await window.MemoriesStore.compressImage(file, 1200, 0.85);
            userSlotsData[idx] = {
              src: compressedDataUrl,
              caption: captionInput ? captionInput.value : ""
            };
            applySlotToCard(card, userSlotsData[idx]);
            await window.MemoriesStore.saveUserSlots(userSlotsData);
            if (statusEl) {
              statusEl.textContent = "اتحفظت ✅";
              setTimeout(() => { statusEl.textContent = ""; }, 2500);
            }
          } catch (err) {
            if (statusEl) statusEl.textContent = "حصل خطأ ❌";
          }
        });
      }

      if (captionInput) {
        captionInput.addEventListener("click", (e) => e.stopPropagation());
        let saveTimer = null;
        captionInput.addEventListener("input", () => {
          card.setAttribute("data-caption", captionInput.value);
          userSlotsData[idx] = {
            src: userSlotsData[idx]?.src || "",
            caption: captionInput.value
          };
          clearTimeout(saveTimer);
          saveTimer = setTimeout(async () => {
            await window.MemoriesStore.saveUserSlots(userSlotsData);
            if (statusEl) {
              statusEl.textContent = "اتحفظ ✅";
              setTimeout(() => { statusEl.textContent = ""; }, 2000);
            }
          }, 500);
        });
      }
    });
  }

  // 9. Interactive Open-When Envelopes
  const envelopeCards = document.querySelectorAll(".envelope-card");
  envelopeCards.forEach((env) => {
    function toggleEnvelope() {
      const isOpen = env.classList.toggle("is-open");
      env.setAttribute("aria-expanded", String(isOpen));
      if (isOpen && typeof launchConfetti === "function") {
        launchConfetti("small");
      }
    }

    env.addEventListener("click", toggleEnvelope);
    env.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleEnvelope();
      }
    });
  });
});
