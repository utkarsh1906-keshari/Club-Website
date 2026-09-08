import React, { useState } from 'react';
import { Mail, ArrowUpRight, Award, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Team.css';

export default function Team() {
  const [activeCategory, setActiveCategory] = useState('all');

  const executiveTeam = [
    {
      name: 'Ms. Unnati Mehta',
      role: 'Faculty Coordinator',
      designation: 'Assistant Professor, Department of ECE',
      department: 'Faculty Mentorship',
      image: '/unnati-mehta-advisor.png',
      badge: 'Faculty Coordinator',
      bio: 'Guiding club administration, research publications, academic approvals, and institutional support for high-impact innovation.'
    },
    {
      name: 'Vishal',
      role: 'General Secretary',
      designation: 'General Secretary',
      department: 'Executive Operations',
      image: '/abes/vishal.jpeg',
      badge: 'Executive Leadership',
      bio: 'Leading strategic club operations, inter-departmental synergy, technical project direction, and overall student execution.'
    },
    {
      name: 'Ayush Tyagi',
      role: 'Joint Secretary',
      designation: 'Joint Secretary',
      department: 'Executive Operations',
      image: '/abes/ayush-tyagi.jpeg',
      badge: 'Executive Leadership',
      bio: 'Managing club logistics, inter-college competition contingents, workshop planning, and team coordination.'
    },
    {
      name: 'Shreya Vishwakarma',
      role: 'Treasurer',
      designation: 'Treasurer',
      department: 'Financial & Inventory',
      image: '/abes/shreya-vishwakarma.webp',
      badge: 'Executive Leadership',
      bio: 'Overseeing club budgeting, hardware inventory, component procurement, and sponsorship pipeline allocations.'
    }
  ];

  const studentCoordinators = [
    {
      name: 'Akshat Modanwal & Arjun Singh',
      role: 'Technical Head',
      department: 'Technical & Hardware',
      desc: 'Leading firmware programming, flight controller debugging, brushless ESC tuning, and embedded robotics prototypes.'
    },
    {
      name: 'Divyansh Goel',
      role: 'Social Media Head',
      department: 'Media & Branding',
      desc: 'Managing club public visibility, photography, video showcases, and technical storytelling across social handles.'
    },
    {
      name: 'Maanya',
      role: 'Research Head',
      department: 'Research & Innovation',
      desc: 'Directing autonomous rover path planning algorithms, computer vision pipelines, and student research papers.'
    },
    {
      name: 'Pratham Singh',
      role: 'Events Head',
      department: 'Event Management',
      desc: 'Orchestrating hardware bootcamps, timed competitive hackathons, guest seminars, and campus robotics challenges.'
    },
    {
      name: 'Deepanshu',
      role: 'PR & Outreach Head',
      department: 'Public Relations & Alliances',
      desc: 'Building institutional partnerships, securing external sponsorships, and expanding collaborative research outreach.'
    }
  ];

  return (
    <div className="team-page">
      {/* Hero Header */}
      <section className="team-hero">
        <div className="container">
          <span className="section-label">Club Community</span>
          <h1 className="team-title">Club Leadership &amp; Co-ordinators</h1>
          <p className="team-subtitle">
            Meet the faculty advisors, executive secretaries, and domain coordinators driving engineering excellence at the Drones and Robotics Club of ABES Engineering College.
          </p>
        </div>
      </section>

      {/* Executive Leadership Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center mb-4">
            <span className="section-label">Core Executive Council</span>
            <h2 className="section-title">Faculty Advisor &amp; Executive Officers</h2>
            <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.5rem auto', width: '60px', height: '3px', background: '#7b181e' }}></div>
          </div>

          <div className="coordinators-grid">
            {executiveTeam.map((c, i) => (
              <div key={i} className="aesthetic-card coordinator-card">
                <div className="coordinator-avatar-box">
                  <img src={c.image} alt={c.name} className="coordinator-photo" />
                  <span className="coordinator-badge">{c.badge}</span>
                </div>
                <div className="coordinator-info">
                  <h3 className="coordinator-name">{c.name}</h3>
                  <span className="coordinator-role">{c.designation}</span>
                  <p className="coordinator-bio">{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Domain Coordinators */}
      <section className="section-padding bg-surface-alt">
        <div className="container">
          <div className="section-header text-center mb-4">
            <span className="section-label">Departmental Leads</span>
            <h2 className="section-title">Student Coordinators</h2>
            <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.5rem auto', width: '60px', height: '3px', background: '#7b181e' }}></div>
            <p className="section-subtitle">
              Heading our technical verticals, project sprints, public outreach, and event operations.
            </p>
          </div>

          <div className="student-leads-grid">
            {studentCoordinators.map((s, idx) => (
              <div key={idx} className="aesthetic-card student-lead-card">
                <div className="lead-card-header">
                  <span className="lead-dept-pill">{s.department}</span>
                </div>
                <h3 className="lead-name">{s.name}</h3>
                <span className="lead-role">{s.role}</span>
                <p className="lead-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="aesthetic-card why-join-box text-center">
            <h2>Want to Join the Team?</h2>
            <p style={{ maxWidth: '600px', margin: '0.5rem auto 1.5rem auto' }}>
              We recruit ~30 passionate first- and second-year engineering students every September. Show your interest to get notified for upcoming trials!
            </p>
            <Link to="/join" className="btn btn-primary">
              Apply in Recruitment Cycle &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}