-- ============================================================================
-- Drone & Robotics Club - Supabase PostgreSQL Schema & Security Policies
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DOMAINS TABLE
CREATE TABLE IF NOT EXISTS public.domains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    badge TEXT NOT NULL,
    description TEXT NOT NULL,
    focus_areas JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id TEXT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    team_members TEXT[] DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    event_date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    badge TEXT,
    highlights TEXT[] DEFAULT '{}',
    is_past BOOLEAN DEFAULT false,
    registration_open BOOLEAN DEFAULT true,
    registration_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    participation_type TEXT DEFAULT 'Solo',
    team_name TEXT,
    team_size INTEGER DEFAULT 1,
    team_members TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MEMBERS TABLE (Organized into Leadership, Technical Verticals, and Creative/Management)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    designation TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('leadership', 'technical', 'management')),
    department TEXT NOT NULL,
    domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
    image_url TEXT,
    badge TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    sort_order INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date_label TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RECRUITMENT CYCLES TABLE
CREATE TABLE IF NOT EXISTS public.recruitment_cycles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    target_years TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true,
    closed_message TEXT,
    allowed_domains JSONB DEFAULT '["AI/ML", "VLSI", "Robotics & IoT", "Drone Technology"]'::jsonb,
    allowed_roles JSONB DEFAULT '["Technical", "Management", "Design", "Media & Content"]'::jsonb,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. RECRUITMENT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id TEXT NOT NULL DEFAULT 'cycle-2026-2027',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    domain TEXT NOT NULL,
    role TEXT NOT NULL,
    reason TEXT NOT NULL,
    portfolio_url TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Accepted', 'Rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enforce one application per email per recruitment cycle
CREATE UNIQUE INDEX IF NOT EXISTS unique_application_email_per_cycle 
    ON public.applications (lower(email), cycle_id);

-- 9. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    badge TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ADMIN USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'domain_lead', 'social_media', 'event_manager')),
    domain_scope TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Anonymous public read policies
CREATE POLICY "Public Read Domains" ON public.domains FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Recruitment Cycles" ON public.recruitment_cycles FOR SELECT USING (true);
CREATE POLICY "Public Read Active Announcements" ON public.announcements FOR SELECT USING (is_active = true);

-- Public submission policies
CREATE POLICY "Public Insert Applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Event Registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

-- Authenticated Admin write policies
CREATE POLICY "Admin Full Access Domains" ON public.domains FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Registrations" ON public.event_registrations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Members" ON public.members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Recruitment Cycles" ON public.recruitment_cycles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Applications" ON public.applications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Announcements" ON public.announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Seed Data Initialization
-- ============================================================================

INSERT INTO public.domains (id, name, lead_name, badge, description, focus_areas, technologies, image_url)
VALUES 
(
    'ai-ml',
    'AI & Machine Learning',
    'Asra Kamal',
    'Edge AI & Perception',
    'Developing intelligent systems that learn from data and make autonomous decisions. Focus on real-time perception, predictive modeling, and decision-making algorithms for robotics and AI applications.',
    '["Real-Time Computer Vision (YOLO, OpenCV, TensorRT)", "Deep Reinforcement Learning for Autonomous Flight", "Visual SLAM & 3D Environment Perception", "Edge AI Deployment (NVIDIA Jetson, Raspberry Pi)", "Autonomous Obstacle Detection & Avoidance"]'::jsonb,
    '["PyTorch", "TensorFlow", "OpenCV", "ROS2 Nav2", "CUDA", "Python", "ONNX", "TensorRT"]'::jsonb,
    '/abes/proteus-simulink.webp'
),
(
    'vlsi',
    'Very Large Scale Integration (VLSI)',
    'Akshat Modanwal (Technical Head)',
    'Hardware & Silicon Design',
    'Designing custom avionics hardware, FPGA acceleration bitstreams, microcontroller firmware, and high-frequency flight sensor telemetry circuits.',
    '["Digital IC & RTL Architecture (Verilog, SystemVerilog)", "FPGA Synthesis & Bitstream Verification (Xilinx Vivado)", "Hardware Accelerators for Flight Telemetry", "Custom High-Density Avionics PCB Layout", "Low-Latency SPI/I2C/CAN Bus Communication"]'::jsonb,
    '["Verilog", "SystemVerilog", "Xilinx Vivado", "KiCAD", "ModelSim", "Artix-7 FPGA", "STM32", "CAN Bus"]'::jsonb,
    '/abes/circuit-bid.webp'
),
(
    'robotics-iot',
    'Robotics & IoT',
    'Arjun Singh (Technical Head)',
    'Ground Systems & Telemetry',
    'Building autonomous wheeled ground rovers, robotic manipulators, distributed IoT sensor nodes, and real-time multi-sensor fusion stacks.',
    '["Robot Operating System (ROS 2 Humble / Iron)", "Multi-Sensor Data Fusion (IMU, LiDAR, Encoders)", "Wheeled & Mobile Robotics Kinematics", "Wireless Telemetry Networks (LoRa, ESP-NOW, MQTT)", "Embedded Firmware Optimization in C/C++"]'::jsonb,
    '["ROS 2", "C++", "ESP32 / STM32", "FreeRTOS", "MQTT", "LiDAR SLAM", "LoRaWAN", "Python"]'::jsonb,
    '/abes/bottom-banner.webp'
),
(
    'drone-tech',
    'Drone Technology',
    'Ayush Tyagi & Flight Lab Team',
    'Aerodynamics & Flight Dynamics',
    'Designing carbon composite airframes, high-speed FPV racing quads, PX4 autopilot integration, and long-range telemetry flight systems.',
    '["Unmanned Aerial Vehicle (UAV) Structural Design", "PX4 / ArduPilot Flight Stack Customization", "FPV Drone Dynamics & High-G Piloting Systems", "Long-Range MAVLink Telemetry Communication", "Aerodynamic Simulation & Carbon Composite Fabrication"]'::jsonb,
    '["PX4 Autopilot", "ArduPilot", "QGroundControl", "MAVLink", "Betaflight", "CFD Simulation", "Carbon Fiber"]'::jsonb,
    '/abes/bootcamp.webp'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    lead_name = EXCLUDED.lead_name,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    focus_areas = EXCLUDED.focus_areas,
    technologies = EXCLUDED.technologies;
