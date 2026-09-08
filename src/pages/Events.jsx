import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Events.css';

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');

  const events = [
    {
      id: 'bootcamp',
      title: 'Drone & Robotics Bootcamp',
      category: 'Flagship Bootcamp',
      date: 'SEPTEMBER 2026',
      time: '10:00 AM – 4:30 PM',
      venue: 'Robotics Lab & Flight Cage, ABESEC',
      desc: 'An immersive hands-on training program covering multirotor aerodynamics, ESC & brushless motor assembly, flight controller configuration, and autonomous obstacle navigation.',
      image: '/abes/bootcamp.webp',
      badge: 'Flagship Event',
      highlights: ['Multirotor Flight Dynamics', 'Brushless Motors & ESCs', 'Autonomous Telemetry']
    },
    {
      id: 'circuit-bid',
      title: 'Circuit Bid',
      category: 'Competition',
      date: 'OCTOBER 2026',
      time: '11:00 AM – 3:00 PM',
      venue: 'VLSI CAD Center, ABESEC',
      desc: 'An exciting hardware bidding and circuit debugging competition where teams strategically bid for components and solve complex electronic schematic problems under strict time constraints.',
      image: '/abes/circuit-bid.webp',
      badge: 'Competition',
      highlights: ['Hardware Bidding', 'Circuit Debugging', 'Real-time Prototyping']
    },
    {
      id: 'fpv-assembly',
      title: 'FPV Drone Assembly Workshop',
      category: 'Workshop',
      date: 'NOVEMBER 2026',
      time: '1:00 PM – 5:00 PM',
      venue: 'Drone Fabrication Workshop',
      desc: 'A comprehensive hardware workshop where participants assembled custom carbon-fiber racing quadcopters from scratch, configured Betaflight firmware, and practiced line-of-sight test hovers.',
      image: '/abes/fpv-assembly.webp',
      badge: 'Hardware Workshop',
      highlights: ['Carbon-fiber Airframes', 'Betaflight Firmware', 'Radio Protocol Binding']
    },
    {
      id: 'proteus-simulink',
      title: 'Proteus & Simulink Masterclass',
      category: 'Masterclass',
      date: 'DECEMBER 2026',
      time: '2:00 PM – 5:00 PM',
      venue: 'ECE Computer Center',
      desc: 'Advanced software simulation sessions focusing on model-based control algorithms in MATLAB/Simulink and circuit validation in Proteus before physical fabrication.',
      image: '/abes/proteus-simulink.webp',
      badge: 'Simulation Masterclass',
      highlights: ['Simulink Control Modeling', 'Proteus Virtual Instruments', 'PID Tuning']
    },
    {
      id: 'robotohack',
      title: 'RobotoHack - 48h National Hackathon',
      category: 'Hackathon',
      date: 'JANUARY 2027',
      time: '48 Hours Non-Stop',
      venue: 'Innovation Arena, ABESEC',
      desc: 'Inter-collegiate 48-hour hardware and robotics marathon bringing together student developers to engineer working autonomous ground rovers, search-and-rescue aerial drones, and connected IoT platforms.',
      image: '/abes/robotohack.webp',
      badge: 'National Hackathon',
      highlights: ['Autonomous Rovers', 'Computer Vision Tracking', 'Sponsored Hardware Pools']
    }
  ];

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="container">
          <span className="section-label">Campus Engineering</span>
          <h1 className="events-title">Events &amp; Workshops</h1>
          <p className="events-subtitle">
            Hands-on bootcamps, competitive hardware challenges, simulation masterclasses, and national hackathons organized by the Drone &amp; Robotics Club at ABES Engineering College.
          </p>

          <div className="events-tab-buttons">
            {['all', 'bootcamp', 'competition', 'workshop', 'hackathon'].map((tab) => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="events-official-grid">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="aesthetic-card event-official-card">
                <div className="event-poster-container">
                  <img src={evt.image} alt={evt.title} className="event-poster-image" />
                  <span className="event-badge-tag">{evt.badge}</span>
                </div>

                <div className="event-card-content">
                  <div className="event-meta-header">
                    <span className="event-date-text">
                      <Calendar size={14} /> {evt.date}
                    </span>
                    <span className="event-venue-text">
                      <MapPin size={14} /> {evt.venue}
                    </span>
                  </div>

                  <h3 className="event-heading">{evt.title}</h3>
                  <p className="event-description">{evt.desc}</p>

                  <div className="event-chips-wrapper">
                    {evt.highlights.map((h, idx) => (
                      <span key={idx} className="event-highlight-chip">{h}</span>
                    ))}
                  </div>

                  <div className="event-card-footer">
                    <Link to="/join" className="btn btn-primary btn-sm">
                      Register / Participate <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}