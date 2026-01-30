// Create animated particles in background
function createParticles() {
  const body = document.body;
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 80 + 20;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    
    // Random animation delay and duration
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    body.appendChild(particle);
  }
}

// Initialize particles
createParticles();

let hasilData = null;

function hitung() {
  const loading = document.getElementById('loading');
  const hasilDiv = document.getElementById('hasil');
  const btnContainer = document.getElementById('btnContainer');
  
  // Show loading
  loading.style.display = 'block';
  
  // Simulate calculation delay for animation effect
  setTimeout(() => {
    let otr = Number(document.getElementById("otr").value);
    let dpPersen = Number(document.getElementById("dp").value) / 100;
    let jangka = Number(document.getElementById("jangka").value);

    if (!otr || !jangka || jangka <= 0) {
      alert("Mohon lengkapi semua data dengan benar!");
      loading.style.display = 'none';
      return;
    }

    if (dpPersen < 0 || dpPersen > 1) {
      alert("DP harus antara 0% - 100%");
      loading.style.display = 'none';
      return;
    }

    let dp = otr * dpPersen;
    let pokokUtang = otr - dp;

    // DETERMINE ANNUAL INTEREST RATE (Sesuai flowchart)
    let bungaTahun;
    if (jangka <= 12) {
      bungaTahun = 0.12; // 12% per tahun
    } else if (jangka <= 24) {
      bungaTahun = 0.14; // 14% per tahun
    } else {
      bungaTahun = 0.165; // 16.5% per tahun
    }

    // CORRECT CALCuai flowchart dan soal):
    // Total bunga = pokok utang * bunga tahunan * (jangka waktu dalam tahun)
    let totalBunga = pokokUtang * bungaTahun * (jangka / 12);
    let totalBayar = pokokUtang + totalBunga;
    let angsuran = totalBayar / jangka;

    // Simpan data untuk cetak/download
    hasilData = {
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      otr: otr,
      dpPersen: dpPersen * 100,
      dp: dp,
      pokokUtang: pokokUtang,
      jangka: jangka,
      bungaTahun: bungaTahun * 100,
      angsuran: angsuran,
      totalBayar: totalBayar,
      totalBunga: totalBunga
    };

    let hasilHTML = `
      <div style="text-align: left;">
        <p style="margin-bottom: 12px;"><strong>💵 Angsuran per bulan:</strong></p>
        <p style="font-size: 28px; color: #ff6b35; margin: 12px 0; font-weight: 700;">
          Rp ${angsuran.toLocaleString('id-ID')}
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid rgba(255, 154, 86, 0.3);">
        <p style="margin-bottom: 15px;"><strong>📊 Ringkasan Lengkap:</strong></p>
        <div style="background: rgba(255, 255, 255, 0.7); padding: 15px; border-radius: 10px; margin-top: 10px;">
          <p style="margin: 8px 0;">• <strong>Harga Mobil (OTR):</strong> Rp ${otr.toLocaleString('id-ID')}</p>
          <p style="margin: 8px 0;">• <strong>DP (${(dpPersen*100).toFixed(0)}%):</strong> Rp ${dp.toLocaleString('id-ID')}</p>
          <p style="margin: 8px 0;">• <strong>Pokok Utang:</strong> Rp ${pokokUtang.toLocaleString('id-ID')}</p>
          <p style="margin: 8px 0;">• <strong>Bunga:</strong> ${bungaTahun * 100}% per tahun</p>
          <p style="margin: 8px 0;">• <strong>Jangka Waktu:</strong> ${jangka} bulan (${Math.floor(jangka/12)} tahun ${jangka%12} bulan)</p>
          <p style="margin: 8px 0;">• <strong>Total Bunga:</strong> Rp ${totalBunga.toLocaleString('id-ID')}</p>
          <p style="margin: 8px 0;">• <strong>Total Bayar:</strong> Rp ${totalBayar.toLocaleString('id-ID')}</p>
        </div>
      </div>
    `;

    hasilDiv.innerHTML = hasilHTML;
    hasilDiv.classList.add('show');
    btnContainer.classList.add('show');
    loading.style.display = 'none';
  }, 500); // Delay for animation effect
}

