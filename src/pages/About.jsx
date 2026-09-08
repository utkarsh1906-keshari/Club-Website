import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, Zap, Users, ArrowRight, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import './About.css';

export default function About() {
  const values = [
    {
      icon: <Target size={24} color="var(--color-primary)" />,
      title: 'Mission-Driven Innovation',
      desc: 'We solve real-world challenges through autonomous flight, intelligent robotics, and silicon hardware engineering.'
    },
    {
      icon: <Zap size={24} color="var(--color-primary)" />,
      title: 'Hands-On First Learning',
      desc: 'From custom PCB fabrication and composite carbon airframes to ROS2 navigation stacks, theory meets tangible hardware.'
    },
    {
      icon: <Users size={24} color="var(--color-primary)" />,
      title: 'Multidisciplinary Synergy',
      desc: 'Software engineers, hardware designers, aerodynamicists, and creative managers collaborating under one roof.'
    },
    {
      icon: <Award size={24} color="var(--color-primary)" />,
      title: 'National Competitive Excellence',
      desc: 'Representing ABES Engineering College at premier robotics tournaments, UAV challenges, and hackathons.'
    }
  ];

  const highlights = [
    'Hands-on UAV Design & Flight Controller Labs',
    'Embedded VLSI Systems & FPGA Programming',
    'AI-Powered Autonomous Navigation & ROS2',
    'National-Level Hackathons & Engineering Competitions'
  ];

  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-crest-wrapper">
            <div className="about-hero-crest-box">
              <img 
                src="/club-emblem.png" 
                alt="Drone & Robotics Club - ABES Logo" 
                className="about-hero-crest-img" 
              />
            </div>
          </div>
          <span className="section-label">Official Overview</span>
          <h1 className="about-title">About Drones and Robotics Club</h1>
          <p className="about-subtitle">
            The premier multidisciplinary engineering community of <strong>ABES Engineering College</strong>, dedicated to advancing autonomous flight and next-generation robotics.
          </p>
        </div>
      </section>

      {/* Official ABES Overview Section */}
      <section className="section-padding">
        <div className="container">
          <div className="about-split-grid">
            {/* Left: Brand Emblem Card */}
            <div className="about-visual-col">
              <div className="aesthetic-card about-emblem-feature-card">
                <div className="emblem-feature-top">
                  <img 
                    src="/club-emblem.png" 
                    alt="DRC ABES Emblem" 
                    className="emblem-feature-img" 
                  />
                  <div className="emblem-feature-text">
                    <h3>DRONE &amp; ROBOTICS CLUB</h3>
                    <span>ABES ENGINEERING COLLEGE &bull; ESTD. 2000</span>
                  </div>
                </div>

                <p className="emblem-quote">
                  "Fostering next-generation aerospace innovators and autonomous robotics engineers."
                </p>

                <div className="emblem-highlights-list">
                  {highlights.map((h, i) => (
                    <div key={i} className="highlight-item">
                      <CheckCircle2 size={16} className="highlight-icon" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Detailed Narrative */}
            <div className="about-narrative-col">
              <span className="card-kicker">COMMUNITY &amp; CHARTER</span>
              <h2>Pioneering Practical Engineering</h2>
              
              <p className="about-lead-p">
                The <strong>Drones and Robotics Club of ABES Engineering College</strong> is a dynamic community of innovators, 
                creators, and technology enthusiasts passionate about advancing modern automation. The club provides a hands-on 
                platform for students to explore, design, and build cutting-edge robotic systems and intelligent aerial vehicles.
              </p>

              <p className="about-body-p">
                Through workshops, technical sessions, and live project-building, members gain practical skills in embedded systems, 
                drone technology, AI-based robotics, and autonomous navigation.
              </p>

              <p className="about-body-p">
                Our goal is to nurture creativity and engineering excellence by encouraging students to transform their ideas into 
                real-world solutions. The club actively participates in national-level competitions, research initiatives, and industry 
                collaborations, ensuring that members stay aligned with the latest technological trends.
              </p>

              <div className="about-quote-box">
                <Sparkles size={20} className="quote-sparkle" />
                <p>
                  "Whether you are a beginner or an advanced tech developer, the Drones and Robotics Club offers an inspiring 
                  environment to learn, innovate, and elevate your technical journey."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Split */}
      <section className="section-padding bg-surface-alt">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="aesthetic-card mission-card">
              <span className="card-kicker">Our Mission</span>
              <h2>Building Engineers Who Create The Future</h2>
              <p>
                To provide an open, cutting-edge collaborative laboratory where students acquire real hardware experience, learn industry-standard tools (ROS2, PX4, Vivado, PyTorch), and design scalable autonomous solutions for environmental, industrial, and societal challenges.
              </p>
            </div>

            <div className="aesthetic-card vision-card">
              <span className="card-kicker">Our Vision</span>
              <h2>A Center of Excellence in Student Innovation</h2>
              <p>
                To cultivate world-class engineering talent, bridge the gap between academic curricula and frontier aerospace/robotics technologies, and champion open-source hardware and software for autonomous aerial and ground machines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding values-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">Club DNA</span>
            <h2 className="section-title">What Defines Our Community</h2>
            <p className="section-subtitle">
              We uphold rigorous engineering standards with an inclusive, student-first learning environment.
            </p>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="aesthetic-card value-card">
                <div className="value-icon-box">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="aesthetic-card why-join-box">
            <div className="why-join-content">
              <h2>Ready to Build the Future with Us?</h2>
              <p>
                Whether you are a fresher exploring your first microcontroller or an experienced developer wanting to deploy deep learning on drones, our club provides peer mentorship, lab equipment, and competition sponsorship.
              </p>
              <div className="why-join-actions">
                <Link to="/join" className="btn btn-primary">
                  Apply for Membership <ArrowRight size={16} />
                </Link>
                <Link to="/domains" className="btn btn-secondary">
                  Explore 4 Domains
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}