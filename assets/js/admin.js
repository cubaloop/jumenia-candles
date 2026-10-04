/**
 * JUMENIA CANDLES - User Authentication & 5-Tab Admin Dashboard Controller
 * Tierra Querida Proven Architecture
 */

// User & Auth State
let currentUser = JSON.parse(localStorage.getItem('jumenia_current_user') || 'null');
let allOrders = JSON.parse(localStorage.getItem('jumenia_orders') || '[]');

// Admin Module Initializer
function initAdminModule() {
  setupAuthModal();
  setupAdminDashboard();
  updateAuthUI();
}

// ----------------------------------------------------
// 1. User Authentication (Customers + Admin)
// ----------------------------------------------------
function setupAuthModal() {
  const modal = document.getElementById('auth-modal');
  const trigger = document.getElementById('open-auth-trigger');
  const closeBtn = document.getElementById('close-auth-modal-btn');
  const overlay = document.getElementById('auth-modal-overlay');
  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (trigger) {
    trigger.addEventListener('click', () => {
      if (currentUser) {
        showUserProfileModal();
      } else {
        openAuthModal('login');
      }
    });
  }

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
      } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
      }
    });
  });

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Check Admin Credentials
      if ((email.toLowerCase() === 'admin@jumenia.com' && password === 'admin123') ||
          (email.toLowerCase() === 'admin' && password === 'admin')) {
        currentUser = {
          role: 'admin',
          email: 'admin@jumenia.com',
          name: 'Master Admin'
        };
        localStorage.setItem('jumenia_current_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal();
        showToast('?? Welcome back, Master Administrator!');
        openAdminDashboard();
        return;
      }

      // Customer Login (from localStorage registered users)
      const users = JSON.parse(localStorage.getItem('jumenia_registered_users') || '[]');
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (found) {
        currentUser = {
          role: 'customer',
          email: found.email,
          name: found.name,
          phone: found.phone || '',
          emirate: found.emirate || 'Dubai',
          address: found.address || ''
        };
        localStorage.setItem('jumenia_current_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal();
        showToast(`? Welcome back, ${currentUser.name}!`);
      } else {
        // Allow guest login or alert
        alert('Invalid email or password. For Admin access use: admin@jumenia.com / admin123');
      }
    });
  }

  // Register Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const emirate = document.getElementById('reg-emirate').value;
      const address = document.getElementById('reg-address').value.trim();
      const password = document.getElementById('reg-password').value;

      const users = JSON.parse(localStorage.getItem('jumenia_registered_users') || '[]');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('An account with this email already exists.');
        return;
      }

      const newUser = { name, email, phone, emirate, address, password, role: 'customer' };
      users.push(newUser);
      localStorage.setItem('jumenia_registered_users', JSON.stringify(users));

      currentUser = { role: 'customer', name, email, phone, emirate, address };
      localStorage.setItem('jumenia_current_user', JSON.stringify(currentUser));

      updateAuthUI();
      closeModal();
      showToast(`?? Account created! Welcome, ${name}!`);
    });
  }
}

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  tabBtns.forEach(b => {
    if (b.dataset.tab === tab) b.classList.add('active');
    else b.classList.remove('active');
  });

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  }
}

