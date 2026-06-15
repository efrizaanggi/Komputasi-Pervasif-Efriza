/**
 * result.js
 *
 * Menangani semua tampilan di Halaman Hasil ujian:
 * - Menghitung & menampilkan skor akhir
 * - Animasi lingkaran skor (score ring)
 * - Review jawaban per soal (benar / salah / tidak dijawab)
 * - Behavior Diary: ringkasan log perilaku selama ujian
 * - Menampilkan heatmap aktivitas mouse (final snapshot)
 */

/**
 * Fungsi utama membangun halaman hasil.
 * Dipanggil dari exam.js setelah ujian selesai.
 */
function buildResult() {
  const { score, correct, answerHTML } = hitungSkor();

  // ── Isi header hasil ──
  document.getElementById('res-score').textContent  = score;
  document.getElementById('res-name').textContent   = `${userName} · ${userNim}`;
  document.getElementById('res-verdict').textContent = getVerdict(score);

  // ── Animasi lingkaran skor ──
  animasiScoreRing(score);

  // ── Review jawaban ──
  document.getElementById('res-answers').innerHTML = answerHTML;

  // ── Behavior Diary ──
  document.getElementById('res-diary').innerHTML = buildDiary();

  // ── Heatmap final ──
  setTimeout(() => drawHeatmap('result-heatmap'), 300);
}

/* ════════════════════════════════════════════════
   HITUNG SKOR
════════════════════════════════════════════════ */
function hitungSkor() {
  let correct = 0;
  const letters = ['A', 'B', 'C', 'D'];

  const answerHTML = QUESTIONS.map((q, i) => {
    const jawaban   = answers[i];
    const benar     = jawaban === q.correct;
    const tidakDiisi = jawaban === null;

    if (benar) correct++;

    // Tentukan kelas & ikon tampilan
    let cls   = tidakDiisi ? 'skipped' : (benar ? 'correct' : 'wrong');
    let icon  = tidakDiisi ? '○'       : (benar ? '✓'       : '✗');
    let detail;

    if (tidakDiisi) {
      detail = 'Tidak dijawab';
    } else if (benar) {
      detail = `Benar! Pilihan ${letters[jawaban]}`;
    } else {
      detail =
        `Salah — kamu pilih <strong>${letters[jawaban]}</strong>, ` +
        `jawaban benar: <strong>${letters[q.correct]}</strong>`;
    }

    return `
      <div class="answer-item ${cls}">
        <span class="answer-icon">${icon}</span>
        <div class="answer-text">
          <strong>Soal ${i + 1}:</strong> ${detail}
        </div>
      </div>`;
  }).join('');

  return { score: correct * 20, correct, answerHTML };
}

/* ════════════════════════════════════════════════
   VERDICT berdasarkan skor
════════════════════════════════════════════════ */
function getVerdict(score) {
  if (score === 100) return '🌟 Sempurna! Kamu benar-benar hadir dan fokus.';
  if (score >= 80)   return '🌸 Sangat baik! Hanya sedikit yang terlewat.';
  if (score >= 60)   return '🌿 Lumayan. Perhatian lebih bisa meningkatkan hasil.';
  if (score >= 40)   return '🍂 Perlu belajar lagi. Jangan terganggu saat ujian.';
  return '😔 Coba lagi dengan lebih fokus ya!';
}

/* ════════════════════════════════════════════════
   ANIMASI SCORE RING (SVG circle)
════════════════════════════════════════════════ */
function animasiScoreRing(score) {
  const keliling = 364.4; // 2 × π × r (r=58)
  const offset   = keliling - (score / 100) * keliling;

  // Delay kecil agar transisi CSS terlihat
  setTimeout(() => {
    document.getElementById('score-arc').style.strokeDashoffset = offset;
  }, 300);
}

/* ════════════════════════════════════════════════
   BUILD BEHAVIOR DIARY
════════════════════════════════════════════════ */
function buildDiary() {
  let html = '';

  // ── Tab switch ──
  if (tabSwitchCount === 0) {
    html += entryDiary('✅',
      'Kamu tidak pernah berpindah tab selama ujian. Fokus yang luar biasa!');
  } else {
    const terkunci = tabSwitchCount >= MAX_TAB_SWITCH ? ' — ujian dikunci otomatis.' : '';
    html += entryDiary('⚠️',
      `Berpindah tab sebanyak <span class="violation-chip">${tabSwitchCount}×</span>${terkunci}`);
  }

  // ── AFK ──
  if (totalAfkSeconds === 0) {
    html += entryDiary('✅', 'Tidak terdeteksi AFK — kamu aktif sepanjang ujian.');
  } else {
    html += entryDiary('😴',
      `Total waktu AFK: <span class="violation-chip">${totalAfkSeconds} detik</span>. ` +
      'Timer dijeda selama periode tidak aktif.');
  }

  // ── Mouse activity ──
  html += entryDiary('🖱',
    `Total gerakan mouse tercatat: <span class="violation-chip">${mouseMoveCount}×</span>. ` +
    'Heatmap menunjukkan distribusi fokus area layarmu.');

  // ── Entri tambahan dari behaviorLog ──
  behaviorLog.forEach(entry => {
    html += entryDiary(entry.icon, entry.text);
  });

  // ── Waktu pengerjaan ──
  const waktuTerpakai = 7 * 60 - timerSeconds;
  html += entryDiary('⏱',
    `Waktu pengerjaan: <span class="violation-chip">${formatTime(waktuTerpakai)}</span> dari 7 menit.`);

  return html;
}

/* Helper: buat satu baris diary */
function entryDiary(icon, text) {
  return `
    <div class="diary-entry">
      <span class="diary-icon">${icon}</span>
      <span>${text}</span>
    </div>`;
}