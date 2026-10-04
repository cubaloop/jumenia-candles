/**
 * JUMENIA CANDLES - Main Application Controller
 * Cart, WhatsApp Checkout Ticket, Dynamic Category Engine & 3D Interactive Photo Viewer
 * Integrated with Dual-Layer Supabase Cloud & Admin Dashboard
 */

// Dual-Layer State Initialization
let PRODUCTS = JSON.parse(localStorage.getItem('jumenia_products') || 'null') || window.JumeniaCloud.DEFAULT_PRODUCTS;
let CATEGORIES = JSON.parse(localStorage.getItem('jumenia_categories') || 'null') || window.JumeniaCloud.DEFAULT_CATEGORIES;
let SITE_CONFIG = JSON.parse(localStorage.getItem('jumenia_config') || 'null') || window.JumeniaCloud.DEFAULT_CONFIG;

let cart = JSON.parse(localStorage.getItem('jumenia_cart') || '[]');
let currentCategory = 'all';
let currentSearch = '';

// State Accessors & Mutators for Admin Module
window.getProductsState = () => PRODUCTS;
window.saveProductState = (product) => {
  const idx = PRODUCTS.findIndex(p => p.id === String(product.id));
  if (idx !== -1) {
    PRODUCTS[idx] = { ...PRODUCTS[idx], ...product };
  } else {
    PRODUCTS.unshift(product);
  }
  localStorage.setItem('jumenia_products', JSON.stringify(PRODUCTS));
};

window.deleteProductState = (productId) => {
  PRODUCTS = PRODUCTS.filter(p => p.id !== String(productId));
  localStorage.setItem('jumenia_products', JSON.stringify(PRODUCTS));
};

window.getCategoriesState = () => CATEGORIES;
window.addCategoryState = (cat) => {
  if (!CATEGORIES.some(c => c.id === cat.id)) {
    CATEGORIES.push(cat);
    localStorage.setItem('jumenia_categories', JSON.stringify(CATEGORIES));
  }
};

window.deleteCategoryState = (catId) => {
  CATEGORIES = CATEGORIES.filter(c => c.id !== catId);
  localStorage.setItem('jumenia_categories', JSON.stringify(CATEGORIES));
};

window.getConfigState = () => SITE_CONFIG;
window.saveConfigState = (cfg) => {
  SITE_CONFIG = { ...SITE_CONFIG, ...cfg };
  localStorage.setItem('jumenia_config', JSON.stringify(SITE_CONFIG));
};

// Supabase Real-Time Cloud Listeners
window.onCloudProductsUpdated = (cloudProducts) => {
  PRODUCTS = cloudProducts;
  renderProducts();
};

window.onCloudCategoriesUpdated = (cloudCats) => {
  CATEGORIES = cloudCats;
  renderCategoryNav();
};

window.onCloudConfigUpdated = (cloudCfg) => {
  SITE_CONFIG = cloudCfg;
  renderAnnouncementBar();
};

// App Lifecycle Boot
document.addEventListener('DOMContentLoaded', () => {
  renderAnnouncementBar();
  renderCategoryNav();
  renderProducts();
  setupHero3DCard();
  setupFiltersAndSearch();
  setupCartDrawer();
  setupMobileMenu();
  setup3DModal();
  setupCheckoutModal();
  updateCartUI();
  setupCardTiltEffect();
  setupHeaderScroll();

  // Initialize Admin Module
  if (typeof window.initAdminModule === 'function') {
    window.initAdminModule();
  }

  // Background Cloud Sync
  if (window.JumeniaCloud && typeof window.JumeniaCloud.syncFromSupabase === 'function') {
    window.JumeniaCloud.syncFromSupabase();
  }
});

/* ----------------------------------------------------
   Announcement Bar Renderer
   ---------------------------------------------------- */
function renderAnnouncementBar() {
  const bar = document.getElementById('top-announcement-bar');
  if (!bar) return;

  const list = SITE_CONFIG.announcements || window.JumeniaCloud.DEFAULT_ANNOUNCEMENTS;
  bar.innerHTML = list.map(item => `<span>${item}</span>`).join('<span>?</span>');
}

/* ----------------------------------------------------
   Dynamic Category Navigation Engine
   ---------------------------------------------------- */
