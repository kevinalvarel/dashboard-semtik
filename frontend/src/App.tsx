import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/(auth)/login";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/(dashboard)/overview";
import AnalyticsPage from "./pages/(dashboard)/analytics";
import ParticipantsPage from "./pages/(dashboard)/participants";
import ExportPage from "./pages/(dashboard)/export";
import ScanQRPage from "./pages/(dashboard)/scan-qr";
import HistoryPage from "./pages/(dashboard)/history";
import AllAttendancePage from "./pages/(dashboard)/all-attendance";
import AdminPage from "./pages/(dashboard)/admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        {/* Main Dashboard */}
        <Route path="/overview" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        {/* Peserta */}
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/export" element={<ExportPage />} />
        {/* Absensi */}
        <Route path="/scan-qr" element={<ScanQRPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/all-attendance" element={<AllAttendancePage />} />
        {/* Pengaturan */}
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
