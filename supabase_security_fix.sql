-- ============================================================================
-- DRONE & ROBOTICS CLUB (ABES EC) - SUPABASE SECURITY HARDENING SCRIPT
-- File: supabase_security_fix.sql
-- Idempotent & Re-runnable: Safe to execute multiple times
-- ============================================================================

-- ============================================================================
-- PART 0: PREFLIGHT AUDIT QUERIES (RUN THESE FIRST IN SQL EDITOR TO REVIEW DATA)
-- ============================================================================
/*
-- 0.1 Check existing recruitment cycles:
SELECT id, title, is_active, deadline, created_at, updated_at
FROM public.recruitment_cycles
ORDER BY created_at DESC;

-- 0.2 Find duplicate rows in event_registrations (event_id, lower(email)):
SELECT event_id, lower(email) AS email_lower, COUNT(*) AS duplicate_count
FROM public.event_registrations
GROUP BY event_id, lower(email)
HAVING COUNT(*) > 1;

-- 0.3 Find duplicate rows in applications (lower(email), cycle_id):
SELECT lower(email) AS email_lower, cycle_id, COUNT(*) AS duplicate_count
FROM public.applications
GROUP BY lower(email), cycle_id
HAVING COUNT(*) > 1;

-- 0.4 Review existing RLS policies currently active across the 9 core tables:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'domains', 'projects', 'events', 'event_registrations',
    'members', 'recruitment_cycles', 'applications', 'announcements', 'admin_users'
  )
ORDER BY tablename, policyname;

-- 0.5 Check for existing rows that would violate the proposed CHECK constraints:
-- Applications checks:
SELECT id, name, email, student_id, reason
FROM public.applications
WHERE length(trim(name)) < 2 OR length(trim(name)) > 100
   OR length(trim(student_id)) < 2 OR length(trim(student_id)) > 50
   OR length(trim(reason)) < 5 OR length(trim(reason)) > 5000;

-- Event Registrations checks:
SELECT id, full_name, email, phone, roll_no, team_size
FROM public.event_registrations
WHERE length(trim(full_name)) < 2 OR length(trim(full_name)) > 100
   OR length(trim(phone)) < 7 OR length(trim(phone)) > 25
   OR length(trim(roll_no)) < 2 OR length(trim(roll_no)) > 50
   OR team_size < 1 OR team_size > 20;
*/

-- ============================================================================
-- PART 1: OPTIONAL PRE-CLEANUP / DEDUPLICATION (IF PREFLIGHT REPORTED DUPLICATES)
-- ============================================================================
/*
-- If Query 0.2 found duplicate event registrations, run this query BEFORE creating
-- the unique index. It preserves the oldest record (earliest created_at) and deletes newer duplicates:
DELETE FROM public.event_registrations
WHERE id NOT IN (
    SELECT DISTINCT ON (event_id, lower(email)) id
    FROM public.event_registrations
    ORDER BY event_id, lower(email), created_at ASC
);
*/

-- Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 2: UNIQUE INDEXES & SEED PREREQUISITES
-- ============================================================================

-- Ensure unique index on event_registrations (one registration per event per email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_event_registration
    ON public.event_registrations (event_id, lower(email));

-- Ensure unique index on applications (one application per cycle per email)
CREATE UNIQUE INDEX IF NOT EXISTS unique_application_email_per_cycle 
    ON public.applications (lower(email), cycle_id);

-- Ensure default recruitment cycle exists so applications INSERT policy never fails
-- NOTE: Please update the deadline date below to match your real recruitment schedule:
INSERT INTO public.recruitment_cycles (id, title, subtitle, target_years, is_active, deadline, instructions)
VALUES (
    'cycle-2026-2027',
    'Recruitment Drive 2026-2027',
    'Join the premier drone and robotics engineering club at ABES EC.',
    '1st & 2nd Year B.Tech Students',
    true,
    '2026-12-31'::date, -- << PLEASE EDIT THIS DEADLINE AS NEEDED
    'Please fill out your authentic academic and interest details. You may only apply once per recruitment cycle with your primary college email.'
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- PART 3: CLIENT-ALIGNED CHECK CONSTRAINTS (NOT VALID for instant non-blocking safety)
-- ============================================================================

-- Applications Constraints
DO $$ 
BEGIN
    ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS chk_app_name_len;
    ALTER TABLE public.applications ADD CONSTRAINT chk_app_name_len 
        CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100) NOT VALID;

    ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS chk_app_student_id_len;
    ALTER TABLE public.applications ADD CONSTRAINT chk_app_student_id_len 
        CHECK (length(trim(student_id)) >= 2 AND length(trim(student_id)) <= 50) NOT VALID;

    ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS chk_app_reason_len;
    ALTER TABLE public.applications ADD CONSTRAINT chk_app_reason_len 
        CHECK (length(trim(reason)) >= 5 AND length(trim(reason)) <= 5000) NOT VALID;
END $$;

-- Event Registrations Constraints
DO $$ 
BEGIN
    ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS chk_reg_name_len;
    ALTER TABLE public.event_registrations ADD CONSTRAINT chk_reg_name_len 
        CHECK (length(trim(full_name)) >= 2 AND length(trim(full_name)) <= 100) NOT VALID;

    ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS chk_reg_phone_len;
    ALTER TABLE public.event_registrations ADD CONSTRAINT chk_reg_phone_len 
        CHECK (length(trim(phone)) >= 7 AND length(trim(phone)) <= 25) NOT VALID;

    ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS chk_reg_roll_len;
    ALTER TABLE public.event_registrations ADD CONSTRAINT chk_reg_roll_len 
        CHECK (length(trim(roll_no)) >= 2 AND length(trim(roll_no)) <= 50) NOT VALID;

    ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS chk_reg_team_size;
    ALTER TABLE public.event_registrations ADD CONSTRAINT chk_reg_team_size 
        CHECK (team_size >= 1 AND team_size <= 20) NOT VALID;
END $$;


-- ============================================================================
-- PART 4: SECURITY DEFINER FUNCTIONS FOR ROLE LOOKUP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_users
  WHERE auth_user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid()
      AND is_active = true
  );
