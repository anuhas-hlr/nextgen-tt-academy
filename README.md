# NextGen Table Tennis Academy

> A professional, full-stack, mobile-first website and booking management system for **NextGen Table Tennis Academy**, owned and operated by professional table tennis coach **Chanul Dulsen** (Sri Lanka National No. 1, Coach at Horizon College).

---

## 🏓 Project Overview

NextGen Table Tennis Academy operates a private facility in Colombo featuring:
- **Exactly ONE official Table Tennis table**: All sessions (Personal Coaching, Group Sessions, and Table Rental) occupy this single table. No overlapping bookings are permitted.
- **Exactly ONE Pool table**: Complimentarily accessible to players and their accompanying guardians during their booked court slot.
- **Physical In-Person Payments**: Players pay at the academy desk via Cash or Direct Bank Transfer. Unpaid bookings are strictly omitted from collected revenue ledgers.
- **Strict Concurrency Guards**: PostgreSQL `btree_gist` exclusion constraint prevents double-booking at the database engine level.

---

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Database & Authentication**: Supabase PostgreSQL with Row Level Security (RLS) & Auth
- **Timezone**: All date-time computations pinned to `Asia/Colombo` (UTC+05:30)
- **Deployment Target**: Vercel

---

## 🚀 Live Routes

### Public Experience
- **`/`**: Academy Homepage (Hero, coach highlights, programs, facilities, why choose NextGen, gallery preview).
- **`/about`**: Academy mission, single competition table court overview, pool table access benefit.
- **`/coach`**: Verified profile of Head Coach Chanul Dulsen (Sri Lanka National No. 1, Horizon College coach).
- **`/programs`**: Personal Coaching (1-on-1), Group Squad Coaching, and Table-Only Rental.
- **`/booking`**: Live 4-step booking wizard with real-time slot checking, duration limits, and auto-fill for logged-in players.
- **`/booking/confirmation`**: Post-submission confirmation showing unique booking reference (e.g. `NGTT-YYYYMMDD-XXXX`), status reminder, and WhatsApp notification button.
- **`/booking/status`**: Self-service lookup tool where players can enter their Reference Code or Email to check whether their booking has been approved.
- **`/gallery`**: Academy photographs and training drills gallery.
- **`/contact`**: Academy location, Google Maps directions, WhatsApp chat, and inquiry form.
- **`/login`**: Universal portal with role-based routing (Admin $\rightarrow$ Dashboard, Player $\rightarrow$ Booking/Status) and New Player Registration.

### Admin Console (Coach Chanul Dulsen)
- **`/admin/login`**: Direct admin authentication portal.
- **`/admin/dashboard`**: Live KPI summary cards (Today's Bookings, Pending Requests, Confirmed Sessions, Total Players, Today's Collected Revenue) and upcoming sessions table with 1-click Approve/Reject.
- **`/admin/dashboard/bookings`**: Complete booking management with multi-criteria search, date/status/type filters, slide-over drawer, reschedule modal with conflict verification, cancel, complete, and payment status toggle.
- **`/admin/dashboard/calendar`**: Visual timetable (07:00 – 21:00) with Day, Week, and Month views color-coded by service type.
- **`/admin/dashboard/players`**: Athlete directory with search, skill levels, guardian contacts, previous sessions, and Chanul's internal coach development notes.
- **`/admin/dashboard/payments`**: Transaction ledger of cash and bank transfer receipts, recording physical desk collections.
- **`/admin/dashboard/settings`**: Dynamic academy settings for hourly prices (Personal, Group, Table Rental), weekly opening hours, booking duration bounds, complimentary pool table policy, and tournament/holiday blocked slots.

---

## 🔒 Security & Concurrency Highlights

1. **Single-Table Exclusion Constraint**:
   ```sql
   CONSTRAINT no_overlapping_table_bookings
   EXCLUDE USING gist (
     booking_date WITH =,
     tstzrange(
       ((booking_date + start_time) AT TIME ZONE 'Asia/Colombo'),
       ((booking_date + end_time) AT TIME ZONE 'Asia/Colombo')
     ) WITH &&
   )
   WHERE (status IN ('pending', 'confirmed'))
   ```
2. **Server-Side Validation**: Zod schema validation sanitizes duration, phone patterns, and enum inputs.
3. **Data Privacy**: Anonymous users can only insert bookings and read public slots via security-definer RPC (`get_booked_time_slots`), preventing customer data leaks.
4. **Audit Trail**: Sensitive admin mutations (approving, rejecting, rescheduling, updating pricing) are automatically logged in `admin_activity_logs`.

---

## 🏃 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & 24)
- npm or pnpm
- Supabase project

### 2. Installation
```bash
git clone <repository-url>
cd nextgen-tt-academy
npm install
```

### 3. Environment Configuration
Create `.env.local` based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Optional: Transactional Email via Resend
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=NextGen TT Academy <bookings@nextgentt.lk>
```

### 4. Database Setup
1. In your Supabase Dashboard SQL Editor, run `supabase/migrations/20260401000000_complete_nextgen_schema.sql`.
2. Run `supabase/migrations/20260402000000_booking_engine_functions.sql`.
3. Run `supabase/seed.sql` to populate default rates, operating hours, and academy policies.

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