function updateAuthUI() {
  const trigger = document.getElementById('open-auth-trigger');
  const adminPill = document.getElementById('admin-header-pill');

  if (currentUser) {
    if (trigger) {
      trigger.innerHTML = currentUser.role === 'admin' 
        ? '<i class="fas fa-crown" style="color: #A68758;"></i>' 
        : '<i class="fas fa-user-check" style="color: #A68758;"></i>';
      trigger.title = currentUser.name;
    }

    if (currentUser.role === 'admin') {
      if (adminPill) adminPill.style.display = 'inline-flex';
    } else {
      if (adminPill) adminPill.style.display = 'none';
    }
  } else {
    if (trigger) {
      trigger.innerHTML = '<i class="fas fa-user"></i>';
      trigger.title = 'Account / Admin Login';
    }
    if (adminPill) adminPill.style.display = 'none';
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('jumenia_current_user');
  updateAuthUI();
  
  const userModal = document.getElementById('user-profile-modal');
  if (userModal) userModal.classList.remove('active');
  
  const adminModal = document.getElementById('admin-modal');
  if (adminModal) adminModal.classList.remove('active');
  
  document.body.style.overflow = '';
  showToast('?? You have been logged out.');
}

function showUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal || !currentUser) return;

  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-email').textContent = currentUser.email;
  document.getElementById('profile-role').textContent = currentUser.role === 'admin' ? '?? Master Administrator' : '??? Valued Customer';

  const customerDetails = document.getElementById('profile-customer-details');
  if (currentUser.role === 'customer') {
    if (customerDetails) customerDetails.style.display = 'block';
    document.getElementById('profile-phone').textContent = currentUser.phone || 'Not specified';
    document.getElementById('profile-emirate').textContent = currentUser.emirate || 'Dubai';
    document.getElementById('profile-address').textContent = currentUser.address || 'Not specified';
  } else {
    if (customerDetails) customerDetails.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ----------------------------------------------------
// 2. 5-Tab Admin Dashboard (Tierra Querida Architecture)
// ----------------------------------------------------
let editingProductId = null;

function setupAdminDashboard() {
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('close-admin-modal-btn');
  const overlay = document.getElementById('admin-modal-overlay');
  const navTabs = document.querySelectorAll('.admin-nav-tab');

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.adminTab;
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(`admin-pane-${targetTab}`);
      if (targetPane) targetPane.classList.add('active');

      // Refresh data on tab switch
      if (targetTab === 'products') renderAdminProductsTable();
      if (targetTab === 'categories') renderAdminCategoriesList();
      if (targetTab === 'announcements') renderAdminAnnouncementsForm();
      if (targetTab === 'orders') renderAdminOrdersTable();
      if (targetTab === 'supabase') renderAdminSupabaseSettings();
    });
  });

  // Setup Product Image Compressor Dropzone
  const imgInput = document.getElementById('admin-prod-image-file');
  const imgPreview = document.getElementById('admin-prod-img-preview');
  if (imgInput) {
    imgInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        try {
          const compressedBase64 = await window.JumeniaCloud.compressImageFile(e.target.files[0], 800, 0.8);
          document.getElementById('admin-prod-image-url').value = compressedBase64;
          if (imgPreview) {
            imgPreview.src = compressedBase64;
            imgPreview.style.display = 'block';
          }
          showToast('?? Image compressed & prepared (<50KB)');
        } catch (err) {
          alert('Failed to compress image: ' + err);
        }
      }
    });
  }

  // Setup Product Save Form
  const productForm = document.getElementById('admin-product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFromAdmin();
    });
  }

  // Setup Category Save Form
  const catForm = document.getElementById('admin-category-form');
  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCategoryFromAdmin();
    });
  }

  // Setup Announcements Save Form
  const annForm = document.getElementById('admin-announcements-form');
  if (annForm) {
    annForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAnnouncementsFromAdmin();
    });
  }

  // Setup Supabase Settings Form
  const sbForm = document.getElementById('admin-supabase-form');
  if (sbForm) {
    sbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSupabaseSettingsFromAdmin();
    });
  }
}

function openAdminDashboard() {
  if (!currentUser || currentUser.role !== 'admin') {
    openAuthModal('login');
    return;
  }

  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  renderAdminProductsTable();
  renderAdminCategoriesList();
  renderAdminAnnouncementsForm();
  renderAdminOrdersTable();
  renderAdminSupabaseSettings();
}

