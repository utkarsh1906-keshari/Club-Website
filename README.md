# Drone & Robotics Club (DRC) — ABES Engineering College

Official web portal and administrative management system for the **Drone & Robotics Club** at ABES Engineering College, Ghaziabad.

---

## 🚀 Overview

The Drone & Robotics Club website provides a platform for collegiate engineering innovation, project showcases, bootcamp registrations, domain research exploration, and student recruitment drives. 

### Key Capabilities
- **Public Showcase**: Technical domain portfolios (AI/ML, VLSI, Robotics & IoT, Drone Tech), project repositories, and leadership profiles.
- **Event Registrations**: Real-time event registrations with validated capacity limits, automated pass generation, and past event archives.
- **Student Induction Portal**: Configurable recruitment cycles, custom dynamic questionnaires, and application status tracking.
- **Admin Control Center (`/admin`)**: Role-based administration protected by Supabase Authentication and PostgreSQL Row Level Security (RLS).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v7
- **Styling**: Vanilla CSS Design System, Responsive Flex/Grid Layouts, Lucide React Icons
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Deployment**: Vercel (SPA Rewrites, HTTP Security Headers)
- **Tooling**: Oxlint, Git

---

## 🔐 Security Architecture

- **Supabase Authentication**: Admins authenticate securely via email and password using `supabase.auth.signInWithPassword`.
- **Database Row Level Security (RLS)**: Enforces role-based data access at the database layer using `auth.uid()` and verified `admin_users` records.
- **Role Permissions**:
  - `super_admin`: Full management across all modules, settings, and admin users.
  - `domain_lead`: Manage technical domains, projects, and review student applications.
  - `event_manager`: Manage events, workshops, and view/export registrations.
  - `social_media`: Manage club leadership roster, member categories, and announcements.
- **HTTP Security Headers**: Enforced via `vercel.json` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

## 📋 Getting Started & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/utkarsh1906-keshari/Club-Website.git
cd Club-Website
npm install
```

### 2. Environment Configuration
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase connection parameters:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_TITLE="Drone & Robotics Club"
VITE_APP_DESCRIPTION="Official website for Drone & Robotics Club - ABES Engineering College"
VITE_APP_URL=http://localhost:5173
VITE_CONTACT_EMAIL=contact@droneandrobotics.club
```
*(Never commit `.env` or paste database service keys into client-side code.)*

### 3. Database Migration & Security Setup
To configure the PostgreSQL schema and security policies:
👉 **Follow the step-by-step instructions in [SETUP_ORDER.md](./SETUP_ORDER.md).**

---

## 👤 Creating the First Super Administrator

1. Open your **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add user** -> **Create user** and enter your administrative email and password.
3. Copy the generated **User UID (UUID)**.
4. In the **SQL Editor**, run:
```sql
INSERT INTO public.admin_users (auth_user_id, name, email, role, is_active)
VALUES (
    'YOUR_COPIED_USER_UID_HERE'::uuid,
    'Super Administrator',
    'your-admin-email@abes.ac.in',
    'super_admin',
    true
)
ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    role = 'super_admin',
    is_active = true;
```

---

## 💻 Local Development

Run the Vite local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`. Access the Admin Portal at `http://localhost:5173/admin`.

To check code quality and build:
```bash
npm run lint
npm run build
```

---

## 🚢 Vercel & Render Deployment

### Vercel
1. Push your repository branch to GitHub (`git push origin main`).
2. In your [Vercel Dashboard](https://vercel.com/dashboard), import the repository.
3. Configure the **Environment Variables** in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_TITLE`
   - `VITE_APP_DESCRIPTION`
   - `VITE_APP_URL`
   - `VITE_CONTACT_EMAIL`
4. Deploy. Vercel automatically applies the rewrites and security response headers defined in [`vercel.json`](./vercel.json).

### Render
1. Push your repository branch to GitHub (`git push origin main`).
2. In your [Render Dashboard](https://dashboard.render.com/), choose either:
   - **Option A (Blueprint / Automatic)**: Click **New +** -> **Blueprint**, and select this repository. Render will automatically read [`render.yaml`](./render.yaml), configuring the build command (`npm run build`), publish directory (`dist`), SPA rewrite rules (`/*` -> `/index.html`), and security headers.
   - **Option B (Static Site)**: Click **New +** -> **Static Site**, connect your repo, set Build Command to `npm run build` and Publish Directory to `dist`. In **Redirects/Rewrites**, add a rewrite: Source `/*` -> Destination `/index.html` (Action: `Rewrite`).
3. Under **Environment Variables**, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Subsequent pushes to `main` will automatically trigger fresh builds.
