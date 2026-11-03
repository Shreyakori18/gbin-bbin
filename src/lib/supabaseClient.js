import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback defaults for client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sample-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sample-anon-key';

export const isLiveSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('sample-project')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust Local Persistence Store for Development / Sandbox
 * Mirrors the exact Supabase PostgreSQL schema so all operations
 * (Households, Profiles, Roles, Orders, Collections) work seamlessly
 * out of the box or connect automatically to live Supabase instances.
 */
const STORAGE_KEYS = {
  USERS: 'gbin_bbin_users',
  PROFILES: 'gbin_bbin_profiles',
  HOUSEHOLDS: 'gbin_bbin_households',
  COLLECTIONS: 'gbin_bbin_collections',
  ORDERS: 'gbin_bbin_orders',
  USER_ROLES: 'gbin_bbin_user_roles',
  CURRENT_SESSION: 'gbin_bbin_session'
};

// Initial collection schedule seed
const INITIAL_COLLECTIONS = [
  {
    id: 'col-1',
    ward_zone: 'Ward 12 - Green Valley',
    area_name: 'Riverside & Sector 4',
    bin_type: 'G-Bin (Wet Waste)',
    collection_day: 'Daily (Mon-Sun)',
    time_slot: '07:00 AM - 09:00 AM',
    vehicle_number: 'GV-04-WM-102',
    driver_name: 'Ramesh Kumar',
    driver_phone: '+91 98765 43210',
    status: 'In Progress',
    last_completed_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    operational_notes: 'Daily wet waste composting route running on schedule.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'col-2',
    ward_zone: 'Ward 12 - Green Valley',
    area_name: 'Riverside & Sector 4',
    bin_type: 'B-Bin (Dry Waste)',
    collection_day: 'Tue, Thu, Sat',
    time_slot: '09:30 AM - 11:30 AM',
    vehicle_number: 'GV-04-WM-105',
    driver_name: 'Anil Verma',
    driver_phone: '+91 98765 43211',
    status: 'Scheduled',
    last_completed_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    operational_notes: 'Recyclables sorting truck. Cardboard and plastic collection.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'col-3',
    ward_zone: 'Ward 08 - Eco Heights',
    area_name: 'Hilltop Enclave & Lakeview',
    bin_type: 'Both (G-Bin & B-Bin)',
    collection_day: 'Mon, Wed, Fri',
    time_slot: '08:00 AM - 10:30 AM',
    vehicle_number: 'EH-08-WM-204',
    driver_name: 'Suresh Patel',
    driver_phone: '+91 98765 43212',
    status: 'Completed',
    last_completed_at: new Date().toISOString(),
    operational_notes: 'Morning round completed. 3.2 tons organic and 1.8 tons dry waste collected.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'col-4',
    ward_zone: 'Ward 15 - Central Park',
    area_name: 'Market Road & Avenues',
    bin_type: 'G-Bin (Wet Waste)',
    collection_day: 'Daily (Mon-Sun)',
    time_slot: '06:30 AM - 08:30 AM',
    vehicle_number: 'CP-15-WM-301',
    driver_name: 'Vikram Singh',
    driver_phone: '+91 98765 43213',
    status: 'Scheduled',
    last_completed_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    operational_notes: 'High density market and residential organic waste route.',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'col-5',
    ward_zone: 'Ward 15 - Central Park',
    area_name: 'Market Road & Avenues',
    bin_type: 'B-Bin (Dry Waste)',
    collection_day: 'Wed, Sun',
    time_slot: '10:00 AM - 12:00 PM',
    vehicle_number: 'CP-15-WM-302',
    driver_name: 'Mahesh Das',
    driver_phone: '+91 98765 43214',
    status: 'Scheduled',
    last_completed_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    operational_notes: 'Commercial and household dry waste collection for recycling plant.',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  }
];

