# design_system.md

## 1. Prinsip Desain
* **Organik & Segar:** Menggunakan nuansa alam untuk mencerminkan bahan organik dan lingkungan.
* **Ramah Anak & Edukatif:** Menggunakan sudut membulat (*rounded corners*), ilustrasi tebal, ikonografi yang jelas, dan maskot karakter pendamping[cite: 22].
* **Jelas & Transparan:** Umpan balik AI harus mudah dibaca dengan warna indikator yang merepresentasikan status (misal: hijau untuk aman, oranye/merah untuk peringatan)[cite: 16, 22].

## 2. Palet Warna
* **Primary (Brand):** Hijau Segar (`#4CAF50` atau ekuivalen) - Digunakan untuk latar belakang utama aplikasi, *header*, dan tombol aksi positif (Mulai Fermentasi, Kirim Laporan)[cite: 22].
* **Secondary:** Putih/Off-White (`#F9F9F9`) - Digunakan untuk latar belakang area konten dan kartu agar teks mudah dibaca[cite: 22].
* **Semantic (Umpan Balik AI):**
  * *Success/Normal:* Hijau Daun (`#2E7D32`)[cite: 22].
  * *Warning/Perlu Perhatian:* Oranye (`#FF9800`) - Digunakan untuk label peringatan dan badge Pendamping Dewasa[cite: 16, 22].
  * *Error/Gagal:* Merah Halus - Untuk indikasi jamur berbahaya atau bau busuk[cite: 3].
* **Aksen Gamifikasi:** Emas/Kuning (`#FFC107`) - Untuk ikon poin (bintang), indikator *streak* (api), dan lencana pencapaian[cite: 22].

## 3. Tipografi
* **Keluarga Huruf:** *Sans-serif* modern dengan tingkat keterbacaan tinggi (contoh: Poppins, Nunito, atau SF Pro Rounded).
* **Hierarki:**
  * *Header/Judul Menu:* Tebal (*Bold*), warna putih di atas latar hijau (contoh: "AI Camera Scanner", "Observasi Harian")[cite: 22].
  * *Label Konten:* Medium, warna teks gelap (contoh: "Kategori", "Warna Fermentasi")[cite: 22].
  * *Deskripsi/Saran:* Reguler, ukuran lebih kecil untuk penjelasan detail tindakan[cite: 16, 22].

## 4. Ikonografi & Ilustrasi
* **Gaya Ikon:** Ikon vektor 2D dengan garis luar (*outline*) lembut dan isi warna solid yang ceria[cite: 15, 22].
* **Komponen Ikon:**
  * *Observasi:* Palet warna (untuk Warna), Hidung (untuk Aroma), Kaca Pembesar (untuk Permukaan), Meteran (untuk Gas)[cite: 15].
  * *Status:* Centang hijau (valid/layak), perisai dengan ikon orang dewasa (indikasi butuh pendamping)[cite: 22].
  * *Bahan:* Pisang, apel, tomat (untuk pemindai dan tombol input)[cite: 22].
* **Maskot:** Robot AI ramah berwarna biru muda dengan senyum, digunakan di halaman "Umpan Balik AI" untuk memperkuat kesan pendamping cerdas yang tidak menakutkan[cite: 22].

## 5. Komponen UI
### 5.1. Cards (Kartu Konten)
* Menggunakan latar belakang putih bersih dengan sudut sangat membulat (*border-radius* ~16px hingga 24px)[cite: 22].
* Dilengkapi dengan bayangan jatuh (*drop shadow*) halus untuk memberikan kesan mengambang dan memisahkan antar segmen interaksi[cite: 22].

### 5.2. Floating Labels (Hasil Pemindai)
* Label hasil scan AI melayang di atas *viewfinder* kamera[cite: 22].
* Latar belakang hijau dengan ikon pendukung di sebelah kiri, dan struktur teks "Judul: Nilai" (misal: "Kondisi: Kulit Buah Segar")[cite: 22].

### 5.3. Progress Bars & Trackers
* Bilah progres tebal dan bersudut membulat.
* Digunakan untuk melacak "Misi Hari Ini" dan "Progres Fermentasi" (menunjukkan persentase penyelesaian)[cite: 22].

### 5.4. Lencana & Gamifikasi (Badges)
* Ditampilkan dalam bentuk sirkular (medali) di bagian bawah layar profil atau umpan balik[cite: 22].
* Elemen *streak* harian menggunakan blok khusus dengan ikon api dan jumlah poin dengan ikon bintang yang mencolok[cite: 22].