function renderCategoryNav() {
  const container = document.getElementById('catalog-filter-pills');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(c => `
    <button class="filter-btn ${c.id === currentCategory ? 'active' : ''}" data-filter="${c.id}">
      ${c.name}
    </button>
  `).join('');

  setupFilterBtnListeners();
}

/* ----------------------------------------------------
   Hero 3D Product Photo Card Interaction
   ---------------------------------------------------- */
function setupHero3DCard() {
  const card = document.getElementById('hero-3d-card');
  if (!card) return;

  const handleMove = (clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
  };

  card.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  card.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  card.addEventListener('touchend', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

function switchHeroProduct(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const imgEl = document.getElementById('hero-featured-img');
  const titleEl = document.getElementById('hero-featured-title');
  const catEl = document.getElementById('hero-featured-cat');
  const priceEl = document.getElementById('hero-featured-price');

  if (imgEl) imgEl.src = product.image;
  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.categoryName;
  if (priceEl) priceEl.textContent = product.price + ' AED';

  const btns = document.querySelectorAll('.hero-thumb-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }
}

/* ----------------------------------------------------
   Header Scroll Styling
   ---------------------------------------------------- */
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ----------------------------------------------------
   Render Product Catalog with 3D Photo Tilt & Icon-only Button
   ---------------------------------------------------- */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => {
    const matchesCat = (currentCategory === 'all') || 
                       (currentCategory === 'under-50' && p.price <= 50) ||
                       (p.category === currentCategory);
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          (p.notes && p.notes.toLowerCase().includes(currentSearch.toLowerCase())) ||
                          (p.categoryName && p.categoryName.toLowerCase().includes(currentSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;"><i class="fas fa-search" style="font-size: 2.5rem; color: #EAE3DA; margin-bottom: 1rem;"></i><h3 style="font-family: serif; font-size: 1.5rem; color: #2C1810; margin-bottom: 0.5rem;">No candles match your search</h3><p style="color: #73675E; font-size: 0.95rem;">Try adjusting your filters or search keywords.</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      <span class="card-badge">${product.badge || 'Artisanal'}</span>
      <button class="card-3d-btn" onclick="open3DModal('${product.id}')" title="Inspect Photo in 3D">
        <i class="fas fa-cube"></i>
      </button>
      
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>

      <div class="product-info">
        <span class="product-category">${product.categoryName || 'Luxury Collection'}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-notes"><i class="fas fa-feather-alt"></i> ${product.notes || 'Natural Essences'}</p>
        
        <div class="product-meta">
          <span><i class="fas fa-fire"></i> ${product.burnTime || '50 Hours'}</span>
          <span>?</span>
          <span><i class="fas fa-leaf"></i> ${product.waxType || 'Soy Wax'}</span>
        </div>

        <div class="product-footer">
          <div class="product-price">
            <span class="price-currency">AED</span>
            <span class="price-amount">${product.price}</span>
          </div>
          <button class="add-to-cart-btn icon-only" onclick="addToCart('${product.id}')" title="Add to Bag" aria-label="Add to Bag">
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  setupCardTiltEffect();
}

/* ----------------------------------------------------
   Filters and Search Controls
   ---------------------------------------------------- */
function setupFiltersAndSearch() {
  setupFilterBtnListeners();

  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderProducts();
    });
  }
}

function setupFilterBtnListeners() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      renderProducts();
    });
  });
}

/* ----------------------------------------------------
   Shopping Cart Management
   ---------------------------------------------------- */
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === String(productId));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      categoryName: product.categoryName,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
  showToast('? Added "' + product.name + '" to cart');
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('jumenia_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-badge-count');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  countBadges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  });

  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-total');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart-state"><i class="fas fa-shopping-bag empty-cart-icon"></i><h4 style="font-family: serif; font-size: 1.25rem; margin-bottom: 0.5rem;">Your bag is empty</h4><p style="font-size: 0.85rem;">Explore our artisanal candle collection and add your favorites.</p></div>';
    if (subtotalEl) subtotalEl.textContent = '0 AED';
    if (deliveryEl) deliveryEl.textContent = '0 AED';
    if (totalEl) totalEl.textContent = '0 AED';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${item.price} AED</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  const threshold = SITE_CONFIG.freeShippingThreshold || 200;
  const shippingFee = SITE_CONFIG.shippingFee || 20;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const delivery = subtotal >= threshold || subtotal === 0 ? 0 : shippingFee;
  const total = subtotal + delivery;

  if (subtotalEl) subtotalEl.textContent = subtotal + ' AED';
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? `FREE (Orders > ${threshold} AED)` : `${delivery} AED`;
  if (totalEl) totalEl.textContent = total + ' AED';
}

function setupCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const openBtns = document.querySelectorAll('.open-cart-trigger');
  const closeBtn = document.getElementById('close-cart-btn');

  const openCart = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
}

/* ----------------------------------------------------
   Checkout Modal & WhatsApp Ticket Generator with Cloud Log
   ---------------------------------------------------- */
function setupCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const openCheckoutBtn = document.getElementById('proceed-checkout-btn');
  const closeBtn = document.getElementById('close-checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-modal-overlay');
  const form = document.getElementById('whatsapp-checkout-form');

  if (openCheckoutBtn) {
    openCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('?? Please add at least one candle to your bag.');
        return;
      }
      document.getElementById('cart-drawer').classList.remove('active');
      document.getElementById('cart-drawer-overlay').classList.remove('active');

      const threshold = SITE_CONFIG.freeShippingThreshold || 200;
      const shippingFee = SITE_CONFIG.shippingFee || 20;
      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      const delivery = subtotal >= threshold ? 0 : shippingFee;
      const total = subtotal + delivery;
      
      document.getElementById('checkout-summary-subtotal').textContent = subtotal + ' AED';
      document.getElementById('checkout-summary-delivery').textContent = delivery === 0 ? 'FREE' : `${delivery} AED`;
      document.getElementById('checkout-summary-total').textContent = total + ' AED';

      // Auto-fill logged-in customer info if available
      const loggedUser = JSON.parse(localStorage.getItem('jumenia_current_user') || 'null');
      if (loggedUser) {
        if (document.getElementById('cust-name') && loggedUser.name) document.getElementById('cust-name').value = loggedUser.name;
        if (document.getElementById('cust-phone') && loggedUser.phone) document.getElementById('cust-phone').value = loggedUser.phone;
        if (document.getElementById('cust-emirate') && loggedUser.emirate) document.getElementById('cust-emirate').value = loggedUser.emirate;
        if (document.getElementById('cust-address') && loggedUser.address) document.getElementById('cust-address').value = loggedUser.address;
      }

      modal.classList.add('active');
    });
  }

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await sendWhatsAppTicket();
    });
  }
}

async function sendWhatsAppTicket() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const emirate = document.getElementById('cust-emirate').value;
  const address = document.getElementById('cust-address').value.trim();
  const notes = document.getElementById('cust-notes').value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your name, phone number, and delivery address.');
    return;
  }

  const threshold = SITE_CONFIG.freeShippingThreshold || 200;
  const shippingFee = SITE_CONFIG.shippingFee || 20;
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const delivery = subtotal >= threshold ? 0 : shippingFee;
  const total = subtotal + delivery;
  const refNumber = 'JUM-' + Math.floor(100000 + Math.random() * 900000);

  // 1. Prepare Order Object for History & Supabase
  const orderRecord = {
    id: refNumber,
    name,
    phone,
    emirate,
    address,
    notes,
    items: [...cart],
    subtotal,
    delivery,
    total,
    date: new Date().toISOString()
  };

  const storedOrders = JSON.parse(localStorage.getItem('jumenia_orders') || '[]');
  storedOrders.push(orderRecord);
  localStorage.setItem('jumenia_orders', JSON.stringify(storedOrders));

  // Sync order to Supabase
  if (window.JumeniaCloud && typeof window.JumeniaCloud.saveOrderToCloud === 'function') {
    await window.JumeniaCloud.saveOrderToCloud(orderRecord);
  }

  // 2. Build WhatsApp Ticket Message
  let ticket = '??? *ORDER CONFIRMATION - JUMENIA CANDLES* ???\n';
  ticket += '?? *Order Ref:* #' + refNumber + '\n';
  ticket += '?? *Date:* ' + new Date().toLocaleDateString('en-GB') + '\n';
  ticket += '??????????????????????\n';
  ticket += '?? *Customer:* ' + name + '\n';
  ticket += '?? *Phone:* ' + phone + '\n';
  ticket += '?? *Delivery Location:* ' + address + ', ' + emirate + ', UAE\n';
  if (notes) {
    ticket += '?? *Gift/Delivery Notes:* ' + notes + '\n';
  }
  ticket += '??????????????????????\n';
  ticket += '??? *PURCHASED ITEMS:*\n';

  cart.forEach(item => {
    ticket += '? ' + item.qty + 'x ' + item.name + ' (' + item.price + ' AED each) = *' + (item.price * item.qty) + ' AED*\n';
  });

  ticket += '??????????????????????\n';
  ticket += '?? *Subtotal:* ' + subtotal + ' AED\n';
  ticket += '?? *UAE Shipping:* ' + (delivery === 0 ? 'FREE' : delivery + ' AED') + '\n';
  ticket += '? *TOTAL PAYABLE:* ' + total + ' AED\n';
  ticket += '?? *Payment Method:* Cash on Delivery / Instant Bank Transfer\n';
  ticket += '??????????????????????\n';
  ticket += 'Hello Jumenia team, I would like to confirm this order. Thank you!';

  const encodedTicket = encodeURIComponent(ticket);
  const targetPhone = SITE_CONFIG.whatsappPhone || '971526680498';
  const whatsappUrl = 'https://wa.me/' + targetPhone + '?text=' + encodedTicket;

  cart = [];
  saveCart();
  updateCartUI();

  document.getElementById('checkout-modal').classList.remove('active');
  document.body.style.overflow = '';

  window.open(whatsappUrl, '_blank');
}