// ----------------------------------------------------
// TAB 1: Product Inventory CRUD
// ----------------------------------------------------
function renderAdminProductsTable() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  const products = window.getProductsState();
  const search = (document.getElementById('admin-product-search')?.value || '').toLowerCase();

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) || 
    p.categoryName.toLowerCase().includes(search) ||
    p.notes.toLowerCase().includes(search)
  );

  container.innerHTML = filtered.map(p => `
    <tr>
      <td style="width: 60px;">
        <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; background: #fff; border-radius: 4px; border: 1px solid #EAE3DA;" />
      </td>
      <td>
        <strong style="color: var(--color-primary);">${p.name}</strong>
        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${p.badge ? '??? ' + p.badge : ''} ? ?? ${p.burnTime}</div>
      </td>
      <td><span class="admin-badge-cat">${p.categoryName}</span></td>
      <td><strong style="color: var(--color-primary); font-size: 1.05rem;">${p.price} AED</strong></td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn-admin-action edit" onclick="editProductInAdmin('${p.id}')" title="Edit Candle">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-admin-action delete" onclick="deleteProductInAdmin('${p.id}')" title="Delete Candle">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Populate category select in product modal
  const catSelect = document.getElementById('admin-prod-category');
  if (catSelect) {
    const categories = window.getCategoriesState();
    catSelect.innerHTML = categories.filter(c => c.id !== 'all' && c.id !== 'under-50').map(c => `
      <option value="${c.id}">${c.name}</option>
    `).join('') + '<option value="__custom__">+ Add Custom Category...</option>';
  }
}

function resetProductForm() {
  editingProductId = null;
  document.getElementById('admin-product-modal-title').textContent = 'Add New Artisanal Candle';
  document.getElementById('admin-product-form').reset();
  document.getElementById('admin-prod-id').value = '';
  document.getElementById('admin-prod-image-url').value = '';
  const imgPreview = document.getElementById('admin-prod-img-preview');
  if (imgPreview) {
    imgPreview.src = '';
    imgPreview.style.display = 'none';
  }
}

function openAddProductModal() {
  resetProductForm();
  document.getElementById('admin-product-edit-modal').classList.add('active');
}

function editProductInAdmin(productId) {
  const products = window.getProductsState();
  const product = products.find(p => p.id === String(productId));
  if (!product) return;

  editingProductId = product.id;
  document.getElementById('admin-product-modal-title').textContent = `Edit Candle: ${product.name}`;
  document.getElementById('admin-prod-id').value = product.id;
  document.getElementById('admin-prod-name').value = product.name;
  document.getElementById('admin-prod-category').value = product.category;
  document.getElementById('admin-prod-price').value = product.price;
  document.getElementById('admin-prod-burn').value = product.burnTime || '50 Hours';
  document.getElementById('admin-prod-wax').value = product.waxType || '100% Soy Wax';
  document.getElementById('admin-prod-badge').value = product.badge || '';
  document.getElementById('admin-prod-notes').value = product.notes || '';
  document.getElementById('admin-prod-desc').value = product.description || '';
  document.getElementById('admin-prod-image-url').value = product.image;

  const imgPreview = document.getElementById('admin-prod-img-preview');
  if (imgPreview) {
    imgPreview.src = product.image;
    imgPreview.style.display = 'block';
  }

  document.getElementById('admin-product-edit-modal').classList.add('active');
}

async function saveProductFromAdmin() {
  const id = document.getElementById('admin-prod-id').value || `jum-${Date.now()}`;
  const name = document.getElementById('admin-prod-name').value.trim();
  let category = document.getElementById('admin-prod-category').value;
  let categoryName = document.getElementById('admin-prod-category').selectedOptions[0]?.text || 'Luxury Candle';
  
  // Custom Category Handling
  if (category === '__custom__') {
    const customName = prompt('Enter new category name:');
    if (!customName) return;
    category = customName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    categoryName = customName;
    window.addCategoryState({ id: category, name: categoryName });
  }

  const price = Number(document.getElementById('admin-prod-price').value) || 49;
  const burnTime = document.getElementById('admin-prod-burn').value.trim() || '50 Hours';
  const waxType = document.getElementById('admin-prod-wax').value.trim() || '100% Soy Wax';
  const badge = document.getElementById('admin-prod-badge').value.trim();
  const notes = document.getElementById('admin-prod-notes').value.trim();
  const description = document.getElementById('admin-prod-desc').value.trim();
  const image = document.getElementById('admin-prod-image-url').value || 'assets/images/candle_1.jpg';

  const productData = {
    id: String(id),
    name,
    category,
    categoryName,
    price,
    burnTime,
    waxType,
    badge,
    notes,
    description,
    image
  };

  // 1. Update Local State
  window.saveProductState(productData);

  // 2. Sync to Supabase Cloud
  await window.JumeniaCloud.saveProductToCloud(productData);

  // 3. UI Update
  document.getElementById('admin-product-edit-modal').classList.remove('active');
  renderAdminProductsTable();
  window.renderProducts();
  showToast(`? Product "${name}" saved and synced to cloud!`);
}

async function deleteProductInAdmin(productId) {
  if (!confirm('Are you sure you want to delete this candle product? This will sync locally and to Supabase.')) return;

  window.deleteProductState(productId);
  await window.JumeniaCloud.deleteProductFromCloud(productId);

  renderAdminProductsTable();
  window.renderProducts();
  showToast('??? Product deleted and synced.');
}

// ----------------------------------------------------
// TAB 2: Categories Engine
// ----------------------------------------------------
function renderAdminCategoriesList() {
  const container = document.getElementById('admin-categories-list');
  if (!container) return;

  const categories = window.getCategoriesState();
  container.innerHTML = categories.map(c => `
    <div class="admin-category-card">
      <div>
        <strong style="color: var(--color-primary); font-size: 1rem;">${c.name}</strong>
        <span style="font-size: 0.75rem; color: var(--color-text-muted); display: block;">Slug: ${c.id}</span>
      </div>
      ${(c.id !== 'all' && c.id !== 'under-50') ? `
        <button class="btn-admin-action delete" onclick="deleteCategoryInAdmin('${c.id}')" title="Delete Category">
          <i class="fas fa-trash-alt"></i>
        </button>
      ` : '<span style="font-size: 0.75rem; color: var(--color-accent-dark); font-weight: 600;">System Protected</span>'}
    </div>
  `).join('');
}

async function saveCategoryFromAdmin() {
  const name = document.getElementById('admin-new-cat-name').value.trim();
  if (!name) return;

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const catObj = { id, name };

  window.addCategoryState(catObj);
  await window.JumeniaCloud.saveCategoryToCloud(catObj);

  document.getElementById('admin-new-cat-name').value = '';
  renderAdminCategoriesList();
  window.renderCategoryNav();
  showToast(`? Category "${name}" added and synced!`);
}

async function deleteCategoryInAdmin(categoryId) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  window.deleteCategoryState(categoryId);
  await window.JumeniaCloud.deleteCategoryFromCloud(categoryId);

  renderAdminCategoriesList();
  window.renderCategoryNav();
  showToast('??? Category deleted.');
}

// ----------------------------------------------------
// TAB 3: Announcements, Banner & Shipping
// ----------------------------------------------------
function renderAdminAnnouncementsForm() {
  const config = window.getConfigState();
  document.getElementById('admin-cfg-phone').value = config.whatsappPhone || '971526680498';
  document.getElementById('admin-cfg-threshold').value = config.freeShippingThreshold || 200;
  document.getElementById('admin-cfg-fee').value = config.shippingFee || 20;

  const annContainer = document.getElementById('admin-announcements-inputs');
  if (annContainer) {
    const list = config.announcements || window.JumeniaCloud.DEFAULT_ANNOUNCEMENTS;
    annContainer.innerHTML = list.map((msg, idx) => `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <input type="text" class="admin-ann-item" value="${msg}" style="flex: 1;" />
        <button type="button" class="btn-admin-action delete" onclick="this.parentElement.remove()" title="Remove line"><i class="fas fa-times"></i></button>
      </div>
    `).join('');
  }
}

function addAnnouncementLine() {
  const annContainer = document.getElementById('admin-announcements-inputs');
  if (!annContainer) return;
  const div = document.createElement('div');
  div.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
  div.innerHTML = `
    <input type="text" class="admin-ann-item" placeholder="e.g. ? New Collection Launched" style="flex: 1;" />
    <button type="button" class="btn-admin-action delete" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;
  annContainer.appendChild(div);
}

