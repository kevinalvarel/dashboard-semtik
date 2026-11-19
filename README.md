# SEMTIK 2026 Admin Portal (Atmin Semtik)

Welcome to the **SEMTIK 2026 Admin Portal** (Seminar Nasional Teknologi Informasi dan Komputer). This project is designed to manage event participants (students & MSMEs/UMKM), monitor attendee check-ins in real-time, scan QR codes using camera and manual fallback, send QR tickets via email, and track overall event analytics.

The repository is structured as a monorepo consisting of:

- [frontend/](file:///c:/Users/Administrator/Desktop/Projects/dashboard-semtik/frontend) — A modern React SPA with Vite, Tailwind CSS v4, Shadcn UI, and TanStack Query.
- [backend/](file:///c:/Users/Administrator/Desktop/Projects/dashboard-semtik/backend) — A high-performance Golang REST API server built with Gin, GORM, and Neon PostgreSQL.

---

## 🛠️ Tech Stack & Dependencies

### Frontend

- **Core**: React 19, TypeScript, Vite 8, React Router v7
- **State & Data Fetching**: `@tanstack/react-query` v5
- **QR Code Scanning**: `@yudiel/react-qr-scanner` with custom Web Audio API feedback sounds
- **Styling**: Tailwind CSS v4, `@base-ui/react`, `tw-animate-css`
- **UI/UX**: Custom components built with `shadcn/ui` (under `@/components/ui`), Lucide React icons, and `sonner` toast notifications
- **Authentication**: `better-auth` client integration
- **Form Management**: React Hook Form with Zod schemas

### Backend

- **Core**: Go (Golang) 1.26+, Gin Web Framework (`github.com/gin-gonic/gin`)
- **Database & ORM**: GORM (`gorm.io/gorm`, `gorm.io/driver/postgres`) with PostgreSQL (Neon Serverless)
- **Authentication & Security**: Custom JWT auth (`github.com/golang-jwt/jwt/v5`), bcrypt (`golang.org/x/crypto/bcrypt`), compatible with `better-auth` session tokens & passwords
- **Email Service**: Resend Go SDK v4 (`github.com/resend/resend-go/v4`)
- **Configuration**: `godotenv` (`github.com/joho/godotenv`) for environment variables

---

## 📁 Repository Structure

Below are the main files and folders of interest:

```text
dashboard-semtik/
├── backend/                       # Golang REST API server
│   ├── attendance/                # Attendance and check-in handlers
│   │   ├── handler.go
│   │   └── handler_test.go
│   ├── auth/                      # Auth handlers, JWT token manager & password hashing
│   │   ├── auth_test.go
│   │   ├── handler.go
│   │   ├── jwt.go
│   │   └── password.go
│   ├── config/                    # Environment variable configurations
│   │   └── config.go
│   ├── database/                  # GORM database connection setup
│   │   └── database.go
│   ├── email/                     # Resend email handler (single & batch)
│   │   ├── handler.go
│   │   └── handler_test.go
│   ├── middleware/                # HTTP middlewares (CORS handler)
│   │   └── cors.go
│   ├── model/                     # GORM database models (Mahasiswa, UMKM, User, Account)
│   │   ├── peserta.go
│   │   └── user.go
│   ├── .env                       # Backend environment variables
│   ├── go.mod                     # Go module definitions
│   ├── go.sum                     # Go module checksums
│   └── main.go                    # Application entry point & router setup
├── frontend/                      # React application codebase
│   ├── src/
│   │   ├── api/                   # API client integrations
│   │   │   └── attendance.ts      # Attendance, scan, and email API calls
│   │   ├── components/            # Reusable UI component libraries
│   │   │   ├── layouts/           # Common layout elements (sidebar, layout shell)
│   │   │   ├── pages/             # Page-specific modular UI components
│   │   │   │   ├── all-attendance/# Table section, dialogs, banners
│   │   │   │   ├── overview/      # Analytics cards, stats, faculty distribution
│   │   │   │   └── scan-qr/       # Modular QR Scanner sub-components
│   │   │   │       ├── types.ts   # Shared types & Web Audio sound helper
│   │   │   │       └── ui/        # Header, Viewfinder, ManualInput, ResultCard, HistoryCard
│   │   │   └── ui/                # Base design system primitives (shadcn UI)
│   │   ├── hooks/                 # Custom React hooks (useAttendance, useMobile)
│   │   ├── lib/
│   │   │   ├── api.ts             # Fetch client with base URL & error handler
│   │   │   └── auth-client.ts     # Auth client helper
│   │   ├── pages/                 # Routing pages divided by layout groups
│   │   │   ├── (auth)/            # Auth routes (Login)
│   │   │   └── (dashboard)/       # Dashboard features
│   │   │       ├── overview/      # Main analytics dashboard
│   │   │       ├── scan-qr/       # Live QR Scanner page
│   │   │       ├── all-attendance/# All participants list table (Mahasiswa & UMKM)
│   │   │       └── admin/         # Admin management page
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

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18+ and `npm`
- **Go**: v1.26+

### 1. Install Dependencies

Install frontend and backend dependencies:

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
go mod download
```

### 2. Configure Environment Variables

Create `.env` files in both the `backend/` and `frontend/` directories:

**Backend (`backend/.env`)**:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
JWT_SECRET=your_jwt_secret_or_better_auth_secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM=SEMTIK Admin <admin@semtik.id>
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run in Development Mode

You can run both servers concurrently from the project root:

```bash
npm run dev
```

Or run them in separate terminals:

**Terminal 1 (Backend - Go)**:
```bash
cd backend
go run .
```
> Server runs on `http://localhost:3000`

**Terminal 2 (Frontend - React + Vite)**:
```bash
cd frontend
npm run dev
```
> Client runs on `http://localhost:5173`

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Payload / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/sign-in/email` | Admin sign-in | `{ "email": "...", "password": "..." }` |
| `POST` | `/api/auth/sign-up/email` | Admin registration | `{ "name": "...", "email": "...", "password": "..." }` |
| `GET` / `POST` | `/api/auth/get-session` | Get current active session | Bearer token / Session cookie |
| `POST` | `/api/auth/sign-out` | Sign out and invalidate session cookie | Optional token |

### Attendance & Check-in (`/api`)
| Method | Endpoint | Description | Payload / Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance` | Fetch all participants (`mahasiswa` & `umkm`) | Protected (Bearer / Cookie) |
| `POST` | `/api/attendance/scan` | Scan QR code & check-in participant | `{ "qrCode": "..." }` (Protected) |
| `POST` | `/api/attendance/check-in` | Alias endpoint for QR code check-in | `{ "token": "..." }` (Protected) |

### Email Delivery (`/api/emails`)
| Method | Endpoint | Description | Payload / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/emails/send` | Send QR ticket email to a single participant | `{ "email": "...", "qrCode": "..." }` (Protected) |
| `POST` | `/api/emails/send-all` | Batch send QR ticket emails to all unsent participants | Protected (Bearer / Cookie) |

### User Profile & Overview (`/api`)
| Method | Endpoint | Description | Payload / Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/overview` | Fetch user session overview | Protected (Bearer / Cookie) |
| `GET` | `/api/profile` | Fetch detailed user and session profile | Protected (Bearer / Cookie) |

---

## 🌟 Key Application Features

### 1. Dual Participant Support (Mahasiswa & UMKM)
- **Mahasiswa**: Includes NIM, Nama, Email, Universitas, Fakultas, Program Studi, QR Code, attendance status, and ticket email delivery status.
- **UMKM**: Includes Nama, Email, Bidang Usaha, Kota, QR Code, and attendance status.
- Both participant categories are seamlessly unified in dashboard listings and verified upon QR scanning.

### 2. Live QR Code Scanner & Check-in
- **Location**: [scan-qr/index.tsx](file:///c:/Users/Administrator/Desktop/Projects/dashboard-semtik/frontend/src/pages/(dashboard)/scan-qr/index.tsx) & `@/components/pages/scan-qr`
- **Features**:
  - **Live Camera Scanner**: Viewfinder with animated laser overlay line and corner markers using `@yudiel/react-qr-scanner`.
  - **Camera Controls**: Instant camera toggle (On/Off) and camera switcher (Environment/User camera).
  - **Web Audio Sound Effects**: Custom beep audio feedback (success, warning, and error tones).
  - **Scan Cooldown**: Built-in cooldown mechanism preventing accidental duplicate scans.
  - **Manual Code Input**: Fallback tab for typing or testing QR tokens manually.
  - **Instant Feedback Card**: Visual status card (`200 OK` Emerald, `409 Conflict` Amber, `404` Red) displaying attendee profile details (Nama, NIM/Bidang, Universitas, Fakultas/Kota, Prodi, Email, & Check-in timestamp).
  - **Session History List**: Real-time log of scanned attendance records in the current browser session.

### 3. Dashboard Overview & Analytics
- **Location**: [overview/index.tsx](file:///c:/Users/Administrator/Desktop/Projects/dashboard-semtik/frontend/src/pages/(dashboard)/overview/index.tsx)
- **Widgets**:
  - **Real-Time Attendance Stats**: Total registered attendees, checked-in count, pending attendees, and percentage progress indicator.
  - **Interactive Participant Table**: Search filter by Name, NIM, Universitas, Faculty, and Program of Study. Filter tabs for *Semua*, *Hadir*, and *Belum Hadir*.
  - **Distribution Charts**: Top faculties attendee breakdown.
  - **Participant Profile Dialog**: Inspect individual participant records, university, program of study, and exact check-in timestamps.

### 4. Ticket Email Automation (Resend v4)
- **Location**: [all-attendance/index.tsx](file:///c:/Users/Administrator/Desktop/Projects/dashboard-semtik/frontend/src/pages/(dashboard)/all-attendance/index.tsx)
- Powered by official `resend-go/v4` SDK.
- Single ticket send or one-click batch delivery to all unsent participants with automated chunking (100 emails/batch).
- Direct delivery from verified `admin@semtik.id` with embedded custom QR code.
