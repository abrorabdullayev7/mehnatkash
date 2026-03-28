// API Service - Frontend API calls
class UzumAPI {
  constructor(baseURL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : 'https://banana-market.onrender.com/api') {
    this.baseURL = baseURL;
    this.token = this.getToken();
  }

  // Token management
  setToken(token) {
    localStorage.setItem('auth_token', token);
    this.token = token;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  removeToken() {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  // Request helper
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      // Try to parse JSON body if any
      let data = null;
      try { data = await response.json(); } catch (e) { data = null; }

      if (!response.ok) {
        const serverMsg = data && (data.message || data.error || data.msg) ? (data.message || data.error || data.msg) : null;
        const message = serverMsg || `API Error: ${response.status}`;
        const err = new Error(message);
        err.status = response.status;
        err.body = data;
        throw err;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // AUTH ENDPOINTS
  async signup(data) {
    const res = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  // Google login: send Google ID token to backend to verify and receive app JWT
  async googleLogin(idToken) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getFavorites() {
    return this.request('/auth/favorites');
  }

  async updateFavorites(favorites) {
    return this.request('/auth/favorites', {
      method: 'PUT',
      body: JSON.stringify({ favorites })
    });
  }

  logout() {
    this.removeToken();
  }

  // PRODUCTS ENDPOINTS
  async getProducts(query = '') {
    return this.request(`/products${query}`);
  }

  async getMyProducts() {
    return this.request('/products/my/listings');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProduct(id, data) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // CART ENDPOINTS
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCart(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE'
    });
  }

  // ORDER ENDPOINTS
  async createOrder(data) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // ADMIN ENDPOINTS
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAllOrders() {
    return this.request('/admin/orders');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  // PAYMENT ENDPOINTS
  async createPaymentIntent(amount, orderId) {
    return this.request('/payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, orderId })
    });
  }

  async confirmPayment(paymentIntentId) {
    return this.request('/payment/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId })
    });
  }
}

// Create global instance
const api = new UzumAPI();
