## 1. Ringkasan Eksekutif
EnzyMate adalah aplikasi seluler yang dirancang untuk mendampingi anak-anak dalam pembuatan eco-enzyme dari sisa buah dan sayur segar[cite: 1, 7]. Aplikasi ini memecahkan masalah tingginya angka kegagalan pembuatan eco-enzyme akibat kurangnya pemantauan, sekaligus membangun kedekatan anak dengan bahan organik segar[cite: 1]. Menggunakan teknologi *Edge AI* (AI pengenal gambar dan AI berbasis aturan) yang beroperasi 100% tanpa internet, EnzyMate memastikan pemrosesan lokal yang cepat, aman, dan berjejak karbon rendah[cite: 11].

## 2. Tujuan & Metrik Keberhasilan
**Tujuan:**
* Memandu pemula (khususnya anak-anak) memilah bahan, membuat, dan memantau fermentasi eco-enzyme[cite: 2, 10].
* Mengurangi limbah pangan rumah tangga/sekolah sejalan dengan SDG 12, SDG 13, dan SDG 11[cite: 2, 21].

**Metrik Keberhasilan (Rencana):**
* **Akurasi AI:** Persentase ketepatan pemindai gambar pada foto uji[cite: 5].
* **Retensi & Disiplin:** Jumlah pengisian kartu observasi yang sesuai dengan jadwal[cite: 5].
* **Dampak Lingkungan:** Total berat sisa kulit/potongan organik yang berhasil diproses ke dalam toples[cite: 5].

## 3. Profil Pengguna
* **Pengguna Utama (Siswa/Anak):** Bertugas memindai bahan baku, membuka tutup toples untuk observasi harian, dan memasukkan data kondisi fermentasi ke aplikasi[cite: 19].
* **Pendamping (Guru/Orang Tua):** Mengawasi pengumpulan bahan, memverifikasi peringatan kegagalan dari aplikasi, membuang isi toples yang terkontaminasi, dan menentukan tindakan akhir saat panen[cite: 19].

## 4. Rincian Fitur Utama

### 4.1. AI Camera Scanner (Pemindai Bahan)
* **Fungsi:** Mendeteksi bahan organik menggunakan kamera perangkat dan mengklasifikasikannya secara lokal[cite: 2, 11].
* **UI/UX:** Tampilan kamera penuh dengan *bounding box* pemindaian[cite: 22]. Hasil muncul dalam bentuk label mengambang (Kategori, Kondisi, Saran AI)[cite: 13, 22]. Tombol "Mulai Fermentasi" muncul jika bahan valid[cite: 22].
* **Logika Aturan:**
  * Mengenali 4 kelas: Kulit buah segar, sayur segar, bahan tidak segar (layu/berjamur), dan objek lainnya (tangan/latar)[cite: 3, 14].
  * Jika segar: Saran "Layak untuk Eco-Enzyme"[cite: 3].
  * Jika tidak segar: Saran "Arahkan ke kompos, tanyakan pendamping"[cite: 14].

### 4.2. Panduan & Penjadwalan
* **Fungsi:** Mencatat tanggal mulai dan memberikan panduan proporsi pengisian wadah (maksimal 2/3 kapasitas)[cite: 4, 6].
* **Keluaran:** Jadwal otomatis (misi harian) untuk pelepasan gas dan observasi berkala[cite: 6, 12].

### 4.3. Observasi Harian (Kartu Pengamatan)
* **Fungsi:** Formulir input visual bagi anak untuk melaporkan kondisi fermentasi, dibatasi 1x per jadwal agar wadah tidak sering dibuka[cite: 4, 15].
* **Variabel Input:**
  * **Warna:** Bening kekuningan, Oranye kecokelatan, Cokelat tua[cite: 3, 15].
  * **Aroma:** Asam segar, Manis, Alkohol, Busuk[cite: 3, 15].
  * **Permukaan (Jamur):** Bersih, Putih tipis, Jamur berbulu warna[cite: 3, 15].
  * **Gas:** Banyak, Sedikit, Tidak ada[cite: 3, 15].
* **UI/UX:** Menu *grid* dengan ikon untuk setiap variabel[cite: 15, 22]. Terdapat *progress bar* untuk "Misi Hari Ini"[cite: 22].

### 4.4. Mesin Logika (Umpan Balik AI)
* **Fungsi:** Memproses input observasi harian menggunakan *Rule-Based Engine* transparan[cite: 11, 17].
* **Kondisi Status:**
  * **Berjalan Normal:** Aroma normal, permukaan bersih/putih tipis[cite: 17].
  * **Perlu Diamati:** Warna lambat berubah, aroma wajar[cite: 17].
  * **Perlu Perhatian:** Aroma menyengat (alkohol) atau cairan menyusut[cite: 3, 16].
  * **Kemungkinan Gagal:** Aroma busuk / jamur berbulu[cite: 17]. Sistem menandai butuh intervensi pendamping[cite: 17].
* **UI/UX:** Menampilkan maskot AI robot, status stoples, dan *progress bar* fermentasi[cite: 22].

### 4.5. Gamifikasi & Pencapaian
* **Fungsi:** Membangun kebiasaan melalui *reward system* tanpa mendorong aktivitas berlebihan (mengutamakan ketelitian dan kedisiplinan)[cite: 4, 18].
* **Mekanisme:**
  * **Poin & Streak:** Ditampilkan di *dashboard* observasi[cite: 22].
  * **Lencana (Badges):** Seperti "Rentetan Disiplin", "Detektif Dini", "Ahli Eco", "Pencari Poin", dan "Kreator"[cite: 18, 22].
  * **Leaderboard:** Sistem kompetisi antar kelas/tim toples sekolah[cite: 18].

## 5. Kebutuhan Teknis & Keamanan
* **Infrastruktur:** Aplikasi berjalan sepenuhnya secara luring (*offline*)[cite: 11, 20].
* **Model Machine Learning:** Model pengenalan gambar berukuran kecil yang dioptimalkan untuk perangkat seluler (*Edge AI*), tanpa pengiriman data ke server (*cloud*)[cite: 4, 11].
* **Keamanan Fisik (Human-in-the-Loop):** Anak dilarang menyentuh jamur, mencicipi, atau membuang isi toples sendiri. Intervensi wajib dilakukan oleh pengguna berstatus Pendamping Dewasa saat sistem mendeteksi kegagalan atau kesiapan panen[cite: 4, 19].
