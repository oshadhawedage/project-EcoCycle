// RecyclerDashboard.jsx
// Purpose:
// - Main dashboard for recyclers.
// - Shows pickup request counts (pending/accepted/collected/completed).
// - Loads recycler analytics (overview + monthly trend) and renders a chart.
// - Cards navigate to the corresponding pickups pages.
import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  CircleCheckBig,
  Truck,
  CheckCircle2,
  Leaf,
  BarChart3,
} from "lucide-react";
import {
  getAllPickupRequests,
  getAcceptedPickupRequests,
  getOverview,
  getMonthlyTrend,
} from "../../services/api";
import dashboardBanner from "../../assets/banners/banner6.png";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RecyclerDashboard = () => {
  const navigate = useNavigate();

  // Pickup request lists used for counts
  const [allRequests, setAllRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Analytics data (overview cards + chart)
  const [overview, setOverview] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Load pickup requests so we can calculate counts for the cards
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);

        const [allRes, acceptedRes] = await Promise.all([
          getAllPickupRequests(),
          getAcceptedPickupRequests(),
        ]);

        // Validation: ensure arrays
        const allData = Array.isArray(allRes?.data) ? allRes.data : [];
        const acceptedData = Array.isArray(acceptedRes?.data) ? acceptedRes.data : [];

        setAllRequests(allData);
        setAcceptedRequests(acceptedData);
      } catch (error) {
        console.error("Failed to load recycler dashboard stats:", error);
        setAllRequests([]);
        setAcceptedRequests([]);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Load analytics for the recycler impact section
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);

        const [overviewRes, trendRes] = await Promise.all([
          getOverview(),
          getMonthlyTrend(),
        ]);

        // Validation: overview must be object or null
        const overviewData =
          overviewRes?.data && typeof overviewRes.data === "object"
            ? overviewRes.data
            : null;

        // Validation: trend must be array
        const trendData = Array.isArray(trendRes?.data) ? trendRes.data : [];

        setOverview(overviewData);
        setMonthlyTrend(trendData);
      } catch (error) {
        console.error("Failed to load recycler analytics:", error);
        setOverview(null);
        setMonthlyTrend([]);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Helper to safely format numeric values for display
  const safeNumber = (value, digits = 1) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(digits) : Number(0).toFixed(digits);
  };

  // Calculate pickup counts by status
  const stats = useMemo(() => {
    const pendingCount = allRequests.filter(
      (item) => item?.status === "Pending"
    ).length;

    const acceptedCount = acceptedRequests.length;

    const collectedCount = allRequests.filter(
      (item) => item?.status === "Collected"
    ).length;

    const completedCount = allRequests.filter(
      (item) => item?.status === "Completed"
    ).length;

    return {
      pendingCount,
      acceptedCount,
      collectedCount,
      completedCount,
    };
  }, [allRequests, acceptedRequests]);

  // Validation: chart should only receive clean objects
  const safeMonthlyTrend = useMemo(() => {
    return Array.isArray(monthlyTrend)
      ? monthlyTrend.map((item) => ({
          month: String(item?.month || ""),
          weightKg: Number(item?.weightKg) || 0,
          co2SavedKg: Number(item?.co2SavedKg) || 0,
          actionsCount: Number(item?.actionsCount) || 0,
        }))
      : [];
  }, [monthlyTrend]);

  return (
    <main className="flex-1 bg-[#f5f7fb]">
      {/* ================= HERO SECTION ================= */}
      <section className="-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <img
          src={dashboardBanner}
          alt="Recycler dashboard banner"
          className="w-full h-auto block"
        />
      </section>

      <section className="max-w-[1400px] mx-auto py-10 space-y-8">
        {/* Top cards: quick navigation + status counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div
            onClick={() => navigate("/pickups")}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-[#4db848] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Requests</p>
                <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                  {loadingStats ? "..." : stats.pendingCount}
                </h3>
              </div>
              <ClipboardList className="w-10 h-10 text-[#0f55a7]" />
            </div>
          </div>

          <div
            onClick={() => navigate("/pickups/accepted")}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-[#4db848] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Accepted Requests</p>
                <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                  {loadingStats ? "..." : stats.acceptedCount}
                </h3>
              </div>
              <CircleCheckBig className="w-10 h-10 text-[#4db848]" />
            </div>
          </div>

          <div
            onClick={() => navigate("/pickups/collected")}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-[#4db848] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Collected</p>
                <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                  {loadingStats ? "..." : stats.collectedCount}
                </h3>
              </div>
              <Truck className="w-10 h-10 text-[#0f55a7]" />
            </div>
          </div>

          <div
            onClick={() => navigate("/pickups/completed")}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-[#4db848] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                  {loadingStats ? "..." : stats.completedCount}
                </h3>
              </div>
              <CheckCircle2 className="w-10 h-10 text-[#4db848]" />
            </div>
          </div>
        </div>

        {/* Info cards: short descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              All Requests
            </h3>
            <p className="text-sm text-slate-500">
              View every pickup request created by users.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Accepted Requests
            </h3>
            <p className="text-sm text-slate-500">
              Track requests already accepted by the recycler.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Processing
            </h3>
            <p className="text-sm text-slate-500">
              Continue the item flow after pickup and collection.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Reports
            </h3>
            <p className="text-sm text-slate-500">
              Review recycler activity and request performance.
            </p>
          </div>
        </div>

        {/* Analytics section header */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Recycler Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your recycling impact and recent monthly performance.
          </p>
        </div>

        {/* Analytics summary cards */}
        {loadingAnalytics ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-slate-500">
            Loading analytics...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Weight</p>
                  <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                    {safeNumber(overview?.totalWeightKg, 1)} kg
                  </h3>
                </div>
                <Leaf className="w-10 h-10 text-[#4db848]" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">CO2 Saved</p>
                  <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                    {safeNumber(overview?.totalCo2SavedKg, 1)} kg
                  </h3>
                </div>
                <BarChart3 className="w-10 h-10 text-[#0f55a7]" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">This Month</p>
                  <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                    {safeNumber(overview?.thisMonthWeightKg, 1)} kg
                  </h3>
                </div>
                <Truck className="w-10 h-10 text-[#0f55a7]" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Progress</p>
                  <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                    {safeNumber(overview?.progressPercent, 0)}%
                  </h3>
                </div>
                <CheckCircle2 className="w-10 h-10 text-[#4db848]" />
              </div>
            </div>
          </div>
        )}

        {/* Monthly trend chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-slate-800">
              Monthly Recycling Trend
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Weight handled over recent months.
            </p>
          </div>

          {loadingAnalytics ? (
            <div className="text-slate-500">Loading chart...</div>
          ) : safeMonthlyTrend.length === 0 ? (
            <div className="text-slate-500">No analytics data available yet.</div>
          ) : (
            <div className="w-full h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeMonthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weightKg"
                    stroke="#0f55a7"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent activity list (from overview.recentLogs) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-slate-800">
              Recent Impact Activity
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Latest completed recycling impact records.
            </p>
          </div>

          {!Array.isArray(overview?.recentLogs) || overview.recentLogs.length === 0 ? (
            <div className="text-slate-500">No recent activity yet.</div>
          ) : (
            <div className="space-y-4">
              {overview.recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log?._id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {log?.actionType || "N/A"} • {log?.category || "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {log?.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : "No date"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">
                      {Number(log?.weightKg || 0)} kg
                    </p>
                    <p className="text-xs text-slate-500">
                      CO2: {Number(log?.co2SavedKg || 0)} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default RecyclerDashboard;