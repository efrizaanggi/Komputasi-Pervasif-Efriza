# 🧠 Smart Quiz Exam — Context-Aware Pervasive Computing System

Project ini adalah aplikasi **simulasi ujian online (E-Exam)** berbasis web yang dilengkapi dengan fitur **context-aware / pervasive computing**, yaitu sistem yang dapat mendeteksi aktivitas, perhatian, dan perilaku pengguna secara real-time selama ujian berlangsung.

---

## 📌 Deskripsi Project

Aplikasi ini mensimulasikan sistem ujian online dengan fitur pengawasan cerdas, seperti:

- Deteksi perpindahan tab (anti-cheating system)
- Deteksi user idle / AFK (absence detection)
- Monitoring aktivitas mouse (heatmap tracking)
- Logging perilaku pengguna selama ujian
- Sistem auto-lock jika terjadi pelanggaran berulang

---

## 🚀 Fitur Utama

### 1. Login Ujian
- Input Nama & NIM
- Mulai ujian dengan tombol “Mulai Ujian”

### 2. Sistem Ujian (5 Soal Pilihan Ganda)
- Navigasi soal
- Progress bar
- Timer 7 menit
- Penyimpanan jawaban otomatis

### 3. Smart Pervasive Monitoring
- 🔴 Tab Switch Detection (Page Visibility API)
- 🟡 AFK / Idle Detection (20 detik tanpa aktivitas)
- 🔒 Auto Lock jika pindah tab > 3 kali
- 📋 Behavior logging real-time

### 4. Mouse Activity Heatmap
- Tracking pergerakan mouse
- Visualisasi intensitas aktivitas
- Ditampilkan di halaman ujian & hasil

### 5. Result System
- Skor otomatis (0–100)
- Review jawaban benar/salah
- Behavior diary lengkap
- Heatmap final

---

## Teknologi yang Digunakan

- HTML5
- CSS3 (custom theme UI)
- JavaScript (Vanilla JS)
- Canvas API (heatmap & animation)
- Page Visibility API
- DOM Events (mousemove, keydown, etc.)

---
