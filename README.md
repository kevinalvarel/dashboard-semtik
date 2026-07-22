# SEMTIK 2026 Admin Portal (Atmin Semtik)

Welcome to the **SEMTIK 2026 Admin Portal** (Seminar Nasional Teknologi Informasi dan Komputer). This project is designed to manage event participants, monitor attendee check-ins in real-time, scan QR codes, export data, and track overall analytics.

The repository is structured as a monorepo consisting of:

- [frontend/](/admin-semtik/frontend) — A modern React SPA.
- [backend/](admin-semtik/backend) — A TypeScript Express server.

---

## 🛠️ Tech Stack & Dependencies

### Frontend

- **Core**: React 19, TypeScript, Vite 8, React Router v7
- **Styling**: Tailwind CSS v4, `@base-ui/react` (unstyled components), `tw-animate-css`
- **UI/UX**: Custom components built with `shadcn/ui` (under `@/components/ui`), Lucide React icons, and Sonner toast notifications
- **Form Management**: React Hook Form with Zod schemas

### Backend

- **Core**: Express v5, TypeScript
- **Execution**: `tsx` (TypeScript Execute) for fast live-reloads during development

---

## 📁 Repository Structure

Below are the main files and folders of interest:

```text
admin-semtik/
├── backend/                       # Express server codebase
│   ├── src/
│   │   └── server.ts              # Entry point of the Express server
│   ├── package.json               # Backend dependencies and scripts
│   └── tsconfig.json
├── frontend/                      # React application codebase
│   ├── src/
│   │   ├── App.tsx                # Main router configuration
│   │   ├── main.tsx               # Client entry point
│   │   ├── index.css              # Global styles (Tailwind CSS v4)
│   │   ├── components/            # Reusable UI component libraries
│   │   │   ├── layouts/           # Common layout elements (sidebar, login form)
│   │   │   └── ui/                # Base design system primitives (shadcn UI)
│   │   ├── data/
│   │   │   └── attendance.json    # Local mockup database for event attendance
│   │   └── pages/                 # Routing Pages divided by layout groups
│   │       ├── (auth)/            # Auth routes (Login)
│   │       └── (dashboard)/       # Dashboard features (Overview, Scan, Admin)
│   ├── package.json               # Frontend dependencies and scripts
│   └── vite.config.ts             # Vite build & plugin configurations
├── package.json                   # Root package manager orchestrator
└── README.md                      # General documentation
```

---

## 🚀 Getting Started

To install dependencies and run the application locally, follow these steps:

### 1. Install Dependencies

You can install dependencies at the root directory to bootstrap both directories:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Run in Development Mode

Use the orchestrated script at the root [package.json](file:///c:/Users/Administrator/Desktop/Project/admin-semtik/package.json) to start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend Dev Server**: Runs on `http://localhost:5173/` (Vite)
- **Backend Server**: Runs on `http://localhost:3000` (Express)

### 3. Isolated Start Commands

If you wish to run only one of the services:

- **Backend only**: `npm run dev:backend`
- **Frontend only**: `npm run dev:frontend`

---

## 🌟 Key Application Features

### 1. Authentication

- **Location**: [login/index.tsx](<file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/pages/(auth)/login/index.tsx>) utilizing [login-form.tsx](file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/components/layouts/login-form.tsx)
- **Role**: Simple administration login layout requesting credentials before accessing the dashboard environment.

### 2. Dashboard Overview

- **Location**: [overview/index.tsx](<file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/pages/(dashboard)/overview/index.tsx>)
- **Widgets**:
  - **Total Registration**: 250 registered attendees.
  - **Attended**: 198 successful check-ins.
  - **Pending (Belum Hadir)**: 52 waiting check-ins.
  - **Attendance Rate**: Responsive visual progress indicator showing a `79.2%` attendance rate.
  - **Interactive Participant Table**: Search filter matching Names, NIM, University, and Program of Study. Tabs to swap between _Semua_ (All), _Hadir_ (Attended), and _Belum Hadir_ (Pending) status.
  - **Distribution Bar**: Displays top 5 universities distribution (e.g. _Universitas Al-Khairiyah_, _Universitas Sultan Ageng Tirtayasa_, etc.).
  - **Participant Detail Modal**: Clicking a participant reveals detail cards with complete profile parameters (Email, NIM, Faculty, Major, and precise Check-in time).

### 3. Sidebar Navigation Layout

- **Location**: [app-sidebar.tsx](file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/components/layouts/app-sidebar.tsx) and [DashboardLayout.tsx](file:///c:/Users/Administrator/Desktop/Project/admin-semtik/frontend/src/layouts/DashboardLayout.tsx)
- Provides structured routing categories:
  - **Dashboard**: Overview, Analytics
  - **Peserta (Participants)**: Daftar Peserta, Export Data
  - **Absensi (Attendance)**: Scan QR, Riwayat Absensi, Semua Kehadiran
  - **Pengaturan (Settings)**: Admin settings
