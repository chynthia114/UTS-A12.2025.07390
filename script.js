// State Data Keranjang
let keranjang = [];

// Pilih Elemen DOM
const btnPesanArr = document.querySelectorAll('.btn-pesan');
const modalKeranjang = document.getElementById('modal-keranjang');
const btnKeranjang = document.getElementById('btn-keranjang');
const btnTutup = document.getElementById('btn-tutup');
const daftarPesanan = document.getElementById('daftar-pesanan');
const totalHarga = document.getElementById('total-harga');
const cartCount = document.getElementById('cart-count');

// ==========================================
// FITUR 4: TOAST NOTIFICATION
// ==========================================
function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return; // Mencegah error jika div belum ada di HTML
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.classList.add('error');
    
    const icon = isError ? '⚠️' : '✨';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Hilangkan otomatis setelah 3 detik
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// ==========================================
// FITUR 1: LIVE SEARCH Bunga
// ==========================================
const searchInput = document.getElementById('search-input');
const allCards = document.querySelectorAll('.card');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        
        allCards.forEach(card => {
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            if(title.includes(keyword)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ==========================================
// FITUR 2: TAMBAH, UBAH QTY (+/-), DAN HAPUS
// ==========================================
btnPesanArr.forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const nama = this.getAttribute('data-nama');
        const harga = parseInt(this.getAttribute('data-harga'));

        const exist = keranjang.find(item => item.id === id);
        if (exist) { exist.qty += 1; }
        else { keranjang.push({id, nama, harga, qty: 1}); }

        // Memanggil Notifikasi Toast saat barang ditambahkan
        showToast(`${nama} ditambahkan ke keranjang!`);

        // Animasi UX Centang pada tombol
        const originalText = this.innerHTML;
        this.innerHTML = "✓";
        this.style.color = "#d89f87";
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.color = "";
        }, 1000);

        updateCart();
    });
});

function ubahQty(id, delta) {
    const item = keranjang.find(i => i.id === id);
    if (item) {
        item.qty += delta; 
        if (item.qty <= 0) {
            hapusItem(id); 
        } else {
            updateCart();
        }
    }
}

function hapusItem(idHapus) {
    keranjang = keranjang.filter(item => item.id !== idHapus);
    updateCart(); 
}

function updateCart() {
    const totalItems = keranjang.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.innerText = totalItems;

    if (keranjang.length === 0) {
        if (daftarPesanan) daftarPesanan.innerHTML = '<p class="empty-cart" style="text-align:center; opacity:0.5;">Cart is empty.</p>';
        if (totalHarga) totalHarga.innerText = "Rp 0";
        return;
    }

    let html = '';
    let total = 0;
    keranjang.forEach(item => {
        const sub = item.harga * item.qty;
        total += sub;
        
        html += `<div class="cart-item">
            <div>
                <h4 style="margin-bottom:0.2rem;">${item.nama}</h4>
                <small style="opacity:0.7;">Rp ${item.harga.toLocaleString('id-ID')}</small>
            </div>
            <div class="cart-action-right">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="ubahQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="ubahQty('${item.id}', 1)">+</button>
                </div>
                <strong>Rp ${sub.toLocaleString('id-ID')}</strong>
                <button class="btn-hapus" onclick="hapusItem('${item.id}')" title="Hapus item">&times;</button>
            </div>
        </div>`;
    });
    
    if (daftarPesanan) daftarPesanan.innerHTML = html;
    if (totalHarga) totalHarga.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Modal Pop-up Toggle & Checkout
if (btnKeranjang) btnKeranjang.addEventListener('click', () => modalKeranjang.classList.remove('hidden'));
if (btnTutup) btnTutup.addEventListener('click', () => modalKeranjang.classList.add('hidden'));

const btnCheckout = document.getElementById('btn-checkout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        if(keranjang.length === 0) {
            showToast("Keranjang belanja kosong!", true); // Memanggil Toast Error
            return;
        }
        
        showToast("Pesanan berhasil diproses! Terima kasih."); // Memanggil Toast Sukses
        keranjang = [];
        updateCart();
        modalKeranjang.classList.add('hidden');
    });
}

// ==========================================
// FITUR 3: VALIDASI FORM NEWSLETTER
// ==========================================
const btnSubscribe = document.getElementById('btn-subscribe');
if (btnSubscribe) {
    btnSubscribe.addEventListener('click', function() {
        const emailInput = document.getElementById('email-input');
        const msgBox = document.getElementById('subscribe-msg');
        
        if (emailInput.value.trim() === '') {
            msgBox.innerText = "Email address cannot be empty!";
            msgBox.style.color = "#e74c3c"; 
        } else {
            msgBox.innerText = "";
            
            const originalText = this.innerText;
            this.innerText = "✓ SUBSCRIBED";
            this.style.backgroundColor = "#f5ebe6";
            this.style.color = "#2b060b";
            emailInput.value = ""; 
            
            setTimeout(() => {
                this.innerText = originalText;
                this.style.backgroundColor = "";
                this.style.color = "";
            }, 2000);
        }
    });
}