// Initial demo household and admin accounts
const INITIAL_DEMO_USERS = [
  {
    id: 'admin-uuid-001',
    email: 'admin@gbinbbin.org',
    password: 'adminpassword123',
    profile: {
      id: 'admin-uuid-001',
      full_name: 'Super Admin Officer',
      email: 'admin@gbinbbin.org',
      phone_number: '+91 98000 11223',
      role: 'admin',
      created_at: '2025-01-01T00:00:00.000Z'
    },
    household: null,
    role: 'admin'
  },
  {
    id: 'household-uuid-002',
    email: 'sarah.household@example.com',
    password: 'password123',
    profile: {
      id: 'household-uuid-002',
      full_name: 'Sarah Jenkins',
      email: 'sarah.household@example.com',
      phone_number: '+91 98111 22334',
      role: 'household',
      created_at: '2025-01-10T00:00:00.000Z'
    },
    household: {
      id: 'hh-002',
      user_id: 'household-uuid-002',
      household_id: 'GB-HH-4291',
      street_address: '42 Orchid Villa, Palm Avenue',
      ward_zone: 'Ward 12 - Green Valley',
      pincode: '560034',
      residents_count: 4,
      g_bin_count: 1,
      b_bin_count: 1,
      notes: 'Active composter. Segregates regularly.',
      created_at: '2025-01-10T00:00:00.000Z'
    },
    role: 'household'
  },
  {
    id: 'household-uuid-003',
    email: 'rohit.sharma@example.com',
    password: 'password123',
    profile: {
      id: 'household-uuid-003',
      full_name: 'Rohit Sharma',
      email: 'rohit.sharma@example.com',
      phone_number: '+91 98222 33445',
      role: 'household',
      created_at: '2025-01-15T00:00:00.000Z'
    },
    household: {
      id: 'hh-003',
      user_id: 'household-uuid-003',
      household_id: 'GB-HH-8820',
      street_address: 'Flat 302, Hill View Towers',
      ward_zone: 'Ward 08 - Eco Heights',
      pincode: '560068',
      residents_count: 3,
      g_bin_count: 1,
      b_bin_count: 2,
      notes: 'Requested extra dry bin for recyclable packaging.',
      created_at: '2025-01-15T00:00:00.000Z'
    },
    role: 'household'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    user_id: 'household-uuid-002',
    household_id: 'GB-HH-4291',
    items: [
      {
        id: 'combo-standard',
        name: 'G-Bin & B-Bin Combo Set (60L)',
        type: 'combo',
        price: 499,
        quantity: 1
      }
    ],
    total_amount: 499,
    status: 'Delivered',
    delivery_address: '42 Orchid Villa, Palm Avenue, Ward 12 - Green Valley, Pincode 560034',
    contact_phone: '+91 98111 22334',
    payment_method: 'Pay on Delivery / Subsidized Scheme',
    created_at: '2025-01-12T10:30:00.000Z',
    updated_at: '2025-01-14T14:00:00.000Z'
  },
  {
    id: 'ord-1002',
    user_id: 'household-uuid-003',
    household_id: 'GB-HH-8820',
    items: [
      {
        id: 'bbin-120',
        name: 'Extra Capacity B-Bin (120L Dry/Recyclable)',
        type: 'b-bin',
        price: 349,
        quantity: 1
      }
    ],
    total_amount: 349,
    status: 'Confirmed',
    delivery_address: 'Flat 302, Hill View Towers, Ward 08 - Eco Heights, Pincode 560068',
    contact_phone: '+91 98222 33445',
    payment_method: 'Pay on Delivery / Subsidized Scheme',
    created_at: '2025-02-01T15:00:00.000Z',
    updated_at: '2025-02-02T09:15:00.000Z'
  }
];

// Helper to get from local storage or set initial
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key}`, e);
  }
}

export function initLocalStorageIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users = INITIAL_DEMO_USERS.map(u => ({ id: u.id, email: u.email, password: u.password }));
    setStorage(STORAGE_KEYS.USERS, users);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    const profiles = INITIAL_DEMO_USERS.map(u => u.profile);
    setStorage(STORAGE_KEYS.PROFILES, profiles);
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS)) {
    const households = INITIAL_DEMO_USERS.filter(u => u.household).map(u => u.household);
    setStorage(STORAGE_KEYS.HOUSEHOLDS, households);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COLLECTIONS)) {
    setStorage(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }
}

export const localDB = {
  getProfiles: () => getStorage(STORAGE_KEYS.PROFILES, []),
  getHouseholds: () => getStorage(STORAGE_KEYS.HOUSEHOLDS, []),
  getCollections: () => getStorage(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS),
  getOrders: () => getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),

  saveHousehold: (household) => {
    const households = getStorage(STORAGE_KEYS.HOUSEHOLDS, []);
    const idx = households.findIndex(h => h.id === household.id || h.user_id === household.user_id);
    if (idx >= 0) {
      households[idx] = { ...households[idx], ...household, updated_at: new Date().toISOString() };
    } else {
      households.unshift(household);
    }
    setStorage(STORAGE_KEYS.HOUSEHOLDS, households);
    return household;
  },

  saveProfile: (profile) => {
    const profiles = getStorage(STORAGE_KEYS.PROFILES, []);
    const idx = profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    setStorage(STORAGE_KEYS.PROFILES, profiles);
    return profile;
  },

  saveOrder: (order) => {
    const orders = getStorage(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...order, updated_at: new Date().toISOString() };
    } else {
      orders.unshift(order);
    }
    setStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  saveCollection: (collection) => {
    const collections = getStorage(STORAGE_KEYS.COLLECTIONS, []);
    const idx = collections.findIndex(c => c.id === collection.id);
    if (idx >= 0) {
      collections[idx] = { ...collections[idx], ...collection, updated_at: new Date().toISOString() };
    } else {
      collections.unshift(collection);
    }
    setStorage(STORAGE_KEYS.COLLECTIONS, collections);
    return collection;
  },

  deleteCollection: (id) => {
    const collections = getStorage(STORAGE_KEYS.COLLECTIONS, []);
    const filtered = collections.filter(c => c.id !== id);
    setStorage(STORAGE_KEYS.COLLECTIONS, filtered);
    return true;
  },

  generateHouseholdId: () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = 'GB-HH-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};
