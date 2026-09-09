import { supabase } from './supabase';

// ============================================================================
// Default Seed Data (Real ABES Drone & Robotics Club Data)
// ============================================================================

const SEED_DOMAINS = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    lead_name: 'Asra Kamal',
    badge: 'Edge AI & Perception',
    description: 'Developing intelligent systems that learn from data and make autonomous decisions. Focus on real-time perception, predictive modeling, and decision-making algorithms for robotics and AI applications.',
    focus_areas: [
      'Real-Time Computer Vision (YOLO, OpenCV, TensorRT)',
      'Deep Reinforcement Learning for Autonomous Flight',
      'Visual SLAM & 3D Environment Perception',
      'Edge AI Deployment (NVIDIA Jetson, Raspberry Pi)',
      'Autonomous Obstacle Detection & Avoidance'
    ],
    technologies: ['PyTorch', 'TensorFlow', 'OpenCV', 'ROS2 Nav2', 'CUDA', 'Python', 'ONNX', 'TensorRT'],
    image_url: '/abes/proteus-simulink.webp'
  },
  {
    id: 'vlsi',
    name: 'Very Large Scale Integration (VLSI)',
    lead_name: 'Akshat Modanwal (Technical Head)',
    badge: 'Hardware & Silicon Design',
    description: 'Designing custom avionics hardware, FPGA acceleration bitstreams, microcontroller firmware, and high-frequency flight sensor telemetry circuits.',
    focus_areas: [
      'Digital IC & RTL Architecture (Verilog, SystemVerilog)',
      'FPGA Synthesis & Bitstream Verification (Xilinx Vivado)',
      'Hardware Accelerators for Flight Telemetry',
      'Custom High-Density Avionics PCB Layout',
      'Low-Latency SPI/I2C/CAN Bus Communication'
    ],
    technologies: ['Verilog', 'SystemVerilog', 'Xilinx Vivado', 'KiCAD', 'ModelSim', 'Artix-7 FPGA', 'STM32', 'CAN Bus'],
    image_url: '/abes/circuit-bid.webp'
  },
  {
    id: 'robotics-iot',
    name: 'Robotics & IoT',
    lead_name: 'Arjun Singh (Technical Head)',
    badge: 'Ground Systems & Telemetry',
    description: 'Building autonomous wheeled ground rovers, robotic manipulators, distributed IoT sensor nodes, and real-time multi-sensor fusion stacks.',
    focus_areas: [
      'Robot Operating System (ROS 2 Humble / Iron)',
      'Multi-Sensor Data Fusion (IMU, LiDAR, Encoders)',
      'Wheeled & Mobile Robotics Kinematics',
      'Wireless Telemetry Networks (LoRa, ESP-NOW, MQTT)',
      'Embedded Firmware Optimization in C/C++'
    ],
    technologies: ['ROS 2', 'C++', 'ESP32 / STM32', 'FreeRTOS', 'MQTT', 'LiDAR SLAM', 'LoRaWAN', 'Python'],
    image_url: '/abes/bottom-banner.webp'
  },
  {
    id: 'drone-tech',
    name: 'Drone Technology',
    lead_name: 'Ayush Tyagi & Flight Lab Team',
    badge: 'Aerodynamics & Flight Dynamics',
    description: 'Designing carbon composite airframes, high-speed FPV racing quads, PX4 autopilot integration, and long-range telemetry flight systems.',
    focus_areas: [
      'Unmanned Aerial Vehicle (UAV) Structural Design',
      'PX4 / ArduPilot Flight Stack Customization',
      'FPV Drone Dynamics & High-G Piloting Systems',
      'Long-Range MAVLink Telemetry Communication',
      'Aerodynamic Simulation & Carbon Composite Fabrication'
    ],
    technologies: ['PX4 Autopilot', 'ArduPilot', 'QGroundControl', 'MAVLink', 'Betaflight', 'CFD Simulation', 'Carbon Fiber'],
    image_url: '/abes/bootcamp.webp'
  }
];

