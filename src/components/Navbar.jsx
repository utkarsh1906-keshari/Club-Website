import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Domains', path: '/domains' },
    { name: 'Projects', path: '/projects' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Join Us', path: '/join' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left: Club Logo & Title */}
        <Link to="/" className="navbar-brand" title="Drones & Robotics Club - ABES EC">
          <img 
            src="/club-emblem.png" 
            alt="Drone & Robotics Club Logo" 
            className="club-nav-logo" 
            style={{ height: '44px', width: 'auto', maxHeight: '44px', objectFit: 'contain' }}
          />
          <div className="brand-text">
            <span className="brand-title">DRONES &amp; ROBOTICS</span>
            <span className="brand-subtitle">ABES ENGINEERING COLLEGE</span>
          </div>
        </Link>

        {/* Center: Simple clean text navigation links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive(link.path) ? 'nav-item-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Vertical Divider & Simple Actions */}
        <div className="navbar-actions">
          <div className="nav-vertical-divider" aria-hidden="true"></div>

          {/* Quick Search toggle */}
          <button 
            className="nav-icon-btn search-toggle-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle Search"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button 
            className="nav-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Quick Search Bar Dropdown */}
      {searchOpen && (
        <div className="navbar-search-bar">
          <div className="navbar-search-container">
            <Search size={18} className="search-bar-icon" />
            <input 
              type="text" 
              placeholder="Search projects, events, domains, team..." 
              className="navbar-search-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
            <button 
              className="navbar-search-close" 
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-item ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mobile-menu-divider"></div>
              <div className="mobile-theme-row">
                <span>Theme</span>
                <button className="theme-toggle-btn-mobile" onClick={toggleTheme}>
                  {theme === 'light' ? <><Moon size={16} /> Dark Mode</> : <><Sun size={16} /> Light Mode</>}
                </button>
              </div>
              <Link to="/join" className="mobile-join-link">
                Join Club
              </Link>
              <Link to="/admin" className="mobile-admin-link">
                Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}