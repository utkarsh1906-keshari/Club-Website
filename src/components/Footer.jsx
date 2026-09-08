import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight, Globe, Code, MessageSquare } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Col 1: Brand & Bio */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="footer-dual-logos">
                <div className="footer-logo-box" title="ABES Engineering College">
                  <img 
                    src="/college-logo.png" 
                    alt="ABES Engineering College Logo" 
                    className="footer-logo-img college-footer-logo" 
                    style={{ height: '48px', width: 'auto', maxHeight: '48px', objectFit: 'contain' }}
                  />
                </div>
                <div className="footer-logo-divider" aria-hidden="true"></div>
                <div className="footer-logo-box" title="Drone & Robotics Club">
                  <img 
                    src="/club-emblem.png" 
                    alt="Drone & Robotics Club Logo" 
                    className="footer-logo-img club-footer-logo" 
                    style={{ height: '48px', width: 'auto', maxHeight: '48px', objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="footer-brand-details">
                <span className="footer-brand-title">DRONE & ROBOTICS CLUB</span>
                <span className="footer-brand-institution">ABES ENGINEERING COLLEGE &bull; ESTD. 2000</span>
              </div>
            </div>
            <p className="footer-description">
              A collegiate multidisciplinary engineering community pioneering research and real-world implementation across AI, Robotics, Embedded VLSI, and Aerial Robotics.
            </p>
          </div>

          {/* Col 2: Domains */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Technical Domains</h4>
            <ul className="footer-links">
              <li><Link to="/domains?domain=ai-ml">AI & Machine Learning</Link></li>
              <li><Link to="/domains?domain=vlsi">Very Large Scale Integration(VLSI)</Link></li>
              <li><Link to="/domains?domain=robotics-iot">Robotics & IOT</Link></li>
              <li><Link to="/domains?domain=drone-tech">Drone Technology</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/domains">Domains &amp; Projects</Link></li>
              <li><Link to="/events">Events & Workshops</Link></li>
              <li><Link to="/team">Club Leadership & Members</Link></li>
              <li><Link to="/gallery">Media Gallery</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/join" className="footer-highlight-link">Recruitment Form <ArrowUpRight size={13} /></Link></li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Connect</h4>
            <p className="footer-contact-text">
              Reach out for collaborative research, sponsorships, or workshop queries.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="mailto:contact@droneandrobotics.club" aria-label="Email" className="social-icon">
                <Mail size={18} />
              </a>
            </div>
            <Link to="/admin" className="admin-portal-link">
              Admin Control Center &rarr;
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Drone & Robotics Club. Built with precision for student innovation.
          </p>
          <div className="footer-bottom-links">
            <Link to="/about">About Club</Link>
            <span>&bull;</span>
            <Link to="/contact">Contact</Link>
            <span>&bull;</span>
            <Link to="/join">Apply</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}