const SEED_PROJECTS = [
  {
    id: 'proj-1',
    domain_id: 'ai-ml',
    title: 'EdgeVision Real-Time Obstacle Avoidance Engine',
    description: 'Lightweight deep neural network architecture engineered for 60 FPS monocular depth estimation and dynamic collision trajectory planning on embedded Jetson edge compute.',
    image_url: '/abes/proteus-simulink.webp',
    technologies: ['PyTorch', 'TensorRT', 'OpenCV', 'CUDA', 'Python'],
    team_members: ['Asra Kamal', 'Devansh Verma', 'Rishi Singh'],
    github_url: 'https://github.com/drone-robotics-abes/edgevision',
    demo_url: '',
    featured: true
  },
  {
    id: 'proj-2',
    domain_id: 'ai-ml',
    title: 'Autonomous Aerial Search & Rescue Perception',
    description: 'Autonomous vision and thermal infrared object detection model deployed on UAV gimbal payloads for real-time person localization in challenging forest foliage.',
    image_url: '/abes/bottom-banner.webp',
    technologies: ['YOLOv8', 'Thermal CV', 'ROS2 Nav2', 'Jetson Orin'],
    team_members: ['Asra Kamal', 'Tanmay Sharma'],
    github_url: 'https://github.com/drone-robotics-abes/aerial-sar-cv',
    demo_url: '',
    featured: false
  },
  {
    id: 'proj-3',
    domain_id: 'vlsi',
    title: 'NeuroCore RTL Telemetry Coprocessor',
    description: 'Synthesizable Verilog coprocessor executing sub-millisecond Kalman filtering on raw IMU telemetry data to reduce latency on low-power UAV flight microcontrollers.',
    image_url: '/abes/circuit-bid.webp',
    technologies: ['Xilinx Artix-7', 'Verilog', 'SystemVerilog', 'Vivado', 'SPI/CAN'],
    team_members: ['Akshat Modanwal', 'Shikhar Dubey'],
    github_url: 'https://github.com/drone-robotics-abes/neurocore-rtl',
    demo_url: '',
    featured: true
  },
  {
    id: 'proj-4',
    domain_id: 'vlsi',
    title: 'Avionics Power Management & Telemetry PCB',
    description: 'High-density 4-layer custom avionics PCB featuring dual buck-boost converters, optocoupled high-rate telemetry bus, and emergency motor kill circuitry.',
    image_url: '/abes/circuit-bid.webp',
    technologies: ['KiCAD', 'STM32F4', 'CAN Transceivers', 'Power Electronics'],
    team_members: ['Akshat Modanwal', 'Priyanshu Ranjan'],
    github_url: 'https://github.com/drone-robotics-abes/avionics-pcb',
    demo_url: '',
    featured: false
  },
  {
    id: 'proj-5',
    domain_id: 'robotics-iot',
    title: 'Titan 12-DOF Quadruped Mobile Explorer',
    description: 'Compliant actuator-driven quadruped robot designed for rough terrain navigation, featuring 3D LiDAR point-cloud mapping and custom brushless motor drivers.',
    image_url: '/abes/bottom-banner.webp',
    technologies: ['ROS 2 Humble', '3D LiDAR', 'Brushless CAN Actuators', 'SLAM'],
    team_members: ['Arjun Singh', 'Nitin Rawat', 'Kavya Sen'],
    github_url: 'https://github.com/drone-robotics-abes/titan-quadruped',
    demo_url: '',
    featured: true
  },
  {
    id: 'proj-6',
    domain_id: 'robotics-iot',
    title: 'Smart Campus Distributed Environmental IoT Mesh',
    description: 'Solar-powered self-healing LoRa mesh network of multi-gas, temperature, and particulate sensing nodes deployed across campus with real-time telemetry dashboards.',
    image_url: '/abes/bottom-banner.webp',
    technologies: ['ESP32', 'LoRaWAN', 'FreeRTOS', 'MQTT', 'Grafana'],
    team_members: ['Arjun Singh', 'Mohit Sharma'],
    github_url: 'https://github.com/drone-robotics-abes/lora-mesh-iot',
    demo_url: '',
    featured: false
  },
  {
    id: 'proj-7',
    domain_id: 'drone-tech',
    title: 'AeroHawk Autonomous Search & Rescue Hexacopter',
    description: 'Custom carbon-fiber heavy-lift hexacopter equipped with RTK GPS, dual flight controllers, and fail-safe return-to-launch algorithms for long-duration missions.',
    image_url: '/abes/bootcamp.webp',
    technologies: ['PX4 Autopilot', 'MAVLink', 'QGroundControl', 'Carbon Composite'],
    team_members: ['Ayush Tyagi', 'Vishal', 'Pratham Singh'],
    github_url: 'https://github.com/drone-robotics-abes/aerohawk-hex',
    demo_url: '',
    featured: true
  },
  {
    id: 'proj-8',
    domain_id: 'drone-tech',
    title: 'Ultra-Lightweight Long-Range Fixed Wing UAV',
    description: 'Aerodynamically optimized composite fixed-wing airframe achieving 2.5-hour continuous flight endurance with 4G LTE cellular telemetry communication.',
    image_url: '/abes/fpv-assembly.webp',
    technologies: ['ArduPilot', 'Composite Aero', '4G Telemetry', 'QGroundControl'],
    team_members: ['Ayush Tyagi', 'Aryan Patel'],
    github_url: 'https://github.com/drone-robotics-abes/fixed-wing-uav',
    demo_url: '',
    featured: false
  }
];

