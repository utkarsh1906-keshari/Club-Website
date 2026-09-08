import React from 'react';
import { Award, Trophy, Star, Target, CheckCircle, Flag } from 'lucide-react';
import './Achievements.css';

export default function Achievements() {
  const milestones = [
    {
      year: '2026',
      title: '1st Place – National Collegiate UAV Grand Challenge',
      category: 'Competition Win',
      desc: 'Our AeroHawk search-and-rescue team secured first prize in autonomous target identification and payload delivery under adverse wind conditions.'
    },
    {
      year: '2026',
      title: 'Best Hardware Innovation – Inter-University Hackathon',
      category: 'Award',
      desc: 'Recognized for our FPGA-accelerated IMU telemetry filter designed on Xilinx Artix-7, outperforming software implementations by 8x.'
    },
    {
      year: '2025',
      title: 'Runner-Up – Autonomous Ground Rover Challenge',
      category: 'Competition Win',
      desc: 'Our quadruped platform successfully navigated a 500-meter unstructured obstacle course using LiDAR SLAM and ROS2.'
    },
    {
      year: '2025',
      title: 'Institutional Research Grant for Drone Safety',
      category: 'Milestone',
      desc: 'Awarded research seed funding to develop geo-fenced fail-safe return-to-launch protocols for campus aerial safety.'
    }
  ];

  return (
    <div className="achievements-page">
      {/* Hero */}
      <section className="achievements-hero">
        <div className="container">
          <span className="section-label">Track Record</span>
          <h1 className="achievements-title">Club Achievements & Milestones</h1>
          <p className="achievements-subtitle">
            Celebrating competitive victories, technical hardware grants, and milestones achieved by our student engineers.
          </p>

          {/* Stats Bar */}
          <div className="achievements-stats-strip">
            <div className="stat-card">
              <span className="stat-num">12+</span>
              <span className="stat-label">Podium Finishes</span>
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
          <div className="achievements-timeline">
            {milestones.map((item, idx) => (
              <div key={idx} className="aesthetic-card achievement-card">
                <div className="achievement-icon-col">
                  <div className="trophy-box">
                    <Trophy size={24} color="var(--color-primary)" />
                  </div>
                  <span className="achievement-year">{item.year}</span>
                </div>

                <div className="achievement-body">
                  <div className="achievement-meta">
                    <span className="tag-pill">{item.category}</span>
                  </div>
                  <h3 className="achievement-title">{item.title}</h3>
                  <p className="achievement-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}