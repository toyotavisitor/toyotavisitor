import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./pages/RequireAuth";
import MainPortal from "./pages/MainPortal";

/* ===== VISITOR ===== */
import VisitorLayout from "./pages/visitor/VisitorLayout";



/* ===== AUTH (GLOBAL) ===== */
import Signup from "./pages/SignUp";
import ForgotPage from "./pages/ForgotPage";

/* ===== EMPLOYEE ===== */
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeePage from "./pages/employee/EmployeePage";

/* ===== SECURITY ===== */
import SecurityLogin from "./pages/security/Login";
import Scanner from "./pages/security/Scanner";

/* ===== HOD ===== */
import HodLogin from "./pages/hod/Login";
import HodDashboard from "./pages/hod/Dashboard";

/* ===== ADMIN ===== */
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= VISITOR ================= */}
        <Route path="/visitor" element={<VisitorLayout />} />


        <Route path="/portal" element={<MainPortal />} />
        <Route path="/" element={<MainPortal />} />

        {/* ================= GLOBAL AUTH ================= */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPage />} />

        {/* ================= EMPLOYEE ================= */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route
          element={
            <RequireAuth
              allowedRoles={["employee"]}
              loginPath="/employee/login"
            />
          }
        >
          <Route path="/employee" element={<EmployeePage />} />
        </Route>

        {/* ================= SECURITY ================= */}
        <Route path="/security/login" element={<SecurityLogin />} />
        <Route
          element={
            <RequireAuth
              allowedRoles={["security"]}
              loginPath="/security/login"
            />
          }
        >
          <Route path="/security" element={<Scanner />} />
        </Route>

        {/* ================= HOD ================= */}
        <Route path="/hod/login" element={<HodLogin />} />
        <Route
          element={
            <RequireAuth
              allowedRoles={["hod"]}
              loginPath="/hod/login"
            />
          }
        >
          <Route path="/hod" element={<HodDashboard />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          element={
            <RequireAuth
              allowedRoles={["admin"]}
              loginPath="/admin/login"
            />
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-black text-red-400 font-bold">
              404 – Page Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
