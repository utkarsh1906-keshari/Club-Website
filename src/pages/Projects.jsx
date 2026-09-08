import React, { useState } from 'react';
import { ExternalLink, Layers, Search, Code, Users } from 'lucide-react';
import './Projects.css';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      name: 'AeroHawk Autonomous Search & Rescue Hexacopter',
      domain: 'Drone Technology',
      desc: 'Autonomous multirotor UAV equipped with thermal imaging and onboard TensorRT computer vision models for search-and-rescue localization in dense forest foliage.',
      technologies: ['PX4 Autopilot', 'NVIDIA Jetson', 'YOLOv8', 'MAVLink', 'ROS 2'],
      team: ['Alex R. (Lead)', 'Priya S.', 'Liam K.'],
      github: 'https://github.com',
      demo: 'https://demo.com'
    },
    {
      id: 2,
      name: 'NeuroCore RTL Telemetry Coprocessor',
      domain: 'VLSI',
      desc: 'Synthesizable Verilog coprocessor executing high-rate Kalman filtering on raw IMU telemetry data to reduce latency on low-power UAV microcontrollers.',
      technologies: ['Xilinx Artix-7', 'Verilog', 'SystemVerilog', 'Vivado', 'SPI/CAN'],
      team: ['Marcus T. (Lead)', 'Chen W.'],
      github: 'https://github.com',
      demo: null
    },
    {
      id: 3,
      name: 'Titan 12-DOF Quadruped Mobile Explorer',
      domain: 'Robotics & IoT',
      desc: 'Compliant actuator-driven quadruped robot designed for rough terrain navigation, featuring 3D LiDAR point-cloud mapping and custom motor controller boards.',
      technologies: ['ROS 2 Humble', '3D LiDAR', 'Brushless CAN Actuators', 'SLAM'],
      team: ['David M. (Lead)', 'Sarah H.', 'Elena G.'],
      github: 'https://github.com',
      demo: 'https://demo.com'
    },
    {
      id: 4,
      name: 'EdgeVision Real-Time Obstacle Avoidance',
      domain: 'AI/ML',
      desc: 'Lightweight deep neural network architecture designed for 60 FPS monocular depth estimation and dynamic collision trajectory planning on embedded edge devices.',
      technologies: ['PyTorch', 'TensorRT', 'OpenCV', 'CUDA', 'Python'],
      team: ['Kavita N. (Lead)', 'Omar F.'],
      github: 'https://github.com',
      demo: 'https://demo.com'
    },
    {
      id: 5,
      name: 'Ultra-Lightweight Long-Range Fixed Wing UAV',
      domain: 'Drone Technology',
      desc: 'Aerodynamically optimized composite fixed-wing glider capable of 2.5-hour continuous flight missions with 4G LTE cellular telemetry connectivity.',
      technologies: ['ArduPilot', 'Carbon Composite', '4G Telemetry', 'QGroundControl'],
      team: ['Samir P. (Lead)', 'Hannah B.'],
      github: 'https://github.com',
      demo: null
    },
    {
      id: 6,
      name: 'Smart Distributed Campus Environmental IoT Mesh',
      domain: 'Robotics & IoT',
      desc: 'Solar-powered self-healing LoRa mesh network of multi-gas and meteorological sensing nodes deployed across campus with live dashboard visualization.',
      technologies: ['ESP32', 'LoRaWAN', 'FreeRTOS', 'MQTT', 'Grafana'],
      team: ['Rohan K. (Lead)', 'Zoe M.'],
      github: 'https://github.com',
      demo: 'https://demo.com'
    }
  ];

  const categories = ['All', 'AI/ML', 'VLSI', 'Robotics & IoT', 'Drone Technology'];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeFilter === 'All' || project.domain === activeFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="projects-page">
      {/* Header */}
      <section className="projects-hero">
        <div className="container">
          <span className="section-label">Engineering Innovation</span>
          <h1 className="projects-title">Club Projects Showcase</h1>
          <p className="projects-subtitle">
            Explore hardware, firmware, and software engineered by student members across all technical domains.
          </p>

          {/* Controls Bar */}
          <div className="projects-controls">
            <div className="search-box">
              <Search size={16} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="Search projects, technologies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-filter-row">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="aesthetic-card empty-state-box">
              <Layers size={40} color="var(--color-primary)" />
              <h3>No projects found</h3>
              <p>Try changing your search term or category filter.</p>
            </div>
          ) : (
            <div className="projects-grid-main">
              {filteredProjects.map(project => (
                <div key={project.id} className="aesthetic-card project-card">
                  <div className="project-card-header">
                    <span className="tag-pill project-domain-pill">{project.domain}</span>
                    <div className="project-links">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" title="GitHub Repository" className="project-icon-link">
                          <Code size={16} />
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noreferrer" title="Live Demo / Field Video" className="project-icon-link">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="project-card-title">{project.name}</h3>
                  <p className="project-card-desc">{project.desc}</p>

                  {/* Tech stack */}
                  <div className="project-tech-tags">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tag-pill">{tech}</span>
                    ))}
                  </div>

                  {/* Team Members */}
                  <div className="project-team-footer">
                    <div className="project-team-label">
                      <Users size={14} />
                      <span>Contributors:</span>
                    </div>
                    <span className="team-names">{project.team.join(', ')}</span>
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