const SEED_EVENTS = [
  {
    id: 'event-bootcamp',
    title: 'Drone & Robotics Bootcamp',
    category: 'Flagship Bootcamp',
    event_date: 'SEPTEMBER 2026',
    time: '10:00 AM – 4:30 PM',
    venue: 'Robotics Lab & Flight Cage, ABESEC',
    description: 'An immersive hands-on training program covering multirotor aerodynamics, ESC & brushless motor assembly, flight controller configuration, and autonomous obstacle navigation.',
    image_url: '/abes/bootcamp.webp',
    badge: 'Flagship Event',
    highlights: ['Multirotor Flight Dynamics', 'Brushless Motors & ESCs', 'Autonomous Telemetry'],
    is_past: false,
    registration_open: true,
    registration_url: ''
  },
  {
    id: 'event-circuit-bid',
    title: 'Circuit Bid',
    category: 'Competition',
    event_date: 'OCTOBER 2026',
    time: '11:00 AM – 3:00 PM',
    venue: 'VLSI CAD Center, ABESEC',
    description: 'An exciting hardware bidding and circuit debugging competition where teams strategically bid for components and solve complex electronic schematic problems under strict time constraints.',
    image_url: '/abes/circuit-bid.webp',
    badge: 'Competition',
    highlights: ['Hardware Bidding', 'Circuit Debugging', 'Real-time Prototyping'],
    is_past: false,
    registration_open: true,
    registration_url: ''
  },
  {
    id: 'event-fpv-assembly',
    title: 'FPV Drone Assembly Workshop',
    category: 'Workshop',
    event_date: 'NOVEMBER 2026',
    time: '1:00 PM – 5:00 PM',
    venue: 'Drone Fabrication Workshop',
    description: 'A comprehensive hardware workshop where participants assembled custom carbon-fiber racing quadcopters from scratch, configured Betaflight firmware, and practiced line-of-sight test hovers.',
    image_url: '/abes/fpv-assembly.webp',
    badge: 'Hardware Workshop',
    highlights: ['Carbon-fiber Airframes', 'Betaflight Firmware', 'Radio Protocol Binding'],
    is_past: true,
    registration_open: false,
    registration_url: ''
  },
  {
    id: 'event-proteus-simulink',
    title: 'Proteus & Simulink Masterclass',
    category: 'Masterclass',
    event_date: 'DECEMBER 2026',
    time: '2:00 PM – 5:00 PM',
    venue: 'ECE Computer Center',
    description: 'Advanced software simulation sessions focusing on model-based control algorithms in MATLAB/Simulink and circuit validation in Proteus before physical fabrication.',
    image_url: '/abes/proteus-simulink.webp',
    badge: 'Simulation Masterclass',
    highlights: ['Simulink Control Modeling', 'Proteus Virtual Instruments', 'PID Tuning'],
    is_past: true,
    registration_open: false,
    registration_url: ''
  },
  {
    id: 'event-robotohack',
    title: 'RobotoHack - 48h National Hackathon',
    category: 'Hackathon',
    event_date: 'JANUARY 2027',
    time: '48 Hours Non-Stop',
    venue: 'Innovation Arena, ABESEC',
    description: 'Inter-collegiate 48-hour hardware and robotics marathon bringing together student developers to engineer working autonomous ground rovers, search-and-rescue aerial drones, and connected IoT platforms.',
    image_url: '/abes/robotohack.webp',
    badge: 'National Hackathon',
    highlights: ['48h Rapid Prototyping', 'Cash Prizes & Lab Grants', 'Industry Jury Mentorship'],
    is_past: false,
    registration_open: true,
    registration_url: ''
  }
];

