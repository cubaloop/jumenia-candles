/**
 * JUMENIA CANDLES - Controlador de Autenticaci?n de Usuarios y Panel de Administraci?n en Espa?ol
 * Arquitectura de Doble Capa y Supabase Cloud (Tierra Querida)
 */

// Estado de Usuario y Pedidos
let currentUser = JSON.parse(localStorage.getItem('jumenia_current_user') || 'null');
let allOrders = JSON.parse(localStorage.getItem('jumenia_orders') || '[]');

// Inicializador del M?dulo de Administraci?n
function initAdminModule() {
  setupAuthModal();
  setupAdminDashboard();
  updateAuthUI();
}

// ----------------------------------------------------
// 1. Autenticaci?n de Usuarios (Clientes + Admin)
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

  // Env?o de Formulario de Inicio de Sesi?n
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Verificaci?n de Credenciales de Administrador
      if ((email.toLowerCase() === 'admin@jumenia.com' && password === 'admin123') ||
          (email.toLowerCase() === 'admin' && password === 'admin')) {
        currentUser = {
          role: 'admin',
          email: 'admin@jumenia.com',
          name: 'Administrador Maestro'
        };
        localStorage.setItem('jumenia_current_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal();
        showToast('?? ?Bienvenido de nuevo, Administrador Maestro!');
        openAdminDashboard();
        return;
      }

      // Inicio de sesi?n de Cliente (desde localStorage)
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
        showToast(`? ?Bienvenido de nuevo, ${currentUser.name}!`);
      } else {
        alert('Correo electr?nico o contrase?a incorrectos. Para acceso de Administrador usa: admin@jumenia.com / admin123');
      }
    });
  }

  // Env?o de Formulario de Registro
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
        alert('Ya existe una cuenta registrada con este correo electr?nico.');
        return;
      }

      const newUser = { name, email, phone, emirate, address, password, role: 'customer' };
      users.push(newUser);
      localStorage.setItem('jumenia_registered_users', JSON.stringify(users));

      currentUser = { role: 'customer', name, email, phone, emirate, address };
      localStorage.setItem('jumenia_current_user', JSON.stringify(currentUser));

      updateAuthUI();
      closeModal();
      showToast(`?? ?Cuenta creada con ?xito! Bienvenido, ${name}!`);
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
      trigger.title = 'Cuenta / Acceso Administrador';
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
  showToast('?? Has cerrado sesi?n.');
}

function showUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal || !currentUser) return;

  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-email').textContent = currentUser.email;
  document.getElementById('profile-role').textContent = currentUser.role === 'admin' ? '?? Administrador Maestro' : '??? Cliente Registrado';

  const customerDetails = document.getElementById('profile-customer-details');
  if (currentUser.role === 'customer') {
    if (customerDetails) customerDetails.style.display = 'block';
    document.getElementById('profile-phone').textContent = currentUser.phone || 'No especificado';
    document.getElementById('profile-emirate').textContent = currentUser.emirate || 'Dubai';
    document.getElementById('profile-address').textContent = currentUser.address || 'No especificado';
  } else {
    if (customerDetails) customerDetails.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ----------------------------------------------------
// 2. Panel de Administraci?n de 5 Pesta?as (En Espa?ol)
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

      // Actualizar datos al cambiar de pesta?a
      if (targetTab === 'products') renderAdminProductsTable();
      if (targetTab === 'categories') renderAdminCategoriesList();
      if (targetTab === 'announcements') renderAdminAnnouncementsForm();
      if (targetTab === 'orders') renderAdminOrdersTable();
      if (targetTab === 'supabase') renderAdminSupabaseSettings();
    });
  });

  // Compresor de Im?genes en el Dropzone
  const imgInput = document.getElementById('admin-prod-image-file');
  const imgPreview = document.getElementById('admin-prod-img-preview');
  if (imgInput) {
    imgInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        try {
          const compressedBase64 = await window.JumeniaCloud.compressImageFile(e.target.files[0], 600, 0.82);
          document.getElementById('admin-prod-image-url').value = compressedBase64;
          if (imgPreview) {
            imgPreview.src = compressedBase64;
            imgPreview.style.display = 'block';
          }
          showToast('?? Foto comprimida autom?ticamente (<40KB)');
        } catch (err) {
          alert('Error al comprimir imagen: ' + err);
        }
      }
    });
  }

  // Guardar Producto
  const productForm = document.getElementById('admin-product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFromAdmin();
    });
  }

  // Guardar Categor?a
  const catForm = document.getElementById('admin-category-form');
  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCategoryFromAdmin();
    });
  }

  // Guardar Anuncios y Env?os
  const annForm = document.getElementById('admin-announcements-form');
  if (annForm) {
    annForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAnnouncementsFromAdmin();
    });
  }

  // Guardar Configuraci?n de Supabase
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
// PESTA?A 1: Inventario de Productos (CRUD Completo)
// ----------------------------------------------------
function renderAdminProductsTable() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  const products = window.getProductsState();
  const search = (document.getElementById('admin-product-search')?.value || '').toLowerCase();

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) || 
    (p.categoryName && p.categoryName.toLowerCase().includes(search)) ||
    (p.notes && p.notes.toLowerCase().includes(search))
  );

  container.innerHTML = filtered.map(p => `
    <tr>
      <td style="width: 60px;">
        <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; background: #fff; border-radius: 4px; border: 1px solid #EAE3DA;" />
      </td>
      <td>
        <strong style="color: var(--color-primary);">${p.name}</strong>
        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${p.badge ? '??? ' + p.badge : ''} ? ?? ${p.burnTime || '50 Horas'}</div>
      </td>
      <td><span class="admin-badge-cat">${p.categoryName || 'General'}</span></td>
      <td><strong style="color: var(--color-primary); font-size: 1.05rem;">${p.price} AED</strong></td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn-admin-action edit" onclick="editProductInAdmin('${p.id}')" title="Editar Vela">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-admin-action delete" onclick="deleteProductInAdmin('${p.id}')" title="Eliminar Vela">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Llenar selector de categor?as en modal de producto
  const catSelect = document.getElementById('admin-prod-category');
  if (catSelect) {
    const categories = window.getCategoriesState();
    catSelect.innerHTML = categories.filter(c => c.id !== 'all' && c.id !== 'under-50').map(c => `
      <option value="${c.id}">${c.name}</option>
    `).join('') + '<option value="__custom__">+ A?adir Nueva Categor?a Personalizada...</option>';
  }
}

function resetProductForm() {
  editingProductId = null;
  document.getElementById('admin-product-modal-title').textContent = 'A?adir Nueva Vela Artesanal';
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
  document.getElementById('admin-product-modal-title').textContent = `Editar Vela: ${product.name}`;
  document.getElementById('admin-prod-id').value = product.id;
  document.getElementById('admin-prod-name').value = product.name;
  document.getElementById('admin-prod-category').value = product.category;
  document.getElementById('admin-prod-price').value = product.price;
  document.getElementById('admin-prod-burn').value = product.burnTime || '55 Horas';
  document.getElementById('admin-prod-wax').value = product.waxType || '100% Cera de Soya Org?nica';
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
  let categoryName = document.getElementById('admin-prod-category').selectedOptions[0]?.text || 'Colecci?n de Lujo';
  
  // Categor?a personalizada
  if (category === '__custom__') {
    const customName = prompt('Ingresa el nombre de la nueva categor?a:');
    if (!customName) return;
    category = customName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    categoryName = customName;
    window.addCategoryState({ id: category, name: categoryName });
  }

  const price = Number(document.getElementById('admin-prod-price').value) || 49;
  const burnTime = document.getElementById('admin-prod-burn').value.trim() || '50 Horas';
  const waxType = document.getElementById('admin-prod-wax').value.trim() || '100% Cera de Soya';
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

  // 1. Guardar localmente
  window.saveProductState(productData);

  // 2. Sincronizar en la nube con Supabase
  await window.JumeniaCloud.saveProductToCloud(productData);

  // 3. Actualizar interfaz
  document.getElementById('admin-product-edit-modal').classList.remove('active');
  renderAdminProductsTable();
  window.renderProducts();
  showToast(`? ?Producto "${name}" guardado y sincronizado!`);
}

async function deleteProductInAdmin(productId) {
  if (!confirm('?Est?s seguro de eliminar este producto? La eliminaci?n se sincronizar? localmente y en Supabase.')) return;

  window.deleteProductState(productId);
  await window.JumeniaCloud.deleteProductFromCloud(productId);

  renderAdminProductsTable();
  window.renderProducts();
  showToast('??? Producto eliminado y sincronizado.');
}

// ----------------------------------------------------
// PESTA?A 2: Motor de Categor?as
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
        <button class="btn-admin-action delete" onclick="deleteCategoryInAdmin('${c.id}')" title="Eliminar Categor?a">
          <i class="fas fa-trash-alt"></i>
        </button>
      ` : '<span style="font-size: 0.75rem; color: var(--color-accent-dark); font-weight: 600;">Protegida por el Sistema</span>'}
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
  showToast(`? ?Categor?a "${name}" a?adida y sincronizada!`);
}