$$;


-- ============================================================================
-- PART 5: EXPLICIT DROP OF PREVIOUS POLICIES (Preserves unrelated custom policies)
-- ============================================================================

-- Drop schema.sql legacy public read policies
DROP POLICY IF EXISTS "Public Read Domains" ON public.domains;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Members" ON public.members;
DROP POLICY IF EXISTS "Public Read Recruitment Cycles" ON public.recruitment_cycles;
DROP POLICY IF EXISTS "Public Read Active Announcements" ON public.announcements;

-- Drop schema.sql legacy public insert policies
DROP POLICY IF EXISTS "Public Insert Applications" ON public.applications;
DROP POLICY IF EXISTS "Public Insert Event Registrations" ON public.event_registrations;

-- Drop schema.sql legacy full admin policies
DROP POLICY IF EXISTS "Admin Full Access Domains" ON public.domains;
DROP POLICY IF EXISTS "Admin Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Full Access Events" ON public.events;
DROP POLICY IF EXISTS "Admin Full Access Registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admin Full Access Members" ON public.members;
DROP POLICY IF EXISTS "Admin Full Access Recruitment Cycles" ON public.recruitment_cycles;
DROP POLICY IF EXISTS "Admin Full Access Applications" ON public.applications;
DROP POLICY IF EXISTS "Admin Full Access Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin Full Access Users" ON public.admin_users;

-- Drop previous iterations of role-based policies (for idempotent re-execution)
DROP POLICY IF EXISTS "rls_domains_select" ON public.domains;
DROP POLICY IF EXISTS "rls_domains_admin" ON public.domains;
DROP POLICY IF EXISTS "rls_projects_select" ON public.projects;
DROP POLICY IF EXISTS "rls_projects_admin" ON public.projects;
DROP POLICY IF EXISTS "rls_events_select" ON public.events;
DROP POLICY IF EXISTS "rls_events_admin" ON public.events;
DROP POLICY IF EXISTS "rls_registrations_insert" ON public.event_registrations;
DROP POLICY IF EXISTS "rls_registrations_admin" ON public.event_registrations;
DROP POLICY IF EXISTS "rls_members_select" ON public.members;
DROP POLICY IF EXISTS "rls_members_admin" ON public.members;
DROP POLICY IF EXISTS "rls_cycles_select" ON public.recruitment_cycles;
DROP POLICY IF EXISTS "rls_cycles_admin" ON public.recruitment_cycles;
DROP POLICY IF EXISTS "rls_applications_insert" ON public.applications;
DROP POLICY IF EXISTS "rls_applications_admin" ON public.applications;
DROP POLICY IF EXISTS "rls_announcements_select" ON public.announcements;
DROP POLICY IF EXISTS "rls_announcements_admin" ON public.announcements;
DROP POLICY IF EXISTS "rls_admin_users_select_self" ON public.admin_users;
DROP POLICY IF EXISTS "rls_admin_users_super_admin" ON public.admin_users;


-- ============================================================================
-- PART 6: NEW ROLE-BASED ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Ensure RLS is active on all 9 tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 6.1 DOMAINS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read domains
CREATE POLICY "rls_domains_select"
    ON public.domains FOR SELECT
    USING (true);

