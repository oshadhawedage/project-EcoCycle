import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';

import AdminRegister from './pages/auth/admin/AdminRegister';
import AdminLogin from './pages/auth/admin/AdminLogin';
import AdminVerifyEmail from './pages/auth/admin/AdminVerifyEmail';
import AdminForgotPassword from './pages/auth/admin/AdminForgotPassword';

// Dashboard & Pages
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import ImpactLogs from './pages/analytics/ImpactLogs';
import ImpactSettings from './pages/analytics/ImpactSettings';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import RecyclerLayout from './components/layout/RecyclerLayout';

// E-Waste Pages
import EwasteList from "./pages/ewaste/EwasteList";
import CreateEwaste from "./pages/ewaste/CreateEwaste";

// Other Pages
import RecyclerPickupsPage from "./pages/pickups/RecyclerPickupsPage"; // recycler


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= USER AUTH ROUTES ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= ADMIN AUTH ROUTES ================= */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/verify-email" element={<AdminVerifyEmail />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

        {/* ================= ADMIN DASHBOARD ROUTES ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AnalyticsDashboard />} />
          <Route path="/admin/logs" element={<ImpactLogs />} />
          <Route path="/admin/settings" element={<ImpactSettings />} />
          <Route path="/admin/ewaste" element={<EwasteList />} />
        </Route>

        {/* ================= USER DASHBOARD ROUTES ================= */}
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<div>User Dashboard</div>} />
          <Route path="/user/ewaste" element={<EwasteList />} />
          <Route path="/user/ewaste/create" element={<CreateEwaste />} />
        </Route>

        {/* ================= RECYCLER DASHBOARD ROUTES ================= */}
        <Route element={<RecyclerLayout />}>
          <Route path="/recycler/dashboard" element={<div>Recycler Dashboard</div>} />
          <Route path="/pickups" element={<RecyclerPickupsPage />} />
          <Route path="/pickups/accepted" element={<RecyclerPickupsPage mode="accepted" />}/>
          <Route path="/recycler/ewaste" element={<EwasteList />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;