async function saveAnnouncementsFromAdmin() {
  const phone = document.getElementById('admin-cfg-phone').value.trim();
  const threshold = Number(document.getElementById('admin-cfg-threshold').value) || 200;
  const fee = Number(document.getElementById('admin-cfg-fee').value) || 20;

  const annInputs = document.querySelectorAll('.admin-ann-item');
  const announcements = Array.from(annInputs).map(i => i.value.trim()).filter(v => v.length > 0);

  const newConfig = {
    ...window.getConfigState(),
    whatsappPhone: phone,
    freeShippingThreshold: threshold,
    shippingFee: fee,
    announcements: announcements.length > 0 ? announcements : window.JumeniaCloud.DEFAULT_ANNOUNCEMENTS
  };

  window.saveConfigState(newConfig);
  await window.JumeniaCloud.saveConfigToCloud(newConfig);

  window.renderAnnouncementBar();
  showToast('? Store announcements & delivery settings updated and synced!');
}

// ----------------------------------------------------
// TAB 4: Orders & WhatsApp Log
// ----------------------------------------------------
function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('jumenia_orders') || '[]');
  if (orders.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No orders recorded yet. As customers order via WhatsApp tickets, they will automatically appear here.</td></tr>';
    return;
  }

  container.innerHTML = orders.slice().reverse().map(o => `
    <tr>
      <td><strong>${o.id || 'N/A'}</strong></td>
      <td>${new Date(o.date || o.created_at).toLocaleDateString()}</td>
      <td>
        <strong>${o.name}</strong>
        <div style="font-size: 0.75rem; color: var(--color-text-muted);"><i class="fab fa-whatsapp" style="color: #25D366;"></i> ${o.phone}</div>
      </td>
      <td><span class="admin-badge-cat">${o.emirate}</span></td>
      <td><strong style="color: var(--color-primary);">${o.total} AED</strong></td>
      <td style="font-size: 0.8rem; color: var(--color-text-muted);">
        ${(o.items || []).map(i => `${i.qty}x ${i.name}`).join(', ')}
      </td>
    </tr>
  `).join('');
}