-- Admin: super_admin, domain_lead can manage domains
CREATE POLICY "rls_domains_admin"
    ON public.domains FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'domain_lead'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'domain_lead'));

-- ----------------------------------------------------------------------------
-- 6.2 PROJECTS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read projects
CREATE POLICY "rls_projects_select"
    ON public.projects FOR SELECT
    USING (true);

-- Admin: super_admin, domain_lead can manage projects
CREATE POLICY "rls_projects_admin"
    ON public.projects FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'domain_lead'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'domain_lead'));

-- ----------------------------------------------------------------------------
-- 6.3 EVENTS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read events
CREATE POLICY "rls_events_select"
    ON public.events FOR SELECT
    USING (true);

-- Admin: super_admin, event_manager can manage events
CREATE POLICY "rls_events_admin"
    ON public.events FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'event_manager'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'event_manager'));

-- ----------------------------------------------------------------------------
-- 6.4 EVENT REGISTRATIONS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anonymous users can insert registration ONLY if event exists, is open and not past
CREATE POLICY "rls_registrations_insert"
    ON public.event_registrations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id
              AND e.registration_open = true
              AND e.is_past = false
        )
    );

-- Admin: super_admin, event_manager can read, update, delete registrations
CREATE POLICY "rls_registrations_admin"
    ON public.event_registrations FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'event_manager'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'event_manager'));

-- ----------------------------------------------------------------------------
-- 6.5 MEMBERS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read team members
CREATE POLICY "rls_members_select"
    ON public.members FOR SELECT
    USING (true);

-- Admin: super_admin, social_media can manage members
CREATE POLICY "rls_members_admin"
    ON public.members FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'social_media'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'social_media'));

-- ----------------------------------------------------------------------------
-- 6.6 RECRUITMENT CYCLES TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read recruitment cycles (to see current cycle & deadlines)
CREATE POLICY "rls_cycles_select"
    ON public.recruitment_cycles FOR SELECT
    USING (true);

-- Admin: ONLY super_admin can configure recruitment cycles
CREATE POLICY "rls_cycles_admin"
    ON public.recruitment_cycles FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() = 'super_admin')
    WITH CHECK (public.get_current_admin_role() = 'super_admin');

-- ----------------------------------------------------------------------------
-- 6.7 APPLICATIONS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anonymous candidates can insert applications ONLY if cycle is active and not expired
CREATE POLICY "rls_applications_insert"
    ON public.applications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recruitment_cycles c
            WHERE c.id = cycle_id
              AND c.is_active = true
              AND (c.deadline IS NULL OR c.deadline >= CURRENT_DATE)
        )
    );

-- Admin: super_admin, domain_lead can read and update application reviews
CREATE POLICY "rls_applications_admin"
    ON public.applications FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'domain_lead'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'domain_lead'));

-- ----------------------------------------------------------------------------
-- 6.8 ANNOUNCEMENTS TABLE
-- ----------------------------------------------------------------------------
-- Public: Anyone can read active announcements
CREATE POLICY "rls_announcements_select"
    ON public.announcements FOR SELECT
    USING (is_active = true);

-- Admin: super_admin, social_media can manage announcements
CREATE POLICY "rls_announcements_admin"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('super_admin', 'social_media'))
    WITH CHECK (public.get_current_admin_role() IN ('super_admin', 'social_media'));

-- ----------------------------------------------------------------------------
-- 6.9 ADMIN USERS TABLE
-- ----------------------------------------------------------------------------
-- Authenticated users: Can read their own record to verify their admin role
CREATE POLICY "rls_admin_users_select_self"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

-- Super Admin: Full management of admin user accounts and roles
CREATE POLICY "rls_admin_users_super_admin"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() = 'super_admin')
    WITH CHECK (public.get_current_admin_role() = 'super_admin');


-- ============================================================================
-- PART 7: BOOTSTRAP INSTRUCTION FOR FIRST SUPER ADMIN (EXECUTE MANUALLY)
-- ============================================================================
/*
-- INSTRUCTIONS TO CREATE YOUR FIRST SUPER ADMIN:
-- 1. Open Supabase Dashboard -> Authentication -> Users.
-- 2. Click "Add user" -> "Create user", enter your email and a strong password.
-- 3. Copy the generated User UID (UUID).
-- 4. In the Supabase SQL Editor, run the statement below replacing the placeholders:

INSERT INTO public.admin_users (auth_user_id, name, email, role, is_active)
VALUES (
    'REPLACE_WITH_SUPABASE_AUTH_USER_UUID'::uuid,
    'Super Administrator',
    'admin@abes.ac.in',
    'super_admin',
    true
)
ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    role = 'super_admin',
    is_active = true;
*/
