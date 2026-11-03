import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { localDB, isLiveSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { user, profile, household } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Sync initial delivery info when user data is ready
  React.useEffect(() => {
    if (household) {
      setDeliveryAddress(`${household.street_address}, ${household.ward_zone}, Pincode: ${household.pincode}`);
    }
    if (profile?.phone_number) {
      setContactPhone(profile.phone_number);
    }
  }, [household, profile]);

  if (!isCartOpen) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!user) {
      setIsCartOpen(false);
      navigate('/login?redirect=shop');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        id: 'ord-' + Date.now(),
        user_id: user.id,
        household_id: household?.household_id || 'GB-HH-' + Math.floor(1000 + Math.random() * 9000),
        items: cart,
        total_amount: totalPrice,
        status: 'Pending',
        delivery_address: deliveryAddress || 'Address on file',
        contact_phone: contactPhone || user.email,
        payment_method: 'Pay on Delivery / Subsidized Scheme',
        created_at: new Date().toISOString()
      };

      if (isLiveSupabaseConfigured()) {
        const { error } = await supabase.from('orders').insert([orderData]);
        if (error) console.error('Supabase order insert error:', error);
      }

      // Always save to local store as well
      localDB.saveOrder(orderData);

      setOrderSuccess(orderData);
      clearCart();
    } catch (err) {
      console.error('Order error:', err);
      alert('Unable to place order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--neutral-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Your Bin Basket</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>Household Municipal Order</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            id="cart-drawer-close-btn"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
          {orderSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>Order Placed Successfully!</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem' }}>
                Your bins will be delivered by municipal sanitation services under Order Reference: <strong>{orderSuccess.id}</strong>.
              </p>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <p><strong>Household ID:</strong> {orderSuccess.household_id}</p>
                <p><strong>Status:</strong> <span className="status-badge badge-pending">Pending Verification</span></p>
                <p><strong>Total:</strong> ₹{orderSuccess.total_amount}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                <button
                  onClick={() => { setOrderSuccess(null); setIsCartOpen(false); navigate('/orders'); }}
                  className="btn btn-gbin"
                >
                  Track My Orders
                </button>
                <button
                  onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>Your bin cart is empty.</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="btn btn-outline btn-sm"
              >
                Browse G-Bin & B-Bin Shop
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{item.price} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/Flat No., Ward, Street"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', background: '#f1f5f9', padding: '0.6rem 0.75rem', borderRadius: '6px' }}>
                  💡 <strong>Subsidized Ordering:</strong> No online payment required. Pay upon doorstep delivery or through municipal sanitation assessment.
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>Total Amount:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gbin"
                  style={{ width: '100%', padding: '0.75rem' }}
                  id="place-order-submit-btn"
                >
                  {submitting ? 'Placing Order...' : 'Confirm Bin Order'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
