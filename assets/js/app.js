/**
 * JUMENIA CANDLES - Main Application Controller
 * Cart, WhatsApp Checkout Ticket, Mobile Menu, Filter & 3D Modal
 */

const WHATSAPP_PHONE = '971526680498';

// Product Catalog
const PRODUCTS = [
  {
    id: 'jum-101',
    name: 'Royal Oud & Dark Amber Jar',
    category: 'jars',
    categoryName: 'Luxury Jar Collection',
    price: 139,
    image: 'assets/images/candle_1.jpg',
    badge: 'Bestseller',
    burnTime: '55 Hours',
    waxType: '100% Organic Soy & Coconut Wax',
    notes: 'Smoked Oud Wood, Dark Amber, Madagascan Vanilla, Clove',
    shape: 'jar',
    color: 0x3A2419,
    description: 'An opulent, sensory journey crafted with rare agarwood and golden amber. Hand-poured in a heavy-base artisan espresso vessel with dual cotton wicks.'
  },
  {
    id: 'jum-102',
    name: 'Velvet Damask Rose & Jasmine',
    category: 'jars',
    categoryName: 'Luxury Jar Collection',
    price: 139,
    image: 'assets/images/candle_2.jpg',
    badge: 'Signature',
    burnTime: '55 Hours',
    waxType: '100% Soy Wax',
    notes: 'Damascus Rose, Night Jasmine, White Tonka, Soft Musk',
    shape: 'jar',
    color: 0xFAF3EB,
    description: 'Delicate yet unforgettable. Captures the romantic aura of blooming Arabian gardens at twilight with notes of lush roses and white florals.'
  },
  {
    id: 'jum-103',
    name: 'Golden Hour Multi-Wick Grand',
    category: 'centerpieces',
    categoryName: 'Centerpiece Edition',
    price: 149,
    image: 'assets/images/candle_3.jpg',
    badge: 'Deluxe Multi-Wick',
    burnTime: '70 Hours',
    waxType: 'Botanical Wax Blend',
    notes: 'Italian Bergamot, Sunlit Sandalwood, Golden Cashmere',
    shape: 'jar',
    color: 0xF5ECE1,
    description: 'Designed to be the crowning centerpiece of your living space. Triple-wick architecture provides an expansive fragrance throw and warm golden ambient illumination.'
  },
  {
    id: 'jum-104',
    name: 'Imperial Noir Grand Edition',
    category: 'centerpieces',
    categoryName: 'Centerpiece Edition',
    price: 179,
    image: 'assets/images/candle_4.jpg',
    badge: 'Limited Edition',
    burnTime: '90 Hours',
    waxType: 'Velvet Soy Wax',
    notes: 'Black Cardamom, Atlas Cedarwood, Smoked Ambergris, Leather',
    shape: 'jar',
    color: 0x221711,
    description: 'Our most prestigious creation. A grand four-wick statement candle offering exceptional burn longevity and an intoxicating woody aroma.'
  },
  {
    id: 'jum-105',
    name: 'Artisanal Ribbed Pillar',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_5.jpg',
    badge: 'Hand-Crafted',
    burnTime: '25 Hours',
    waxType: 'Natural Beeswax & Soy',
    notes: 'Warm Vanilla, Raw Shea, Soft Cashmere Musk',
    shape: 'ribbed',
    color: 0xFDFBF7,
    description: 'Architectural fluted column with clean Scandinavian lines. An aesthetic visual sculpture that doubles as a serene mood enhancer.'
  },
  {
    id: 'jum-106',
    name: 'Geometric Minimalist Arch',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_6.jpg',
    badge: 'Art Design',
    burnTime: '25 Hours',
    waxType: '100% Soy Wax',
    notes: 'French Lavender, White Honey, Wild Iris',
    shape: 'ribbed',
    color: 0xF8F4EE,
    description: 'Modern neo-classical arch form. Hand-molded to perfection with clean geometric silhouettes for the design-conscious home.'
  },
  {
    id: 'jum-107',
    name: 'Sculptural Bubble Cube',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_7.jpg',
    badge: 'Popular',
    burnTime: '20 Hours',
    waxType: 'Pure Natural Soy Wax',
    notes: 'Coconut Blossom, Almond Milk, White Cocoa',
    shape: 'bubble',
    color: 0xFFFAF0,
    description: 'The iconic aesthetic bubble cube. Soft tactile curves that diffuse a creamy gourmand aroma throughout cozy spaces.'
  },
  {
    id: 'jum-108',
    name: 'Nordic Wave Twirl Pillar',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_8.jpg',
    badge: 'Artisan Pick',
    burnTime: '25 Hours',
    waxType: 'Organic Soy Wax',
    notes: 'Sea Salt, Coastal Sage, Sun-Dried Linen',
    shape: 'ribbed',
    color: 0xFDFBF7,
    description: 'Fluid helical spirals crafted by master artisans. A dynamic conversation piece radiating fresh botanical notes.'
  },
  {
    id: 'jum-109',
    name: 'Celestial Sphere Art Candle',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_9.jpg',
    badge: 'Minimalist',
    burnTime: '20 Hours',
    waxType: 'Natural Soy Blend',
    notes: 'Golden Honey, Sun-Ripened Fig, Green Cedar',
    shape: 'bubble',
    color: 0xF6EFE7,
    description: 'Pure spherical harmony. Unscented or gently infused with wild fig to elevate modern coffee tables and entryway consoles.'
  },
  {
    id: 'jum-110',
    name: 'Botanical Bloom Sculpture',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_10.jpg',
    badge: 'Floral Art',
    burnTime: '22 Hours',
    waxType: 'Soy & Palm Wax',
    notes: 'Neroli Petals, Sweet Orange Blossom, Amber',
    shape: 'bubble',
    color: 0xFFF8F0,
    description: 'Intricate blooming petal geometry hand-poured with botanical waxes for a gentle, uplifting floral ambiance.'
  },
  {
    id: 'jum-111',
    name: 'Fluted Column Classical',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_11.jpg',
    badge: 'Timeless',
    burnTime: '28 Hours',
    waxType: 'Premium Soy Wax',
    notes: 'White Tea, Bergamot Zest, Herbal Thyme',
    shape: 'ribbed',
    color: 0xFBF9F5,
    description: 'Greek revival columnar aesthetics. Adds height and sophisticated architectural texture to dining table arrangements.'
  },
  {
    id: 'jum-112',
    name: 'Artisan Silhouette Silhouette',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_12.jpg',
    badge: 'Modern Form',
    burnTime: '20 Hours',
    waxType: '100% Soy Wax',
    notes: 'Warm Sandalwood, Bourbon Vanilla, Cedar',
    shape: 'bubble',
    color: 0xF8F2EA,
    description: 'Celebration of artistic human form and sculpture. Made with clean-burning soy wax that retains sharp sculptural detail.'
  }
];