async function deleteCategoryInAdmin(categoryId) {
  if (!confirm('?Est?s seguro de eliminar esta categor?a?')) return;

  window.deleteCategoryState(categoryId);
  await window.JumeniaCloud.deleteCategoryFromCloud(categoryId);

  renderAdminCategoriesList();
  window.renderCategoryNav();
  showToast('??? Categor?a eliminada.');
}

// ----------------------------------------------------
// PESTA?A 3: Anuncios, Marquee y Env?os
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
        <button type="button" class="btn-admin-action delete" onclick="this.parentElement.remove()" title="Eliminar l?nea"><i class="fas fa-times"></i></button>
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
    <input type="text" class="admin-ann-item" placeholder="Ej. ? Nueva Colecci?n Disponible" style="flex: 1;" />
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
  showToast('? Anuncios y reglas de env?o actualizados en vivo!');
}

// ----------------------------------------------------
// PESTA?A 4: Historial de Pedidos y WhatsApp
// ----------------------------------------------------
function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('jumenia_orders') || '[]');
  if (orders.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No hay pedidos registrados todav?a. A medida que los clientes compren por WhatsApp, aparecer?n aqu? autom?ticamente.</td></tr>';
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
// PESTA?A 5: Supabase Cloud y Resguardo de Datos
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
  showToast('?? Credenciales de Supabase guardadas localmente!');
  testSupabaseConnection();
}

async function testSupabaseConnection() {
  const statusEl = document.getElementById('admin-sb-connection-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Probando conexi?n con Supabase...';

  try {
    const client = window.JumeniaCloud.initSupabase();
    if (!client) {
      statusEl.innerHTML = '<span style="color: #D9534F;"><i class="fas fa-exclamation-circle"></i> Cliente de Supabase no inicializado. Revisa las credenciales.</span>';
      return;
    }

    const { data, error } = await client.from('jumenia_products').select('count', { count: 'exact', head: true });
    if (error) {
      statusEl.innerHTML = `<span style="color: #D9534F;"><i class="fas fa-exclamation-triangle"></i> Conectado, pero las tablas requieren creaci?n: ${error.message}</span>`;
    } else {
      statusEl.innerHTML = '<span style="color: #2E7D32;"><i class="fas fa-check-circle"></i> ?Conectado a Supabase con ?xito! Base de datos activa.</span>';
    }
  } catch (err) {
    statusEl.innerHTML = `<span style="color: #D9534F;"><i class="fas fa-times-circle"></i> Error de conexi?n: ${err.message}</span>`;
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
  a.download = `jumenia-candles-respaldo-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('?? ?Respaldo JSON completo descargado!');
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
      alert('Archivo JSON no v?lido: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function copySQLSchema() {
  navigator.clipboard.writeText(window.JumeniaCloud.SUPABASE_SQL_SCHEMA).then(() => {
    showToast('?? ?Script SQL copiado al portapapeles!');
  });
}

// Exportar funciones globales
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
