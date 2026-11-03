import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Leaf, Recycle, Check, ShieldCheck, Plus } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'gbin-standard',
    name: 'G-Bin (Green) – Standard 60 Liters',
    type: 'gbin',
    category: 'Biodegradable & Wet Waste',
    price: 249,
    originalPrice: 450,
    capacity: '60 Liters',
    features: [
      'Heavy-duty antimicrobial virgin HDPE polymer',
      'Airtight odor-locking seal lid with handle',
      'UV-resistant green pigmentation',
      'Integrated aeration vents for compost stabilization'
    ],
    recommendedFor: 'Apartments & 2-4 member households',
    badgeText: 'Green Wet Waste'
  },
  {
    id: 'bbin-standard',
    name: 'B-Bin (Blue) – Standard 60 Liters',
    type: 'bbin',
    category: 'Dry & Recyclable Waste',
    price: 249,
    originalPrice: 450,
    capacity: '60 Liters',
    features: [
      'Sturdy scratch-resistant recyclable polymer',
      'Wide-mouth entry for paper, boxes & containers',
      'Dual ergonomic side carry handles',
      'Weatherproof non-fading blue finish'
    ],
    recommendedFor: 'Daily cardboard, plastic & paper recyclables',
    badgeText: 'Blue Dry Waste'
  },
  {
    id: 'combo-standard',
    name: 'G-Bin & B-Bin Combo Set (60L Duo)',
    type: 'combo',
    category: 'Complete Segregation Solution',
    price: 449,
    originalPrice: 900,
    capacity: '60L Green + 60L Blue',
    features: [
      'Full dual-bin system for total compliance',
      'Color-matched printed segregation sticker guide',
      'Subsidized pair pricing (Save 50%)',
      'Free municipal delivery & household tagging'
    ],
    recommendedFor: 'Best Value for new registered homes',
    badgeText: 'Most Popular Choice'
  },
  {
    id: 'gbin-large',
    name: 'G-Bin Heavy Capacity – 120 Liters',
    type: 'gbin',
    category: 'Commercial / Large Wet Waste',
    price: 499,
    originalPrice: 850,
    capacity: '120 Liters with Heavy Wheels',
    features: [
      'Rubberized all-terrain wheels & roll handle',
      'Reinforced base for heavy organic waste',
      'Foot-step pedal for hands-free operation',
      'Direct compatibility with municipal tipper lifts'
    ],
    recommendedFor: 'Joint families, villas, & small eateries',
    badgeText: 'Heavy Duty 120L'
  },
  {
    id: 'bbin-large',
    name: 'B-Bin Heavy Capacity – 120 Liters',
    type: 'bbin',
    category: 'Bulk Recyclables Collection',
    price: 499,
    originalPrice: 850,
    capacity: '120 Liters with Heavy Wheels',
    features: [
      'Wheel-mounted dry waste mobile unit',
      'Capacity for high-volume corrugated boxes',
      'Lockable hood prevent rain ingress',
      'Compatible with recycling truck lifts'
    ],
    recommendedFor: 'Homes with extensive parcel deliveries & packaging',
    badgeText: 'High Volume 120L'
  },
  {
    id: 'combo-deluxe',
    name: 'Deluxe Smart Waste Station (120L Duo)',
    type: 'combo',
    category: 'Comprehensive 120L Double Unit',
    price: 899,
    originalPrice: 1700,
    capacity: '120L G-Bin + 120L B-Bin on Wheels',
    features: [
      'Two 120L mobile wheeled bins with foot pedals',
      'Weather-resistant steel linking bracket',
      'Municipal QR Code tag for automated route verification',
      'Complimentary roll of biodegradable liner bags'
    ],
    recommendedFor: 'Community centers, villas & housing societies',
    badgeText: 'Ultimate Duo Package'
  }
];

export const BinShop = () => {
  const { addToCart, setIsCartOpen } = useCart();

  return (
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: '#047857', marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Official Municipal Bin Program
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Municipal Bin Shop
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6 }}>
          Standardized G-Bins (Green) and B-Bins (Blue) distributed at subsidized rates.
          Orders are delivered directly to your registered household address with cash on delivery or municipal billing.
        </p>
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {PRODUCTS.map((prod) => {
          const isGreen = prod.type === 'gbin';
          const isBlue = prod.type === 'bbin';
          const isCombo = prod.type === 'combo';

          return (
            <div
              key={prod.id}
              className={`card ${isGreen ? 'card-gbin' : isBlue ? 'card-bbin' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: isCombo ? '4px solid #8b5cf6' : undefined,
                position: 'relative'
              }}
            >
              <div>
                {/* Visual Representation */}
                <div style={{
                  height: '140px',
                  background: isGreen ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' : isBlue ? 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  position: 'relative'
                }}>
                  {isCombo ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="bin-illustration bin-ill-g" style={{ width: '60px', height: '80px' }}>
                        <Leaf size={20} />
                      </div>
                      <div className="bin-illustration bin-ill-b" style={{ width: '60px', height: '80px' }}>
                        <Recycle size={20} />
                      </div>
                    </div>
                  ) : isGreen ? (
                    <div className="bin-illustration bin-ill-g" style={{ width: '70px', height: '90px' }}>
                      <Leaf size={24} />
                    </div>
                  ) : (
                    <div className="bin-illustration bin-ill-b" style={{ width: '70px', height: '90px' }}>
                      <Recycle size={24} />
                    </div>
                  )}

                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isGreen ? '#047857' : isBlue ? '#0369a1' : '#6b21a8',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {prod.badgeText}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {prod.category}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.35rem 0 0.5rem', color: '#0f172a' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontStyle: 'italic' }}>
                  Recommended: {prod.recommendedFor}
                </p>

                {/* Features list */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#334155', marginBottom: '1.5rem' }}>
                  {prod.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={15} color={isGreen ? '#10b981' : isBlue ? '#0284c7' : '#8b5cf6'} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Add to Cart */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{prod.price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Subsidized
                  </span>
                </div>

                <button
                  onClick={() => addToCart(prod, 1)}
                  className={`btn ${isGreen ? 'btn-gbin' : isBlue ? 'btn-bbin' : 'btn-gbin'}`}
                  style={{ width: '100%', padding: '0.65rem' }}
                  id={`add-to-cart-${prod.id}`}
                >
                  <Plus size={16} /> Add to Basket
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Municipal Ordering Notice */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShieldCheck size={36} color="#0284c7" />
        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
          <strong>Municipal Standard Certification:</strong> All G-Bins and B-Bins comply with Ministry of Housing and Urban Affairs Solid Waste Management Rules. Bins feature permanent embossed color markings to prevent household confusion.
        </div>
      </div>
    </div>
  );
};
