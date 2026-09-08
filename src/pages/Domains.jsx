import React, { useState } from 'react';
import { Brain, Cpu, Bot, Plane, CheckCircle2, ArrowRight, Code2, Layers, CpuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Domains.css';

export default function Domains() {
  const [selectedDomain, setSelectedDomain] = useState('all');

  const domainData = [
    {
      id: 'ai-ml',
      name: 'AI & Autonomous Perception',
      lead: 'Maanya (Research Head)',
      badge: 'Edge AI & Perception',
      icon: <Brain size={26} />,
      desc: 'Deploying edge neural perception, real-time computer vision, obstacle avoidance algorithms, and ROS2 autonomous navigation on physical mobile robots and UAV platforms.',
      focusAreas: [
        'Real-Time Computer Vision (YOLO, OpenCV, TensorRT)',
        'Deep Reinforcement Learning for Autonomous Flight',
        'Visual SLAM & 3D Environment Perception',
        'Edge AI Deployment (NVIDIA Jetson, Raspberry Pi)',
        'Autonomous Obstacle Detection & Avoidance'
      ],
      technologies: ['PyTorch', 'TensorFlow', 'OpenCV', 'ROS2 Nav2', 'CUDA', 'Python', 'ONNX'],
      projects: ['Autonomous Aerial Search & Rescue', 'Edge-Vision Obstacle Avoidance Engine']
    },
    {
      id: 'vlsi',
      name: 'Embedded Systems & VLSI',
      lead: 'Akshat Modanwal (Technical Head)',
      badge: 'Hardware & Silicon Design',
      icon: <Cpu size={26} />,
      desc: 'Designing custom avionics hardware, FPGA acceleration bitstreams, microcontroller firmware, and high-frequency flight sensor telemetry circuits.',
      focusAreas: [
        'Digital IC & RTL Architecture (Verilog, SystemVerilog)',
        'FPGA Synthesis & Bitstream Verification (Xilinx Vivado)',
        'Hardware Accelerators for Flight Telemetry',
        'Custom High-Density Avionics PCB Layout',
        'Low-Latency SPI/I2C/CAN Bus Communication'
      ],
      technologies: ['Verilog', 'SystemVerilog', 'Xilinx Vivado', 'KiCAD', 'ModelSim', 'Artix-7 FPGA'],
      projects: ['Sub-millisecond IMU Hardware Filter', 'Avionics Power & Telemetry PCB']
    },
    {
      id: 'robotics-iot',
      name: 'Robotics & Connected IoT',
      lead: 'Arjun Singh (Technical Head)',
      badge: 'Ground Systems & Telemetry',
      icon: <Bot size={26} />,
      desc: 'Building autonomous wheeled ground rovers, robotic manipulators, distributed IoT sensor nodes, and real-time multi-sensor fusion stacks.',
      focusAreas: [
        'Robot Operating System (ROS 2 Humble / Iron)',
        'Multi-Sensor Data Fusion (IMU, LiDAR, Encoders)',
        'Wheeled & Mobile Robotics Kinematics',
        'Wireless Telemetry Networks (LoRa, ESP-NOW, MQTT)',
        'Embedded Firmware Optimization in C/C++'
      ],
      technologies: ['ROS 2', 'C++', 'ESP32 / STM32', 'FreeRTOS', 'MQTT', 'LiDAR SLAM'],
      projects: ['12-DOF Quadruped Rover', 'Smart Campus Wireless Environmental Sensor Node']
    },
    {
      id: 'drone-tech',
      name: 'Aerial Robotics & UAVs',
      lead: 'Ayush Tyagi & Flight Lab Team',
      badge: 'Aerodynamics & Flight Dynamics',
      icon: <Plane size={26} />,
      desc: 'Designing carbon composite airframes, high-speed FPV racing quads, PX4 autopilot integration, and long-range telemetry flight systems.',
      focusAreas: [
        'Unmanned Aerial Vehicle (UAV) Structural Design',
        'PX4 / ArduPilot Flight Stack Customization',
        'FPV Drone Dynamics & High-G Piloting Systems',
        'Long-Range MAVLink Telemetry Communication',
        'Aerodynamic Simulation & Carbon Composite Fabrication'
      ],
      technologies: ['PX4 Autopilot', 'ArduPilot', 'QGroundControl', 'MAVLink', 'Betaflight', 'CFD Simulation'],
      projects: ['Autonomous Long-Range Survey Hexacopter', 'Custom Carbon Micro-FPV Drone']
    }
  ];

  const filteredDomains = selectedDomain === 'all' 
    ? domainData 
    : domainData.filter(d => d.id === selectedDomain);

  return (
    <div className="domains-page">
      {/* Header */}
      <section className="domains-hero">
        <div className="container">
          <span className="section-label">Engineering Verticals</span>
          <h1 className="domains-title">Core Technical Domains</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.5rem auto' }}></div>
          <p className="domains-subtitle">
            Explore our specialized engineering divisions driving technical research, competitive hardware, and autonomous systems at ABES Engineering College.
          </p>

          {/* Filter Bar */}
          <div className="domains-filter-bar">
            <button 
              className={`filter-btn ${selectedDomain === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDomain('all')}
            >
              All Domains
            </button>
            {domainData.map(d => (
              <button 
                key={d.id}
                className={`filter-btn ${selectedDomain === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDomain(d.id)}
              >
                {d.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Cards Detailed View */}
      <section className="section-padding">
        <div className="container">
          <div className="domains-detailed-list">
            {filteredDomains.map(domain => (
              <div key={domain.id} className="aesthetic-card domain-detail-card" id={domain.id}>
                <div className="domain-detail-header">
                  <div className="domain-detail-title-group">
                    <div className="domain-detail-icon">
                      {domain.icon}
                    </div>
                    <div className="domain-title-text-group">
                      <span className="domain-card-tag">{domain.badge}</span>
                      <h2 className="domain-detail-name">{domain.name}</h2>
                      <span className="domain-lead-text">Domain Mentorship: <strong>{domain.lead}</strong></span>
                    </div>
                  </div>
                </div>

                <p className="domain-detail-description">{domain.desc}</p>

                <div className="domain-breakdown-grid">
                  {/* Focus Areas */}
                  <div className="breakdown-col">
                    <h4 className="breakdown-heading">Core Focus Areas</h4>
                    <ul className="focus-list">
                      {domain.focusAreas.map((area, i) => (
                        <li key={i}>
                          <CheckCircle2 size={16} color="var(--color-primary)" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack & Projects */}
                  <div className="breakdown-col">
                    <h4 className="breakdown-heading">Technologies & Frameworks</h4>
                    <div className="tech-tags-grid">
                      {domain.technologies.map((tech, i) => (
                        <span key={i} className="tag-pill tech-tag">{tech}</span>
                      ))}
                    </div>

                    <h4 className="breakdown-heading" style={{ marginTop: '1.5rem' }}>Active Domain Projects</h4>
                    <ul className="domain-projects-list">
                      {domain.projects.map((proj, i) => (
                        <li key={i} className="domain-project-item">
                          <span>{proj}</span>
                          <Link to="/projects" className="project-view-link">View &rarr;</Link>
                        </li>
                      ))}
                    </ul>
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