// ----------------------------------------------------
// TAB 5: Supabase Cloud & Resguardo Backup
// ----------------------------------------------------
function renderAdminSupabaseSettings() {
  const savedConfig = JSON.parse(localStorage.getItem('jumenia_supabase_config') || '{}');
  document.getElementById('admin-sb-url').value = savedConfig.url || (window.ENV && window.ENV.VITE_SUPABASE_URL) || 'https://jyrqzjctkmzdvmraqrcv.supabase.co';
  document.getElementById('admin-sb-key').value = savedConfig.anonKey || (window.ENV && window.ENV.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cnF6amN0a216ZHZtcmFxcmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODE1NzQsImV4cCI6MjEwMTg1NzU3NH0.dummy';
  document.getElementById('admin-sb-sql-code').textContent = window.JumeniaCloud.SUPABASE_SQL_SCHEMA;
}

function saveSupabaseSettingsFromAdmin() {
  const url = document.getElementById('admin-sb-url').value.trim();
  const anonKey = document.getElementById('admin-sb-key').value.trim();

  localStorage.setItem('jumenia_supabase_config', JSON.stringify({ url, anonKey }));
  window.JumeniaCloud.initSupabase();
  showToast('?? Supabase credentials saved locally!');
  testSupabaseConnection();
}

async function testSupabaseConnection() {
  const statusEl = document.getElementById('admin-sb-connection-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing connection to Supabase...';

  try {
    const client = window.JumeniaCloud.initSupabase();
    if (!client) {
      statusEl.innerHTML = '<span style="color: #D9534F;"><i class="fas fa-exclamation-circle"></i> Supabase client not initialized. Check credentials.</span>';
      return;
    }

    const { data, error } = await client.from('jumenia_products').select('count', { count: 'exact', head: true });
    if (error) {
      statusEl.innerHTML = `<span style="color: #D9534F;"><i class="fas fa-exclamation-triangle"></i> Connected, but tables need creation: ${error.message}</span>`;
    } else {
      statusEl.innerHTML = '<span style="color: #2E7D32;"><i class="fas fa-check-circle"></i> Connected to Supabase Successfully! Database is Live.</span>';
    }
  } catch (err) {
    statusEl.innerHTML = `<span style="color: #D9534F;"><i class="fas fa-times-circle"></i> Connection failed: ${err.message}</span>`;
  }
}

function downloadJSONBackup() {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    products: window.getProductsState(),
    categories: window.getCategoriesState(),
    config: window.getConfigState(),
    orders: JSON.parse(localStorage.getItem('jumenia_orders') || '[]')
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jumenia-candles-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('?? Complete store backup JSON downloaded!');
}

function restoreJSONBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products) localStorage.setItem('jumenia_products', JSON.stringify(data.products));
      if (data.categories) localStorage.setItem('jumenia_categories', JSON.stringify(data.categories));
      if (data.config) localStorage.setItem('jumenia_config', JSON.stringify(data.config));
      if (data.orders) localStorage.setItem('jumenia_orders', JSON.stringify(data.orders));

      window.location.reload();
    } catch (err) {
      alert('Invalid backup JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function copySQLSchema() {
  navigator.clipboard.writeText(window.JumeniaCloud.SUPABASE_SQL_SCHEMA).then(() => {
    showToast('?? Supabase SQL Schema copied to clipboard!');
  });
}

// Export Admin Controller to Window
window.initAdminModule = initAdminModule;
window.openAdminDashboard = openAdminDashboard;
window.openAddProductModal = openAddProductModal;
window.editProductInAdmin = editProductInAdmin;
window.deleteProductInAdmin = deleteProductInAdmin;
window.deleteCategoryInAdmin = deleteCategoryInAdmin;
window.addAnnouncementLine = addAnnouncementLine;
window.testSupabaseConnection = testSupabaseConnection;
window.downloadJSONBackup = downloadJSONBackup;
window.restoreJSONBackup = restoreJSONBackup;
window.copySQLSchema = copySQLSchema;
window.logoutUser = logoutUser;
window.openAuthModal = openAuthModal;