const SEED_MEMBERS = [
  // 1. Leadership
  {
    id: 'mem-1',
    name: 'Ms. Unnati Mehta',
    role: 'Faculty Coordinator',
    designation: 'Assistant Professor, Department of ECE',
    category: 'leadership',
    department: 'Faculty Mentorship',
    domain_id: null,
    image_url: '/unnati-mehta-advisor.png',
    badge: 'Faculty Coordinator',
    bio: 'Guiding club administration, research publications, academic approvals, and institutional support for high-impact innovation.',
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    sort_order: 1
  },
  {
    id: 'mem-2',
    name: 'Vishal',
    role: 'General Secretary',
    designation: 'General Secretary',
    category: 'leadership',
    department: 'Executive Operations',
    domain_id: null,
    image_url: '/abes/vishal.jpeg',
    badge: 'Executive Leadership',
    bio: 'Leading strategic club operations, inter-departmental synergy, technical project direction, and overall student execution.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    sort_order: 2
  },
  {
    id: 'mem-3',
    name: 'Ayush Tyagi',
    role: 'Joint Secretary',
    designation: 'Joint Secretary',
    category: 'leadership',
    department: 'Executive Operations',
    domain_id: 'drone-tech',
    image_url: '/abes/ayush-tyagi.jpeg',
    badge: 'Executive Leadership',
    bio: 'Managing club logistics, inter-college competition contingents, workshop planning, and team coordination.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    sort_order: 3
  },
  {
    id: 'mem-4',
    name: 'Shreya Vishwakarma',
    role: 'Treasurer',
    designation: 'Treasurer',
    category: 'leadership',
    department: 'Financial & Inventory',
    domain_id: null,
    image_url: '/abes/shreya-vishwakarma.webp',
    badge: 'Executive Leadership',
    bio: 'Overseeing club budgeting, hardware inventory, component procurement, and sponsorship pipeline allocations.',
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    sort_order: 4
  },
  // 2. Technical Domain Leads
  {
    id: 'mem-5',
    name: 'Akshat Modanwal',
    role: 'Technical Head (VLSI)',
    designation: 'Technical Head - VLSI & Silicon',
    category: 'technical',
    department: 'Very Large Scale Integration',
    domain_id: 'vlsi',
    image_url: '',
    badge: 'Domain Lead',
    bio: 'Leading FPGA synthesis, custom RTL architecture in Verilog, and high-speed avionics telemetry PCB routing.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    sort_order: 10
  },
  {
    id: 'mem-6',
    name: 'Arjun Singh',
    role: 'Technical Head (Robotics & IoT)',
    designation: 'Technical Head - Robotics',
    category: 'technical',
    department: 'Robotics & IoT',
    domain_id: 'robotics-iot',
    image_url: '',
    badge: 'Domain Lead',
    bio: 'Architecting ROS2 autonomous rover navigation, brushless motor ESC drivers, and distributed campus sensor networks.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    sort_order: 11
  },
  {
    id: 'mem-7',
    name: 'Asra Kamal',
    role: 'Research & AI Head',
    designation: 'Research Head - AI & Perception',
    category: 'technical',
    department: 'AI & Machine Learning',
    domain_id: 'ai-ml',
    image_url: '',
    badge: 'Domain Lead',
    bio: 'Directing computer vision perception, monocular depth estimation for UAVs, and edge AI deployment on NVIDIA Jetson.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    sort_order: 12
  },
  // 3. Functional / Management Teams
  {
    id: 'mem-8',
    name: 'Pratham Singh',
    role: 'Events Head',
    designation: 'Events Coordinator',
    category: 'management',
    department: 'Event Management',
    domain_id: null,
    image_url: '',
    badge: 'Functional Lead',
    bio: 'Orchestrating hardware bootcamps, timed competitive hackathons, guest seminars, and campus robotics challenges.',
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    sort_order: 20
  },
  {
    id: 'mem-9',
    name: 'Deepanshu',
    role: 'PR & Outreach Head',
    designation: 'PR & Strategic Outreach Lead',
    category: 'management',
    department: 'Public Relations & Alliances',
    domain_id: null,
    image_url: '',
    badge: 'Functional Lead',
    bio: 'Building institutional partnerships, securing external sponsorships, and expanding collaborative research outreach.',
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    sort_order: 21
  },
  {
    id: 'mem-10',
    name: 'Divyansh Goel',
    role: 'Social Media & Design Head',
    designation: 'Media & Branding Lead',
    category: 'management',
    department: 'Media & Creative',
    domain_id: null,
    image_url: '',
    badge: 'Functional Lead',
    bio: 'Managing club public visibility, photography, video showcases, and technical storytelling across digital handles.',
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    sort_order: 22
  }
];

const SEED_GALLERY = [
  {
    id: 'gal-1',
    title: 'FPV Racing Quad Assembly & Flight Calibration',
    category: 'Drones',
    date_label: 'NOVEMBER 2026',
    description: 'Hands-on carbon-fiber racing quadcopter fabrication, Betaflight motor configuration, and line-of-sight test hovers.',
    image_url: '/abes/fpv-assembly.webp',
    badge: 'Hardware Build'
  },
  {
    id: 'gal-2',
    title: 'RobotoHack 48-Hour National Hackathon',
    category: 'Events',
    date_label: 'JANUARY 2027',
    description: 'Inter-collegiate hardware marathon bringing together engineering squads to construct autonomous rovers and drone payloads.',
    image_url: '/abes/robotohack.webp',
    badge: 'National Hackathon'
  },
  {
    id: 'gal-3',
    title: 'Circuit Bid Hardware & Telemetry Competition',
    category: 'VLSI',
    date_label: 'OCTOBER 2026',
    description: 'Real-time schematic debugging, component bidding, and oscilloscope telemetry validation under competitive time limits.',
    image_url: '/abes/circuit-bid.webp',
    badge: 'Hardware Challenge'
  },
  {
    id: 'gal-4',
    title: 'Drone & Multirotor Flight Bootcamp',
    category: 'Workshops',
    date_label: 'SEPTEMBER 2026',
    description: 'Immersive flight aerodynamics session covering ESCs, brushless thrust dynamics, and radio telemetry bind procedures.',
    image_url: '/abes/bootcamp.webp',
    badge: 'Flagship Bootcamp'
  },
  {
    id: 'gal-5',
    title: 'Proteus & MATLAB Control Loop Simulation',
    category: 'AI/ML',
    date_label: 'DECEMBER 2026',
    description: 'Advanced software simulation sessions focusing on model-based control algorithms, virtual instruments, and PID tuning.',
    image_url: '/abes/proteus-simulink.webp',
    badge: 'Simulation Masterclass'
  },
  {
    id: 'gal-6',
    title: 'Autonomous Rover & Campus Robotics Lab',
    category: 'Robotics',
    date_label: 'AUGUST 2026',
    description: 'Indoor obstacle traversal tests, LiDAR point-cloud mapping, and ROS2 mobile rover locomotion in the club flight arena.',
    image_url: '/abes/bottom-banner.webp',
    badge: 'Lab Research'
  }
];

