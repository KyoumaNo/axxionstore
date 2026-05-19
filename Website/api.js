// API Service untuk komunikasi dengan Backend
const API_URL = 'http://localhost:3000/api'; // Ganti saat production dengan Railway URL

class APIService {
  // GET semua products dari database
  static async getAllProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // GET product by ID
  static async getProductById(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // POST create new product (admin only)
  static async createProduct(productData) {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to create product');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  // PUT update product (admin only)
  static async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      showToast(`✅ Product "${data.data.name}" updated successfully`, 'success');
      return data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('❌ Failed to update product', 'error');
      return null;
    }
  }

  // DELETE product (admin only)
  static async deleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
      showToast('✅ Product deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('❌ Failed to delete product', 'error');
      return false;
    }
  }

  // Check backend health
  static async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend is not responding');
      return false;
    }
  }
}

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : type === 'error' ? 'circle-xmark' : 'info'}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}
