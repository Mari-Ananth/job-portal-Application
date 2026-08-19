import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Briefcase, User as UserIcon, LayoutDashboard, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'JOB_SEEKER') return '/seeker/dashboard';
    if (user.role === 'EMPLOYER') return '/employer/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 'var(--nav-height)',
      zIndex: 1000,
      borderBottom: '1px solid var(--border-color)',
      borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: 'rgba(9, 13, 22, 0.75)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: 800 }}>
        <Briefcase style={{ color: 'var(--accent-color)' }} size={24} />
        <span className="title-gradient">CareersHub</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Home</NavLink>
        <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Find Jobs</NavLink>

        {user ? (
          <>
            <NavLink to={getDashboardPath()} className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            
            {user.role === 'JOB_SEEKER' && (
              <>
                <NavLink to="/seeker/profile" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserIcon size={16} /> Profile
                </NavLink>
                <NavLink to="/seeker/applications" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Applications
                </NavLink>
              </>
            )}

            {user.role === 'EMPLOYER' && (
              <>
                <NavLink to="/employer/post-job" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Post a Job</NavLink>
                <NavLink to="/employer/profile" className={({ isActive }) => isActive ? 'nav-active' : ''} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Company Profile</NavLink>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>Register</Link>
          </div>
        )}
      </div>

      <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }} className="mobile-toggle-btn">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--nav-height)',
          left: 0,
          width: '100%',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 999
        }} className="mobile-drawer">
          <Link to="/" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <Link to="/jobs" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Find Jobs</Link>
          {user ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Dashboard</Link>
              {user.role === 'JOB_SEEKER' && (
                <>
                  <Link to="/seeker/profile" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Profile</Link>
                  <Link to="/seeker/applications" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>My Applications</Link>
                </>
              )}
              {user.role === 'EMPLOYER' && (
                <>
                  <Link to="/employer/post-job" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Post a Job</Link>
                  <Link to="/employer/profile" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }}>Company Profile</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .desktop-nav a:hover, .desktop-nav a.nav-active {
          color: var(--accent-color) !important;
        }
        .mobile-toggle-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