export const DEFAULT_FORM_QUESTIONS = [
  { id: 'name', label: 'Full Name', type: 'text', required: true, is_default: true, active: true },
  { id: 'email', label: 'College Email Address (@abes.ac.in recommended)', type: 'email', required: true, is_default: true, active: true },
  { id: 'studentId', label: 'Admission Number', type: 'text', required: true, is_default: true, active: true },
  { id: 'branch', label: 'Department / Academic Branch', type: 'text', required: true, is_default: true, active: true },
  { id: 'year', label: 'Current Year of Study', type: 'select', options: ['1st Year (Freshman)', '2nd Year (Sophomore)', '3rd Year (Junior)', '4th Year (Senior)'], required: true, is_default: true, active: true },
  { id: 'domain', label: 'Preferred Technical Domain', type: 'select', options: ['AI/ML', 'VLSI', 'Robotics & IoT', 'Drone Technology', 'None / Pure Management'], required: true, is_default: true, active: true },
  { id: 'role', label: 'Functional or Technical Role', type: 'select', options: ['Technical Developer / Engineer', 'Creative & UI/UX Design', 'Social Media & Communications', 'Events & Operations', 'PR & Corporate Outreach', 'Technical Content & Documentation', 'Other Functional Role'], required: true, is_default: true, active: true },
  { id: 'portfolio', label: 'GitHub / Portfolio Link', type: 'url', required: false, is_default: true, active: true },
  { id: 'reason', label: 'Why do you want to join the Drone & Robotics Club?', type: 'textarea', required: true, is_default: true, active: true }
];

const SEED_RECRUITMENT_CYCLE = {
  id: 'cycle-2026-2027',
  title: 'Recruitment Drive 2026–2027',
  subtitle: 'Join the premier drone and robotics engineering club at ABES EC.',
  target_years: '1st & 2nd Year B.Tech Students',
  deadline: '2026-10-31',
  is_active: true,
  closed_message: 'Recruitment for Drones & Robotics Club is currently closed. Follow our announcements or connect with our social handles for updates on future induction drives.',
  allowed_domains: ['AI/ML', 'VLSI', 'Robotics & IoT', 'Drone Technology'],
  allowed_roles: ['Technical', 'Management', 'Design', 'Media & Content'],
  instructions: 'Please fill out your authentic academic and interest details. You may only apply once per recruitment cycle with your primary college email.',
  questions: DEFAULT_FORM_QUESTIONS,
  updated_at: new Date().toISOString()
};

const SEED_APPLICATIONS = [
  {
    id: 'app-1',
    cycle_id: 'cycle-2026-2027',
    name: 'Aarav Patel',
    email: 'aarav.p@college.edu',
    student_id: '2300320100012',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    domain: 'AI/ML',
    role: 'Technical',
    reason: 'Interested in ROS2 Nav2 autonomous path planning and computer vision deployment on drones.',
    portfolio_url: 'https://github.com/aarav-ai',
    status: 'New',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'app-2',
    cycle_id: 'cycle-2026-2027',
    name: 'Devika Sharma',
    email: 'devika.s@college.edu',
    student_id: '2400320200045',
    branch: 'Electronics & Communication',
    year: '1st Year',
    domain: 'Drone Technology',
    role: 'Technical',
    reason: 'Have built a quadcopter in high school and want to contribute to the AeroHawk search and rescue UAV.',
    portfolio_url: '',
    status: 'Under Review',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'app-3',
    cycle_id: 'cycle-2026-2027',
    name: 'Rohan Gupta',
    email: 'rohan.g@college.edu',
    student_id: '2300320310088',
    branch: 'Electrical Engineering',
    year: '2nd Year',
    domain: 'VLSI',
    role: 'Technical',
    reason: 'Passionate about synthesizable Verilog, FPGA design, and telemetry hardware acceleration.',
    portfolio_url: 'https://github.com/rohan-fpga',
    status: 'Accepted',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'app-4',
    cycle_id: 'cycle-2026-2027',
    name: 'Ananya Roy',
    email: 'ananya.r@college.edu',
    student_id: '2400320100102',
    branch: 'Information Technology',
    year: '1st Year',
    domain: 'Robotics & IoT',
    role: 'Design',
    reason: 'Graphic designer with 3D modeling skills in Blender and Fusion 360 for drone chassis and branding.',
    portfolio_url: 'https://behance.net/ananya',
    status: 'Accepted',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

const SEED_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Recruitment Cycle 2026–2027 is Now Live!',
    content: 'Applications are officially open for 1st & 2nd year students across all engineering branches. Submit your interest before Sept 30.',
    badge: 'Recruitment',
    link_url: '/join',
    is_active: true,
    expires_at: '2026-09-30T23:59:59Z',
    created_at: new Date().toISOString()
  },
  {
    id: 'ann-2',
    title: 'Registration Open: Flagship Drone & Robotics Bootcamp 2026',
    content: 'Hands-on assembly, Betaflight tuning, and test flights in the ABES flight cage. Limited to 40 seats.',
    badge: 'Workshop',
    link_url: '/events',
    is_active: true,
    expires_at: '2026-10-15T23:59:59Z',
    created_at: new Date().toISOString()
  }
];

