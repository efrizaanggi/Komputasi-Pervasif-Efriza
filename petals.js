/**
 * petals.js  (assets/)
 *
 * Animasi bunga sakura jatuh sebagai background ambient.
 * Berjalan di atas <canvas id="petal-canvas"> yang di-overlay
 * di atas seluruh halaman (z-index: 0, pointer-events: none).
 *
 * Teknik: Canvas 2D API + requestAnimationFrame loop
 * Setiap "kelopak" adalah ellipse kecil yang jatuh dari atas
 * dengan kecepatan, arah drift, dan rotasi acak.
 */

(function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  const ctx    = canvas.getContext('2d');

  /* Sesuaikan ukuran canvas ke jendela */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Palet warna kelopak */
  const COLORS = [
    '#e8a0b4', // rose
    '#f5d5e2', // rose light
    '#ddd5f0', // lavender
    '#c9a98b', // latte
    '#f2c4d4', // pink blush
    '#d4a8c7'  // mauve
  ];

  /* Buat satu objek kelopak baru */
  function createPetal() {
    return {
      x:        Math.random() * canvas.width,
      y:        -20,
      size:     Math.random() * 10 + 6,         // Radius 6–16px
      speed:    Math.random() * 1.2 + 0.4,      // Kecepatan jatuh
      drift:    Math.random() * 1.5 - 0.75,     // Gerak horizontal
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,   // Kecepatan rotasi
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity:  Math.random() * 0.6 + 0.3
    };
  }

  /* Inisialisasi kelopak awal (tersebar di seluruh layar) */
  let petals = [];
  for (let i = 0; i < 18; i++) {
    const p = createPetal();
    p.y = Math.random() * canvas.height; // Mulai dari posisi acak
    petals.push(p);
  }

  /* Gambar satu kelopak ke canvas */
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    // Bentuk ellipse: lebar penuh, tinggi 55% dari lebar
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* Loop animasi utama */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];

      // Perbarui posisi & rotasi
      p.y        += p.speed;
      p.x        += p.drift;
      p.rotation += p.rotSpeed;

      drawPetal(p);

      // Jika sudah keluar bawah layar, buat ulang dari atas
      if (p.y > canvas.height + 20) {
        petals[i] = createPetal();
      }
    }

    // Sesekali tambah kelopak baru (maks 30)
    if (Math.random() < 0.02 && petals.length < 30) {
      petals.push(createPetal());
    }

    requestAnimationFrame(loop);
  }

  loop();
})();