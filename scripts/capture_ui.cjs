const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 4173;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'ui_renders');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading ' + req.url);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=2',
      '--window-size=430,932'
    ],
    defaultViewport: {
      width: 430,
      height: 932,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    }
  });

  const page = await browser.newPage();

  async function clickButtonWithText(textSubstring) {
    const clicked = await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find((b) => b.textContent && b.textContent.includes(text));
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, textSubstring);
    return clicked;
  }

  try {
    // -------------------------------------------------------------
    // 1. Initial Launch: Prompt Tour Guide
    // -------------------------------------------------------------
    console.log('[1] Menyiapkan Onboarding Tour Prompt...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(600);

    console.log('Capturing: 01_onboarding_tour_prompt.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01_onboarding_tour_prompt.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 2. Start Interactive Tour Spotlight
    // -------------------------------------------------------------
    console.log('[2] Menjalankan Tur Panduan Interaktif...');
    await clickButtonWithText('Mulai Tur Panduan');
    await sleep(600);

    console.log('Capturing: 02_onboarding_tour_guide.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02_onboarding_tour_guide.png'),
      fullPage: false
    });

    // Selesaikan tur & set status agar tidak muncul lagi
    await page.evaluate(() => {
      localStorage.setItem('enzymate_tour_prompted', 'true');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(600);

    // -------------------------------------------------------------
    // 3A. Landing Page Awal: Daftar Koleksi Toples Aktif
    // -------------------------------------------------------------
    console.log('[3A] Mengambil screenshot Landing Page (List Toples Aktif)...');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03a_landing_list_toples_aktif.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 3B. Landing Page: Tab Riwayat Panen & Arsip Toples Selesai
    // -------------------------------------------------------------
    console.log('[3B] Berpindah ke Tab Riwayat Panen...');
    await clickButtonWithText('Riwayat Panen');
    await sleep(500);

    console.log('Capturing: 03b_landing_riwayat_toples_panen.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03b_landing_riwayat_toples_panen.png'),
      fullPage: false
    });

    // Kembalikan ke tab Semua
    await clickButtonWithText('Semua');
    await sleep(400);

    // -------------------------------------------------------------
    // 3C. Tampilan Detail Toples Terpilih (Setelah Toples Dibuka)
    // -------------------------------------------------------------
    console.log('[3C] Membuka toples untuk melihat Detail Dashboard Toples...');
    await clickButtonWithText('Buka Toples');
    await sleep(600);

    console.log('Capturing: 03c_detail_toples_terpilih.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03c_detail_toples_terpilih.png'),
      fullPage: false
    });

    // Scroll ke bawah di Detail Toples untuk melihat Misi & Riwayat Pengamatan
    console.log('[3D] Mengambil scroll Detail Toples (Misi & Riwayat)...');
    await page.evaluate(() => {
      const scrollEl = document.getElementById('main-scroll-container');
      if (scrollEl) scrollEl.scrollTo({ top: 380, behavior: 'instant' });
    });
    await sleep(400);

    console.log('Capturing: 03d_detail_toples_misi_dan_riwayat.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03d_detail_toples_misi_dan_riwayat.png'),
      fullPage: false
    });

    // Kembalikan scroll ke atas
    await page.evaluate(() => {
      const scrollEl = document.getElementById('main-scroll-container');
      if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: 'instant' });
    });
    await sleep(300);

    // -------------------------------------------------------------
    // 4. Modal Kalkulator Formula 1:3:10
    // -------------------------------------------------------------
    console.log('[4] Membuka Modal Kalkulator...');
    await clickButtonWithText('Buka Kalkulator Toples');
    await sleep(500);

    console.log('Capturing: 04_modal_kalkulator_rasio.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04_modal_kalkulator_rasio.png'),
      fullPage: false
    });

    // Tutup modal kalkulator
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const xBtn = btns.find(b => b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(400);

    // -------------------------------------------------------------
    // 5. Modal Lencana & Prestasi Siswa
    // -------------------------------------------------------------
    console.log('[5] Membuka Modal Prestasi & Lencana...');
    await page.evaluate(() => {
      const statsBtn = document.getElementById('tour-header-stats');
      if (statsBtn) statsBtn.click();
    });
    await sleep(500);

    console.log('Capturing: 05_modal_prestasi_lencana.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05_modal_prestasi_lencana.png'),
      fullPage: false
    });

    // Scroll di dalam modal untuk melihat Klasemen Sekolah
    console.log('[6] Scroll ke Klasemen Sekolah...');
    await page.evaluate(() => {
      const modal = document.querySelector('.overflow-y-auto');
      if (modal) modal.scrollTo({ top: 280, behavior: 'instant' });
    });
    await sleep(300);

    console.log('Capturing: 06_modal_klasemen_sekolah.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06_modal_klasemen_sekolah.png'),
      fullPage: false
    });

    // Tutup modal lencana
    await clickButtonWithText('Tutup');
    await sleep(400);

    // -------------------------------------------------------------
    // 5b. Modal Daftar Koleksi Toples Fermentasi
    // -------------------------------------------------------------
    console.log('[Koleksi] Membuka Modal Daftar Koleksi Toples...');
    await clickButtonWithText('Ganti Toples');
    await sleep(500);

    console.log('Capturing: 15_modal_daftar_koleksi_toples.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '15_modal_daftar_koleksi_toples.png'),
      fullPage: false
    });

    // Buka Modal Tambah Toples Baru dari dalam modal koleksi
    console.log('[Koleksi] Membuka Modal Buat Toples Baru...');
    await clickButtonWithText('Tambah Toples Baru');
    await sleep(500);

    console.log('Capturing: 16_modal_buat_toples_baru.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '16_modal_buat_toples_baru.png'),
      fullPage: false
    });

    // Tutup modal buat toples baru
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const xBtn = btns.find(b => b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(400);

    // -------------------------------------------------------------
    // 6. Layar Pemindai Kamera AI (Preset Segar)
    // -------------------------------------------------------------
    console.log('[8] Berpindah ke tab AI Camera Scanner...');
    await clickButtonWithText('Scan AI');
    await sleep(600);

    console.log('Capturing: 07_scanner_ai_kulit_jeruk.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '07_scanner_ai_kulit_jeruk.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 7. Pemindai Kamera AI (Preset Tidak Layak / Busuk)
    // -------------------------------------------------------------
    console.log('[9] Memilih sampel bahan busuk (Pepaya berjamur)...');
    await clickButtonWithText('Potongan Pepaya Layu');
    await sleep(600);

    console.log('Capturing: 08_scanner_ai_bahan_busuk.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '08_scanner_ai_bahan_busuk.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 8. Modal Konfirmasi In-App Scanner
    // -------------------------------------------------------------
    console.log('[10] Membuka Modal Konfirmasi In-App Scanner...');
    await clickButtonWithText('Kulit Jeruk & Lemon');
    await sleep(500);
    await clickButtonWithText('Mulai Fermentasi dengan Bahan Ini');
    await sleep(500);

    console.log('Capturing: 09_scanner_modal_konfirmasi.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '09_scanner_modal_konfirmasi.png'),
      fullPage: false
    });

    // Tutup modal konfirmasi dengan klik "Simpan & Kembali ke Beranda"
    console.log('Menutup modal konfirmasi scan...');
    await clickButtonWithText('Simpan & Kembali ke Beranda');
    await sleep(500);

    // -------------------------------------------------------------
    // 9. Layar Observasi Harian - Landing Briefing
    // -------------------------------------------------------------
    console.log('[11] Berpindah ke tab Observasi (Landing Briefing)...');
    await clickButtonWithText('Observasi');
    await sleep(600);

    console.log('Capturing: 10_observasi_landing_briefing.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '10_observasi_landing_briefing.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 10. Formulir Observasi Harian (4 Variabel)
    // -------------------------------------------------------------
    console.log('[12] Membuka Formulir Input Observasi Harian...');
    await clickButtonWithText('Mulai Isi Kartu Observasi Sekarang');
    await sleep(500);

    console.log('Capturing: 11_observasi_formulir_pengamatan.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '11_observasi_formulir_pengamatan.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 11. Modal Feedback AI - Kondisi Normal / Sehat
    // -------------------------------------------------------------
    console.log('[13] Mengirim hasil observasi normal ke AI Enzy...');
    await clickButtonWithText('Kirim Pengamatan ke AI Enzy');
    await sleep(700);

    console.log('Capturing: 12_modal_feedback_ai_normal.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '12_modal_feedback_ai_normal.png'),
      fullPage: false
    });

    // Tutup feedback modal
    await clickButtonWithText('Kembali ke Dashboard');
    await sleep(500);

    // -------------------------------------------------------------
    // 12. Layar Observasi Harian - Status Terkunci 1x/hari
    // -------------------------------------------------------------
    console.log('[14] Berpindah ke tab Observasi untuk melihat Status Terkunci...');
    await clickButtonWithText('Observasi');
    await sleep(500);

    console.log('Capturing: 13_observasi_status_terkunci.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '13_observasi_status_terkunci.png'),
      fullPage: false
    });

    // -------------------------------------------------------------
    // 13. Modal Feedback AI - Peringatan Kontaminasi Bahaya (Dewasa)
    // -------------------------------------------------------------
    console.log('[15] Menjalankan skenario kontaminasi bahaya / jamur berbulu...');
    await clickButtonWithText('Reset Demo');
    await sleep(400);
    await clickButtonWithText('Mulai Isi Kartu Observasi Sekarang');
    await sleep(400);

    // Pilih variabel bahaya: Bau Busuk & Jamur Berbulu Warna
    await clickButtonWithText('Bau Busuk');
    await sleep(200);
    await clickButtonWithText('Jamur Berbulu Warna');
    await sleep(200);

    await clickButtonWithText('Kirim Pengamatan ke AI Enzy');
    await sleep(600);

    console.log('Capturing: 14_modal_feedback_ai_bahaya_dewasa.png');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '14_modal_feedback_ai_bahaya_dewasa.png'),
      fullPage: false
    });

    console.log('\n============================================================');
    console.log('SEMUA RENDER UI BERHASIL TERSIMPAN DI ui_renders/ !');
    console.log('============================================================');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

run();