// Helper to retrieve/store in LocalStorage
function getLocal(key, seed) {
  try {
    const item = localStorage.getItem('drc_' + key);
    if (!item) {
      localStorage.setItem('drc_' + key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Local storage read error for ${key}:`, e);
    return seed;
  }
}

function setLocal(key, data) {
  try {
    localStorage.setItem('drc_' + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Local storage write error for ${key}:`, e);
  }
}

// ============================================================================
// Service Export Implementations
// ============================================================================

export const domainsService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('domains').select('*').order('id');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase domains fetch failed, using local cache:', err);
      }
    }
    return getLocal('domains', SEED_DOMAINS);
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find(d => d.id === id) || null;
  },

  async update(id, domainData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('domains')
          .update(domainData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('domains', SEED_DOMAINS).map(d => (d.id === id ? { ...d, ...data } : d));
          setLocal('domains', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase domain update error, falling back to local:', err);
      }
    }
    const list = getLocal('domains', SEED_DOMAINS).map(d => (d.id === id ? { ...d, ...domainData } : d));
    setLocal('domains', list);
    return list.find(d => d.id === id);
  }
};

export const projectsService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase projects fetch failed, using local cache:', err);
      }
    }
    return getLocal('projects', SEED_PROJECTS);
  },

  async getByDomain(domainId) {
    const all = await this.getAll();
    if (!domainId || domainId === 'all') return all;
    return all.filter(p => p.domain_id === domainId);
  },

  async create(project) {
    const newProj = {
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
      ...project
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').insert([project]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('projects', SEED_PROJECTS)];
          setLocal('projects', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase project create error:', err);
      }
    }
    const list = [newProj, ...getLocal('projects', SEED_PROJECTS)];
    setLocal('projects', list);
    return newProj;
  },

  async update(id, projectData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('projects', SEED_PROJECTS).map(p => (p.id === id ? { ...p, ...data } : p));
          setLocal('projects', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase project update error:', err);
      }
    }
    const list = getLocal('projects', SEED_PROJECTS).map(p => (p.id === id ? { ...p, ...projectData } : p));
    setLocal('projects', list);
    return list.find(p => p.id === id);
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase project delete error:', err);
      }
    }
    const list = getLocal('projects', SEED_PROJECTS).filter(p => p.id !== id);
    setLocal('projects', list);
    return true;
  }
};

export const eventsService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase events fetch failed, using local cache:', err);
      }
    }
    return getLocal('events', SEED_EVENTS);
  },

  async create(event) {
    const newEvent = {
      id: 'event-' + Date.now(),
      created_at: new Date().toISOString(),
      ...event
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('events').insert([event]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('events', SEED_EVENTS)];
          setLocal('events', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase event create error:', err);
      }
    }
    const list = [newEvent, ...getLocal('events', SEED_EVENTS)];
    setLocal('events', list);
    return newEvent;
  },

  async update(id, eventData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('events', SEED_EVENTS).map(e => (e.id === id ? { ...e, ...data } : e));
          setLocal('events', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase event update error:', err);
      }
    }
    const list = getLocal('events', SEED_EVENTS).map(e => (e.id === id ? { ...e, ...eventData } : e));
    setLocal('events', list);
    return list.find(e => e.id === id);
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('events').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase event delete error:', err);
      }
    }
    const list = getLocal('events', SEED_EVENTS).filter(e => e.id !== id);
    setLocal('events', list);
    return true;
  }
};

