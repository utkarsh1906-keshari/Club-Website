import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Sun, 
  Moon,
  Home as HomeIcon,
  Info,
  Layers,
  FolderGit2,
  Calendar,
  Users,
  Image as ImageIcon,
  Trophy,
  UserPlus,
  ArrowRight,
  Shield
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Domains', path: '/domains', icon: <Layers size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderGit2 size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
    { name: 'Team', path: '/team', icon: <Users size={18} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Achievements', path: '/achievements', icon: <Trophy size={18} /> },
    { name: 'Join Us', path: '/join', icon: <UserPlus size={18} /> },
  ];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (q.includes('event') || q.includes('bootcamp') || q.includes('workshop')) {
      navigate('/events');
    } else if (q.includes('project') || q.includes('drone') || q.includes('rover')) {
      navigate('/projects');
    } else if (q.includes('team') || q.includes('lead') || q.includes('member')) {
      navigate('/team');
    } else if (q.includes('domain') || q.includes('ai') || q.includes('vlsi')) {
      navigate('/domains');
    } else if (q.includes('achieve') || q.includes('winner') || q.includes('award')) {
      navigate('/achievements');
    } else if (q.includes('join') || q.includes('apply') || q.includes('recruit')) {
      navigate('/join');
    } else {
      navigate('/projects');
    }
  };

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
          />
          <div className="brand-text">
            <span className="brand-title">DRONES &amp; ROBOTICS</span>
            <span className="brand-subtitle">ABES ENGINEERING COLLEGE</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
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

        {/* Right: Actions */}
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

          {/* Mobile Menu Toggle (Hamburger / Close) */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Quick Search Bar Dropdown */}
      {searchOpen && (
        <form onSubmit={handleSearchSubmit} className="navbar-search-bar">
          <div className="navbar-search-container">
            <Search size={18} className="search-bar-icon" />
            <input 
              type="text" 
              placeholder="Search projects, events, domains, team..." 
              className="navbar-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
            <button 
              type="button"
              className="navbar-search-close" 
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Modern Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Quick Search Bar Inside Drawer */}
            <form onSubmit={handleSearchSubmit} className="mobile-drawer-search">
              <Search size={16} className="drawer-search-icon" />
              <input 
                type="text" 
                placeholder="Search club website..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="mobile-menu-links">
              <Link
                to="/"
                className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
              >
                <span className="mobile-nav-icon"><HomeIcon size={18} /></span>
                <span>Home</span>
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-item ${isActive(link.path) ? 'active' : ''}`}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="mobile-menu-divider"></div>

              <div className="mobile-theme-row">
                <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>Theme Mode</span>
                <button type="button" className="theme-toggle-btn-mobile" onClick={toggleTheme}>
                  {theme === 'light' ? <><Moon size={15} /> Dark Mode</> : <><Sun size={15} /> Light Mode</>}
                </button>
              </div>

              <Link to="/join" className="mobile-join-link">
                <span>Join The Club</span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/admin" className="mobile-admin-link">
                <Shield size={14} />
                <span>Faculty &amp; Admin Portal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}