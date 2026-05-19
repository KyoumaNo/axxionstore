# INTEGRASI FRONTEND DENGAN BACKEND

## 📝 Panduan Mengintegrasikan index.html dengan API

Berikut contoh implementasi JavaScript untuk menampilkan dan mengelola products dari database:

---

## 1. LOAD PRODUCTS DARI DATABASE

```javascript
// Tambahkan di dalam <script> tag di index.html

// Global state
let allProducts = [];
let autoRefreshInterval = null;

// Load products saat halaman buka
async function initializeApp() {
  console.log('🚀 Initializing Axxion Store...');
  
  // Check backend status
  const isHealthy = await APIService.checkHealth();
  if (!isHealthy) {
    showToast('⚠️ Backend tidak terhubung. Mode offline.', 'warning');
  }
  
  // Load products
  await loadProducts();
  
  // Setup auto-refresh setiap 5 detik
  startAutoRefresh();
  
  // Hide loader
  setTimeout(() => {
    document.getElementById('loader').style.opacity = '0';
    document.getElementById('loader').style.pointerEvents = 'none';
  }, 500);
}

// Ambil semua products dari API
async function loadProducts() {
  try {
    const products = await APIService.getAllProducts();
    allProducts = products;
    console.log(`✅ Loaded ${products.length} products from database`);
    
    // Render products di UI
    renderProductsGrid(products);
    updateCategoryFilter(products);
    
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('❌ Gagal memuat products', 'error');
  }
}

// Auto-refresh products setiap 5 detik
function startAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  
  autoRefreshInterval = setInterval(async () => {
    const products = await APIService.getAllProducts();
    
    // Hanya re-render jika ada perubahan
    if (JSON.stringify(products) !== JSON.stringify(allProducts)) {
      console.log('🔄 Database berubah, update UI...');
      allProducts = products;
      renderProductsGrid(products);
      showToast('🔄 Data produk diperbarui', 'info');
    }
  }, 5000);
}

// Render products ke UI grid
function renderProductsGrid(products = allProducts) {
  const container = document.getElementById('products-display');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Belum ada produk</p>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card glassmorphism animate-scale">
      <img src="${product.image_url || 'https://via.placeholder.com/300'}" class="product-thumb" alt="${product.name}">
      <div class="product-details">
        <span class="product-category">${product.category || 'General'}</span>
        <h4 class="product-title">${product.name}</h4>
        <p class="product-desc">${product.description || ''}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="product-price">$${product.price}</span>
          <span style="font-size: 12px; color: var(--accent-cyan);">
            Stock: ${product.stock}
          </span>
        </div>
        <button class="glow-button" style="width: 100%; margin-top: 10px;" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Add Cart
        </button>
      </div>
    </div>
  `).join('');
}

// Update kategori filter dari products yang ada
function updateCategoryFilter(products = allProducts) {
  const categories = [...new Set(products.map(p => p.category || 'All'))];
  const filterList = document.getElementById('category-filter-list');
  
  if (!filterList) return;
  
  filterList.innerHTML = [
    '<li><button class="category-btn active" onclick="filterByCategory(null)">All Products</button></li>',
    ...categories.map(cat => `
      <li><button class="category-btn" onclick="filterByCategory('${cat}')">${cat}</button></li>
    `)
  ].join('');
}

// Filter products by category
function filterByCategory(category) {
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (category === null) {
    renderProductsGrid(allProducts);
    buttons[0].classList.add('active');
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    renderProductsGrid(filtered);
    event.target.classList.add('active');
  }
}