export const eventRegistrationsService = {
  async getAll(eventId = null) {
    if (supabase) {
      try {
        let query = supabase.from('event_registrations').select('*').order('created_at', { ascending: false });
        if (eventId) query = query.eq('event_id', eventId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase event registrations fetch failed:', err);
      }
    }
    const local = getLocal('event_registrations', []);
    if (eventId) return local.filter(r => r.event_id === eventId);
    return local;
  },

  async create(registration) {
    const newReg = {
      id: 'reg-' + Date.now(),
      created_at: new Date().toISOString(),
      ...registration
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('event_registrations').insert([registration]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('event_registrations', [])];
          setLocal('event_registrations', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase registration insert error:', err);
      }
    }
    const list = [newReg, ...getLocal('event_registrations', [])];
    setLocal('event_registrations', list);
    return newReg;
  }
};

export const membersService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('members').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase members fetch failed, using local cache:', err);
      }
    }
    return getLocal('members', SEED_MEMBERS);
  },

  async create(member) {
    const newMem = {
      id: 'mem-' + Date.now(),
      created_at: new Date().toISOString(),
      ...member
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('members').insert([member]).select().single();
        if (!error && data) {
          const list = [...getLocal('members', SEED_MEMBERS), data];
          setLocal('members', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase member create error:', err);
      }
    }
    const list = [...getLocal('members', SEED_MEMBERS), newMem];
    setLocal('members', list);
    return newMem;
  },

  async update(id, memberData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('members')
          .update(memberData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('members', SEED_MEMBERS).map(m => (m.id === id ? { ...m, ...data } : m));
          setLocal('members', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase member update error:', err);
      }
    }
    const list = getLocal('members', SEED_MEMBERS).map(m => (m.id === id ? { ...m, ...memberData } : m));
    setLocal('members', list);
    return list.find(m => m.id === id);
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('members').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase member delete error:', err);
      }
    }
    const list = getLocal('members', SEED_MEMBERS).filter(m => m.id !== id);
    setLocal('members', list);
    return true;
  }
};

export const galleryService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase gallery fetch failed, using local cache:', err);
      }
    }
    return getLocal('gallery', SEED_GALLERY);
  },

  async create(item) {
    const newItem = {
      id: 'gal-' + Date.now(),
      created_at: new Date().toISOString(),
      ...item
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('gallery').insert([item]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('gallery', SEED_GALLERY)];
          setLocal('gallery', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase gallery insert error:', err);
      }
    }
    const list = [newItem, ...getLocal('gallery', SEED_GALLERY)];
    setLocal('gallery', list);
    return newItem;
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase gallery delete error:', err);
      }
    }
    const list = getLocal('gallery', SEED_GALLERY).filter(g => g.id !== id);
    setLocal('gallery', list);
    return true;
  }
};

