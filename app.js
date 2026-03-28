// Static product list (20 items) - edit this array freely
const defaultProducts = [
  { id: 1, name: 'iPhone 17 promax', price: 15000000, oldPrice: 17000000, image: 'https://avatars.mds.yandex.net/i?id=39df4dd98890388b24c72c22009e02ac23eb2963-5092546-images-thumbs&n=13', category: 'telefon', rating: 4.5 },
  { id: 2, name: 'RGB CASE', price: 4000000, oldPrice: 4500000, image: 'https://avatars.mds.yandex.net/i?id=f57a0b961c9e5e16b05e30c9f92b26335c6babc1-4326270-images-thumbs&n=13', category: 'elektronika', rating: 4.2 },
  { id: 3, name: 'OverSize Futbolka', price: 800000, oldPrice: 950000, image: 'https://avatars.mds.yandex.net/i?id=d160c6c3606e4d0c6f70b0449aa1514d62bcaa1a-5177926-images-thumbs&n=13', category: 'kiyim', rating: 4.0 },
  { id: 4, name: 'Karam', price: 50000, oldPrice: 60000, image: 'https://img.freepik.com/premium-photo/savoy-cabbage-isolated-white-background_980000-442.jpg?semt=ais_hybrid&w=740', category: 'oziq', rating: 4.7 },
  { id: 5, name: 'Harry Potter', price: 120000, oldPrice: 140000, image: 'https://avatars.mds.yandex.net/i?id=dae895ffc69210e537ecf4b4a5904ae1a4fc76e0-9094507-images-thumbs&n=13', category: 'kitoblar', rating: 4.1 },
  { id: 6, name: 'Samsung Galaxy S24 Ultra', price: 15500000, oldPrice: 17500000, image: 'https://avatars.mds.yandex.net/i?id=7c5b6e4c51ed40bbcd397680e8fec54b40d640e3-3006166-images-thumbs&n=13', category: 'telefon', rating: 4.3 },
  { id: 7, name: '4k Monitor', price: 4200000, oldPrice: 4800000, image: 'https://avatars.mds.yandex.net/i?id=afde8cb522521ecb05d31acccc462c5d3a68efce-13088547-images-thumbs&n=13', category: 'elektronika', rating: 4.4 },
  { id: 8, name: 'Nike krosovka', price: 920000, oldPrice: 1100000, image: 'https://picsum.photos/seed/product8/400/300', category: 'kiyim', rating: 3.9 },
];

const LOCATIONS = ['Toshkent', 'Andijon', 'Farg\'ona', 'Namangan', 'Samarqand', 'Buxoro'];
const HIDDEN_CATEGORIES = new Set(['oziq', 'sog']);
const BRAND_KEYWORDS = ['apple', 'samsung', 'xiaomi', 'sony'];
const COLOR_PALETTE = ['black', 'white', 'red', 'blue', 'yellow'];
let productLocations = loadState('product_locations', {});
let favorites = loadState('favorites', []);
let products = attachProductMeta(defaultProducts);
let cart = loadCart();
let useBackend = false;
let userRole = localStorage.getItem('user_role') || null;
let activeChatProductId = null;
let profileAvatarValue = '';
let newProductImageValue = '';
const bannerAds = [
  {
    brand: 'Pepsi',
    title: 'Pepsi Haftaligi',
    desc: '2+1 aksiya: ichimliklar bo\'limida chegirmalar',
    category: 'all',
    gradient: 'linear-gradient(130deg, #001845 0%, #023e8a 55%, #00b4d8 100%)'
  },
  {
    brand: 'Coca-Cola',
    title: 'Coca-Cola Super Combo',
    desc: 'Oilaviy paketlarda maxsus narxlar',
    category: 'all',
    gradient: 'linear-gradient(130deg, #3d0000 0%, #8b0000 50%, #ef233c 100%)'
  },
  {
    brand: 'Banan Market',
    title: 'Kundalik Top Takliflar',
    desc: 'Telefon, kiyim va elektronika bo\'yicha hot sale',
    category: 'all',
    gradient: 'linear-gradient(130deg, #0f172a 0%, #1f2937 55%, #374151 100%)'
  }
];
let bannerAdIndex = 0;
let bannerTimerId = null;
const UZBEKISTAN_ADDRESS = {
  "Qoraqalpog'iston Respublikasi": ["Amudaryo", "Beruniy", "Chimboy", "Ellikqala", "Kegeyli", "Mo'ynoq", "Nukus", "Qanliko'l", "Qo'ng'irot", "Qorao'zak", "Shumanay", "Taxtako'pir", "To'rtko'l", "Xo'jayli"],
  "Andijon viloyati": ["Andijon", "Asaka", "Baliqchi", "Bo'ston", "Buloqboshi", "Izboskan", "Jalaquduq", "Marhamat", "Oltinko'l", "Paxtaobod", "Shahrixon", "Ulug'nor", "Xo'jaobod", "Qo'rg'ontepa"],
  "Buxoro viloyati": ["Buxoro", "G'ijduvon", "Jondor", "Kogon", "Olot", "Peshku", "Qorako'l", "Qorovulbozor", "Romitan", "Shofirkon", "Vobkent"],
  "Jizzax viloyati": ["Arnasoy", "Baxmal", "Do'stlik", "Forish", "G'allaorol", "Sharof Rashidov", "Mirzacho'l", "Paxtakor", "Yangiobod", "Zafarobod", "Zarbdor", "Zomin"],
  "Qashqadaryo viloyati": ["Chiroqchi", "Dehqonobod", "G'uzor", "Kasbi", "Kitob", "Koson", "Ko'kdala", "Muborak", "Mirishkor", "Nishon", "Qamashi", "Qarshi", "Shahrisabz", "Yakkabog'"],
  "Navoiy viloyati": ["Karmana", "Konimex", "Navbahor", "Nurota", "Qiziltepa", "Tomdi", "Uchquduq", "Xatirchi"],
  "Namangan viloyati": ["Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Namangan", "Norin", "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangiqo'rg'on"],
  "Samarqand viloyati": ["Bulung'ur", "Ishtixon", "Jomboy", "Kattaqo'rg'on", "Narpay", "Nurobod", "Oqdaryo", "Paxtachi", "Pastdarg'om", "Payariq", "Qo'shrabot", "Samarqand", "Toyloq", "Urgut"],
  "Sirdaryo viloyati": ["Boyovut", "Guliston", "Mirzaobod", "Oqoltin", "Sardoba", "Sayxunobod", "Sirdaryo", "Xovos", "Yangiyer", "Shirin"],
  "Surxondaryo viloyati": ["Angor", "Bandixon", "Boysun", "Denov", "Jarqo'rg'on", "Muzrabot", "Oltinsoy", "Qiziriq", "Qumqo'rg'on", "Sariosiyo", "Sherobod", "Sho'rchi", "Termiz", "Uzun"],
  "Toshkent viloyati": ["Bekobod", "Bo'ka", "Bo'stonliq", "Chinoz", "Ohangaron", "Oqqo'rg'on", "Parkent", "Piskent", "Quyichirchiq", "Yangiyo'l", "Yuqorichirchiq", "Zangiota", "Qibray"],
  "Farg'ona viloyati": ["Bag'dod", "Beshariq", "Buvayda", "Dang'ara", "Farg'ona", "Furqat", "Oltiariq", "Qo'qon", "Quva", "Rishton", "So'x", "Toshloq", "Uchko'prik", "Yozyovon", "Quvasoy"],
  "Xorazm viloyati": ["Bog'ot", "Gurlan", "Hazorasp", "Xiva", "Xonqa", "Qo'shko'pir", "Shovot", "Urganch", "Yangiariq", "Yangibozor", "Tuproqqal'a"],
  "Toshkent shahri": ["Bektemir", "Chilonzor", "Yakkasaroy", "Mirobod", "Mirzo Ulug'bek", "Sergeli", "Shayxontohur", "Olmazor", "Uchtepa", "Yunusobod", "Yashnobod", "Yangihayot"]
};

