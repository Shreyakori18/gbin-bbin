import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localDB } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';

export const MyOrders = () => {
  const { user, household } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const allOrders = localDB.getOrders();
      const userOrders = allOrders.filter(
        (o) => o.user_id === user.id || o.household_id === household?.household_id
      );
      setOrders(userOrders);
    }
  }, [user, household]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>My Bin Orders</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Track delivery status of G-Bins and B-Bins for Household ID: <strong>{household?.household_id || 'N/A'}</strong>
          </p>
        </div>
        <Link to="/shop" className="btn btn-gbin">
          <ShoppingBag size={16} /> Order More Bins
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Package size={52} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>No Bin Orders Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't ordered any extra bins or combos yet. Every household is eligible for subsidized bins.
          </p>
          <Link to="/shop" className="btn btn-bbin">Browse Municipal Bin Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((ord) => {
            const step = getStatusStep(ord.status);

            return (
              <div key={ord.id} className="card" style={{ padding: '1.75rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Order #{ord.id}</h3>
                      <span className={`status-badge badge-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {ord.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Placed on: {new Date(ord.created_at).toLocaleDateString()} at {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{ord.total_amount}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.payment_method}</span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Delivery Progress Tracker
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? '#10b981' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        1
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: step >= 1 ? 700 : 500, color: step >= 1 ? '#065f46' : '#94a3b8' }}>Pending</span>
                    </div>

                    <div>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? '#10b981' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        2
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: step >= 2 ? 700 : 500, color: step >= 2 ? '#065f46' : '#94a3b8' }}>Confirmed</span>
                    </div>

                    <div>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 3 ? '#0284c7' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        3
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: step >= 3 ? 700 : 500, color: step >= 3 ? '#075985' : '#94a3b8' }}>Out for Delivery</span>
                    </div>

                    <div>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 4 ? '#10b981' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        4
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: step >= 4 ? 700 : 500, color: step >= 4 ? '#065f46' : '#94a3b8' }}>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Items & Delivery Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>Items Ordered:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {ord.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', background: '#ffffff', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                          <span><strong>{item.quantity}x</strong> {item.name}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>Delivery Destination:</h4>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                      <p><strong>Address:</strong> {ord.delivery_address}</p>
                      <p><strong>Contact:</strong> {ord.contact_phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