export const recruitmentService = {
  async getCycleConfig() {
    let base = SEED_RECRUITMENT_CYCLE;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('recruitment_cycles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && data) base = { ...SEED_RECRUITMENT_CYCLE, ...data };
      } catch (err) {
        console.warn('Supabase recruitment cycle fetch failed, using local fallback:', err);
      }
    } else {
      base = getLocal('recruitment_cycle', SEED_RECRUITMENT_CYCLE);
    }
    const questions = getLocal('recruitment_form_questions', base.questions || DEFAULT_FORM_QUESTIONS);
    return { ...base, questions };
  },

  async updateCycleConfig(updates) {
    const current = await this.getCycleConfig();
    const updated = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (updates.questions) {
      setLocal('recruitment_form_questions', updates.questions);
    }
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('recruitment_cycles')
          .upsert([updated])
          .select()
          .single();
        if (!error && data) {
          setLocal('recruitment_cycle', data);
          return { ...data, questions: updated.questions };
        }
      } catch (err) {
        console.warn('Supabase recruitment cycle update error:', err);
      }
    }
    setLocal('recruitment_cycle', updated);
    return updated;
  },

  async getQuestions() {
    const config = await this.getCycleConfig();
    return config.questions || DEFAULT_FORM_QUESTIONS;
  },

  async saveQuestions(questions) {
    setLocal('recruitment_form_questions', questions);
    return this.updateCycleConfig({ questions });
  },

  async addQuestion(newQuestion) {
    const currentQuestions = await this.getQuestions();
    const questionObj = {
      id: 'q_' + Date.now(),
      label: newQuestion.label,
      type: newQuestion.type || 'text',
      required: !!newQuestion.required,
      options: newQuestion.options || [],
      active: true,
      is_default: false
    };
    const updated = [...currentQuestions, questionObj];
    await this.saveQuestions(updated);
    return updated;
  },

  async removeQuestion(questionId) {
    const currentQuestions = await this.getQuestions();
    const updated = currentQuestions.filter(q => q.id !== questionId);
    await this.saveQuestions(updated);
    return updated;
  },

  async toggleQuestion(questionId) {
    const currentQuestions = await this.getQuestions();
    const updated = currentQuestions.map(q => q.id === questionId ? { ...q, active: !q.active } : q);
    await this.saveQuestions(updated);
    return updated;
  },

  async recreateCycle(newCycleData = {}) {
    const newCycle = {
      ...SEED_RECRUITMENT_CYCLE,
      ...newCycleData,
      id: 'cycle-' + Date.now(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('recruitment_cycles')
          .insert([newCycle])
          .select()
          .single();
        if (!error && data) {
          setLocal('recruitment_cycle', data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase recruitment cycle recreation error:', err);
      }
    }
    setLocal('recruitment_cycle', newCycle);
    return newCycle;
  }
};

export const applicationsService = {
  async getAll(cycleId = null) {
    if (supabase) {
      try {
        let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
        if (cycleId) {
          query = query.eq('cycle_id', cycleId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase applications fetch failed, using local cache:', err);
      }
    }
    const all = getLocal('applications', SEED_APPLICATIONS);
    if (cycleId) {
      return all.filter(a => (a.cycle_id || 'cycle-2026-2027') === cycleId);
    }
    return all;
  },

  async checkEmailExists(email, cycleId = null) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const all = await this.getAll(cycleId);
    return all.some(a => (a.email || '').trim().toLowerCase() === cleanEmail);
  },

  async create(app) {
    const cycle = await recruitmentService.getCycleConfig();

    // 1. Check if recruitment cycle is active
    if (!cycle.is_active) {
      throw new Error('Recruitment is currently closed. New applications are not being accepted at this time.');
    }

    const cleanEmail = (app.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('A valid email address is required.');
    }

    // 2. Check for duplicate email in this cycle
    const isDuplicate = await this.checkEmailExists(cleanEmail, cycle.id);
    if (isDuplicate) {
      throw new Error(`An application with email "${app.email}" has already been submitted for the current cycle (${cycle.title}). Multiple submissions are not permitted.`);
    }

    const newApp = {
      id: 'app-' + Date.now(),
      status: 'New',
      cycle_id: cycle.id,
      created_at: new Date().toISOString(),
      ...app,
      email: cleanEmail
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('applications', SEED_APPLICATIONS)];
          setLocal('applications', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase application submit error:', err);
      }
    }
    const list = [newApp, ...getLocal('applications', SEED_APPLICATIONS)];
    setLocal('applications', list);
    return newApp;
  },

  async updateStatus(id, status, notes = '') {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('applications', SEED_APPLICATIONS).map(a =>
            a.id === id ? { ...a, status, admin_notes: notes } : a
          );
          setLocal('applications', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase application status update error:', err);
      }
    }
    const list = getLocal('applications', SEED_APPLICATIONS).map(a =>
      a.id === id ? { ...a, status, admin_notes: notes } : a
    );
    setLocal('applications', list);
    return list.find(a => a.id === id);
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('applications').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase application delete error:', err);
      }
    }
    const list = getLocal('applications', SEED_APPLICATIONS).filter(a => a.id !== id);
    setLocal('applications', list);
    return true;
  }
};

export const announcementsService = {
  async getAll(onlyActive = true) {
    if (supabase) {
      try {
        let query = supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase announcements fetch failed:', err);
      }
    }
    const list = getLocal('announcements', SEED_ANNOUNCEMENTS);
    if (onlyActive) return list.filter(a => a.is_active);
    return list;
  },

  async create(announcement) {
    const newAnn = {
      id: 'ann-' + Date.now(),
      created_at: new Date().toISOString(),
      ...announcement
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('announcements').insert([newAnn]).select().single();
        if (!error && data) {
          const list = [data, ...getLocal('announcements', SEED_ANNOUNCEMENTS)];
          setLocal('announcements', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase announcement insert error:', err);
      }
    }
    const list = [newAnn, ...getLocal('announcements', SEED_ANNOUNCEMENTS)];
    setLocal('announcements', list);
    return newAnn;
  },

  async update(id, announcementData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = getLocal('announcements', SEED_ANNOUNCEMENTS).map(a =>
            a.id === id ? { ...a, ...data } : a
          );
          setLocal('announcements', list);
          return data;
        }
      } catch (err) {
        console.warn('Supabase announcement update error:', err);
      }
    }
    const list = getLocal('announcements', SEED_ANNOUNCEMENTS).map(a =>
      a.id === id ? { ...a, ...announcementData } : a
    );
    setLocal('announcements', list);
    return list.find(a => a.id === id);
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('announcements').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase announcement delete error:', err);
      }
    }
    const list = getLocal('announcements', SEED_ANNOUNCEMENTS).filter(a => a.id !== id);
    setLocal('announcements', list);
    return true;
  }
};

export const statsService = {
  async getDashboardStats() {
    const [events, projects, members, applications, gallery] = await Promise.all([
      eventsService.getAll(),
      projectsService.getAll(),
      membersService.getAll(),
      applicationsService.getAll(),
      galleryService.getAll()
    ]);

    return {
      eventsCount: events.length,
      projectsCount: projects.length,
      membersCount: members.length,
      applicationsCount: applications.length,
      galleryCount: gallery.length,
      newApplicationsCount: applications.filter(a => a.status === 'New').length
    };
  }
};
