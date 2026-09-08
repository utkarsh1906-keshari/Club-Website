import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Brain, 
  Cpu, 
  Bot, 
  Plane, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Layers, 
  Sparkles,
  UserCheck, 
  FolderGit2, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import './Domains.css';

export default function Domains() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailSectionRef = useRef(null);

  const domainData = [
    {
      id: 'ai-ml',
      name: 'AI & Autonomous Perception',
      shortName: 'Edge AI & Perception',
      lead: 'Maanya',
      leadRole: 'Research Head',
      badge: 'EDGE AI & PERCEPTION',
      icon: Brain,
      themeColor: '#e11d48',
      themeColorDark: '#fb7185',
      teaser: 'Deploying real-time edge vision, obstacle avoidance algorithms, and ROS2 autonomous navigation on mobile robots and UAVs.',
      desc: 'Deploying edge neural perception, real-time computer vision, obstacle avoidance algorithms, and ROS2 autonomous navigation on physical mobile robots and UAV platforms.',
      focusAreas: [
        'Real-Time Computer Vision (YOLO, OpenCV, TensorRT)',
        'Deep Reinforcement Learning for Autonomous Flight',
        'Visual SLAM & 3D Environment Perception',
        'Edge AI Deployment (NVIDIA Jetson, Raspberry Pi)',
        'Autonomous Obstacle Detection & Avoidance'
      ],
      technologies: ['PyTorch', 'TensorFlow', 'OpenCV', 'ROS2 Nav2', 'CUDA', 'Python', 'ONNX', 'TensorRT'],
      projects: [
        {
          id: 'p-aiml-1',
          title: 'EdgeVision Real-Time Obstacle Avoidance Engine',
          status: 'Active Testing',
          statusType: 'active',
          desc: 'Lightweight deep neural network architecture engineered for 60 FPS monocular depth estimation and dynamic collision trajectory planning on embedded Jetson edge compute.',
          technologies: ['PyTorch', 'TensorRT', 'OpenCV', 'CUDA', 'Python'],
          team: 'Kavita N. (Lead), Omar F.',
          link: '/projects'
        },
        {
          id: 'p-aiml-2',
          title: 'Autonomous Aerial Search & Rescue Perception',
          status: 'Field Testing',
          statusType: 'field',
          desc: 'Autonomous vision and thermal infrared object detection model deployed on UAV gimbal payloads for real-time person localization in challenging forest foliage.',
          technologies: ['YOLOv8', 'Thermal CV', 'ROS2 Nav2', 'Jetson Orin'],
          team: 'Alex R. (Lead), Priya S.',
          link: '/projects'
        }
      ]
    },
    {
      id: 'vlsi',
      name: 'Embedded Systems & VLSI',
      shortName: 'Hardware & Silicon Design',
      lead: 'Akshat Modanwal',
      leadRole: 'Technical Head',
      badge: 'HARDWARE & SILICON DESIGN',
      icon: Cpu,
      themeColor: '#8b1d24',
      themeColorDark: '#38bdf8',
      teaser: 'Designing custom avionics hardware, FPGA acceleration bitstreams, microcontroller firmware, and flight telemetry circuits.',
      desc: 'Designing custom avionics hardware, FPGA acceleration bitstreams, microcontroller firmware, and high-frequency flight sensor telemetry circuits.',
      focusAreas: [
        'Digital IC & RTL Architecture (Verilog, SystemVerilog)',
        'FPGA Synthesis & Bitstream Verification (Xilinx Vivado)',
        'Hardware Accelerators for Flight Telemetry',
        'Custom High-Density Avionics PCB Layout',
        'Low-Latency SPI/I2C/CAN Bus Communication'
      ],
      technologies: ['Verilog', 'SystemVerilog', 'Xilinx Vivado', 'KiCAD', 'ModelSim', 'Artix-7 FPGA', 'STM32', 'CAN Bus'],
      projects: [
        {
          id: 'p-vlsi-1',
          title: 'NeuroCore RTL Telemetry Coprocessor',
          status: 'Silicon Verified',
          statusType: 'verified',
          desc: 'Synthesizable Verilog coprocessor executing sub-millisecond Kalman filtering on raw IMU telemetry data to reduce latency on low-power UAV flight microcontrollers.',
          technologies: ['Xilinx Artix-7', 'Verilog', 'SystemVerilog', 'Vivado', 'SPI/CAN'],
          team: 'Marcus T. (Lead), Chen W.',
          link: '/projects'
        },
        {
          id: 'p-vlsi-2',
          title: 'Avionics Power Management & Telemetry PCB',
          status: 'Hardware Prototype',
          statusType: 'prototype',
          desc: 'High-density 4-layer custom avionics PCB featuring dual buck-boost converters, optocoupled high-rate telemetry bus, and emergency motor kill circuitry.',
          technologies: ['KiCAD', 'STM32F4', 'CAN Transceivers', 'Power Electronics'],
          team: 'Akshat M. (Lead), Siddharth K.',
          link: '/projects'
        }
      ]
    },
    {
      id: 'robotics-iot',
      name: 'Robotics & Connected IoT',
      shortName: 'Ground Systems & Telemetry',
      lead: 'Arjun Singh',
      leadRole: 'Technical Head',
      badge: 'GROUND SYSTEMS & TELEMETRY',
      icon: Bot,
      themeColor: '#059669',
      themeColorDark: '#34d399',
      teaser: 'Building autonomous wheeled ground rovers, robotic manipulators, distributed IoT nodes, and multi-sensor fusion stacks.',
      desc: 'Building autonomous wheeled ground rovers, robotic manipulators, distributed IoT sensor nodes, and real-time multi-sensor fusion stacks.',
      focusAreas: [
        'Robot Operating System (ROS 2 Humble / Iron)',
        'Multi-Sensor Data Fusion (IMU, LiDAR, Encoders)',
        'Wheeled & Mobile Robotics Kinematics',
        'Wireless Telemetry Networks (LoRa, ESP-NOW, MQTT)',
        'Embedded Firmware Optimization in C/C++'
      ],
      technologies: ['ROS 2', 'C++', 'ESP32 / STM32', 'FreeRTOS', 'MQTT', 'LiDAR SLAM', 'LoRaWAN', 'Python'],
      projects: [
        {
          id: 'p-robot-1',
          title: 'Titan 12-DOF Quadruped Mobile Explorer',
          status: 'Operational',
          statusType: 'active',
          desc: 'Compliant actuator-driven quadruped robot designed for rough terrain navigation, featuring 3D LiDAR point-cloud mapping and custom brushless motor drivers.',
          technologies: ['ROS 2 Humble', '3D LiDAR', 'Brushless CAN Actuators', 'SLAM'],
          team: 'David M. (Lead), Sarah H., Elena G.',
          link: '/projects'
        },
        {
          id: 'p-robot-2',
          title: 'Smart Campus Distributed Environmental IoT Mesh',
          status: 'Live Deployment',
          statusType: 'verified',
          desc: 'Solar-powered self-healing LoRa mesh network of multi-gas, temperature, and particulate sensing nodes deployed across campus with real-time telemetry dashboards.',
          technologies: ['ESP32', 'LoRaWAN', 'FreeRTOS', 'MQTT', 'Grafana'],
          team: 'Rohan K. (Lead), Zoe M.',
          link: '/projects'
        }
      ]
    },
    {
      id: 'drone-tech',
      name: 'Aerial Robotics & UAVs',
      shortName: 'Aerodynamics & Flight',
      lead: 'Ayush Tyagi & Flight Lab Team',
      leadRole: 'Flight Operations',
      badge: 'AERODYNAMICS & FLIGHT DYNAMICS',
      icon: Plane,
      themeColor: '#0284c7',
      themeColorDark: '#38bdf8',
      teaser: 'Designing carbon composite airframes, high-speed FPV racing quads, PX4 autopilot integration, and long-range telemetry.',
      desc: 'Designing carbon composite airframes, high-speed FPV racing quads, PX4 autopilot integration, and long-range telemetry flight systems.',
      focusAreas: [
        'Unmanned Aerial Vehicle (UAV) Structural Design',
        'PX4 / ArduPilot Flight Stack Customization',
        'FPV Drone Dynamics & High-G Piloting Systems',
        'Long-Range MAVLink Telemetry Communication',
        'Aerodynamic Simulation & Carbon Composite Fabrication'
      ],
      technologies: ['PX4 Autopilot', 'ArduPilot', 'QGroundControl', 'MAVLink', 'Betaflight', 'CFD Simulation', 'Carbon Fiber'],
      projects: [
        {
          id: 'p-drone-1',
          title: 'AeroHawk Autonomous Search & Rescue Hexacopter',
          status: 'Flight Testing',
          statusType: 'field',
          desc: 'Custom carbon-fiber heavy-lift hexacopter equipped with RTK GPS, dual flight controllers, and fail-safe return-to-launch algorithms for long-duration missions.',
          technologies: ['PX4 Autopilot', 'MAVLink', 'QGroundControl', 'Carbon Composite'],
          team: 'Alex R. (Lead), Liam K.',
          link: '/projects'
        },
        {
          id: 'p-drone-2',
          title: 'Ultra-Lightweight Long-Range Fixed Wing UAV',
          status: 'Field Validated',
          statusType: 'verified',
          desc: 'Aerodynamically optimized composite fixed-wing airframe achieving 2.5-hour continuous flight endurance with 4G LTE cellular telemetry communication.',
          technologies: ['ArduPilot', 'Composite Aero', '4G Telemetry', 'QGroundControl'],
          team: 'Samir P. (Lead), Hannah B.',
          link: '/projects'
        }
      ]
    }
  ];

  // Read domain from URL query param if present, or default to first domain
  const paramDomain = searchParams.get('id') || searchParams.get('domain');
  const validDomainId = domainData.some(d => d.id === paramDomain) ? paramDomain : domainData[0].id;
  const [selectedDomainId, setSelectedDomainId] = useState(validDomainId);

  useEffect(() => {
    if (paramDomain && domainData.some(d => d.id === paramDomain)) {
      setSelectedDomainId(paramDomain);
    }
  }, [paramDomain]);

  const handleDomainSelect = (id, shouldScroll = true) => {
    setSelectedDomainId(id);
    setSearchParams({ domain: id }, { replace: true });
    
    if (shouldScroll && detailSectionRef.current) {
      setTimeout(() => {
        detailSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const activeDomain = domainData.find(d => d.id === selectedDomainId) || domainData[0];
  const ActiveIcon = activeDomain.icon;

  return (
    <div className="domains-page">
      {/* Header */}
      <section className="domains-hero">
        <div className="container">
          <div className="domains-hero-badge">
            <Compass size={14} />
            <span>ENGINEERING VERTICALS</span>
          </div>
          <h1 className="domains-title">Technical Domains</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="domains-subtitle">
            Explore our 4 specialized engineering divisions. Click any domain card below to deep-dive into its focus areas, technologies, and active student projects.
          </p>

          {/* Clean Domain Cards Selector Grid */}
          <div className="domain-selection-grid">
            {domainData.map(domain => {
              const IconComp = domain.icon;
              const isSelected = domain.id === selectedDomainId;

              return (
                <div
                  key={domain.id}
                  className={`domain-preview-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleDomainSelect(domain.id, true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDomainSelect(domain.id, true);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${domain.name} domain`}
                >
                  <div className="preview-card-top">
                    <div className="preview-icon-wrapper">
                      <IconComp size={24} />
                    </div>
                    <span className="preview-tag">{domain.badge}</span>
                  </div>

                  <h3 className="preview-title">{domain.name}</h3>

                  <div className="preview-lead-line">
                    <UserCheck size={13} className="lead-icon" />
                    <span>Lead: <strong>{domain.lead}</strong></span>
                  </div>

                  <p className="preview-teaser">{domain.teaser}</p>

                  <div className="preview-stats-bar">
                    <span className="preview-stat-item">{domain.focusAreas.length} Focus Areas</span>
                    <span className="stat-separator">&bull;</span>
                    <span className="preview-stat-item">{domain.projects.length} Projects</span>
                  </div>

                  <div className="preview-card-action">
                    <span className="action-text">
                      {isSelected ? 'Currently Viewing' : 'Explore Details & Projects'}
                    </span>
                    <ArrowRight size={15} className="action-arrow" />
                  </div>

                  {isSelected && <div className="active-indicator-pill">Active View</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Domain Comprehensive Details & Projects View */}
      <section className="domain-details-section" ref={detailSectionRef} id="domain-detail-view">
        <div className="container">
          
          {/* Active Domain Header Banner */}
          <div className="domain-active-banner aesthetic-card">
            <div className="active-banner-content">
              <div className="active-banner-header">
                <div className="active-banner-icon-box">
                  <ActiveIcon size={34} />
                </div>
                <div className="active-banner-titles">
                  <div className="active-domain-badge-group">
                    <span className="active-domain-pill">{activeDomain.badge}</span>
                    <span className="active-mentorship-pill">
                      <ShieldCheck size={13} />
                      Mentorship: <strong>{activeDomain.lead}</strong> ({activeDomain.leadRole})
                    </span>
                  </div>
                  <h2 className="active-domain-title">{activeDomain.name}</h2>
                </div>
              </div>

              <p className="active-domain-full-desc">{activeDomain.desc}</p>
            </div>
          </div>

          {/* 2-Column Grid: Focus Areas + Tech Stack */}
          <div className="domain-deepdive-grid">
            
            {/* Column 1: Core Focus Areas */}
            <div className="aesthetic-card deepdive-card">
              <div className="deepdive-card-header">
                <div className="deepdive-header-icon">
                  <CheckCircle2 size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="deepdive-card-title">Core Focus &amp; Specialization Areas</h3>
                  <p className="deepdive-card-subtitle">Applied engineering topics covered by division members</p>
                </div>
              </div>

              <ul className="deepdive-focus-list">
                {activeDomain.focusAreas.map((area, idx) => (
                  <li key={idx} className="deepdive-focus-item">
                    <span className="focus-index">0{idx + 1}</span>
                    <span className="focus-text">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Technologies, Frameworks & Hardware */}
            <div className="aesthetic-card deepdive-card">
              <div className="deepdive-card-header">
                <div className="deepdive-header-icon">
                  <Code2 size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="deepdive-card-title">Technologies &amp; Hardware Stack</h3>
                  <p className="deepdive-card-subtitle">Tools, simulation suites, and frameworks utilized</p>
                </div>
              </div>

              <div className="deepdive-tech-grid">
                {activeDomain.technologies.map((tech, idx) => (
                  <div key={idx} className="tech-badge-card">
                    <Zap size={13} className="tech-zap-icon" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>

              <div className="deepdive-tech-info-note">
                <Sparkles size={16} />
                <span>Hands-on lab equipment, test benches, and development kits provided for all active members.</span>
              </div>
            </div>
          </div>

          {/* Active Domain Projects Showcase Section */}
          <div className="domain-projects-container">
            <div className="domain-projects-header">
              <div>
                <div className="projects-pre-title">RESEARCH &amp; PROTOTYPES</div>
                <h3 className="domain-projects-title">
                  Active Projects in <span className="text-highlight">{activeDomain.name}</span>
                </h3>
                <p className="domain-projects-subtitle">
                  Key hardware and software systems currently engineered and field-tested by students in this division.
                </p>
              </div>

              <Link to="/projects" className="view-all-projects-btn">
                <span>All Club Projects</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="domain-projects-grid">
              {activeDomain.projects.map(proj => (
                <div key={proj.id} className="aesthetic-card domain-project-card">
                  <div className="project-card-top-row">
                    <span className={`project-status-tag status-${proj.statusType}`}>
                      <span className="status-dot"></span>
                      {proj.status}
                    </span>
                    <span className="project-team-tag">
                      <UserCheck size={12} />
                      {proj.team}
                    </span>
                  </div>

                  <h4 className="project-card-name">{proj.title}</h4>
                  <p className="project-card-desc">{proj.desc}</p>

                  <div className="project-card-bottom">
                    <div className="project-tech-tags">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="project-tag-item">{t}</span>
                      ))}
                    </div>

                    <Link to={proj.link} className="project-card-cta">
                      <span>Showcase</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Quick Switcher Bar */}
          <div className="bottom-domain-switcher">
            <span className="switcher-label">Select Another Domain:</span>
            <div className="switcher-buttons">
              {domainData.map(d => (
                <button
                  key={d.id}
                  className={`switcher-btn ${d.id === selectedDomainId ? 'active' : ''}`}
                  onClick={() => handleDomainSelect(d.id, true)}
                >
                  {d.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}