# Supabase Security Hardening & Admin Migration Guide

Follow this exact step-by-step checklist to apply the security fix to your project. **Do not skip steps or change the order.**

---

### Step 1: Disable Public Sign-ups in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and navigate to your project.
2. Go to **Authentication** -> **Providers** -> **Email**.
3. **Turn OFF / Disable "Enable Sign-ups" (Allow new users to sign up)**.
4. Click **Save**.
   > *Why:* Only designated admins created by you should exist in Supabase Auth. Public visitors must never be able to create Auth accounts.

---

### Step 2: Create Your Admin User in Supabase Auth
1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **"Add user"** -> **"Create user"**.
3. Enter your administrative email (e.g., `admin@abes.ac.in`) and a secure password.
4. Set **Auto Confirm User?** to **Enabled (Checked)**.
5. Click **Create User**.
6. **Copy the User UID** (a UUID like `a1b2c3d4-e5f6-...`) of the newly created user. You will need this in Step 5.

---

### Step 3: Run the Preflight Queries and Fix Any Issues
1. Open the **SQL Editor** in your Supabase Dashboard.
2. Open `supabase_security_fix.sql` and copy the queries inside **PART 0 (PREFLIGHT AUDIT QUERIES)**.
3. Run each query and review the output:
   - **Recruitment cycles**: Verify that an active cycle exists.
   - **Duplicate event registrations**: If duplicates are reported, run the deduplication cleanup query in **PART 1** to remove duplicates before the unique index is applied.
   - **Duplicate applications**: Ensure no candidates have multiple applications under the same cycle.
   - **CHECK constraint violations**: Ensure existing rows won't be blocked.

---

### Step 4: Run `supabase_security_fix.sql`
1. In the Supabase **SQL Editor**, open a new query tab.
2. Paste the entire content of [`supabase_security_fix.sql`](./supabase_security_fix.sql).
3. Review the default recruitment deadline in **PART 2** (`2026-12-31`) and adjust if needed.
4. Click **Run** to execute the script.
5. Verify that all statements executed successfully with zero errors.

---

### Step 5: Insert Your First `super_admin` Row
1. In the Supabase **SQL Editor**, prepare the following query using the **User UID** you copied in Step 2:

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

2. Run the query.
3. Verify by running:
```sql
SELECT * FROM public.admin_users WHERE email = 'your-admin-email@abes.ac.in';
```
Confirm that `auth_user_id` matches your Supabase Auth UID and `role` is `super_admin`.

---

### Step 6: Test Locally with `npm run dev`
1. In your local terminal on the `security-fix` branch, start the Vite development server:
   ```powershell
   npm run dev
   ```
2. Navigate to `http://localhost:5173/admin`.
3. Log in with your email and password created in Step 2.
4. Verify:
   - Access to the Admin Console is granted.
   - Public forms (Events registration at `/events` and Recruitment application at `/join`) submit properly.
   - Anonymous users cannot directly query protected admin tables.

---

### Step 7: Remove Old Passkey Variables from Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) -> Select the **Drone & Robotics** project.
2. Go to **Settings** -> **Environment Variables**.
3. Delete any legacy passkey variables:
   - `VITE_FACULTY_PASSKEY`
   - `VITE_CLUBHEAD_PASSKEY`
   - `VITE_ADMIN_MASTER_KEY`
   - `VITE_ADMIN_PASSKEY`
   - `VITE_LEAD_PASSKEY`
   - `VITE_EVENTS_PASSKEY`
   - `VITE_MEDIA_PASSKEY`
4. Confirm that only genuine public configuration remains:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_TITLE`
   - `VITE_APP_DESCRIPTION`
   - `VITE_APP_URL`
   - `VITE_CONTACT_EMAIL`

---

### Step 8: Merge the Branch and Deploy
1. Once local testing succeeds, commit any remaining changes and merge `security-fix` into `main`:
   ```powershell
   git checkout main
   git merge security-fix
   git push origin main
   ```
2. Vercel will trigger a production deployment.
3. Test your live production URL at `/admin` to verify production authentication.

