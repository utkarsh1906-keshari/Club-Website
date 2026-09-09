import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, Award, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { membersService } from '../lib/dataService';
import './Team.css';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      try {
        const data = await membersService.getAll();
        setMembers(data);
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  const executiveTeam = members.filter(m => m.category === 'leadership');
  const technicalTeam = members.filter(m => m.category === 'technical');
  const managementTeam = members.filter(m => m.category === 'management');

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
              <div key={c.id || i} className="aesthetic-card coordinator-card">
                <div className="coordinator-avatar-box">
                  <img src={c.image_url || c.image || '/club-emblem.png'} alt={c.name} className="coordinator-photo" />
                  <span className="coordinator-badge">{c.badge || c.role}</span>
                </div>
                <div className="coordinator-info">
                  <h3 className="coordinator-name">{c.name}</h3>
                  <span className="coordinator-role">{c.designation || c.role}</span>
                  <p className="coordinator-bio">{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Domain Leads */}
      <section className="section-padding bg-surface-alt">
        <div className="container">
          <div className="section-header text-center mb-4">
            <span className="section-label">Engineering Leadership</span>
            <h2 className="section-title">Technical Domain Leads</h2>
            <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.5rem auto', width: '60px', height: '3px', background: '#7b181e' }}></div>
            <p className="section-subtitle">
              Heading our four core engineering verticals: AI/ML, VLSI, Robotics &amp; IoT, and Drone Technology.
            </p>
          </div>

          <div className="student-leads-grid">
            {technicalTeam.map((s, idx) => (
              <div key={s.id || idx} className="aesthetic-card student-lead-card">
                <div className="lead-card-header">
                  <span className="lead-dept-pill">{s.department}</span>
                </div>
                <h3 className="lead-name">{s.name}</h3>
                <span className="lead-role">{s.role}</span>
                <p className="lead-desc">{s.bio || s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative & Functional Management Teams */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center mb-4">
            <span className="section-label">Operations &amp; Creative</span>
            <h2 className="section-title">Functional &amp; Management Teams</h2>
            <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.5rem auto', width: '60px', height: '3px', background: '#7b181e' }}></div>
            <p className="section-subtitle">
              Driving media storytelling, public outreach, branding, and tournament event operations.
            </p>
          </div>

          <div className="student-leads-grid">
            {managementTeam.map((m, idx) => (
              <div key={m.id || idx} className="aesthetic-card student-lead-card">
                <div className="lead-card-header">
                  <span className="lead-dept-pill">{m.department}</span>
                </div>
                <h3 className="lead-name">{m.name}</h3>
                <span className="lead-role">{m.role}</span>
                <p className="lead-desc">{m.bio || m.desc}</p>
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