// State Management
let cart = JSON.parse(localStorage.getItem('jumenia_cart') || '[]');
let currentCategory = 'all';
let currentSearch = '';
let modal3dInstance = null;
let hero3dInstance = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupHero3DCard();
  renderProducts();
  setupFiltersAndSearch();
  setupCartDrawer();
  setupMobileMenu();
  setup3DModal();
  setupCheckoutModal();
  updateCartUI();
  setupCardTiltEffect();
  setupHeaderScroll();
});

/* ----------------------------------------------------
   Hero 3D Candle Showcase
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
  card.addEventListener('mouseleave', () => { card.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
  card.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  card.addEventListener('touchend', () => { card.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
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
  if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
}

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
   Render Product Catalog
   ---------------------------------------------------- */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => {
    const matchesCat = (currentCategory === 'all') || 
                       (currentCategory === 'under-50' && p.price <= 50) ||
                       (p.category === currentCategory);
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          p.notes.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          p.categoryName.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <i class="fas fa-search" style="font-size: 2.5rem; color: var(--color-border); margin-bottom: 1rem;"></i>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-primary); margin-bottom: 0.5rem;">No candles match your search</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem;">Try adjusting your filters or search keywords.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      <span class="card-badge">${product.badge}</span>
      <button class="card-3d-btn" onclick="open3DModal('${product.id}')" title="View in 3D / 360°">
        <i class="fas fa-cube"></i>
      </button>
      
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>

      <div class="product-info">
        <span class="product-category">${product.categoryName}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-notes"><i class="fas fa-feather-alt"></i> ${product.notes}</p>
        
        <div class="product-meta">
          <span><i class="fas fa-fire"></i> ${product.burnTime}</span>
          <span>•</span>
          <span><i class="fas fa-leaf"></i> Soy Wax</span>
        </div>

        <div class="product-footer">
          <div class="product-price">
            <span class="price-currency">AED</span>
            <span class="price-amount">${product.price}</span>
          </div>
          <button class="add-to-cart-btn icon-only" onclick="addToCart('${product.id}')" title="Add to Bag" aria-label="Add to Bag"><i class="fas fa-shopping-bag"></i></button>
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
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      renderProducts();
    });
  });

  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderProducts();
    });
  }
}

