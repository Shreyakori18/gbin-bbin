import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="g-badge">G</span>
            <span className="b-badge">B</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>G-Bin & B-Bin</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '360px' }}>
            Smart Waste Management System empowering neighborhoods to separate biodegradable (wet) and
            non-biodegradable (dry) waste at source for a cleaner, greener community.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.85rem' }}>
              <Leaf size={16} /> Organic Composting
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontSize: '0.85rem' }}>
              <Recycle size={16} /> Closed-loop Recycling
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <li><Link to="/" style={{ color: '#94a3b8' }}>Home Overview</Link></li>
            <li><Link to="/guide" style={{ color: '#94a3b8' }}>Waste Segregation Guide</Link></li>
            <li><Link to="/shop" style={{ color: '#94a3b8' }}>Bin Shop & Combos</Link></li>
            <li><Link to="/about" style={{ color: '#94a3b8' }}>About the Initiative</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <li><Link to="/login" style={{ color: '#94a3b8' }}>Household Login</Link></li>
            <li><Link to="/register" style={{ color: '#94a3b8' }}>Household Registration</Link></li>
            <li><Link to="/admin" style={{ color: '#94a3b8' }}>Municipal Admin Portal</Link></li>
            <li><Link to="/admin/reports" style={{ color: '#94a3b8' }}>Operations Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Contact Desk</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#10b981" /> Municipal Ward Sanitation Dept.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#0284c7" /> Helpline: 1800-425-GBIN
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#94a3b8" /> support@gbinbbin.gov.in
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} G-Bin & B-Bin Smart Waste Management System. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Ward Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
