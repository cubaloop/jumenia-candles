/**
 * JUMENIA CANDLES (??????) - Supabase Cloud & Dual-Layer Storage Architecture
 * Tierra Querida Proven Architecture
 */

// Default Seed Products
const DEFAULT_PRODUCTS = [
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
    description: 'An opulent, sensory journey crafted with rare agarwood and golden amber. Hand-poured in a heavy-base artisan vessel with dual cotton wicks.'
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
    description: 'Greek revival columnar aesthetics. Adds height and sophisticated architectural texture to dining table arrangements.'
  },
  {
    id: 'jum-112',
    name: 'Artisan Silhouette Sculpture',
    category: 'sculptural',
    categoryName: 'Sculptural & Pillar',
    price: 49,
    image: 'assets/images/candle_12.jpg',
    badge: 'Modern Form',
    burnTime: '20 Hours',
    waxType: '100% Soy Wax',
    notes: 'Warm Sandalwood, Bourbon Vanilla, Cedar',
    description: 'Celebration of artistic human form and sculpture. Made with clean-burning soy wax that retains sharp sculptural detail.'
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All Candles' },
  { id: 'jars', name: 'Luxury Jars' },
  { id: 'centerpieces', name: 'Grand Centerpieces' },
  { id: 'sculptural', name: 'Sculptural & Pillar' },
  { id: 'under-50', name: 'Under 50 AED' }
];

const DEFAULT_ANNOUNCEMENTS = [
  '✨ Hand-Poured in the UAE',
  '100% Natural Soy & Botanical Wax',
  'Free UAE Delivery on Orders Over 200 AED',
  'Artisanal Aromatherapy & Luxury Home Decor'
];

const DEFAULT_CONFIG = {
  storeName: 'Jumenia Candles',
  storeArabicName: 'جومنيا للشموع الطبيعية',
  whatsappPhone: '971526680498',
  freeShippingThreshold: 200,
  shippingFee: 20,
  currency: 'AED',
  announcements: DEFAULT_ANNOUNCEMENTS
};

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  const savedConfig = JSON.parse(localStorage.getItem('jumenia_supabase_config') || '{}');
  const url = savedConfig.url || (window.ENV && window.ENV.VITE_SUPABASE_URL) || 'https://jyrqzjctkmzdvmraqrcv.supabase.co';
  const anonKey = savedConfig.anonKey || (window.ENV && window.ENV.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cnF6amN0a216ZHZtcmFxcmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODE1NzQsImV4cCI6MjEwMTg1NzU3NH0.dummy';

  if (url && anonKey && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(url, anonKey);
      console.log('? [Jumenia Cloud] Supabase client initialized with:', url);
    } catch (err) {
      console.warn('?? [Jumenia Cloud] Supabase init warning:', err);
    }
  }
  return supabaseClient;
}

async function syncFromSupabase() {
  const client = getSupabaseClient();
  if (!client) {
    console.log('?? [Jumenia Cloud] Operating in resilient LocalStorage mode.');
    return;
  }

  try {
    const { data: productsData, error: pErr } = await client
      .from('jumenia_products')
      .select('*')
      .order('created_at', { ascending: true });

    if (!pErr && productsData && productsData.length > 0) {
      localStorage.setItem('jumenia_products', JSON.stringify(productsData));
      if (typeof window.onCloudProductsUpdated === 'function') {
        window.onCloudProductsUpdated(productsData);
      }
      console.log('? [Jumenia Cloud] Products synced from Supabase:', productsData.length);
    }

    const { data: catData, error: cErr } = await client
      .from('jumenia_categories')
      .select('*')
      .order('id', { ascending: true });

    if (!cErr && catData && catData.length > 0) {
      localStorage.setItem('jumenia_categories', JSON.stringify(catData));
      if (typeof window.onCloudCategoriesUpdated === 'function') {
        window.onCloudCategoriesUpdated(catData);
      }
      console.log('? [Jumenia Cloud] Categories synced from Supabase:', catData.length);
    }

    const { data: cfgData, error: cfgErr } = await client
      .from('jumenia_config')
      .select('*')
      .eq('id', 'store_config')
      .single();

    if (!cfgErr && cfgData && cfgData.payload) {
      localStorage.setItem('jumenia_config', JSON.stringify(cfgData.payload));
      if (typeof window.onCloudConfigUpdated === 'function') {
        window.onCloudConfigUpdated(cfgData.payload);
      }
      console.log('? [Jumenia Cloud] Config synced from Supabase');
    }

  } catch (err) {
    console.log('?? [Jumenia Cloud] Supabase non-blocking sync complete with local fallback.');
  }
}

