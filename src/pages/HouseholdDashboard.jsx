import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localDB } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import {
  Home,
  Leaf,
  Recycle,
  Calendar,
  ShoppingBag,
  Package,
  MapPin,
  Users,
  Clock,
  Truck,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react';

export const HouseholdDashboard = () => {
  const { user, profile, household } = useAuth();
  const [collections, setCollections] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Load scheduled collections
    const allCollections = localDB.getCollections();
    // Filter for current household's ward if available, else show all
    if (household?.ward_zone) {
      const wardCollections = allCollections.filter(c => c.ward_zone === household.ward_zone);
      setCollections(wardCollections.length > 0 ? wardCollections : allCollections);
    } else {
      setCollections(allCollections);
    }

    // Load recent orders for this user
    if (user) {
      const allOrders = localDB.getOrders();
      const userOrders = allOrders.filter(o => o.user_id === user.id || o.household_id === household?.household_id);
      setRecentOrders(userOrders.slice(0, 3));
    }
  }, [household, user]);

  return (
    <div className="container">
      {/* Welcome & Household ID Banner */}
      <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Home size={16} /> Household Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome, {profile?.full_name || 'Resident'}!
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            Here is your daily waste management schedule, bin status, and ward operational updates.
          </p>
        </div>

        {/* Unique Household ID Badge */}
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', border: '2px solid #10b981', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unique Household ID
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#065f46', fontFamily: 'monospace' }} id="dashboard-household-id">
            {household?.household_id || 'GB-HH-PENDING'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            ● Verified Active Citizen
          </span>
        </div>
      </div>

      {/* Household Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Address & Ward Details */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#334155' }}>
            <MapPin size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Registered Location</h3>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
            <p><strong>Ward / Zone:</strong> {household?.ward_zone || 'Ward 12 - Green Valley'}</p>
            <p><strong>Address:</strong> {household?.street_address || 'Registered Residential Address'}</p>
            <p><strong>PIN Code:</strong> {household?.pincode || '560034'}</p>
            <p><strong>Residents:</strong> {household?.residents_count || 1} Family Members</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Edit Household Info
            </Link>
          </div>
        </div>

        {/* Allocated Bins Status */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#334155' }}>
            <Recycle size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Household Bins Allocated</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <Leaf size={22} color="#10b981" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#065f46' }}>
                {household?.g_bin_count || 1}x G-Bin
              </div>
              <span style={{ fontSize: '0.75rem', color: '#047857' }}>Wet / Bio Waste</span>
            </div>

            <div style={{ flex: 1, background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <Recycle size={22} color="#0284c7" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#075985' }}>
                {household?.b_bin_count || 1}x B-Bin
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0369a1' }}>Dry / Recyclable</span>
            </div>
          </div>
          <Link to="/shop" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            Need Extra Bins? Visit Shop
          </Link>
        </div>

        {/* Quick Guidelines Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#334155' }}>
            <Info size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Segregation Checklist</h3>
          </div>
          <ul style={{ fontSize: '0.85rem', color: '#475569', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.4 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
              <span><strong>G-Bin:</strong> Kitchen peels, leftover food, leaves. Keep dry of standing liquid.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#0284c7', fontWeight: 800 }}>✓</span>
              <span><strong>B-Bin:</strong> Rinsed plastic bottles, paper, cardboard, cans & glass jars.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>✗</span>
              <span><strong>Never mix</strong> wet kitchen waste into the dry bin!</span>
            </li>
          </ul>
          <div style={{ marginTop: '0.75rem' }}>
            <Link to="/guide" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Detailed Segregation Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Regular Waste Collection Schedule for Household Ward */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Regular Scheduled Waste Collections ({household?.ward_zone || 'Ward 12 - Green Valley'})
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Collection vehicles operate strictly on schedule. Please ensure bins are positioned at your doorstep before arrival.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bin Stream</th>
                <th>Area & Ward</th>
                <th>Collection Days</th>
                <th>Time Window</th>
                <th>Assigned Vehicle</th>
                <th>Sanitation Officer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span
                      className={`status-badge ${
                        c.bin_type.includes('G-Bin')
                          ? 'badge-completed'
                          : c.bin_type.includes('B-Bin')
                          ? 'badge-in-progress'
                          : 'badge-confirmed'
                      }`}
                    >
                      {c.bin_type}
                    </span>
                  </td>
                  <td>
                    <strong>{c.area_name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.ward_zone}</div>
                  </td>
                  <td><strong>{c.collection_day}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
                      <Clock size={14} color="#64748b" /> {c.time_slot}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Truck size={14} color="#64748b" /> {c.vehicle_number}
                    </div>
                  </td>
                  <td>
                    {c.driver_name}
                    {c.driver_phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.driver_phone}</div>}
                  </td>
                  <td>
                    <span className={`status-badge badge-${c.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access to Orders & Shop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Bin Orders</h3>
            <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--bbin-primary)', fontWeight: 600 }}>
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>No orders placed yet.</p>
              <Link to="/shop" className="btn btn-outline btn-sm">Order Bins from Shop</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((ord) => (
                <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order #{ord.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge badge-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {ord.status}
                    </span>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>₹{ord.total_amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>Municipal Bin Subsidy</h3>
              <p style={{ fontSize: '0.8rem', color: '#047857' }}>Subsidized G-Bins and B-Bins for every registered home</p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Need replacement bins, higher volume 120L containers, or extra bins for large families? Order online directly through the municipal portal with doorstep delivery.
          </p>
          <Link to="/shop" className="btn btn-gbin" style={{ width: '100%' }}>
            Browse Bin Shop & Combos
          </Link>
        </div>
      </div>
    </div>
  );
};