/* ----------------------------------------------------
   Shopping Cart Management
   ---------------------------------------------------- */
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
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
  showToast(`✨ Added "${product.name}" to cart`);
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
    container.innerHTML = `
      <div class="empty-cart-state">
        <i class="fas fa-shopping-bag empty-cart-icon"></i>
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Your bag is empty</h4>
        <p style="font-size: 0.85rem;">Explore our artisanal candle collection and add your favorites.</p>
      </div>
    `;
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

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const delivery = subtotal >= 200 || subtotal === 0 ? 0 : 20;
  const total = subtotal + delivery;

  if (subtotalEl) subtotalEl.textContent = `${subtotal} AED`;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE (Orders > 200 AED)' : `${delivery} AED`;
  if (totalEl) totalEl.textContent = `${total} AED`;
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
   Checkout Modal & WhatsApp Ticket Generator
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
        showToast('⚠️ Please add at least one candle to your bag.');
        return;
      }
      // Close cart drawer
      document.getElementById('cart-drawer').classList.remove('active');
      document.getElementById('cart-drawer-overlay').classList.remove('active');

      // Update modal order summary
      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      const delivery = subtotal >= 200 ? 0 : 20;
      const total = subtotal + delivery;
      
      document.getElementById('checkout-summary-subtotal').textContent = `${subtotal} AED`;
      document.getElementById('checkout-summary-delivery').textContent = delivery === 0 ? 'FREE' : `${delivery} AED`;
      document.getElementById('checkout-summary-total').textContent = `${total} AED`;

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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendWhatsAppTicket();
    });
  }
}

function sendWhatsAppTicket() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const emirate = document.getElementById('cust-emirate').value;
  const address = document.getElementById('cust-address').value.trim();
  const notes = document.getElementById('cust-notes').value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your name, phone number, and delivery address.');
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const delivery = subtotal >= 200 ? 0 : 20;
  const total = subtotal + delivery;
  const refNumber = 'JUM-' + Math.floor(100000 + Math.random() * 900000);

  // Build luxury formatted ticket
  let ticket = `🕯️ *ORDER CONFIRMATION - JUMENIA CANDLES* 🕯️\n`;
  ticket += `📋 *Order Ref:* #${refNumber}\n`;
  ticket += `📅 *Date:* ${new Date().toLocaleDateString('en-GB')}\n`;
  ticket += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  ticket += `👤 *Customer:* ${name}\n`;
  ticket += `📞 *Phone:* ${phone}\n`;
  ticket += `📍 *Delivery Location:* ${address}, ${emirate}, UAE\n`;
  if (notes) {
    ticket += `✍️ *Gift/Delivery Notes:* ${notes}\n`;
  }
  ticket += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  ticket += `🛍️ *PURCHASED ITEMS:*\n`;

  cart.forEach(item => {
    ticket += `• ${item.qty}x ${item.name} (${item.price} AED each) = *${item.price * item.qty} AED*\n`;
  });

  ticket += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  ticket += `💵 *Subtotal:* ${subtotal} AED\n`;
  ticket += `🚚 *UAE Shipping:* ${delivery === 0 ? 'FREE' : delivery + ' AED'}\n`;
  ticket += `✨ *TOTAL PAYABLE:* ${total} AED\n`;
  ticket += `💳 *Payment Method:* Cash on Delivery / Instant Bank Transfer\n`;
  ticket += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  ticket += `Hello Jumenia team, I would like to confirm this order. Thank you!`;

  const encodedTicket = encodeURIComponent(ticket);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedTicket}`;

  // Clear cart after sending ticket
  cart = [];
  saveCart();
  updateCartUI();

  // Close modal
  document.getElementById('checkout-modal').classList.remove('active');
  document.body.style.overflow = '';

  // Open WhatsApp in new tab / app
  window.open(whatsappUrl, '_blank');
}

/* ----------------------------------------------------
   3D Product Modal Viewer
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
  const product = PRODUCTS.find(p => p.id === productId);
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
   Smooth 3D Card Tilt Effect
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

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
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
