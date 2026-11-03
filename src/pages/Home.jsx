import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Recycle,
  CheckCircle,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Users,
  Trash2,
  Sparkles
} from 'lucide-react';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: '#047857', marginBottom: '1.25rem', border: '1px solid #a7f3d0' }}>
              <Sparkles size={16} /> Smart Neighborhood Waste Segregation
            </div>
            <h1 className="hero-title">
              Separate Today for a <span className="text-gbin">Greener</span> & <span className="text-bbin">Cleaner</span> Tomorrow.
            </h1>
            <p className="hero-lead">
              Welcome to the <strong>G-Bin & B-Bin</strong> Smart Waste Management System. We empower households to separate biodegradable wet waste from recyclable dry waste at the source, ensuring seamless regular scheduled municipal collection.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-gbin" id="hero-register-btn">
                Register Your Household <ArrowRight size={18} />
              </Link>
              <Link to="/guide" className="btn btn-outline" id="hero-guide-btn">
                View Segregation Guide
              </Link>
              <Link to="/shop" className="btn btn-bbin" id="hero-shop-btn">
                Order Bins <ShoppingBag size={18} />
              </Link>
            </div>
          </div>

          {/* Interactive Bins Visual */}
          <div className="bin-duo-container">
            {/* G-Bin Showcase */}
            <div className="bin-card-showcase showcase-gbin">
              <div className="bin-illustration bin-ill-g">
                <div className="bin-lid"></div>
                <Leaf size={32} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '4px' }}>G-BIN</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--gbin-dark)', fontWeight: 800 }}>Green Bin</h3>
              <p style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600, margin: '0.35rem 0' }}>Biodegradable & Wet Waste</p>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                Vegetable peels, food scraps, fruit waste, leaves & tea grounds. Converted to rich compost!
              </p>
              <div style={{ marginTop: '1rem' }}>
                <span className="status-badge badge-completed">Compost Ready</span>
              </div>
            </div>

            {/* B-Bin Showcase */}
            <div className="bin-card-showcase showcase-bbin">
              <div className="bin-illustration bin-ill-b">
                <div className="bin-lid"></div>
                <Recycle size={32} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '4px' }}>B-BIN</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--bbin-dark)', fontWeight: 800 }}>Blue Bin</h3>
              <p style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600, margin: '0.35rem 0' }}>Dry & Recyclable Waste</p>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                Paper, plastic bottles, cardboard, cartons, metals, & dry packaging. Reprocessed into new goods!
              </p>
              <div style={{ marginTop: '1rem' }}>
                <span className="status-badge badge-in-progress">Recycle Stream</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Content */}
      <div className="container">
        {/* Quick Highlights Strip */}
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-val">12,450+</div>
              <div className="stat-lbl">Registered Households</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Trash2 size={24} />
            </div>
            <div>
              <div className="stat-val">28,900+</div>
              <div className="stat-lbl">Bins Distributed</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-val">100%</div>
              <div className="stat-lbl">Scheduled Regular Routes</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="stat-val">94.8%</div>
              <div className="stat-lbl">Segregation Compliance</div>
            </div>
          </div>
        </div>

        {/* Why Segregation Matters */}
        <div style={{ margin: '4rem 0' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Why Segregate with G-Bin & B-Bin?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Unsegregated garbage clogs landfills, produces methane gas, and ruins recyclable goods. Segregating into Green and Blue bins creates a sustainable circular economy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card card-gbin">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
                  <Leaf size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Zero Waste to Landfills</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Wet waste in G-Bin decomposes naturally without releasing toxic leachate into groundwater. It is directly converted to nutrient-rich compost for community agriculture.
              </p>
            </div>

            <div className="card card-bbin">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#f0f9ff', padding: '0.5rem', borderRadius: '8px', color: '#0284c7' }}>
                  <Recycle size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Resource Recovery</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Dry waste in B-Bin remains clean and uncontaminated by liquids, allowing paper, metals, and polymers to be sorted and re-manufactured efficiently.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '8px', color: '#d97706' }}>
                  <Calendar size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Regular Municipal Schedule</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                No guesswork or irregular pickups. Ward-level sanitation teams follow published schedules so households know exactly when collection vehicles arrive.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Steps */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3rem 2rem', margin: '3rem 0' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.85rem', fontWeight: 800, marginBottom: '2.5rem' }}>
            Four Simple Steps for Every Household
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: '#ecfdf5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 1rem' }}>
                1
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Register Household</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Register with your address and ward to receive your permanent unique Household ID.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: '#f0f9ff', color: '#0369a1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 1rem' }}>
                2
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Get Color Bins</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Obtain your standardized G-Bin (Green) and B-Bin (Blue) through our subsidized bin shop.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: '#ecfdf5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 1rem' }}>
                3
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Segregate Waste</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Deposit kitchen scraps into G-Bin and clean packaging, paper, & plastic into B-Bin.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: '#f0f9ff', color: '#0369a1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 1rem' }}>
                4
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Scheduled Handover</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Hand over bins to municipal collection trucks following the designated ward schedule.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/register" className="btn btn-gbin" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Join the Movement Today <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
