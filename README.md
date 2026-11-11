# NextGen Table Tennis Academy 🏓

Modern, high-performance web platform and booking management engine for NextGen Table Tennis Academy. Built with Next.js 15, Tailwind CSS, TypeScript, and Supabase.

## Features
- **Public Portal**: Showcase coaches, elite training programs, academy facilities, and responsive contact channels.
- **Booking Engine**: Multi-step interactive session scheduling, slot availability checks, real-time validations, and booking confirmations.
- **Admin Dashboard**: Secure management portal with session KPIs, active reservations, player directories, calendar management, and academy settings (operating hours & rates).
- **Timezone Aware**: Formatted for `Asia/Colombo` standard times.
- **Supabase Backend**: Role-based access control (RLS), automated triggers, and PostgreSQL database migrations.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.
