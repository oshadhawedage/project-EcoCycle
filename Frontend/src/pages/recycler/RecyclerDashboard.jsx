//RecyclerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  CircleCheckBig,
  Truck,
  CheckCircle2,
} from "lucide-react";
import {
  getAllPickupRequests,
  getAcceptedPickupRequests,
} from "../../services/api";
import RecyclerPickupsPage from "../pickups/RecyclerPickupsPage";

const RecyclerDashboard = () => {
  // Store all pickup requests
  const [allRequests, setAllRequests] = useState([]);

  // Store accepted pickup requests
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  // Loading state for summary cards
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);

        const [allRes, acceptedRes] = await Promise.all([
          getAllPickupRequests(),
          getAcceptedPickupRequests(),
        ]);

        setAllRequests(allRes.data || []);
        setAcceptedRequests(acceptedRes.data || []);
      } catch (error) {
        console.error("Failed to load recycler dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Calculate summary values
  const stats = useMemo(() => {
    const totalRequests = allRequests.length;
    const acceptedCount = acceptedRequests.length;
    const collectedCount = allRequests.filter(
      (item) => item.status === "Collected"
    ).length;
    const completedCount = allRequests.filter(
      (item) => item.status === "Completed"
    ).length;

    return {
      totalRequests,
      acceptedCount,
      collectedCount,
      completedCount,
    };
  }, [allRequests, acceptedRequests]);

  return (
    <main className="flex-1 bg-[#f5f7fb]">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white rounded-3xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
          <p className="uppercase tracking-[0.25em] text-xs text-white/80 mb-3">
            Recycler Dashboard
          </p>

          <h1 className="text-3xl md:text-5xl font-semibold mb-3">
            Pickup Management Center
          </h1>

          <p className="text-white/90 max-w-2xl text-sm md:text-base">
            Manage customer pickup requests, monitor accepted collections, and
            update the recycling workflow efficiently.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto py-10 space-y-8">
        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Requests</p>
                <h3 className="text-3xl font-semibold text-slate-800 mt-2">
                  {loadingStats ? "..." : stats.totalRequests}
                </h3>
              </div>
              <ClipboardList className="w-10 h-10 text-[#0f55a7]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
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

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
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

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
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

        {/* ================= QUICK INFO CARDS ================= */}
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

        
      </section>
    </main>
  );
};

export default RecyclerDashboard;