// Initialize - Check if backend is available
async function initApp() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (response.ok) {
      useBackend = true;
      console.log('✅ Backend connected');
      // show loading state while fetching from backend
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) catalogEl.innerHTML = '<div class="loader">Yuklanmoqda...</div>';
      await loadProductsFromBackend();
    }
  } catch (error) {
    console.log('ℹ️ Backend not available, using local data');
    useBackend = false;
  }

  // clear any accidental browser autofill in search input
  const searchEl = document.getElementById('searchInput');
  if (searchEl) {
    searchEl.value = '';
    try {
      // stronger anti-autofill: change name, disable briefly and set autocomplete attributes
      searchEl.setAttribute('autocomplete', 'off');
      searchEl.setAttribute('autocorrect', 'off');
      searchEl.setAttribute('autocapitalize', 'off');
      searchEl.setAttribute('spellcheck', 'false');
      // rename field to avoid stored autofill
      searchEl.name = 'search_' + Date.now();
      // disable briefly so browser won't autofill
      searchEl.readOnly = true;
      setTimeout(() => { searchEl.readOnly = false; }, 50);
    } catch (e) { console.warn('anti-autofill failed', e); }
  }

  const locationFilterEl = document.getElementById('locationFilter');
  if (locationFilterEl) {
    const savedLocation = localStorage.getItem('selected_location') || 'all';
    locationFilterEl.value = savedLocation;
  }
  saveState('product_locations', productLocations);
  updateFavoritesUI();
  initBannerAds();
  applyFilters();
  updateCartUI();
  applyHeaderUser(getStoredUser());

  // Export internal functions to window so they can be used by index.html script
  window.handleLandingSignIn = handleLandingSignIn;
  window.handleLandingSignup = handleLandingSignup;
  window.showUser = applyHeaderUser;
  window.logout = () => {
    api.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    const userInfo = document.getElementById('userInfo');
    const emailLoginBtn = document.getElementById('emailLoginBtn');
    const googleBtn = document.getElementById('googleSignInButton');
    const landing = document.getElementById('landingOverlay');
    if (userInfo) userInfo.style.display = 'none';
    if (emailLoginBtn) emailLoginBtn.style.display = 'inline-block';
    if (googleBtn) googleBtn.style.display = 'block';
    if (landing) landing.style.display = 'flex';
    if (window.closeProfileModal) window.closeProfileModal();
  };

  // No longer blocking the app with landingOverlay
  const landing = document.getElementById('landingOverlay');
  if (landing) landing.style.display = 'none';

  const user = getStoredUser();
  if (user) {
    applyHeaderUser(user);
    await syncFavoritesFromBackend();
  }

  if (!userRole) {
    // Optionally set a default guest role or just leave it null
    userRole = 'user';
    applyRoleUI();
  }
}

function setActiveCategory(category) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
}

