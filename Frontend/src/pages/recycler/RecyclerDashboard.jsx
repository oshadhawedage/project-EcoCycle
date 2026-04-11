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
import headerImage from "../../assets/RecyclerHeader.png";
import { useNavigate } from "react-router-dom";

const RecyclerDashboard = () => {
  const navigate = useNavigate(); // ✅ added

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
      <section className="rounded-3xl overflow-hidden">
        <img
          src={headerImage}
          alt="Recycler Header"
          className="w-full h-[220px] object-cover"
        />
      </section>

      <section className="max-w-[1400px] mx-auto py-10 space-y-8">
        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          
          <div
            onClick={() => navigate("/pickups")}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-[#4db848] hover:-translate-y-1 transition-all duration-200"
          >
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