/* ----------------------------------------------------
   3D Product Photo Modal Viewer
   ---------------------------------------------------- */
function setup3DModal() {
  const modal = document.getElementById('modal-3d');
  const closeBtn = document.getElementById('close-3d-modal-btn');
  const overlay = document.getElementById('modal-3d-overlay');

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  const modalStage = document.getElementById('modal-photo-stage');
  const modalImgCard = document.getElementById('modal-interactive-card');
  if (modalStage && modalImgCard) {
    modalStage.addEventListener('mousemove', (e) => {
      const rect = modalStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -18;
      const rotateY = ((x - centerX) / centerX) * 18;

      modalImgCard.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.05)';
    });

    modalStage.addEventListener('mouseleave', () => {
      modalImgCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
}

function open3DModal(productId) {
  const product = PRODUCTS.find(p => p.id === String(productId));
  if (!product) return;

  const modal = document.getElementById('modal-3d');
  const imgEl = document.getElementById('modal-3d-img');
  const titleEl = document.getElementById('modal-3d-title');
  const catEl = document.getElementById('modal-3d-category');
  const priceEl = document.getElementById('modal-3d-price');
  const descEl = document.getElementById('modal-3d-description');
  const notesEl = document.getElementById('modal-3d-notes');
  const burnEl = document.getElementById('modal-3d-burn');
  const addBtn = document.getElementById('modal-3d-add-btn');

  if (imgEl) imgEl.src = product.image;
  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.categoryName;
  if (priceEl) priceEl.textContent = product.price + ' AED';
  if (descEl) descEl.textContent = product.description;
  if (notesEl) notesEl.textContent = product.notes;
  if (burnEl) burnEl.textContent = product.burnTime;

  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product.id);
      modal.classList.remove('active');
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ----------------------------------------------------
   Mobile Navigation Drawer
   ---------------------------------------------------- */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-nav-menu');
  const overlay = document.getElementById('mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');

  const toggle = () => {
    const isOpen = menu.classList.contains('active');
    if (isOpen) {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('active');
      overlay.classList.add('active');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', toggle);
  links.forEach(l => l.addEventListener('click', toggle));
}

/* ----------------------------------------------------
   Smooth 3D Card Tilt Effect on Real Product Photos
   ---------------------------------------------------- */
function setupCardTiltEffect() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ----------------------------------------------------
   Toast Notifications
   ---------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Window Globals
window.renderProducts = renderProducts;
window.renderCategoryNav = renderCategoryNav;
window.renderAnnouncementBar = renderAnnouncementBar;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.open3DModal = open3DModal;
window.switchHeroProduct = switchHeroProduct;
window.showToast = showToast;