function renderBannerAd(index) {
  const ad = bannerAds[index];
  const brandEl = document.getElementById('adBrand');
  const titleEl = document.getElementById('adTitle');
  const descEl = document.getElementById('adDesc');
  const ctaEl = document.getElementById('adCtaBtn');
  const bannerEl = document.querySelector('.banner');
  if (!ad || !brandEl || !titleEl || !descEl || !ctaEl || !bannerEl) return;

  brandEl.textContent = ad.brand;
  titleEl.textContent = ad.title;
  descEl.textContent = ad.desc;
  ctaEl.textContent = `${ad.brand} aksiyasini ko'rish`;
  bannerEl.style.background = ad.gradient;
  ctaEl.onclick = () => {
    setActiveCategory(ad.category);
    applyFilters();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

function initBannerAds() {
  if (!document.getElementById('adBrand')) return;
  renderBannerAd(bannerAdIndex);
  if (bannerTimerId) clearInterval(bannerTimerId);
  bannerTimerId = setInterval(() => {
    bannerAdIndex = (bannerAdIndex + 1) % bannerAds.length;
    renderBannerAd(bannerAdIndex);
  }, 5000);
}

function bindLandingEvents() {
  const signInBtn = document.getElementById('landingSignInBtn');
  const signUpBtn = document.getElementById('landingSignupBtn');
  if (signInBtn) signInBtn.onclick = handleLandingSignIn;
  if (signUpBtn) signUpBtn.onclick = handleLandingSignup;
}

async function handleLandingSignIn(email, password) {
  const finalEmail = (email || document.getElementById('landingEmail')?.value || '').trim().toLowerCase();
  const finalPassword = password || document.getElementById('landingPassword')?.value;

  if (!finalEmail || !finalPassword) return alert('Email va parol kiriting');

  if (!useBackend) {
    // Local fallback: any user info works as "guest" or just store what they entered
    const user = { name: finalEmail.split('@')[0], email: finalEmail, role: 'user' };
    localStorage.setItem('user', JSON.stringify(user));
    applyHeaderUser(user);
    document.getElementById('landingOverlay').style.display = 'none';
    userRole = 'user';
    localStorage.setItem('user_role', userRole);
    applyRoleUI();
    return;
  }

  try {
    const res = await api.login(finalEmail, finalPassword);
    if (res && res.token) {
      localStorage.setItem('user', JSON.stringify(res.user));
      applyHeaderUser(res.user);
      document.getElementById('landingOverlay').style.display = 'none';
      await syncFavoritesFromBackend();
      userRole = res.user && res.user.role ? res.user.role : null;
      if (userRole) localStorage.setItem('user_role', userRole);
      if (!userRole) showRoleSelector(); else applyRoleUI();
    }
  } catch (e) { alert('Kirish muvaffaqiyatsiz: ' + (e.message || e)); }
}

async function handleLandingSignup(data) {
  let name = 'User', email, password, role = 'user';

  if (data && typeof data === 'object') {
    name = data.name || 'User';
    email = data.email;
    password = data.password;
    role = data.role || 'user';
  } else {
    email = document.getElementById('landingEmail')?.value;
    password = document.getElementById('landingPassword')?.value;
    const roleEl = document.getElementById('landingRole');
    role = roleEl ? roleEl.value : 'user';
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) return alert('Email va parol kiriting');

  if (!useBackend) {
    const localUsers = loadState('local_users', []);
    if (localUsers.some((u) => String(u.email || '').toLowerCase() === normalizedEmail)) {
      alert('Bu email bilan allaqachon ro\'yxatdan o\'tilgan');
      return;
    }
    const user = { name: name || normalizedEmail.split('@')[0], email: normalizedEmail, role };
    localUsers.push({ name: user.name, email: normalizedEmail, role });
    saveState('local_users', localUsers);
    localStorage.setItem('user', JSON.stringify(user));
    applyHeaderUser(user);
    document.getElementById('landingOverlay').style.display = 'none';
    userRole = role;
    localStorage.setItem('user_role', userRole);
    applyRoleUI();
    return;
  }

  try {
    const res = await api.signup({ name, email: normalizedEmail, password, role });
    if (res && res.token) {
      localStorage.setItem('user', JSON.stringify(res.user));
      applyHeaderUser(res.user);
      document.getElementById('landingOverlay').style.display = 'none';
      await syncFavoritesFromBackend();
      userRole = res.user && res.user.role ? res.user.role : null;
      if (userRole) localStorage.setItem('user_role', userRole);
      if (!userRole) showRoleSelector(); else applyRoleUI();
    }
  } catch (e) { alert('Ro\'yxatdan o\'tish muvaffaqiyatsiz: ' + (e.message || e)); }
}

function showRoleSelector() {
  // simple role selector modal
  const choice = confirm("Sotuvchi bo'lishni xohlaysizmi? OK = Sotuvchi, Cancel = Xaridor");
  userRole = choice ? 'seller' : 'user';
  localStorage.setItem('user_role', userRole);
  applyRoleUI();
}

function applyRoleUI() {
  // show add product button to sellers
  let addBtn = document.getElementById('addProductBtn');
  let myListingsBtn = document.getElementById('myListingsBtn');
  let adminBtn = document.getElementById('adminBtn');
  const headerIcons = document.querySelector('.header-icons');

  if (!myListingsBtn && headerIcons) {
    myListingsBtn = document.createElement('div');
    myListingsBtn.id = 'myListingsBtn';
    myListingsBtn.className = 'header-icon';
    myListingsBtn.style.cursor = 'pointer';
    myListingsBtn.innerHTML = '<i class="fas fa-store"></i><span>E\'lonlarim</span>';
    headerIcons.appendChild(myListingsBtn);
  }

  if (!addBtn) {
    // create and append to header icons
    if (headerIcons) {
      addBtn = document.createElement('div');
      addBtn.id = 'addProductBtn';
      addBtn.className = 'header-icon';
      addBtn.style.cursor = 'pointer';
      addBtn.innerHTML = '<i class="fas fa-plus-circle"></i><span>Qo\'shish</span>';
      headerIcons.appendChild(addBtn);
    }
  }
  if (!adminBtn && headerIcons) {
    adminBtn = document.createElement('div');
    adminBtn.id = 'adminBtn';
    adminBtn.className = 'header-icon';
    adminBtn.style.cursor = 'pointer';
    adminBtn.innerHTML = '<i class="fas fa-shield-alt"></i><span>Admin</span>';
    headerIcons.appendChild(adminBtn);
  }
  if (addBtn) {
    if (userRole === 'seller' || userRole === 'admin') {
      addBtn.style.display = 'flex';
      addBtn.onclick = openAddProductModal;
      if (myListingsBtn) {
        myListingsBtn.style.display = 'flex';
        myListingsBtn.onclick = openMyListings;
      }
    } else {
      addBtn.style.display = 'none';
      if (myListingsBtn) myListingsBtn.style.display = 'none';
    }
  }
  if (adminBtn) {
    if (userRole === 'admin') {
      adminBtn.style.display = 'flex';
      adminBtn.onclick = openAdminModal;
    } else {
      adminBtn.style.display = 'none';
    }
  }
}

function openAddProductModal() {
  const modal = document.getElementById('addProductModal');
  if (modal) modal.style.display = 'flex';
  newProductImageValue = '';
  const imageUrlEl = document.getElementById('newImageUrl');
  const imageFileEl = document.getElementById('newImageFile');
  if (imageUrlEl) {
    imageUrlEl.value = '';
    imageUrlEl.oninput = () => {
      const val = imageUrlEl.value.trim();
      if (val && val !== 'Yuklangan rasm') newProductImageValue = val;
    };
  }
  if (imageFileEl) {
    imageFileEl.value = '';
    imageFileEl.onchange = async () => {
      const file = imageFileEl.files && imageFileEl.files[0];
      if (!file) return;
      const dataUrl = await resizeImageFileToDataUrl(file);
      newProductImageValue = dataUrl;
      if (imageUrlEl) imageUrlEl.value = 'Yuklangan rasm';
    };
  }
}

function closeAddProductModal() {
  const modal = document.getElementById('addProductModal');
  if (modal) modal.style.display = 'none';
  newProductImageValue = '';
}

async function openMyListings() {
  if (!useBackend) {
    const localPreview = products
      .slice(0, 10)
      .map((p, i) => `${i + 1}. ${p.name} - ${formatPrice(p.price)} so'm`)
      .join('\n');
    alert(localPreview || 'Hozircha e\'lon yo\'q');
    return;
  }

  try {
    const res = await api.getMyProducts();
    const list = (res.products || [])
      .map((p, i) => `${i + 1}. ${p.name} - ${formatPrice(p.price)} so'm`)
      .join('\n');
    alert(list || 'Sizda hozircha e\'lon yo\'q');
  } catch (e) {
    alert('E\'lonlarni yuklashda xatolik: ' + (e.message || e));
  }
}

function normalizeBackendCart(cartResponse) {
  const items = (cartResponse && cartResponse.items) ? cartResponse.items : [];
  return items.map((item) => {
    const product = (item.product && typeof item.product === 'object') ? item.product : null;
    return {
      id: product ? (product._id || product.id) : item.product,
      name: product ? product.name : item.name,
      price: product ? product.price : item.price,
      image: product ? product.image : '',
      quantity: item.quantity
    };
  });
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProductId(product) {
  return String(product._id || product.id);
}

function inferBrandFromName(productName = '') {
  const normalized = String(productName).toLowerCase();
  for (const keyword of BRAND_KEYWORDS) {
    if (normalized.includes(keyword)) return keyword;
  }
  if (normalized.includes('iphone')) return 'apple';
  if (normalized.includes('galaxy')) return 'samsung';
  return '';
}

function inferColorFromProduct(product, id) {
  const explicitColor = String(product.color || '').toLowerCase();
  if (COLOR_PALETTE.includes(explicitColor)) return explicitColor;
  const safeId = String(id || '');
  const hash = safeId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

function attachProductMeta(list) {
  return list
    .filter((product) => !HIDDEN_CATEGORIES.has(product.category))
    .map((product) => {
      const id = getProductId(product);
      if (!productLocations[id]) {
        const index = Math.abs(id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) % LOCATIONS.length;
        productLocations[id] = LOCATIONS[index];
      }
      const brand = String(product.brand || inferBrandFromName(product.name)).toLowerCase();
      const color = inferColorFromProduct(product, id);
      return { ...product, location: productLocations[id], brand, color };
    });
}

function isFavorite(productId) {
  return favorites.includes(String(productId));
}

function updateFavoritesUI() {
  const badge = document.getElementById('favoritesCount');
  if (badge) badge.textContent = String(favorites.length);
}

async function syncFavoritesFromBackend() {
  if (!useBackend || !api.getToken()) return;
  try {
    const res = await api.getFavorites();
    if (res && Array.isArray(res.favorites)) {
      favorites = res.favorites.map((id) => String(id));
      saveState('favorites', favorites);
      updateFavoritesUI();
      applyFilters();
    }
  } catch (error) {
    console.warn('Favorites sync failed:', error.message || error);
  }
}

async function persistFavoritesToBackend() {
  if (!useBackend || !api.getToken()) return;
  try {
    await api.updateFavorites(favorites);
  } catch (error) {
    console.warn('Favorites save failed:', error.message || error);
  }
}

function getStoredUser() {
  return loadState('user', null);
}

function applyHeaderUser(user) {
  if (!user) return;
  const userNameEl = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  const emailLoginBtn = document.getElementById('emailLoginBtn');
  const googleBtn = document.getElementById('googleSignInButton');
  const userInfo = document.getElementById('userInfo');
  const landing = document.getElementById('landingOverlay');

  if (userNameEl) userNameEl.textContent = user.name || user.email.split('@')[0];
  if (userAvatar) {
    userAvatar.src = user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || user.email || 'User');
  }

  if (emailLoginBtn) emailLoginBtn.style.display = 'none';
  if (googleBtn) googleBtn.style.display = 'none';
  if (userInfo) userInfo.style.display = 'inline-flex';
  if (landing) landing.style.display = 'none';
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageFileToDataUrl(file, maxSize = 360, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const width = Math.round(img.width * ratio);
        const height = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizePhoneInput(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('998')) return '+' + digits.slice(0, 12);
  return '+998' + digits.slice(0, 9);
}

function phoneForApi(raw) {
  return String(raw || '').replace(/\D/g, '');
}

function populateRegionSelect(selectedRegion = '') {
  const regionEl = document.getElementById('profileRegion');
  if (!regionEl) return;
  const regions = Object.keys(UZBEKISTAN_ADDRESS);
  regionEl.innerHTML = '<option value="">Viloyatni tanlang</option>' + regions
    .map((region) => `<option value="${region}">${region}</option>`)
    .join('');
  if (selectedRegion && regions.includes(selectedRegion)) {
    regionEl.value = selectedRegion;
  }
}

function populateDistrictSelect(region, selectedDistrict = '') {
  const districtEl = document.getElementById('profileDistrict');
  if (!districtEl) return;
  const districts = region ? (UZBEKISTAN_ADDRESS[region] || []) : [];
  districtEl.disabled = districts.length === 0;
  districtEl.innerHTML = '<option value="">Tumanni tanlang</option>' + districts
    .map((district) => `<option value="${district}">${district}</option>`)
    .join('');
  if (selectedDistrict && districts.includes(selectedDistrict)) {
    districtEl.value = selectedDistrict;
  }
}

function parseAddressToRegionDistrict(user) {
  const region = user.region || '';
  const district = user.district || '';
  if (region || district) return { region, district };

  const text = String(user.address || '');
  const parts = text.split(',').map((item) => item.trim()).filter(Boolean);
  if (parts.length < 2) return { region: '', district: '' };
  return { region: parts[0], district: parts[1] };
}

async function openProfileModal() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  modal.classList.add('open');

  const profile = api.getToken() ? await api.getProfile().catch(() => null) : null;
  const user = profile?.user || getStoredUser() || {};
  const avatarUrl = user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User');

  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const phoneEl = document.getElementById('profilePhone');
  const regionEl = document.getElementById('profileRegion');
  const districtEl = document.getElementById('profileDistrict');
  const addressLineEl = document.getElementById('profileAddressLine');
  const avatarUrlEl = document.getElementById('profileAvatarUrl');
  const avatarPreviewEl = document.getElementById('profileAvatarPreview');
  const avatarFileEl = document.getElementById('profileAvatarFile');
  const { region, district } = parseAddressToRegionDistrict(user);

  if (nameEl) nameEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || '';
  if (phoneEl) {
    phoneEl.value = normalizePhoneInput(user.phone || '');
    phoneEl.oninput = () => {
      phoneEl.value = normalizePhoneInput(phoneEl.value);
    };
  }
  if (regionEl) {
    populateRegionSelect(region);
    regionEl.onchange = () => {
      populateDistrictSelect(regionEl.value, '');
    };
  }
  populateDistrictSelect(region, district);
  if (addressLineEl) addressLineEl.value = user.addressLine || '';
  profileAvatarValue = user.avatar || '';
  if (avatarUrlEl) avatarUrlEl.value = (profileAvatarValue && profileAvatarValue.startsWith('data:')) ? 'Yuklangan rasm' : profileAvatarValue;
  if (avatarPreviewEl) avatarPreviewEl.src = avatarUrl;
  if (avatarFileEl) {
    avatarFileEl.value = '';
    avatarFileEl.onchange = async () => {
      const file = avatarFileEl.files && avatarFileEl.files[0];
      if (!file) return;
      const dataUrl = await resizeImageFileToDataUrl(file);
      profileAvatarValue = dataUrl;
      if (avatarPreviewEl) avatarPreviewEl.src = dataUrl;
      if (avatarUrlEl) avatarUrlEl.value = 'Yuklangan rasm';
    };
  }
  if (avatarUrlEl) {
    avatarUrlEl.oninput = () => {
      const val = avatarUrlEl.value.trim();
      if (val && val !== 'Yuklangan rasm') profileAvatarValue = val;
    };
  }
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('open');
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.remove('open');
}

async function openAdminModal() {
  const modal = document.getElementById('adminModal');
  const statsEl = document.getElementById('adminStats');
  if (!modal) return;
  modal.classList.add('open');
  if (statsEl) statsEl.innerHTML = '<p>Ma\'lumot yuklanmoqda...</p>';

  if (!useBackend || !api.getToken()) {
    if (statsEl) statsEl.innerHTML = '<p>Admin ma\'lumotlari uchun backend kerak.</p>';
    return;
  }

  try {
    const res = await api.getAdminDashboard();
    const d = res && res.dashboard ? res.dashboard : null;
    if (!d) {
      if (statsEl) statsEl.innerHTML = '<p>Ma\'lumot topilmadi.</p>';
      return;
    }
    if (statsEl) {
      statsEl.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
          <div class="stat-card"><strong>Buyers</strong><div>${d.totalBuyers ?? 0}</div></div>
          <div class="stat-card"><strong>Sellers</strong><div>${d.totalSellers ?? 0}</div></div>
          <div class="stat-card"><strong>Users</strong><div>${d.totalUsers ?? 0}</div></div>
          <div class="stat-card"><strong>Orders</strong><div>${d.totalOrders ?? 0}</div></div>
          <div class="stat-card"><strong>Products</strong><div>${d.totalProducts ?? 0}</div></div>
          <div class="stat-card"><strong>Revenue</strong><div>${formatPrice(d.totalRevenue || 0)} so'm</div></div>
        </div>
      `;
    }
  } catch (e) {
    if (statsEl) statsEl.innerHTML = `<p>Xatolik: ${e.message || e}</p>`;
  }
}

async function saveProfile() {
  if (useBackend && !api.getToken()) {
    alert('Profilni saqlash uchun login qiling');
    return;
  }

  const region = document.getElementById('profileRegion')?.value || '';
  const district = document.getElementById('profileDistrict')?.value || '';
  const addressLine = document.getElementById('profileAddressLine')?.value || '';
  if (!region || !district) {
    alert('Iltimos, viloyat va tumanni tanlang');
    return;
  }

  const combinedAddress = [region, district, addressLine].filter(Boolean).join(', ');
  const payload = {
    name: document.getElementById('profileName')?.value || '',
    phone: phoneForApi(document.getElementById('profilePhone')?.value || ''),
    address: combinedAddress,
    region,
    district,
    addressLine,
    avatar: profileAvatarValue || ''
  };

  try {
    // Very large base64 strings can fail DB write; keep payload small.
    if (payload.avatar && payload.avatar.startsWith('data:') && payload.avatar.length > 450000) {
      alert('Avatar rasmi juda katta. Kichikroq rasm tanlang.');
      return;
    }

    let res = null;
    if (useBackend) {
      res = await api.updateProfile(payload);
    } else {
      res = { user: { ...(getStoredUser() || {}), ...payload } };
    }
    if (res?.user) {
      const nextUser = {
        ...(getStoredUser() || {}),
        ...res.user,
        id: res.user._id || res.user.id
      };
      localStorage.setItem('user', JSON.stringify(nextUser));
      applyHeaderUser(nextUser);
      closeProfileModal();
      alert('Profil muvaffaqiyatli saqlandi');
    }
  } catch (error) {
    const backendError = error && error.body && error.body.error ? ` (${error.body.error})` : '';
    const fallbackUser = {
      ...(getStoredUser() || {}),
      ...payload
    };
    localStorage.setItem('user', JSON.stringify(fallbackUser));
    applyHeaderUser(fallbackUser);
    alert('Serverga saqlanmadi, lekin lokal saqlandi: ' + (error.message || error) + backendError);
  }
}

function toggleFavorite(productId) {
  const id = String(productId);
  if (isFavorite(id)) {
    favorites = favorites.filter((item) => item !== id);
  } else {
    favorites.push(id);
  }
  saveState('favorites', favorites);
  persistFavoritesToBackend();
  updateFavoritesUI();
  applyFilters();
  const modal = document.getElementById('favoritesModal');
  if (modal && modal.classList.contains('open')) renderFavoritesList();
}

function toggleFavoritesModal() {
  const modal = document.getElementById('favoritesModal');
  if (!modal) return;
  modal.classList.toggle('open');
  if (modal.classList.contains('open')) renderFavoritesList();
}

function renderFavoritesList() {
  const listEl = document.getElementById('favoritesList');
  if (!listEl) return;

  const favoriteProducts = products.filter((p) => isFavorite(getProductId(p)));
  if (favoriteProducts.length === 0) {
    listEl.innerHTML = '<p class="empty-cart">Hozircha sevimli mahsulot yo\'q</p>';
    return;
  }

  listEl.innerHTML = favoriteProducts.map((p) => `
    <div class="favorite-item">
      <div>
        <strong>${p.name}</strong>
        <div>${formatPrice(p.price)} so'm</div>
      </div>
      <button class="btn fav-btn" onclick="toggleFavorite('${getProductId(p)}')">O'chirish</button>
    </div>
  `).join('');
}

function getChats() {
  return loadState('product_chats', {});
}

function saveChats(chats) {
  saveState('product_chats', chats);
}

function openChat(productId) {
  const product = products.find((p) => getProductId(p) === String(productId));
  if (!product) return;
  activeChatProductId = String(productId);
  const title = document.getElementById('chatTitle');
  if (title) title.textContent = `${product.name} bo'yicha chat`;
  renderChatMessages();
  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.add('open');
}

function closeChatModal() {
  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.remove('open');
}

function renderChatMessages() {
  const box = document.getElementById('chatMessages');
  if (!box || !activeChatProductId) return;
  const chats = getChats();
  const messages = chats[activeChatProductId] || [];
  if (messages.length === 0) {
    box.innerHTML = '<p class="empty-cart">Xabarlar yo\'q. Birinchi bo\'lib yozing.</p>';
    return;
  }

  box.innerHTML = messages.map((msg) => `
    <div class="chat-row ${msg.from}">
      <div class="chat-bubble">${msg.text}</div>
    </div>
  `).join('');
  box.scrollTop = box.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !activeChatProductId) return;
  const text = input.value.trim();
  if (!text) return;

  const chats = getChats();
  const thread = chats[activeChatProductId] || [];
  thread.push({ from: 'me', text });
  chats[activeChatProductId] = thread;
  saveChats(chats);
  input.value = '';
  renderChatMessages();

  setTimeout(() => {
    const refreshed = getChats();
    const replyThread = refreshed[activeChatProductId] || [];
    replyThread.push({ from: 'seller', text: 'Rahmat, tez orada javob beraman.' });
    refreshed[activeChatProductId] = replyThread;
    saveChats(refreshed);
    renderChatMessages();
  }, 700);
}

function getActiveCategory() {
  const activeSidebar = document.querySelector('.filter-item.active');
  const activeNav = document.querySelector('.nav-btn.active');
  return (activeSidebar || activeNav)?.dataset.category || 'all';
}

function applyFilters() {
  const category = getActiveCategory();
  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const minPriceInput = document.getElementById('priceFilterMin');
  const maxPriceInput = document.getElementById('priceFilterMax') || document.getElementById('priceFilter');
  const rawMinPrice = Number(minPriceInput?.value || 0);
  const rawMaxPrice = Number(maxPriceInput?.value || 50000000);
  const minPrice = Math.min(rawMinPrice, rawMaxPrice);
  const maxPrice = Math.max(rawMinPrice, rawMaxPrice);
  const sortType = document.getElementById('sortFilter')?.value || 'default';
  const selectedLocation = document.getElementById('locationFilter')?.value || 'all';
  const selectedBrands = Array.from(document.querySelectorAll('.brand-filter input[type="checkbox"]:checked'))
    .map((input) => String(input.dataset.brand || '').toLowerCase())
    .filter(Boolean);
  const selectedColor = document.querySelector('.color-swatch.active')?.dataset.color || '';

  let filtered = [...products];
  if (category !== 'all') filtered = filtered.filter((p) => p.category === category);
  filtered = filtered.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);
  if (searchTerm) filtered = filtered.filter((p) => String(p.name).toLowerCase().includes(searchTerm));
  if (selectedLocation !== 'all') filtered = filtered.filter((p) => p.location === selectedLocation);
  if (selectedBrands.length > 0) filtered = filtered.filter((p) => selectedBrands.includes(String(p.brand || '').toLowerCase()));
  if (selectedColor) filtered = filtered.filter((p) => String(p.color || '').toLowerCase() === selectedColor);

  if (sortType === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sortType === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sortType === 'new') filtered = [...filtered].reverse();

  displayProducts(filtered);
}

async function submitNewProduct() {
  const name = (document.getElementById('newName')?.value || '').trim();
  const price = parseInt(document.getElementById('newPrice')?.value, 10) || 0;
  const stock = parseInt(document.getElementById('newStock')?.value, 10) || 0;
  const colorRaw = (document.getElementById('newColor')?.value || '').trim().toLowerCase();
  const category = document.getElementById('newCategory')?.value || 'telefon';
  const imageUrlInput = (document.getElementById('newImageUrl')?.value || '').trim();
  const description = document.getElementById('newDescription')?.value || '';

  const colorMap = { 'qora': 'black', 'oq': 'white', 'qizil': 'red', "ko'k": 'blue', 'kok': 'blue', 'sariq': 'yellow' };
  const color = colorMap[colorRaw] || colorRaw;

  if (!name || price <= 0) { alert('Iltimos nom va to\'g\'ri narx kiriting'); return; }
  if (stock <= 0) { alert('Iltimos mahsulot sonini kiriting'); return; }

  const image = newProductImageValue || imageUrlInput || `https://picsum.photos/seed/new${Date.now()}/400/300`;
  if (image && image.startsWith('data:') && image.length > 450000) {
    alert('Rasm hajmi juda katta. Kichikroq rasm tanlang.');
    return;
  }

  const payload = { name, price, oldPrice: Math.round(price * 1.12), category, image, description, stock, color };

  if (useBackend) {
    try {
      const res = await api.createProduct(payload);
      if (res && res.product) {
        alert('Mahsulot serverga yuborildi');
        await loadProductsFromBackend();
        applyFilters();
        closeAddProductModal();
      }
    } catch (e) {
      alert('Serverga yuborishda xatolik: ' + (e.message || e));
    }
  } else {
    const newProduct = { id: Date.now(), name, price, oldPrice: Math.round(price * 1.12), category, image, rating: 4.0, stock, color, description };
    products = attachProductMeta([newProduct, ...products]);
    saveState('product_locations', productLocations);
    applyFilters();
    closeAddProductModal();
  }
}

// BACKEND FUNCTIONS
async function loadProductsFromBackend() {
  try {
    const result = await api.getProducts();
    if (result.success && result.products.length > 0) {
      products = attachProductMeta(result.products);
      saveState('product_locations', productLocations);
    }
  } catch (error) {
    console.error('Failed to load from backend:', error);
  }
}

// MAHSULOTLARNI KO'RSATISH
function displayProducts(productsToDisplay = products) {
  const catalog = document.getElementById("catalog");
  if (!catalog) return;
  catalog.innerHTML = "";

  productsToDisplay.forEach(product => {
    const id = getProductId(product);
    const isFav = isFavorite(id);
    const favoriteClass = isFav ? 'side-action-btn active' : 'side-action-btn';
    const favoriteIcon = isFav ? 'fas fa-heart' : 'far fa-heart';

    // Convert rating to stars
    const fullStars = Math.floor(product.rating || 0);
    const starsHtml = '<i class="fas fa-star" style="color:#FFD93D;font-size:12px;"></i>'.repeat(fullStars) +
      (product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt" style="color:#FFD93D;font-size:12px;"></i>' : '');

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="image-container">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" style="cursor:pointer;">
      </div>
      <div class="card-content">
        <div class="price-row">
          <span class="price">${formatPrice(product.price)} so'm</span>
          ${product.oldPrice ? `<span class="oldPrice">${formatPrice(product.oldPrice)} so'm</span>` : ''}
        </div>
        <h4 class="product-title" style="cursor:pointer;">${product.name}</h4>
        
        <div class="card-meta">
          <div class="card-location"><i class="fas fa-location-dot"></i> ${product.location || 'Toshkent'}</div>
          <div class="card-rating">${starsHtml} <span style="font-weight:700;margin-left:4px;">${product.rating || 0}</span></div>
        </div>

        <div class="card-actions">
          <button class="main-action-btn" onclick="event.stopPropagation(); addToCart('${id}')">Savatga qo'shish</button>
          <button class="${favoriteClass}" onclick="event.stopPropagation(); toggleFavorite('${id}')" title="Sevimliga qo'shish">
            <i class="${favoriteIcon}"></i>
          </button>
          <button class="side-action-btn" onclick="event.stopPropagation(); openChat('${id}')" title="Sotuvchi bilan bog'lanish">
            <i class="far fa-comment-dots"></i>
          </button>
        </div>
      </div>
    `;

    const imageEl = card.querySelector('.product-image');
    const titleEl = card.querySelector('.product-title');
    if (imageEl) imageEl.onclick = () => goToProduct(id);
    if (titleEl) titleEl.onclick = () => goToProduct(id);
    catalog.appendChild(card);
  });
}

// Product detail page ga o'tish
function goToProduct(id) {
  window.location.href = `krosovka.html?id=${id}`;
}

// NARX FORMATLASH
function formatPrice(price) {
  return price.toLocaleString('uz-UZ');
}

// SAVTGA QO'SHISH
async function addToCart(productId) {
  // support numeric id or string _id from backend
  const product = products.find(p => String(p.id) === String(productId) || String(p._id) === String(productId));
  const existingItem = cart.find(item => String(item.id) === String(productId));

  if (useBackend) {
    try {
      const result = await api.addToCart(productId, 1);
      if (result.success) {
        cart = normalizeBackendCart(result.cart);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  } else {
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  }

  saveCart();
  updateCartUI();
}

// SAVATNI O'CHIRISH
async function removeFromCart(productId) {
  if (useBackend) {
    try {
      const result = await api.removeFromCart(productId);
      if (result.success) {
        cart = normalizeBackendCart(result.cart);
        saveCart();
        updateCartUI();
      }
      return;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  }

  cart = cart.filter(item => String(item.id) !== String(productId));
  saveCart();
  updateCartUI();
}

// MIQDORNI O'ZGARTIRISH
async function updateQuantity(productId, quantity) {
  const item = cart.find(item => String(item.id) === String(productId));
  if (item) {
    if (useBackend) {
      try {
        const result = await api.updateCart(productId, Math.max(0, quantity));
        if (result.success) {
          cart = normalizeBackendCart(result.cart);
          saveCart();
          updateCartUI();
        }
        return;
      } catch (error) {
        console.error('Failed to update cart:', error);
      }
    }

    item.quantity = Math.max(1, quantity);
    saveCart();
    updateCartUI();
  }
}

// SAVAT UI NI YANGILASH
function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Savat bo\'sh</p>';
    cartTotal.textContent = "0 so'm";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} so'm</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
        <div class="remove-item" onclick="removeFromCart('${item.id}')">Olib tashla</div>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `${formatPrice(total)} so'm`;
}

// SAVAT OCHISH/YOPISH
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("overlay");

  cartSidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

// LOKALDA SAQLASH
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
}

// KATEGORIYA FILTRI (SIDEBAR)
document.querySelectorAll(".filter-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-item, .nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Sync with top nav if exists
    const cat = btn.dataset.category;
    const navBtn = document.querySelector(`.nav-btn[data-category="${cat}"]`);
    if (navBtn) navBtn.classList.add("active");
    applyFilters();
  });
});

// KATEGORIYA FILTRI (TOP NAV)
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn, .filter-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Sync with sidebar if exists
    const cat = btn.dataset.category;
    const sideBtn = document.querySelector(`.filter-item[data-category="${cat}"]`);
    if (sideBtn) sideBtn.classList.add("active");
    applyFilters();
  });
});

