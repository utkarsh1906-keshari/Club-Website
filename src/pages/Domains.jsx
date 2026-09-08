import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, Cpu, Bot, Plane, CheckCircle2 } from 'lucide-react';
import './Domains.css';

export default function Domains() {
  const [searchParams, setSearchParams] = useSearchParams();

  const domainData = [
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      lead: 'Maanya (Research Head)',
      badge: 'Edge AI & Perception',
      icon: <Brain size={24} />,
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
          name: 'EdgeVision Real-Time Obstacle Avoidance Engine',
          desc: 'Lightweight deep neural network architecture engineered for 60 FPS monocular depth estimation and dynamic collision trajectory planning on embedded Jetson edge compute.',
          technologies: ['PyTorch', 'TensorRT', 'OpenCV', 'CUDA', 'Python']
        },
        {
          id: 'p-aiml-2',
          name: 'Autonomous Aerial Search & Rescue Perception',
          desc: 'Autonomous vision and thermal infrared object detection model deployed on UAV gimbal payloads for real-time person localization in challenging forest foliage.',
          technologies: ['YOLOv8', 'Thermal CV', 'ROS2 Nav2', 'Jetson Orin']
        }
      ]
    },
    {
      id: 'vlsi',
      name: 'Very Large Scale Integration(VLSI)',
      lead: 'Akshat Modanwal (Technical Head)',
      badge: 'Hardware & Silicon Design',
      icon: <Cpu size={24} />,
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
          name: 'NeuroCore RTL Telemetry Coprocessor',
          desc: 'Synthesizable Verilog coprocessor executing sub-millisecond Kalman filtering on raw IMU telemetry data to reduce latency on low-power UAV flight microcontrollers.',
          technologies: ['Xilinx Artix-7', 'Verilog', 'SystemVerilog', 'Vivado', 'SPI/CAN']
        },
        {
          id: 'p-vlsi-2',
          name: 'Avionics Power Management & Telemetry PCB',
          desc: 'High-density 4-layer custom avionics PCB featuring dual buck-boost converters, optocoupled high-rate telemetry bus, and emergency motor kill circuitry.',
          technologies: ['KiCAD', 'STM32F4', 'CAN Transceivers', 'Power Electronics']
        }
      ]
    },
    {
      id: 'robotics-iot',
      name: 'Robotics & IOT',
      lead: 'Arjun Singh (Technical Head)',
      badge: 'Ground Systems & Telemetry',
      icon: <Bot size={24} />,
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
          name: 'Titan 12-DOF Quadruped Mobile Explorer',
          desc: 'Compliant actuator-driven quadruped robot designed for rough terrain navigation, featuring 3D LiDAR point-cloud mapping and custom brushless motor drivers.',
          technologies: ['ROS 2 Humble', '3D LiDAR', 'Brushless CAN Actuators', 'SLAM']
        },
        {
          id: 'p-robot-2',
          name: 'Smart Campus Distributed Environmental IoT Mesh',
          desc: 'Solar-powered self-healing LoRa mesh network of multi-gas, temperature, and particulate sensing nodes deployed across campus with real-time telemetry dashboards.',
          technologies: ['ESP32', 'LoRaWAN', 'FreeRTOS', 'MQTT', 'Grafana']
        }
      ]
    },
    {
      id: 'drone-tech',
      name: 'Drone Technology',
      lead: 'Ayush Tyagi & Flight Lab Team',
      badge: 'Aerodynamics & Flight Dynamics',
      icon: <Plane size={24} />,
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
          name: 'AeroHawk Autonomous Search & Rescue Hexacopter',
          desc: 'Custom carbon-fiber heavy-lift hexacopter equipped with RTK GPS, dual flight controllers, and fail-safe return-to-launch algorithms for long-duration missions.',
          technologies: ['PX4 Autopilot', 'MAVLink', 'QGroundControl', 'Carbon Composite']
        },
        {
          id: 'p-drone-2',
          name: 'Ultra-Lightweight Long-Range Fixed Wing UAV',
          desc: 'Aerodynamically optimized composite fixed-wing airframe achieving 2.5-hour continuous flight endurance with 4G LTE cellular telemetry communication.',
          technologies: ['ArduPilot', 'Composite Aero', '4G Telemetry', 'QGroundControl']
        }
      ]
    }
  ];

  const paramDomain = searchParams.get('id') || searchParams.get('domain');
  const validDomainId = domainData.some(d => d.id === paramDomain) ? paramDomain : domainData[0].id;
  const [selectedDomainId, setSelectedDomainId] = useState(validDomainId);

  useEffect(() => {
    if (paramDomain && domainData.some(d => d.id === paramDomain)) {
      setSelectedDomainId(paramDomain);
    }
  }, [paramDomain]);

  const handleDomainSelect = (id) => {
    setSelectedDomainId(id);
    setSearchParams({ domain: id }, { replace: true });
  };

  const activeDomain = domainData.find(d => d.id === selectedDomainId) || domainData[0];

  return (
    <div className="domains-page">
      {/* Hero Header */}
      <section className="domains-hero">
        <div className="container">
          <span className="section-label">Engineering Verticals</span>
          <h1 className="domains-title">Core Technical Domains</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="domains-subtitle">
            Explore our specialized engineering divisions. Select any domain below to view its focus areas, technologies, and active projects.
          </p>

          {/* Clean Domain Selector Cards */}
          <div className="domain-tabs-grid">
            {domainData.map(domain => {
              const isSelected = domain.id === selectedDomainId;
              return (
                <button
                  key={domain.id}
                  className={`domain-tab-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleDomainSelect(domain.id)}
                  type="button"
                  aria-pressed={isSelected}
                >
                  <div className="domain-tab-icon">
                    {domain.icon}
                  </div>
                  <div className="domain-tab-info">
                    <span className="domain-tab-badge">{domain.badge}</span>
                    <h3 className="domain-tab-name">{domain.name}</h3>
                    <span className="domain-tab-lead">Lead: {domain.lead.split('(')[0].trim()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Domain Detailed View */}
      <section className="section-padding">
        <div className="container">
          <div className="aesthetic-card domain-detail-card" key={activeDomain.id}>
            
            {/* Domain Title & Lead Header */}
            <div className="domain-detail-header">
              <div className="domain-detail-title-group">
                <div className="domain-detail-icon">
                  {activeDomain.icon}
                </div>
                <div className="domain-title-text-group">
                  <span className="domain-card-tag">{activeDomain.badge}</span>
                  <h2 className="domain-detail-name">{activeDomain.name}</h2>
                  <span className="domain-lead-text">Domain Mentorship: <strong>{activeDomain.lead}</strong></span>
                </div>
              </div>
            </div>

            <p className="domain-detail-description">{activeDomain.desc}</p>

            {/* 2-Column Breakdown: Focus Areas & Technologies */}
            <div className="domain-breakdown-grid">
              
              {/* Focus Areas */}
              <div className="breakdown-col">
                <h4 className="breakdown-heading">Core Focus Areas</h4>
                <ul className="focus-list">
                  {activeDomain.focusAreas.map((area, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} color="var(--color-primary)" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="breakdown-col">
                <h4 className="breakdown-heading">Technologies &amp; Frameworks</h4>
                <div className="tech-tags-grid">
                  {activeDomain.technologies.map((tech, i) => (
                    <span key={i} className="tag-pill tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Domain Projects */}
            <div className="domain-projects-section">
              <h4 className="breakdown-heading">Active Domain Projects</h4>
              <div className="domain-projects-cards-grid">
                {activeDomain.projects.map(proj => (
                  <div key={proj.id} className="domain-subproject-card">
                    <h5 className="subproject-title">{proj.name}</h5>
                    <p className="subproject-desc">{proj.desc}</p>
                    <div className="subproject-tech-list">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="subproject-tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}