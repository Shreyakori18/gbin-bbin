import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Home, Phone, Mail, MapPin, CheckCircle, Save } from 'lucide-react';

export const Profile = () => {
  const { user, profile, household, updateProfileAndHousehold, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone_number || '',
    streetAddress: household?.street_address || '',
    wardZone: household?.ward_zone || 'Ward 12 - Green Valley',
    pincode: household?.pincode || '',
    residentsCount: household?.residents_count || 1
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfileAndHousehold(formData);
      setSuccessMsg('Profile and household records updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>My Profile & Settings</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manage your personal contact details, household address, and ward assignment.
        </p>
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} color="#10b981" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {errorMsg}
        </div>
      )}

      <div className="card">
        {/* Household ID Header if resident */}
        {!isAdmin && household && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Assigned Household Identifier</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065f46', fontFamily: 'monospace' }}>{household.household_id}</div>
            </div>
            <span className="status-badge badge-completed">Verified Household</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                id="profile-fullname-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (System ID)</label>
              <input
                type="email"
                disabled
                className="form-input"
                value={user?.email || ''}
                style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Contact Phone</label>
            <input
              type="tel"
              name="phone"
              required
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              id="profile-phone-input"
            />
          </div>

          {!isAdmin && (
            <>
              <div className="form-group">
                <label className="form-label">Residential Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  required
                  className="form-input"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  id="profile-address-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ward / Zone</label>
                  <select
                    name="wardZone"
                    className="form-select"
                    value={formData.wardZone}
                    onChange={handleChange}
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
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Family Members</label>
                  <input
                    type="number"
                    name="residentsCount"
                    min={1}
                    required
                    className="form-input"
                    value={formData.residentsCount}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-gbin"
              disabled={saving}
              id="save-profile-btn"
            >
              <Save size={16} /> {saving ? 'Saving Records...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
