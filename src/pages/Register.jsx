import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Home, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    streetAddress: '',
    wardZone: 'Ward 12 - Green Valley',
    pincode: '560034',
    residentsCount: '3'
  });
  const [error, setError] = useState('');
  const [successHouseholdId, setSuccessHouseholdId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { registerHousehold } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await registerHousehold(formData);
      setSuccessHouseholdId(result.householdId);
    } catch (err) {
      setError(err.message || 'Household registration failed. Please review details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px', marginTop: '2rem', marginBottom: '3rem' }}>
      <div className="card">
        {successHouseholdId ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065f46', marginBottom: '0.75rem' }}>
              Household Registered Successfully!
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your household has been recorded in the municipal waste management database. Your unique Household ID is:
            </p>

            <div style={{ background: '#f0fdf4', border: '2px dashed #10b981', padding: '1.25rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600, textTransform: 'uppercase' }}>Permanent Household ID</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#065f46', letterSpacing: '2px', fontFamily: 'monospace' }} id="registered-household-id-badge">
                {successHouseholdId}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-gbin"
                style={{ padding: '0.75rem 2rem' }}
                id="goto-dashboard-btn"
              >
                Go to Household Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', padding: '0.65rem', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', marginBottom: '0.75rem' }}>
                <Home size={28} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                Register Your Household
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Receive your unique Household ID to participate in scheduled G-Bin & B-Bin collection.
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Head of Household / Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="form-input"
                    placeholder="e.g. Priya Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    id="register-fullname-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    id="register-phone-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address (Login ID)</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-input"
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    id="register-email-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    id="register-password-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address / House / Flat No.</label>
                <input
                  type="text"
                  name="streetAddress"
                  required
                  className="form-input"
                  placeholder="e.g. #14 Palm Meadows, 3rd Cross"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  id="register-address-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ward / Administrative Zone</label>
                  <select
                    name="wardZone"
                    className="form-select"
                    value={formData.wardZone}
                    onChange={handleChange}
                    id="register-ward-select"
                  >
                    <option value="Ward 12 - Green Valley">Ward 12 - Green Valley</option>
                    <option value="Ward 08 - Eco Heights">Ward 08 - Eco Heights</option>
                    <option value="Ward 15 - Central Park">Ward 15 - Central Park</option>
                    <option value="Ward 03 - Sunrise Colony">Ward 03 - Sunrise Colony</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    className="form-input"
                    placeholder="560034"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Residents Count</label>
                  <input
                    type="number"
                    name="residentsCount"
                    min={1}
                    max={20}
                    required
                    className="form-input"
                    value={formData.residentsCount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.825rem', color: '#64748b', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <ShieldCheck size={16} color="#10b981" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                Registering automatically assigns standard 1x G-Bin and 1x B-Bin quota to your household address.
              </div>

              <button
                type="submit"
                className="btn btn-gbin"
                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
                disabled={loading}
                id="register-submit-btn"
              >
                {loading ? 'Creating Household Account...' : 'Complete Household Registration'}
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--bbin-primary)', fontWeight: 600 }}>
                Sign in to your dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
