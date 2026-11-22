# NextGen Table Tennis Academy - Production Deployment & Operations Guide

This document describes the step-by-step procedure for deploying the **NextGen Table Tennis Academy** platform to production on **Vercel** with **Supabase**, and provisioning administrator accounts.

---

## 1. Supabase Production Setup

### A. Create Project & Run Migrations
1. Create a new Supabase project (select Region: **Singapore** or **Mumbai** for lowest latency to Sri Lanka).
2. In the Supabase **SQL Editor**, execute the migration files in this exact order:
   - `supabase/migrations/20260401000000_complete_nextgen_schema.sql` (Creates all 11 tables, RLS policies, indexes, and `btree_gist` constraint)
   - `supabase/migrations/20260402000000_booking_engine_functions.sql` (Creates RPC functions `get_booked_time_slots` and `get_booking_by_reference`)
   - `supabase/seed.sql` (Seeds initial service rates, weekly operating hours, and academy policies)

### B. Enable btree_gist Extension
The migration automatically executes:
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
```
Verify under **Database** $\rightarrow$ **Extensions** that `btree_gist` is marked active.

---

## 2. Administrator Account Provisioning

To grant Coach Chanul Dulsen administrative rights:

### Step 1: Create the User in Supabase Auth
In **Authentication** $\rightarrow$ **Users** in the Supabase Dashboard:
1. Click **Add User** $\rightarrow$ **Create User**.
2. Enter Coach Chanul's email (e.g. `chanul@nextgentt.lk` or client-provided email).
3. Set a strong password.
4. Toggle **Auto Confirm User?** to **Yes**.

### Step 2: Elevate Role to Admin in Profiles
In the **SQL Editor**, run:
```sql
UPDATE public.profiles
SET role = 'admin',
    full_name = 'Chanul Dulsen'
WHERE email = 'chanul@nextgentt.lk';
```
Verify the record:
```sql
SELECT id, email, full_name, role FROM public.profiles WHERE role = 'admin';
```
*(Only accounts with `role = 'admin'` can access `/admin/dashboard` and execute admin server actions).*

---

## 3. Vercel Production Deployment

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "NextGen TT Academy production release"
git remote add origin https://github.com/your-username/nextgen-tt-academy.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import the `nextgen-tt-academy` repository.
3. Framework Preset: **Next.js** (detected automatically).
4. Build Command: `next build`
5. Output Directory: `.next`

### Step 3: Configure Environment Variables
In the Vercel project configuration, add the following Environment Variables:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://twmxgvfrzximznsmlglt.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon API Key | `sb_publishable_...` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public Anon API Key | `sb_publishable_...` |
| `NEXT_PUBLIC_APP_URL` | Canonical Production URL | `https://nextgentt.lk` |
| `RESEND_API_KEY` | Resend API key for emails | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Verified sender address | `NextGen TT Academy <bookings@nextgentt.lk>` |
| `CRON_SECRET` | Secret token for expiry cron | `super_secret_cron_string_32_chars` |

Click **Deploy**.

---

## 4. Automated Pending Expiry Cron (Optional)

To enable automatic release of table slots when pending requests are abandoned past the expiry window (default 60 minutes):
In `vercel.json` (or via Vercel Cron Jobs dashboard):
```json
{
  "crons": [
    {
      "path": "/api/cron/expire-pending",
      "schedule": "*/15 * * * *"
    }
  ]
}
```
This pings `/api/cron/expire-pending` every 15 minutes to safely release unconfirmed reservations.

---

## 5. Post-Deployment Verification Checklist

- [ ] Open homepage: Verify hero section, coach achievements, and Google Maps location link.
- [ ] Submit a public test booking on `/booking`: Verify price snapshot and pending reference code generation.
- [ ] Query booking on `/booking/status`: Verify status card displays `Pending Coach Review`.
- [ ] Attempt double-booking the same slot on another tab: Verify that the system blocks the conflicting request.
- [ ] Log in as Coach Chanul on `/login`: Verify redirect to `/admin/dashboard`.
- [ ] Approve the booking in Admin: Verify status changes to `Confirmed` and confirmation email is logged/dispatched.
- [ ] Re-query `/booking/status`: Verify status updates to `Confirmed`.
- [ ] Record offline payment in Admin: Verify collected revenue counter increments only for paid transactions.