// NARX FILTRI
function syncPriceFilterUI(activeHandle = 'max') {
  const minInput = document.getElementById('priceFilterMin');
  const maxInput = document.getElementById('priceFilterMax') || document.getElementById('priceFilter');
  const minDisplay = document.getElementById('priceMinDisplay');
  const maxDisplay = document.getElementById('priceMaxDisplay');
  if (!maxInput) return;

  let minPrice = parseInt(minInput?.value || '0', 10);
  let maxPrice = parseInt(maxInput.value || '50000000', 10);
  if (Number.isNaN(minPrice)) minPrice = 0;
  if (Number.isNaN(maxPrice)) maxPrice = 50000000;

  if (minInput && minPrice > maxPrice) {
    if (activeHandle === 'min') {
      maxPrice = minPrice;
      maxInput.value = String(maxPrice);
    } else {
      minPrice = maxPrice;
      minInput.value = String(minPrice);
    }
  }

  if (minDisplay) minDisplay.textContent = String(minPrice);
  if (maxDisplay) maxDisplay.textContent = String(maxPrice);

  const rangeFill = document.getElementById('priceRangeFill');
  if (rangeFill) {
    const min = Number(maxInput.min || 0);
    const max = Number(maxInput.max || 50000000);
    const span = Math.max(1, max - min);
    const left = ((minPrice - min) / span) * 100;
    const right = 100 - ((maxPrice - min) / span) * 100;
    rangeFill.style.left = `${Math.max(0, Math.min(100, left))}%`;
    rangeFill.style.right = `${Math.max(0, Math.min(100, right))}%`;
  }
}

