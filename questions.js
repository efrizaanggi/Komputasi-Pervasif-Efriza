/**
 * questions.js
 *
 * Menyimpan semua data soal ujian.
 * Jika ingin mengganti soal, cukup edit file ini saja
 * tanpa menyentuh file logika lainnya.
 *
 * Format setiap soal:
 *   text    : String — teks pertanyaan
 *   choices : Array[4] — pilihan jawaban A, B, C, D
 *   correct : Number — index jawaban benar (0=A, 1=B, 2=C, 3=D)
 */

const QUESTIONS = [
  {
    text: 'Dalam psikologi kognitif, istilah "Attentional Spotlight" mengacu pada kemampuan otak untuk…',
    choices: [
      'Memproses seluruh informasi visual secara bersamaan tanpa prioritas',
      'Mengarahkan sumber daya perhatian ke area tertentu seperti sorotan lampu panggung',
      'Menyimpan memori jangka panjang secara otomatis tanpa usaha sadar',
      'Mengalihkan perhatian ke stimulus paling keras di lingkungan'
    ],
    correct: 1
  },
  {
    text: 'Fenomena "Presence" dalam komputasi pervasif paling tepat dianalogikan dengan konsep psikologi…',
    choices: [
      'Disonansi kognitif — ketidaksesuaian antara keyakinan dan perilaku',
      'Flow state — kondisi seseorang terserap penuh dalam suatu aktivitas',
      'Dunning-Kruger effect — overestimasi kemampuan diri sendiri',
      'Confirmation bias — mencari informasi yang mengkonfirmasi keyakinan lama'
    ],
    correct: 1
  },
  {
    text: 'Seorang mahasiswa yang terus mengecek ponselnya saat ujian menunjukkan gejala psikologis yang dikenal sebagai…',
    choices: [
      'Selective Attention yang kuat dan terlatih',
      'Nomophobia — kecemasan berlebih saat terpisah dari smartphone',
      'Hyperfocus — kemampuan berkonsentrasi luar biasa pada satu hal',
      'Metacognition — kemampuan memantau proses berpikir sendiri'
    ],
    correct: 1
  },
  {
    text: 'Dalam desain sistem context-aware, deteksi "idle user" paling berhubungan dengan teori psikologi…',
    choices: [
      'Teori Motivasi Maslow — hierarki kebutuhan manusia',
      'Embodied Cognition — pikiran dipengaruhi oleh kondisi fisik tubuh',
      'Behaviorisme — perilaku adalah respons terukur terhadap stimulus lingkungan',
      'Psikoanalisis Freud — dorongan bawah sadar menentukan perilaku'
    ],
    correct: 2
  },
  {
    text: 'Mengapa sistem pengawasan ujian berbasis AI yang terlalu ketat justru bisa menurunkan performa akademik peserta?',
    choices: [
      'Karena AI tidak mampu membedakan kecurangan dan aktivitas normal',
      'Karena tekanan pengawasan memicu anxiety yang mengganggu working memory dan fungsi kognitif',
      'Karena mahasiswa menjadi terlalu percaya diri saat diawasi sistem otomatis',
      'Karena sistem AI selalu bias terhadap mahasiswa dengan latar belakang tertentu'
    ],
    correct: 1
  }
];