// Jalankan saat halaman load
document.addEventListener('DOMContentLoaded', initializeApp);
```

---

## 2. ADMIN: TAMBAH PRODUCT

```javascript
// Form untuk tambah product
function openProductModal() {
  // Buat modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card glassmorphism animate-scale">
      <div class="modal-header">
        <h3>➕ Tambah Product Baru</h3>
        <button class="close-modal-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      </div>
      
      <form onsubmit="saveNewProduct(event)">
        <div class="input-group">
          <label>Nama Produk</label>
          <input type="text" id="form-product-name" required placeholder="Laptop Gaming">
        </div>
        
        <div class="input-group">
          <label>Deskripsi</label>
          <textarea id="form-product-desc" placeholder="RTX 4090, Intel i9..."></textarea>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="input-group">
            <label>Harga ($)</label>
            <input type="number" id="form-product-price" required placeholder="25000">
          </div>
          
          <div class="input-group">
            <label>Stock</label>
            <input type="number" id="form-product-stock" required placeholder="10">
          </div>
        </div>
        
        <div class="input-group">
          <label>Kategori</label>
          <input type="text" id="form-product-category" placeholder="Electronics">
        </div>
        
        <div class="input-group">
          <label>Image URL</label>
          <input type="url" id="form-product-image" placeholder="https://...">
        </div>
        
        <button type="submit" class="glow-button admin-color w-100">💾 Simpan Product</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Simpan product baru ke database
async function saveNewProduct(event) {
  event.preventDefault();
  
  const productData = {
    name: document.getElementById('form-product-name').value,
    description: document.getElementById('form-product-desc').value,
    price: parseFloat(document.getElementById('form-product-price').value),
    stock: parseInt(document.getElementById('form-product-stock').value),
    category: document.getElementById('form-product-category').value,
    image_url: document.getElementById('form-product-image').value
  };
  
  const result = await APIService.createProduct(productData);
  
  if (result) {
    showToast(`✅ Product "${result.name}" ditambahkan!`, 'success');
    event.target.closest('.modal-overlay').remove();
    loadProducts(); // Refresh UI
  }
}
```

---

## 3. ADMIN: EDIT PRODUCT

```javascript
// Edit product - ubah price atau stock
async function editProduct(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card glassmorphism animate-scale">
      <div class="modal-header">
        <h3>✏️ Edit: ${product.name}</h3>
        <button class="close-modal-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      </div>
      
      <form onsubmit="updateProduct(event, ${productId})">
        <div class="input-group">
          <label>Harga ($)</label>
          <input type="number" id="edit-price" value="${product.price}" required>
        </div>
        
        <div class="input-group">
          <label>Stock</label>
          <input type="number" id="edit-stock" value="${product.stock}" required>
        </div>
        
        <div class="input-group">
          <label>Deskripsi</label>
          <textarea id="edit-desc">${product.description}</textarea>
        </div>
        
        <button type="submit" class="glow-button w-100">💾 Update Product</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Update product di database
async function updateProduct(event, productId) {
  event.preventDefault();
  
  const updateData = {
    price: parseFloat(document.getElementById('edit-price').value),
    stock: parseInt(document.getElementById('edit-stock').value),
    description: document.getElementById('edit-desc').value
  };
  
  const result = await APIService.updateProduct(productId, updateData);
  
  if (result) {
    showToast('✅ Product updated! All users akan lihat perubahan...', 'success');
    event.target.closest('.modal-overlay').remove();
    loadProducts(); // Refresh UI untuk semua user
  }
}
```

---

## 4. ADMIN: HAPUS PRODUCT

```javascript
// Delete product dengan confirmation
async function deleteProduct(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  if (!confirm(`⚠️ Hapus "${product.name}"?\nAction ini tidak bisa di-undo!`)) {
    return;
  }
  
  const success = await APIService.deleteProduct(productId);
  
  if (success) {
    showToast(`🗑️ Product "${product.name}" dihapus`, 'success');
    loadProducts(); // Refresh UI
  }
}
```

---

## 5. CART SYSTEM

```javascript
// Cart state
let cart = [];

// Tambah ke cart
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  // Check stock
  if (product.stock <= 0) {
    showToast('❌ Out of stock!', 'error');
    return;
  }
  
  // Add to cart
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartBadge();
  showToast(`✅ "${product.name}" ditambahkan ke cart`, 'success');
}

// Update cart counter badge
function updateCartBadge() {
  const badge = document.getElementById('cart-counter');
  if (badge) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
  }
}

// Toggle cart modal
function toggleCartModal() {
  // Show cart items
  showToast(`🛒 Cart: ${cart.length} items`, 'info');
}
```

---

## 6. INTEGRASI DI index.html

Tambahkan di dalam `<script>` tag sebelum `</body>`:

```html
<script src="api.js"></script>
<script src="config.js"></script>
<script>
  // Kode di atas (loadProducts, renderProductsGrid, dll)
  // Tambahkan semua function dari dokumentasi ini
</script>
```

---

## 🎯 Workflow Realtime

```
User 1 (Vercel)        Admin (Vercel)         Database (Neon)
    │                       │                         │
    │──── Poll (5s) ─────── API (Railway) ────────────│
    │                       │                    Update Stock
    │                       │◄──────────────────────────│
    │◄────── Response ──────│                         │
    │                       │                         │
    │ Update UI             │ Update UI               │
    │ Lihat stock berkurang │ Lihat stock berkurang   │
```

---

## 📊 Admin Panel Product Management

Pastikan di admin section ada button:

```html
<button class="glow-button btn-small admin-color" onclick="openProductModal()">
  <i class="fa-solid fa-plus"></i> Tambah Product
</button>
```

Dan di admin products table:

```html
<tbody id="admin-products-table"></tbody>
```

Render dengan:

```javascript
function renderAdminProductsTable() {
  const tbody = document.getElementById('admin-products-table');
  if (!tbody) return;
  
  tbody.innerHTML = allProducts.map(product => `
    <tr>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>Rp ${(product.price * 15000).toLocaleString('id-ID')}</td>
      <td>${product.category}</td>
      <td>
        <button class="glow-button btn-small" onclick="editProduct(${product.id})">✏️ Edit</button>
        <button class="glow-button btn-small danger-color" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

// Panggil setelah loadProducts
```

---

## ✅ Testing Checklist

- [ ] Frontend load products dari API
- [ ] Products display dengan benar
- [ ] Auto-refresh setiap 5 detik
- [ ] Admin bisa add product
- [ ] Admin bisa edit price/stock
- [ ] Semua user lihat update yang sama
- [ ] Admin bisa delete product
- [ ] Cart system working

---

**READY TO INTEGRATE! 🚀**
