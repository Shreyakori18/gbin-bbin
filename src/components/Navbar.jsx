import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  ShoppingBag,
  User,
  LogOut,
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Info,
  Package,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, profile, isAdmin, logout, quickDemoLogin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="brand-badge">
            <span className="g-badge">G</span>
            <span className="b-badge">B</span>
          </div>
          <div>
            <div className="brand-title">G-Bin & B-Bin</div>
            <span className="brand-subtitle">Smart Waste Management</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <BookOpen size={16} /> Segregation Guide
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={16} /> Bin Shop
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Info size={16} /> About Us
          </NavLink>

          {user && !isAdmin && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Package size={16} /> My Orders
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ShieldAlert size={16} color="#0284c7" /> Admin Panel
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Reports
              </NavLink>
            </>
          )}
        </div>

        {/* Actions (Cart & Auth) */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-outline"
            style={{ position: 'relative', padding: '0.45rem 0.75rem' }}
            title="Bin Cart"
            id="nav-cart-btn"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 6px'
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* User state */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/profile"
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <User size={15} />
                <span>{profile?.full_name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out" id="nav-logout-btn">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" id="nav-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-gbin btn-sm" id="nav-register-btn">
                Register Household
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="btn btn-outline btn-sm mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'inline-flex' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--neutral-border)', background: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
            <Link to="/guide" onClick={() => setMobileMenuOpen(false)} className="nav-link">Segregation Guide</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="nav-link">Bin Shop</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link">About Us</Link>
            {user && !isAdmin && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link">Household Dashboard</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Orders</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Profile</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link">Admin Dashboard</Link>
                <Link to="/admin/reports" onClick={() => setMobileMenuOpen(false)} className="nav-link">Reports</Link>
              </>
            )}
            {!user && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); navigate('/admin'); }}
                  className="btn btn-bbin btn-sm"
                  style={{ flex: 1 }}
                >
                  Demo Admin
                </button>
                <button
                  onClick={() => { quickDemoLogin('household'); setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="btn btn-gbin btn-sm"
                  style={{ flex: 1 }}
                >
                  Demo Household
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
