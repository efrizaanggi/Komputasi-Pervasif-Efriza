/**
 * exam.js
 *
 * Logika utama jalannya ujian:
 * - Menerima input login dan memulai sesi ujian
 * - Mengelola timer countdown ujian
 * - Merender soal, pilihan jawaban, dan navigasi soal
 * - Memanggil modul pervasive.js dan heatmap.js
 * - Menangani submit ujian (manual maupun paksa)
 */

/* ── State global ujian ── */
let userName     = '';
let userNim      = '';
let currentQ     = 0;
let answers      = Array(5).fill(null); // null = belum dijawab
let timerSeconds = 7 * 60;             // 7 menit dalam detik
let timerInterval = null;
let examRunning  = false;
let timerPaused  = false;              // Dikendalikan pervasive.js saat AFK
let behaviorLog  = [];                 // Array log peristiwa selama ujian

/* ════════════════════════════════════════════════
   MULAI UJIAN
════════════════════════════════════════════════ */
function startExam() {
  userName = document.getElementById('input-name').value.trim();
  userNim  = document.getElementById('input-nim').value.trim();

  if (!userName || !userNim) {
    alert('Lengkapi nama dan NIM kamu dulu ya! 🌸');
    return;
  }

  showScreen('screen-exam');
  renderQuestion();
  renderDots();
  startTimer();

  // Aktifkan fitur pervasif & heatmap
  startPervasiveMonitoring();
  startHeatmapTracking();

  examRunning = true;
}

/* ════════════════════════════════════════════════
   TIMER
════════════════════════════════════════════════ */
function startTimer() {
  timerSeconds  = 7 * 60;
  timerInterval = setInterval(() => {
    if (timerPaused) return; // Dijeda saat AFK

    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      behaviorLog.push({ icon: '⏰', text: 'Waktu ujian habis. Jawaban dikumpulkan otomatis.' });
      submitExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m  = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s  = (timerSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('timer-display');
  el.textContent = `${m}:${s}`;
  el.className   = timerSeconds <= 60 ? 'timer-pill warning' : 'timer-pill';
}

/* ════════════════════════════════════════════════
   RENDER SOAL & NAVIGASI
════════════════════════════════════════════════ */
function renderQuestion() {
  const q       = QUESTIONS[currentQ];
  const letters = ['A', 'B', 'C', 'D'];

  // Header soal
  document.getElementById('q-number').textContent =
    `SOAL ${String(currentQ + 1).padStart(2, '0')} / 05`;
  document.getElementById('q-text').textContent = q.text;

  // Progress bar
  document.getElementById('progress-text').textContent =
    `Soal ${currentQ + 1} dari 5`;
  document.getElementById('progress-fill').style.width =
    ((currentQ + 1) / 5 * 100) + '%';

  // Hitung jawaban terisi
  const jumlahDijawab = answers.filter(a => a !== null).length;
  document.getElementById('answered-count').textContent =
    jumlahDijawab + ' dijawab';

  // Render pilihan jawaban
  const choicesEl = document.getElementById('q-choices');
  choicesEl.innerHTML = '';

  q.choices.forEach((teks, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (answers[currentQ] === i ? ' selected' : '');
    btn.innerHTML =
      `<span class="choice-letter">${letters[i]}</span><span>${teks}</span>`;
    btn.onclick = () => selectAnswer(i);
    choicesEl.appendChild(btn);
  });

  renderDots();
}

/* Pilih jawaban untuk soal saat ini */
function selectAnswer(idx) {
  answers[currentQ] = idx;
  renderQuestion();
}

/* Navigasi soal */
function prevQ() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function nextQ() {
  if (currentQ < 4) { currentQ++; renderQuestion(); }
}

/* Render titik navigasi soal di side panel */
function renderDots() {
  const wrap = document.getElementById('q-dots');
  wrap.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const d = document.createElement('div');
    d.className =
      'q-dot' +
      (answers[i] !== null ? ' answered' : '') +
      (i === currentQ   ? ' active'   : '');
    d.textContent = i + 1;
    d.onclick     = () => { currentQ = i; renderQuestion(); };
    wrap.appendChild(d);
  }
}

/* ════════════════════════════════════════════════
   SUBMIT UJIAN
════════════════════════════════════════════════ */
function submitExam(forced = false) {
  if (!forced && !confirm('Yakin mau mengumpulkan jawaban sekarang? 🌸')) return;

  // Hentikan semua proses aktif
  examRunning  = false;
  timerPaused  = true;
  clearInterval(timerInterval);
  stopPervasiveMonitoring();
  stopHeatmapTracking();

  // Tampilkan layar hasil
  buildResult();
  showScreen('screen-result');
}

/* ════════════════════════════════════════════════
   RESET (Coba Lagi)
════════════════════════════════════════════════ */
function resetApp() {
  // Reset state ujian
  userName      = '';
  userNim       = '';
  currentQ      = 0;
  answers       = Array(5).fill(null);
  timerSeconds  = 7 * 60;
  examRunning   = false;
  timerPaused   = false;
  behaviorLog   = [];
  clearInterval(timerInterval);

  // Reset state pervasif
  tabSwitchCount  = 0;
  totalAfkSeconds = 0;
  isAfk           = false;
  clearTimeout(afkTimer);

  // Reset heatmap
  resetHeatmap();

  // Reset elemen UI
  document.getElementById('score-arc').style.strokeDashoffset = 364.4;
  document.getElementById('badge-tab').className  = 'badge badge-ok';
  document.getElementById('badge-tab').textContent = '👁 Fokus';
  document.getElementById('badge-afk').className  = 'badge badge-ok';
  document.getElementById('badge-afk').textContent = '🐇 Aktif';

  showScreen('screen-login');
}

/* ════════════════════════════════════════════════
   HELPERS BERSAMA (dipakai semua modul)
════════════════════════════════════════════════ */

/* Tampilkan satu screen, sembunyikan yang lain */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/**
 * Format detik menjadi string "X mnt Y det" atau "Y det"
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} mnt ${s} det` : `${s} det`;
}