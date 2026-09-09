import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  MapPin, 
  Mail, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck,
  Quote,
  Bell
} from 'lucide-react';
import { announcementsService } from '../lib/dataService';
import './Home.css';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await announcementsService.getAll(true);
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      }
    }
    loadAnnouncements();
  }, []);

  const portalCards = [
    {
      title: 'About the Club',
      tag: 'CHARTER & MISSION',
      desc: 'Discover our institutional heritage, autonomous flight labs, mission charter, and practical engineering philosophy at ABESEC.',
      link: '/about',
      linkText: 'Open About Section',
      badge: 'Overview'
    },
    {
      title: 'Technical Domains',
      tag: 'SPECIALIZATIONS',
      desc: 'Deep-dive into our 4 core engineering domains: AI & Machine Learning, Very Large Scale Integration(VLSI), Robotics & IOT, and Drone Technology.',
      link: '/domains',
      linkText: 'Explore Domains',
      badge: '4 Verticals'
    },
    {
      title: 'Events & Workshops',
      tag: 'HANDS-ON LEARNING',
      desc: 'Browse flagship Drone Bootcamps, Circuit Bid challenges, FPV assembly workshops, and 48-hour national hackathons.',
      link: '/events',
      linkText: 'View Event Details',
      badge: 'Competitions'
    },
    {
      title: 'Club Leadership & Members',
      tag: 'FACULTY & STUDENTS',
      desc: 'Meet our Faculty Coordinator, Executive Leadership, and student domain heads steering innovation and member mentorship.',
      link: '/team',
      linkText: 'Meet The Team',
      badge: 'Core Council'
    }
  ];

  return (
    <div className="home-page abes-theme">
      {/* 1. HERO BANNER */}
      <section className="abes-hero-banner">
        <div className="hero-banner-overlay"></div>
        
        <div className="container hero-banner-container">
          {/* Active Announcement Alert */}
          {announcements.length > 0 && (
            <div className="home-announcement-banner" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.45rem 1.15rem',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{
                background: 'var(--color-primary)',
                color: '#fff',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Bell size={11} /> {announcements[0].badge || 'Notice'}
              </span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {announcements[0].title}
              </span>
              {announcements[0].link_url && (
                <Link to={announcements[0].link_url} style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  View &rarr;
                </Link>
              )}
            </div>
          )}

          {/* Institutional Showcase: College Logo + Name | Vertical Line | Club Logo + Name */}
          <div className="hero-institutional-header">
            <div className="institutional-partner college-side" title="ABES Engineering College">
              <div className="partner-logo-box">
                <img 
                  src="/college-logo.png" 
                  alt="ABES Engineering College Logo" 
                  className="institutional-logo college-logo-img" 
                />
              </div>
              <div className="partner-text-block">
                <span className="partner-pre-title">AFFILIATED INSTITUTION</span>
                <h2 className="partner-title">ABES Engineering College</h2>
                <span className="partner-sub-title">Estd. 2000 &bull; Ghaziabad, UP</span>
              </div>
            </div>

            {/* Vertical Thick Black Divider Line */}
            <div className="institutional-divider" aria-hidden="true"></div>

            <div className="institutional-partner club-side" title="Drone & Robotics Club - ABES">
              <div className="partner-logo-box">
                <img 
                  src="/club-emblem.png" 
                  alt="Drone & Robotics Club ABES Logo" 
                  className="institutional-logo club-logo-img" 
                />
              </div>
              <div className="partner-text-block">
                <span className="partner-pre-title">OFFICIAL CHAPTER</span>
                <h2 className="partner-title">Drones &amp; Robotics Club</h2>
                <span className="partner-sub-title">ABESEC &bull; Student Innovation Hub</span>
              </div>
            </div>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="hero-title">
            Drones and Robotics <span className="text-gradient-cyan">Club</span>
          </h1>

          <p className="hero-tagline">
            Exploring the Sky, Advancing Robotics
          </p>

          <p className="hero-description">
            The premier multidisciplinary engineering community of <strong>ABES Engineering College</strong>.
            Empowering students through hands-on UAV airframes, autonomous robotics, embedded VLSI systems, and industry-grade workshops.
          </p>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <Link to="/about" className="btn btn-primary">
              About Our Club <ArrowRight size={16} />
            </Link>
            <Link to="/events" className="btn btn-secondary">
              Explore Events
            </Link>
            <Link to="/join" className="btn btn-outline-light">
              Apply to Join
            </Link>
          </div>

          {/* Metrics Strip */}
          <div className="metrics-strip">
            <div className="metric-box">
              <span className="metric-number">4</span>
              <span className="metric-label">Technical Domains</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-number">150+</span>
              <span className="metric-label">Student Members</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-number">~30</span>
              <span className="metric-label">Annual Intake</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-number">100%</span>
              <span className="metric-label">Hands-On Learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED SECTIONS PORTAL GATEWAY */}
      <section className="section-padding portal-gateway-section">
        <div className="container">
          <div className="abes-section-heading text-center">
            <span className="section-label">Club Sections</span>
            <h2>Explore Club Portals</h2>
            <p className="section-subtitle">
              Select any section to open its dedicated details, projects, schedules, and team directories.
            </p>
          </div>

          <div className="portal-grid">
            {portalCards.map((card, index) => (
              <div key={index} className="aesthetic-card portal-card">
                <div className="portal-card-top">
                  <span className="portal-tag">{card.tag}</span>
                  <span className="portal-badge">{card.badge}</span>
                </div>
                <h3 className="portal-title">{card.title}</h3>
                <p className="portal-desc">{card.desc}</p>
                <div className="portal-action">
                  <Link to={card.link} className="btn btn-primary portal-btn">
                    {card.linkText} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MESSAGE FROM FACULTY ADVISOR */}
      <section className="section-padding faculty-advisor-section">
        <div className="container">
          <div className="aesthetic-card faculty-advisor-card">
            {/* Left Column: Message Content */}
            <div className="faculty-advisor-content">
              <div className="advisor-section-badge">
                <span className="section-label">FACULTY MENTORSHIP &amp; GUIDANCE</span>
              </div>
              
              <h2 className="faculty-advisor-title">
                Message from Faculty Advisor
              </h2>
              <div className="heading-line-maroon" style={{ marginBottom: '1.75rem' }}></div>

              <div className="faculty-quote-wrapper">
                <Quote className="faculty-quote-icon" size={36} aria-hidden="true" />
                <blockquote className="faculty-advisor-quote">
                  &ldquo;As the Faculty Advisor and Coordinator of the Drones and Robotics Club at ABES Engineering College, I am dedicated to fostering hands-on engineering excellence, practical flight robotics, and research-driven innovation. Our mission is to empower our students with industry-grade prototyping labs and competitive platforms to lead in modern automation.&rdquo;
                </blockquote>
              </div>

              <div className="faculty-advisor-regards">
                <span className="regards-salutation">Warm regards,</span>
                <span className="regards-author">Ms. Unnati Mehta</span>
                <span className="regards-designation">Assistant Professor &bull; Dept. of Electronics &amp; Communication Engineering</span>
              </div>
            </div>

            {/* Right Column: Faculty Advisor Profile */}
            <div className="faculty-advisor-profile">
              <div className="advisor-photo-card">
                <div className="advisor-photo-container">
                  <img 
                    src="/unnati-mehta-advisor.png" 
                    alt="Ms. Unnati Mehta - Faculty Advisor & Coordinator" 
                    className="advisor-photo-img" 
                  />
                  <span className="advisor-floating-pill">Faculty Advisor</span>
                </div>
                <div className="advisor-info-block">
                  <h3 className="advisor-display-name">Ms. Unnati Mehta</h3>
                  <p className="advisor-role-title">Faculty Coordinator &amp; Advisor</p>
                  <p className="advisor-department-text">Dept. of Electronics &amp; Communication Engineering</p>
                  <p className="advisor-college-text">ABES Engineering College, Ghaziabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM JOIN BANNER */}
      <section className="abes-bottom-banner-section">
        <div className="bottom-banner-overlay"></div>
        <div className="container bottom-banner-container">
          <div className="bottom-banner-content">
            <span className="bottom-kicker">JOIN OUR ENGINEERING COMMUNITY</span>
            <h2 className="bottom-banner-title">
              Want to join Drones and Robotics Club?
            </h2>
            <p className="bottom-banner-subtitle">
              Step into high-speed UAV aerodynamics, ROS2 autonomous ground rovers, and cutting-edge silicon hardware design at ABES Engineering College.
            </p>
            <div className="bottom-banner-buttons">
              <Link to="/join" className="btn btn-primary btn-large">
                Show Your Interest <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-large">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}