async function saveProductToCloud(product) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      id: String(product.id),
      name: product.name,
      category: product.category,
      categoryName: product.categoryName,
      price: Number(product.price),
      image: product.image,
      badge: product.badge || '',
      burnTime: product.burnTime || '50 Hours',
      waxType: product.waxType || '100% Soy Wax',
      notes: product.notes || '',
      description: product.description || '',
      updated_at: new Date().toISOString()
    };

    await client.from('jumenia_products').upsert(payload, { onConflict: 'id' });
    console.log('?? [Jumenia Cloud] Product persisted to Supabase:', product.id);
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Product save cloud fallback:', err);
  }
}

async function deleteProductFromCloud(productId) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('jumenia_products').delete().eq('id', String(productId));
    console.log('?? [Jumenia Cloud] Product deleted from Supabase:', productId);
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Product delete cloud fallback:', err);
  }
}

async function saveCategoryToCloud(category) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      id: String(category.id),
      name: category.name,
      updated_at: new Date().toISOString()
    };
    await client.from('jumenia_categories').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Category save fallback:', err);
  }
}

async function deleteCategoryFromCloud(categoryId) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('jumenia_categories').delete().eq('id', String(categoryId));
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Category delete fallback:', err);
  }
}

async function saveOrderToCloud(order) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      id: String(order.id),
      customer_name: order.name,
      customer_phone: order.phone,
      emirate: order.emirate,
      address: order.address,
      notes: order.notes || '',
      items: order.items,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      created_at: new Date().toISOString()
    };
    await client.from('jumenia_orders').insert([payload]);
    console.log('?? [Jumenia Cloud] Order ticket logged to Supabase:', order.id);
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Order log fallback:', err);
  }
}

async function saveConfigToCloud(config) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      id: 'store_config',
      payload: config,
      updated_at: new Date().toISOString()
    };
    await client.from('jumenia_config').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('?? [Jumenia Cloud] Config save fallback:', err);
  }
}

function compressImageFile(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

const SUPABASE_SQL_SCHEMA = `-- JUMENIA CANDLES (??????) - SQL SCHEMA FOR SUPABASE
CREATE TABLE IF NOT EXISTS jumenia_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  categoryName TEXT,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  burnTime TEXT,
  waxType TEXT,
  notes TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS jumenia_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS jumenia_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  emirate TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  items JSONB,
  subtotal NUMERIC,
  delivery NUMERIC,
  total NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS jumenia_config (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE jumenia_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access Products" ON jumenia_products FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Products" ON jumenia_products FOR ALL USING (true);
CREATE POLICY "Public Delete Products" ON jumenia_products FOR DELETE USING (true);

ALTER TABLE jumenia_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Categories" ON jumenia_categories FOR ALL USING (true);

ALTER TABLE jumenia_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Orders" ON jumenia_orders FOR ALL USING (true);

ALTER TABLE jumenia_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Config" ON jumenia_config FOR ALL USING (true);
`;

window.JumeniaCloud = {
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_CONFIG,
  SUPABASE_SQL_SCHEMA,
  getSupabaseClient,
  syncFromSupabase,
  saveProductToCloud,
  deleteProductFromCloud,
  saveCategoryToCloud,
  deleteCategoryFromCloud,
  saveOrderToCloud,
  saveConfigToCloud,
  compressImageFile
};
