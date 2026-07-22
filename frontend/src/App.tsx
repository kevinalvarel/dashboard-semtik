import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/(auth)/login";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/(dashboard)/overview";
import ScanQRPage from "./pages/(dashboard)/scan-qr";
import AllAttendancePage from "./pages/(dashboard)/all-attendance";
import AdminPage from "./pages/(dashboard)/admin";

import { GuestRoute } from "./components/routes/guest-route";
import { ProtectedRoute } from "./components/routes/protected-route";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Main Dashboard */}
          <Route path="/overview" element={<DashboardPage />} />
          {/* Absensi */}
          <Route path="/scan-qr" element={<ScanQRPage />} />
          <Route path="/all-attendance" element={<AllAttendancePage />} />
          {/* Pengaturan */}
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
