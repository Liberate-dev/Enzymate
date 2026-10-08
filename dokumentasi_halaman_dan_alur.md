# Dokumentasi Struktur Halaman, Fungsi, dan Alur Antarmuka EnzyMate

Dokumen ini menjelaskan secara terperinci setiap tampilan layar (screen), modal, fungsi interaksi, serta koneksi data dan navigasi antar halaman pada aplikasi **EnzyMate (Mobile-First Prototype)**.

---

## 1. Peta Halaman & Komponen

Aplikasi terbagi menjadi **3 Layar Utama**, **1 Sub-Layar Alur**, dan **4 Modal Dialog Interaktif**:

| No | Nama Halaman / Modal | Tipe Tampilan | File Komponen Utama |
| :--- | :--- | :--- | :--- |
| **1** | **Beranda (Dashboard Toples)** | Layar Utama (Tab 1) | [`App.tsx`](file:///D:/Porto/Enzyme/src/App.tsx) & [`JarIllustration.tsx`](file:///D:/Porto/Enzyme/src/components/JarIllustration.tsx) |
| **2** | **AI Camera Scanner** | Layar Utama (Tab 2) | [`ScannerScreen.tsx`](file:///D:/Porto/Enzyme/src/components/ScannerScreen.tsx) |
| **3A**| **Landing Pengantar Observasi** | Layar Utama (Tab 3 - Awal) | [`ObservationScreen.tsx`](file:///D:/Porto/Enzyme/src/components/ObservationScreen.tsx) |
| **3B**| **Formulir Input Pengamatan** | Sub-Layar (Tab 3 - Lanjutan) | [`ObservationScreen.tsx`](file:///D:/Porto/Enzyme/src/components/ObservationScreen.tsx) |
| **M1**| **Modal Konfirmasi Scan In-App** | Modal Transisi | [`ScannerScreen.tsx`](file:///D:/Porto/Enzyme/src/components/ScannerScreen.tsx) |
| **M2**| **Modal Umpan Balik AI & Safety** | Modal Evaluasi | [`FeedbackModal.tsx`](file:///D:/Porto/Enzyme/src/components/FeedbackModal.tsx) & [`MascotBot.tsx`](file:///D:/Porto/Enzyme/src/components/MascotBot.tsx) |
| **M3**| **Modal Kalkulator Rasio 1:3:10**| Modal Panduan | [`CalculatorModal.tsx`](file:///D:/Porto/Enzyme/src/components/CalculatorModal.tsx) |
| **M4**| **Modal Prestasi & Leaderboard** | Modal Gamifikasi | [`BadgesModal.tsx`](file:///D:/Porto/Enzyme/src/components/BadgesModal.tsx) |

---

## 2. Diagram Alur Koneksi Antar Halaman

Diagram alur berikut mengilustrasikan perpindahan pengguna dan transmisi data antar halaman:

```mermaid
flowchart TD
    subgraph NAV ["Bar Navigasi Bawah"]
        TabHome["🏠 Beranda"]
        TabScan["📷 Scan AI"]
        TabObs["📋 Observasi"]
    end

    subgraph SCREEN_HOME ["Layar 1: Beranda"]
        HomeView["Dashboard Toples Saya"]
        JarCard["Visual Toples Dinamis (Batas 2/3)"]
        HeroCalc["Banner Formula 1:3:10 (Mencolok)"]
        MissionCard["Kartu Misi Hari Ini"]
        RecentLog["Riwayat 3 Pengamatan Terakhir"]
    end

    subgraph SCREEN_SCAN ["Layar 2: AI Scanner"]
        LiveCamera["Viewfinder Kamera + Bounding Box"]
        Presets["Selector Sampel (4 Kelas PRD)"]
        FloatingAI["Floating Badge Deteksi & Saran AI"]
        ModalConfirm["Modal Konfirmasi Bahan In-App"]
    end

    subgraph SCREEN_OBS ["Layar 3: Observasi Harian"]
        ObsLanding["Landing Briefing (3 Langkah Cek)"]
        ObsForm["Formulir Grid 4 Variabel (Warna, Bau, Jamur, Gas)"]
        ObsLocked["Status Terkunci 1x Sehari (Proteksi Wadah)"]
    end

    subgraph MODALS ["Modal Dialog & Bantuan"]
        ModalCalc["Kalkulator Formula 1:3:10"]
        ModalFeedback["Hasil Evaluasi AI Enzy (Mascot + Safety)"]
        ModalBadges["Lencana & Klasemen Sekolah"]
    end

    %% Koneksi Navigasi
    TabHome --> HomeView
    TabScan --> LiveCamera
    TabObs --> ObsLanding

    %% Koneksi dari Beranda
    HeroCalc -->|Klik 'Buka Kalkulator'| ModalCalc
    MissionCard -->|Klik 'Mulai Pengamatan'| ObsLanding
    HomeView -->|Klik Badge Streak / Bintang| ModalBadges
    HomeView -->|Tombol Shortcut Scan| LiveCamera

    %% Koneksi dari Scanner
    LiveCamera --> Presets
    Presets --> FloatingAI
    FloatingAI -->|Klik 'Mulai Fermentasi'| ModalConfirm
    ModalConfirm -->|Opsi 1: 'Hitung Takaran' (Bawa data berat)| ModalCalc
    ModalConfirm -->|Opsi 2: 'Kembali ke Toples'| HomeView

    %% Koneksi dari Observasi
    ObsLanding -->|Klik 'Mulai Isi Kartu'| ObsForm
    ObsForm -->|Klik 'Kembali'| ObsLanding
    ObsForm -->|Submit Form| ModalFeedback
    ModalFeedback -->|Klik 'Kembali ke Dashboard'| HomeView
    ModalFeedback -->|Update State| ObsLocked
    ObsLocked -->|Mode Demo Reset| ObsLanding
```

---

## 3. Rincian Fungsi Setiap Halaman & Elemen UI

### 3.1. Halaman 1: Beranda (Dashboard Toples)
* **Tujuan:** Menjadi pusat pemantauan visual harian anak, memberikan rasa kepemilikan terhadap toples fermentasi mereka, dan memicu motivasi melalui gamifikasi.
* **Elemen & Fungsi Utama:**
  1. **Top Status Bar:**
     * Logo identitas aplikasi (*EnzyMate Cilik*).
     * Nama Siswa (*Rian - SDN 01*).
     * Tombol interaktif **Streak Harian (Api)** dan **Total Bintang**: Mengklik elemen ini langsung membuka modal pencapaian sekolah.
  2. **Kartu Toples Aktif ([JarIllustration.tsx](file:///D:/Porto/Enzyme/src/components/JarIllustration.tsx)):**
     * Ilustrasi toples vektor hidup dengan potongan kulit buah melayang.
     * Garis putus-putus emas bertuliskan **"BATAS AMAN (2/3)"** untuk mendidik anak agar tidak mengisi penuh toples.
     * Status warna cairan yang berubah sesuai umur hari toples.
     * Bilah progres menuju 90 hari panen alami.
  3. **Banner Hero Formula 1:3:10 (Sangat Mencolok):**
     * Desain kontras bergradasi hijau tua (*emerald-to-teal*) dengan tombol aksi besar berwarna kuning keemasan.
     * Berisi pill rasio: **1 Bagian Gula : 3 Bagian Organik : 10 Bagian Air**.
     * Mengarahkan pengguna langsung ke modal kalkulator takaran.
  4. **Kartu Misi Hari Ini:**
     * Menampilkan pengingat buka tutup toples untuk melepaskan tekanan gas.
     * Indikator status apakah observasi sudah dicatat atau masih menunggu.
     * Tombol cepat untuk langsung melompat ke ruang observasi.
  5. **Riwayat Pengamatan Terakhir:**
     * Menampilkan 3 kartu log observasi sebelumnya lengkap dengan poin yang didapat.

---

### 3.2. Halaman 2: AI Camera Scanner ([ScannerScreen.tsx](file:///D:/Porto/Enzyme/src/components/ScannerScreen.tsx))
* **Tujuan:** Memandu pemula memilah bahan secara aman dan mandiri menggunakan teknologi Edge AI 100% luring.
* **Elemen & Fungsi Utama:**
  1. **Viewfinder & Garis Pemindai:**
     * Feed video kamera langsung (`getUserMedia`) jika perangkat mengizinkan.
     * Garis pemindai bergerak (*scanning beam*) dengan sudut bidik (*bounding box*).
  2. **Selector Sampel Bahan (4 Kelas Sesuai PRD):**
     * Menguji 4 kondisi bahan secara langsung:
       * *Kulit Buah Segar* (Kulit Jeruk & Lemon, Kulit Pisang).
       * *Sayur Segar* (Sisa Batang Sawi/Kangkung mentah).
       * *Bahan Tidak Segar/Busuk* (Potongan Pepaya Layu Berjamur Hitam).
       * *Bukan Organik* (Plastik & Sendok).
  3. **Floating AI Result Badge:**
     * Menampilkan nama bahan, kondisi, persentase akurasi Edge AI, dan rekomendasi tindakan.
     * Tombol *"Mulai Fermentasi dengan Bahan Ini"* hanya aktif jika bahan valid/layak.
  4. **Modal Konfirmasi In-App (Pengganti Browser Alert):**
     * Menampilkan selebrasi bahan layak +30 Bintang.
     * Memberikan dua opsi alur lanjutan:
       * **Opsi A (Terhubung):** Melanjutkan ke *Kalkulator Rasio 1:3:10* membawa data gram bahan yang baru dipindai.
       * **Opsi B:** Menyimpan dan kembali ke Dashboard Beranda.

---

### 3.3. Halaman 3A: Landing Pengantar Observasi ([ObservationScreen.tsx](file:///D:/Porto/Enzyme/src/components/ObservationScreen.tsx))
* **Tujuan:** Menghilangkan kebingungan anak dengan memberikan edukasi panduan langkah nyata sebelum mengisi form.
* **Elemen & Fungsi Utama:**
  1. **Maskot Sambutan & Nama Toples:**
     * Robot Enzy menyapa anak dan mengingatkan toples mana yang sedang diamati.
  2. **3 Langkah Tindakan Fisik:**
     * **Langkah 1 (Dengar):** Buka tutup sedikit, dengarkan apakah ada desisan gas.
     * **Langkah 2 (Cium):** Cium aroma apakah asam segar, manis, atau busuk.
     * **Langkah 3 (Amati):** Periksa warna cairan dan keberadaan lapisan jamur putih pitera.
  3. **Tombol Masuk Formulir:**
     * Tombol hijau lebar *"Mulai Isi Kartu Observasi Sekarang"* untuk membuka form input.
     * Jika sudah diisi hari ini, menampilkan kartu status terkunci dengan tombol *"Lihat / Isi Ulang"* dan tombol *"Reset Demo"*.

---

### 3.4. Halaman 3B: Formulir Input Pengamatan ([ObservationScreen.tsx](file:///D:/Porto/Enzyme/src/components/ObservationScreen.tsx))
* **Tujuan:** Antarmuka input data visual yang mudah dipahami anak tanpa perlu mengetik teks panjang.
* **Elemen & Fungsi Utama:**
  1. **Tombol "Kembali ke Pengantar":** Navigasi aman jika anak ingin membaca ulang briefing.
  2. **4 Grid Variabel Observasi:**
     * **Warna:** *Bening Kuning* (Awal) | *Oranye Cokelat* (Ideal) | *Cokelat Gelap* (Molase Matang).
     * **Aroma:** *Asam Segar* | *Manis Gula* | *Alkohol* | *Bau Busuk*.
     * **Permukaan:** *Bersih* | *Lapisan Putih Tipis* (Bagus) | *Jamur Berbulu Warna* (Bahaya/Terkontaminasi).
     * **Gas:** *Banyak* | *Sedikit* | *Tidak Ada*.
  3. **Tombol Kirim ke AI:** Memproses data secara luring ke *Rule Engine*.

---

### 3.5. Modal Dialog Pendukung

#### M2. Umpan Balik AI & Protokol Keamanan ([FeedbackModal.tsx](file:///D:/Porto/Enzyme/src/components/FeedbackModal.tsx))
* Menampilkan reaksi maskot robot (tersenyum gembira, berpikir, waspada, atau cemas).
* Memberikan status toples: *Normal*, *Perlu Diamati*, *Perlu Perhatian*, atau *Kemungkinan Gagal*.
* **Protokol Human-in-the-Loop:** Jika jamur berbulu atau bau busuk terdeteksi, modal mengeluarkan kotak merah peringatan: *"Peringatan Keselamatan: Panggil Guru atau Orang Tua! Anak dilarang menyentuh jamur langsung atau membuang cairan toples."*
* Efek selebrasi confetti jika hasil observasi normal & sehat.

#### M3. Kalkulator Rasio 1:3:10 ([CalculatorModal.tsx](file:///D:/Porto/Enzyme/src/components/CalculatorModal.tsx))
* Menghitung secara presisi gram gula merah, gram bahan organik, dan ml air bersih.
* Pilihan tombol cepat kapasitas toples (1L, 2L, 3L, 5L) atau slider kustom hingga 15L.
* Memvisualisasikan batas pengisian 2/3 kapasitas toples dan menyisakan 1/3 ruang gas.
* Dapat menerima konteks bahan dari hasil pemindaian AI Scanner.

#### M4. Prestasi & Klasemen Sekolah ([BadgesModal.tsx](file:///D:/Porto/Enzyme/src/components/BadgesModal.tsx))
* Pelacak dampak lingkungan: Total gram sampah organik yang diselamatkan dari tempat sampah (SDG 12 & 13).
* Lencana penghargaan anak: *Detektif Dini*, *Rentetan Disiplin*, *Ahli Eco-Enzyme*, dan *Pahlawan Pangan*.
* Papan peringkat antar-kelas sekolah dasar untuk memupuk semangat kolaborasi.

---

## 4. Alur Data & Penyimpanan Lokal
* Seluruh data toples (`enzymate_jar`), data progres pengguna (`enzymate_user`), dan status harian (`enzymate_observed_today`) disimpan secara otomatis di **`localStorage`** peramban.
* Tidak ada pengiriman data ke server luar (*zero cloud transmission*), menjamin keamanan privasi anak dan kepatuhan penuh terhadap standar *offline-first*.
* Untuk keperluan demonstrasi atau pengujian berulang, tombol **"Reset Demo"** disediakan pada halaman observasi agar evaluator dapat mencoba berbagai kombinasi tanpa harus menunggu 24 jam.
