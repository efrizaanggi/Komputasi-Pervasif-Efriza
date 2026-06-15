/**
 * heatmap.js
 *
 * FITUR BONUS: Mouse Activity Heatmap
 * ─────────────────────────────────────────────────────────
 * Melacak pergerakan kursor mouse dan memvisualisasikannya
 * sebagai peta panas (heatmap) berwarna pada kanvas.
 *
 * Cara kerja:
 * - Layar dibagi menjadi grid COLS × ROWS sel
 * - Setiap kali mouse bergerak, sel yang sesuai dengan
 *   posisi kursor ditambah nilainya (increment)
 * - Canvas digambar ulang setiap 300ms dengan warna
 *   berdasarkan intensitas (frekuensi gerakan)
 *
 * Warna:
 * - Area sering disentuh → warna rose/merah muda gelap
 * - Area jarang disentuh → warna lavender terang
 * - Tidak ada gerakan    → transparan
 */

/* ── Grid konfigurasi ── */
const HEATMAP_COLS = 20;
const HEATMAP_ROWS = 5;

/* ── Array data: satu nilai per sel grid ── */
let heatmapData = Array(HEATMAP_COLS * HEATMAP_ROWS).fill(0);

/* ── Counter gerakan mouse untuk Live Stats ── */
let mouseMoveCount = 0;

/* ── Throttle agar tidak menggambar ulang terlalu sering ── */
let lastHeatmapDraw = Date.now();

/* ── Dipanggil oleh startPervasiveMonitoring() di exam.js ── */
function startHeatmapTracking() {
  document.addEventListener('mousemove', onMouseMoveHeatmap);
}

/* ── Bersihkan saat ujian selesai ── */
function stopHeatmapTracking() {
  document.removeEventListener('mousemove', onMouseMoveHeatmap);
}

/* Dipanggil setiap gerakan mouse */
function onMouseMoveHeatmap(e) {
  mouseMoveCount++;
  document.getElementById('stat-mouse').textContent = mouseMoveCount;

  // Konversi posisi pixel → indeks sel grid
  const col = Math.min(
    HEATMAP_COLS - 1,
    Math.floor((e.clientX / window.innerWidth) * HEATMAP_COLS)
  );
  const row = Math.min(
    HEATMAP_ROWS - 1,
    Math.floor((e.clientY / window.innerHeight) * HEATMAP_ROWS)
  );

  heatmapData[row * HEATMAP_COLS + col]++;

  // Gambar ulang hanya setiap 300ms (throttle)
  const now = Date.now();
  if (now - lastHeatmapDraw > 300) {
    drawHeatmap('heatmap-canvas');
    lastHeatmapDraw = now;
  }
}

/**
 * Menggambar heatmap ke elemen <canvas> berdasarkan ID.
 * Bisa dipanggil untuk canvas di exam maupun di hasil.
 *
 * @param {string} canvasId - ID elemen canvas target
 */
function drawHeatmap(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W   = canvas.clientWidth  || 180;
  const H   = canvas.clientHeight || 80;

  // Atur ukuran internal canvas sesuai tampilan
  canvas.width  = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);

  const maxVal = Math.max(1, ...heatmapData);
  const cellW  = W / HEATMAP_COLS;
  const cellH  = H / HEATMAP_ROWS;

  for (let r = 0; r < HEATMAP_ROWS; r++) {
    for (let c = 0; c < HEATMAP_COLS; c++) {
      const val       = heatmapData[r * HEATMAP_COLS + c];
      const intensity = val / maxVal;

      if (intensity < 0.01) continue; // Lewati sel kosong

      // Warna: rose (banyak gerakan) → lavender (sedikit gerakan)
      const hue = 340 - intensity * 60; // 340° rose → 280° lavender
      ctx.globalAlpha = 0.15 + intensity * 0.75;
      ctx.fillStyle   = `hsl(${hue}, 65%, 65%)`;
      ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
    }
  }

  ctx.globalAlpha = 1; // Reset alpha
}

/* Reset data heatmap (dipanggil saat ujian diulang) */
function resetHeatmap() {
  heatmapData    = Array(HEATMAP_COLS * HEATMAP_ROWS).fill(0);
  mouseMoveCount = 0;
  lastHeatmapDraw = Date.now();
}