const priceFilterMin = document.getElementById('priceFilterMin');
const priceFilterMax = document.getElementById('priceFilterMax') || document.getElementById('priceFilter');
if (priceFilterMin) {
  priceFilterMin.addEventListener('input', () => {
    syncPriceFilterUI('min');
    applyFilters();
  });
}
if (priceFilterMax) {
  priceFilterMax.addEventListener('input', () => {
    syncPriceFilterUI('max');
    applyFilters();
  });
}

syncPriceFilterUI('max');

document.querySelectorAll('.brand-filter input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener('change', applyFilters);
});

document.querySelectorAll('.color-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const shouldActivate = !swatch.classList.contains('active');
    document.querySelectorAll('.color-swatch').forEach((item) => item.classList.remove('active'));
    if (shouldActivate) swatch.classList.add('active');
    applyFilters();
  });
});

// QIDIRISH
document.getElementById("searchInput").addEventListener("input", (e) => {
  applyFilters();
});

// SEARCH BUTTON
document.querySelector(".search-btn").addEventListener("click", () => {
  document.getElementById("searchInput").focus();
});

// SORTING
document.getElementById("sortFilter").addEventListener("change", (e) => {
  applyFilters();
});

const locationFilter = document.getElementById("locationFilter");
if (locationFilter) {
  locationFilter.addEventListener("change", (e) => {
    localStorage.setItem('selected_location', e.target.value);
    applyFilters();
  });
}

const chatInput = document.getElementById('chatInput');
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

window.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'favoritesModal') {
    toggleFavoritesModal();
  }
  if (e.target && e.target.id === 'chatModal') {
    closeChatModal();
  }
  if (e.target && e.target.id === 'profileModal') {
    closeProfileModal();
  }
});

window.syncFavoritesFromBackend = syncFavoritesFromBackend;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.saveProfile = saveProfile;

// Global exports for auth logic used in index.html
window.handleLandingSignIn = handleLandingSignIn;
window.handleLandingSignup = handleLandingSignup;
window.showUser = applyHeaderUser;
window.logout = function () {
  if (useBackend) api.logout();
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  location.reload();
};

// CHECKOUT
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Savat bo'sh!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const message = `Sotib olish:\n\n${cart.map(p => `${p.name} x${p.quantity}`).join("\n")}\n\nJami: ${formatPrice(total)} so'm`;
  alert(message);

  cart = [];
  saveCart();
  updateCartUI();
  toggleCart();
});

// INITIALIZATION
initApp();
