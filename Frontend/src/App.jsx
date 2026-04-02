import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import ImpactLogs from './pages/analytics/ImpactLogs';
import ImpactSettings from './pages/analytics/ImpactSettings';

import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import RecyclerLayout from './components/layout/RecyclerLayout';

import RecyclerPickupsPage from "./pages/pickups/RecyclerPickupsPage"; // recycler


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AnalyticsDashboard />} />
          <Route path="/admin/logs" element={<ImpactLogs />} />
          <Route path="/admin/settings" element={<ImpactSettings />} />

        </Route>

        <Route element={<UserLayout />}>
          <Route path="/user" element={<div>User Dashboard</div>} />
        </Route>

        <Route element={<RecyclerLayout />}>
          <Route path="/recycler" element={<div>Recycler Dashboard</div>} />
          
          {/* ✅ YOUR NEW PICKUP PAGE */}
          <Route path="/pickups" element={<RecyclerPickupsPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;