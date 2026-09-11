import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Target, CheckCircle, Flag } from 'lucide-react';
import { achievementsService } from '../lib/dataService';
import './Achievements.css';

export default function Achievements() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const data = await achievementsService.getAll();
        setMilestones(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  return (
    <div className="achievements-page">
      {/* Hero */}
      <section className="achievements-hero">
        <div className="container">
          <span className="section-label">Track Record</span>
          <h1 className="achievements-title">Club Achievements &amp; Milestones</h1>
          <p className="achievements-subtitle">
            Celebrating competitive victories, technical hardware grants, and milestones achieved by our student engineers.
          </p>

          {/* Stats Bar */}
          <div className="achievements-stats-strip">
            <div className="stat-card">
              <span className="stat-num">{milestones.length || 12}+</span>
              <span className="stat-label">Recognized Honors</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">4</span>
              <span className="stat-label">National Awards</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">20+</span>
              <span className="stat-label">Open-Source Repos</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">150+</span>
              <span className="stat-label">Engineers Mentored</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline List */}
      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading club achievements...</p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="aesthetic-card" style={{ textAlign: 'center', padding: '3.5rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
              <Trophy size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>Milestones Updating</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                New competitive milestones and project grants will be announced shortly.
              </p>
            </div>
          ) : (
            <div className="achievements-timeline">
              {milestones.map((item, idx) => (
                <div key={item.id || idx} className="aesthetic-card achievement-card">
                  <div className="achievement-icon-col">
                    <div className="trophy-box">
                      <Trophy size={24} color="var(--color-primary)" />
                    </div>
                    <span className="achievement-year">{item.year}</span>
                  </div>

                  <div className="achievement-body">
                    <div className="achievement-meta">
                      <span className="tag-pill">{item.category}</span>
                      {item.badge && (
                        <span 
                          className="tag-pill" 
                          style={{ 
                            marginLeft: '0.45rem', 
                            background: 'rgba(245, 158, 11, 0.12)', 
                            color: '#d97706',
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="achievement-title">{item.title}</h3>
                    <p className="achievement-desc">{item.description || item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}