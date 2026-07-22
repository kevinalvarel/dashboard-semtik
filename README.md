# SEMTIK 2026 Admin Portal (Atmin Semtik)

Welcome to the **SEMTIK 2026 Admin Portal** (Seminar Nasional Teknologi Informasi dan Komputer). This project is designed to manage event participants, monitor attendee check-ins in real-time, scan QR codes using camera and manual fallback, export data, and track overall analytics.

The repository is structured as a monorepo consisting of:

- [frontend/](/frontend) — A modern React SPA with Vite, Shadcn UI, and React Query.
- [backend/](/backend) — A TypeScript Express server powered by Drizzle ORM & Neon PostgreSQL.

---

## 🛠️ Tech Stack & Dependencies

### Frontend

- **Core**: React 19, TypeScript, Vite 8, React Router v7
- **State & Data Fetching**: `@tanstack/react-query` v5
- **QR Code Scanning**: `react-qr-scanner` with custom Web Audio API feedback sounds
- **Styling**: Tailwind CSS v4, `@base-ui/react`, `tw-animate-css`
- **UI/UX**: Custom components built with `shadcn/ui` (under `@/components/ui`), Lucide React icons, and `sonner` toast notifications
- **Authentication**: `better-auth` client integration
- **Form Management**: React Hook Form with Zod schemas

### Backend

- **Core**: Express v5, TypeScript
- **Database & ORM**: Drizzle ORM (`drizzle-orm`) with Neon Serverless Postgres (`@neondatabase/serverless`)
- **Authentication**: `better-auth` for node
- **Execution**: `tsx` (TypeScript Execute) for fast live-reloads during development

---

## 📁 Repository Structure

Below are the main files and folders of interest:

```text
admin-semtik/
├── backend/                       # Express server codebase
│   ├── src/
│   │   ├── controller/            # Request handlers
│   │   │   ├── attendance.controller.ts
│   │   │   └── checkin.controller.ts  # QR Code scan controller
│   │   ├── db/                    # Drizzle ORM database schemas & config
│   │   │   ├── attendance-schema.ts   # Peserta & attendance table schema
│   │   │   ├── auth-schema.ts         # User session & auth schema
│   │   │   └── drizzle.ts             # Drizzle client instance
│   │   ├── routes/                # Express API router definitions
│   │   │   └── attendance.route.ts    # GET / and POST /scan routes
│   │   ├── services/              # Business logic layer
│   │   │   ├── attendance.service.ts
│   │   │   └── checkin.service.ts     # QR validation & atomic check-in logic
│   │   ├── auth.ts                # Better-auth backend setup
│   │   ├── middleware.ts          # Auth authentication middleware
│   │   └── server.ts              # Entry point of the Express server
│   ├── package.json               # Backend dependencies and scripts
│   └── tsconfig.json
├── frontend/                      # React application codebase
│   ├── src/
│   │   ├── api/                   # API client integrations
│   │   │   └── attendance.ts      # getAttendance() & scanAttendance()
│   │   ├── components/            # Reusable UI component libraries
│   │   │   ├── layouts/           # Common layout elements (sidebar, login form)
│   │   │   ├── pages/             # Page-specific modular UI components
│   │   │   │   └── scan-qr/       # Modular QR Scanner sub-components
│   │   │   │       ├── types.ts   # Shared types & Web Audio sound helper
│   │   │   │       └── ui/        # Header, Viewfinder, ManualInput, ResultCard, HistoryCard
│   │   │   └── ui/                # Base design system primitives (shadcn UI)
│   │   ├── lib/
│   │   │   └── api.ts             # Fetch client with base URL & error handler
│   │   ├── pages/                 # Routing Pages divided by layout groups
│   │   │   ├── (auth)/            # Auth routes (Login)
│   │   │   └── (dashboard)/       # Dashboard features
│   │   │       ├── overview/      # Main analytics dashboard
│   │   │       ├── scan-qr/       # Live QR Scanner page
│   │   │       ├── all-attendance/# All participants list table
│   │   │       └── admin/         # Settings page
│   │   ├── types/                 # Custom TypeScript declaration files
│   │   ├── App.tsx                # Main router configuration
│   │   ├── main.tsx               # Client entry point
│   │   └── index.css              # Global styles (Tailwind CSS v4)
│   ├── package.json               # Frontend dependencies and scripts
│   └── vite.config.ts             # Vite build & plugin configurations
├── package.json                   # Root package manager orchestrator
└── README.md                      # General documentation
```

---

## 🚀 Getting Started

To install dependencies and run the application locally, follow these steps:

### 1. Install Dependencies

You can install dependencies at the root directory to bootstrap both frontend and backend workspace packages:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Configure Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (`backend/.env`)**:
```env
DATABASE_URL=postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run in Development Mode

Use the orchestrated script at the root [package.json](file:///c:/Users/Administrator/Desktop/Project/admin-semtik/package.json) to start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend Dev Server**: Runs on `http://localhost:5173/` (Vite)
- **Backend API Server**: Runs on `http://localhost:3000` (Express API)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance` | Fetch all participants and attendance status | N/A |
| `POST` | `/api/attendance/scan` | Scan QR code & process real-time check-in | `{ "qrCode": "..." }` |
| `POST` | `/api/attendance/check-in` | Alias endpoint for QR code check-in | `{ "token": "..." }` |
| `GET` | `/api/overview` | Fetch user session overview | Requires auth cookie |

---

## 🌟 Key Application Features

### 1. Live QR Code Scanner & Check-in

- **Location**: [scan-qr/index.tsx](<file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/pages/(dashboard)/scan-qr/index.tsx>) & `@/components/pages/scan-qr`
- **Features**:
  - **Live Camera Scanner**: Viewfinder with animated laser overlay line and corner markers using `react-qr-scanner`.
  - **Camera Controls**: Instant camera toggle (On/Off) and camera switcher (Environment/User camera).
  - **Web Audio Sound Effects**: Custom beep audio feedback (success, warning, and error tones).
  - **2.5s Scan Cooldown**: Cooldown mechanism preventing duplicate scans for the same QR code.
  - **Manual Code Input**: Fallback tab for typing or testing QR codes manually.
  - **Instant Feedback Card**: Visual status card (`200 OK` Emerald, `409 Conflict` Amber, `404` Red) displaying attendee profile details (Nama, NIM, Fakultas, Prodi, Email, & Check-in timestamp).
  - **Session History List**: Real-time log of scanned attendance records in the current browser session.

### 2. Dashboard Overview

- **Location**: [overview/index.tsx](<file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/pages/(dashboard)/overview/index.tsx>)
- **Widgets**:
  - **Real-Time Attendance Stats**: Total registered attendees, checked-in count, pending attendees, and percentage progress indicator.
  - **Interactive Participant Table**: Search filter by Name, NIM, Faculty, and Program of Study. Filter tabs for *Semua*, *Hadir*, and *Belum Hadir*.
  - **Distribution Charts**: Top universities and faculties attendee breakdown.
  - **Participant Profile Dialog**: Inspect individual participant records and exact check-in timestamps.

### 3. Authentication & Protected Routes

- **Location**: [login/index.tsx](<file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/pages/(auth)/login/index.tsx>)
- Powered by `better-auth` session cookies protecting dashboard routes (`/overview`, `/scan-qr`, `/all-attendance`, `/admin`).