function cetak() {
  if (!hasilData) {
    alert("Harap hitung terlebih dahulu!");
    return;
  }

  let printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hasil Simulasi Kredit Mobil</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 4px solid #ff9a56;
          padding-bottom: 25px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #ff6b35;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .result {
          background: linear-gradient(135deg, #fffaf0 0%, #fff5e6 100%);
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 25px;
          border: 2px solid #ffccaa;
        }
        .highlight-box {
          background: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(255, 154, 86, 0.2);
        }
        .highlight-box .amount {
          font-size: 32px;
          font-weight: bold;
          color: #ff6b35;
          margin: 10px 0;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          margin: 12px 0;
          padding: 10px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
        }
        .result-item strong {
          color: #e65100;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚗 SIMULASI KREDIT MOBIL</h1>
        <p>${hasilData.tanggal}</p>
      </div>

      <div class="highlight-box">
        <div style="font-size: 16px; color: #666; margin-bottom: 10px;">Angsuran Per Bulan</div>
        <div class="amount">Rp ${hasilData.angsuran.toLocaleString('id-ID')}</div>
      </div>

      <div class="result">
        <div class="result-item">
          <span><strong>Harga Mobil (OTR)</strong></span>
          <span>Rp ${hasilData.otr.toLocaleString('id-ID')}</span>
        </div>
        <div class="result-item">
          <span><strong>DP (${hasilData.dpPersen.toFixed(0)}%)</strong></span>
          <span>Rp ${hasilData.dp.toLocaleString('id-ID')}</span>
        </div>
        <div class="result-item">
          <span><strong>Pokok Utang</strong></span>
          <span>Rp ${hasilData.pokokUtang.toLocaleString('id-ID')}</span>
        </div>
        <div class="result-item">
          <span><strong>Bunga</strong></span>
          <span>${hasilData.bungaTahun.toFixed(1)}% per tahun</span>
        </div>
        <div class="result-item">
          <span><strong>Jangka Waktu</strong></span>
          <span>${hasilData.jangka} bulan</span>
        </div>
        <div class="result-item">
          <span><strong>Total Bunga</strong></span>
          <span>Rp ${hasilData.totalBunga.toLocaleString('id-ID')}</span>
        </div>
        <div class="result-item">
          <span><strong>Total Pembayaran</strong></span>
          <span>Rp ${hasilData.totalBayar.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div class="footer">
        <p>Hasil simulasi ini bersifat estimasi. Untuk informasi lebih lanjut, silakan hubungi dealer terdekat.</p>
        <p style="margin-top: 5px; font-weight: bold;">Terima kasih telah menggunakan kalkulator kami! 🚗</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function download() {
  if (!hasilData) {
    alert("Harap hitung terlebih dahulu!");
    return;
  }

  // Show visual feedback
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sedang Mengunduh...';
  btn.disabled = true;

  setTimeout(() => {
    let content = `
╔══════════════════════════════════════════════════════════╗
║           SIMULASI KREDIT MOBIL - HASIL PERHITUNGAN      ║
╠══════════════════════════════════════════════════════════╣
║  Tanggal: ${hasilData.tanggal.padEnd(45)}║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  💵 ANGSURAN PER BULAN                                   ║
║  Rp ${hasilData.angsuran.toLocaleString('id-ID').padEnd(48)}║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  📊 DETAIL PERHITUNGAN                                   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  • Harga Mobil (OTR)     : Rp ${hasilData.otr.toLocaleString('id-ID').padEnd(35)}║
║  • DP (${hasilData.dpPersen.toFixed(0)}%)               : Rp ${hasilData.dp.toLocaleString('id-ID').padEnd(35)}║
║  • Pokok Utang           : Rp ${hasilData.pokokUtang.toLocaleString('id-ID').padEnd(35)}║
║  • Bunga                 : ${hasilData.bungaTahun.toFixed(1)}% per tahun${''.padEnd(31)}║
║  • Jangka Waktu          : ${hasilData.jangka} bulan${''.padEnd(41)}║
║  • Total Bunga           : Rp ${hasilData.totalBunga.toLocaleString('id-ID').padEnd(35)}║
║  • Total Bayar           : Rp ${hasilData.totalBayar.toLocaleString('id-ID').padEnd(35)}║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  Catatan: Hasil simulasi ini bersifat estimasi.          ║
║  Untuk informasi lebih lanjut, hubungi dealer terdekat.  ║
╚══════════════════════════════════════════════════════════╝
    `;

    let blob = new Blob([content], { type: 'text/plain' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Simulasi_Kredit_Mobil_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 300);
}