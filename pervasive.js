/**
 * pervasive.js
 *
 * ═══════════════════════════════════════════════════════════
 * INI ADALAH INTI DARI TUGAS KOMPUTASI PERVASIF
 * ═══════════════════════════════════════════════════════════
 *
 * Berisi 2 fitur Smart Detector yang diwajibkan dosen:
 *
 * 1. TAB VISIBILITY MONITOR (Anti-Cheating)
 *    Menggunakan Page Visibility API (document.visibilitychange)
 *    untuk mendeteksi ketika pengguna berpindah ke tab lain.
 *    → Mencatat log pelanggaran
 *    → Memperbarui badge status di topbar
 *    → Mengunci ujian jika pelanggaran melebihi MAX_TAB_SWITCH
 *
 * 2. USER INACTIVITY / IDLE DETECTOR (Presence Tracker)
 *    Menggunakan event mousemove, keydown, mousedown, touchstart
 *    untuk mendeteksi apakah pengguna masih aktif.
 *    → Jika tidak ada aktivitas selama AFK_TIMEOUT ms, tampilkan overlay
 *    → Timer ujian dijeda saat AFK
 *    → Durasi AFK dicatat ke behavior log
 */

/* ── Konfigurasi ── */
const MAX_TAB_SWITCH = 3;    // Batas maksimal pindah tab sebelum dikunci
const AFK_TIMEOUT    = 20000; // Batas idle dalam milidetik (20 detik)

/* ── State pervasive ── */
let tabSwitchCount  = 0;
let totalAfkSeconds = 0;
let afkTimer        = null;
let afkStartTime    = null;
let isAfk           = false;

/* ── Dipanggil oleh exam.js saat ujian dimulai ── */
function startPervasiveMonitoring() {
  // 1. Daftarkan Page Visibility API
  document.addEventListener('visibilitychange', onVisibilityChange);

  // 2. Daftarkan event aktivitas pengguna untuk AFK detector
  document.addEventListener('mousemove',  onUserActivity);
  document.addEventListener('keydown',    onUserActivity);
  document.addEventListener('mousedown',  onUserActivity);
  document.addEventListener('touchstart', onUserActivity);

  // Mulai hitungan AFK pertama kali
  resetAfkTimer();
}

/* ── Bersihkan semua listener saat ujian selesai ── */
function stopPervasiveMonitoring() {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  document.removeEventListener('mousemove',        onUserActivity);
  document.removeEventListener('keydown',          onUserActivity);
  document.removeEventListener('mousedown',        onUserActivity);
  document.removeEventListener('touchstart',       onUserActivity);
  clearTimeout(afkTimer);
}

/* ════════════════════════════════════════════════
   FITUR 1: TAB VISIBILITY MONITOR
════════════════════════════════════════════════ */
function onVisibilityChange() {
  if (!examRunning) return;

  if (document.hidden) {
    // Pengguna meninggalkan tab
    tabSwitchCount++;
    document.getElementById('stat-tabs').textContent = tabSwitchCount + '×';
    updateBadge('badge-tab', 'danger', '🚨 Keluar Tab');

    // Catat ke behavior log
    const waktu = formatTime(7 * 60 - timerSeconds);
    behaviorLog.push({
      icon: '⚠️',
      text: `Pindah tab ke-${tabSwitchCount} pada menit ke-${waktu}`
    });

    // Kunci jika sudah melebihi batas
    if (tabSwitchCount >= MAX_TAB_SWITCH) {
      lockExam();
    }

  } else {
    // Pengguna kembali ke tab
    if (tabSwitchCount < MAX_TAB_SWITCH) {
      updateBadge('badge-tab', 'warn', '⚠️ Kembali');
      setTimeout(() => updateBadge('badge-tab', 'ok', '👁 Fokus'), 3000);
    }
  }
}

/* ════════════════════════════════════════════════
   FITUR 2: INACTIVITY / IDLE DETECTOR
════════════════════════════════════════════════ */

/* Dipanggil setiap kali ada aktivitas pengguna */
function onUserActivity() {
  if (!examRunning) return;

  // Jika sedang AFK, lanjutkan kembali
  if (isAfk) resumeFromAfk();

  // Reset hitungan mundur AFK
  resetAfkTimer();
  updateBadge('badge-afk', 'ok', '🐇 Aktif');
}

/* Reset timer AFK — dipanggil ulang setiap ada aktivitas */
function resetAfkTimer() {
  clearTimeout(afkTimer);
  afkTimer = setTimeout(triggerAfk, AFK_TIMEOUT);
}

/* Dipanggil saat batas idle tercapai */
function triggerAfk() {
  if (!examRunning) return;

  isAfk        = true;
  afkStartTime = Date.now();
  timerPaused  = true; // Jeda timer ujian (dikelola exam.js)

  updateBadge('badge-afk', 'danger', '😴 AFK');
  document.getElementById('overlay-afk').classList.add('show');
}

/* Dipanggil dari tombol "Saya Kembali" di overlay AFK */
function resumeFromAfk() {
  if (!isAfk) return;

  const durasi = Math.round((Date.now() - afkStartTime) / 1000);
  totalAfkSeconds += durasi;

  behaviorLog.push({
    icon: '😴',
    text: `AFK selama ${durasi} detik pada ${formatTime(7 * 60 - timerSeconds)}`
  });

  document.getElementById('stat-afk').textContent = totalAfkSeconds + ' det';

  isAfk        = false;
  timerPaused  = false; // Lanjutkan timer ujian
  document.getElementById('overlay-afk').classList.remove('show');
  resetAfkTimer();
}

/* ════════════════════════════════════════════════
   KUNCI UJIAN (dipanggil saat tab switch berlebih)
════════════════════════════════════════════════ */
function lockExam() {
  examRunning  = false;
  timerPaused  = true;
  clearInterval(timerInterval);
  behaviorLog.push({
    icon: '🔒',
    text: 'Ujian dikunci otomatis karena melampaui batas perpindahan tab.'
  });
  document.getElementById('lock-count').textContent = MAX_TAB_SWITCH;
  document.getElementById('lock-overlay').classList.add('show');
}

/* Tombol "Lihat Hasil" di lock overlay */
function forceSubmit() {
  document.getElementById('lock-overlay').classList.remove('show');
  submitExam(true);
}

/* ════════════════════════════════════════════════
   HELPER: Update badge status di topbar
════════════════════════════════════════════════ */
function updateBadge(id, type, text) {
  const el = document.getElementById(id);
  el.className  = 'badge badge-' + type;
  el.textContent = text;
}