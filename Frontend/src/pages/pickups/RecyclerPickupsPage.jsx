import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  CircleCheckBig,
  RefreshCw,
  Search,
} from "lucide-react";
import PickupRequestCard from "../../components/pickup/PickupRequestCard";
import PickupRequestDetails from "../../components/pickup/PickupRequestDetails";
import {
  acceptPickupRequest,
  getAcceptedPickupRequests,
  getAllPickupRequests,
  getPickupRequestById,
  updatePickupRequestStatus,
} from "../../services/api";

const RecyclerPickupsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoadingList(true);

      const response =
        activeTab === "all"
          ? await getAllPickupRequests()
          : await getAcceptedPickupRequests();

      setRequests(response.data || []);

      if (response.data?.length > 0) {
        const keepSelected = response.data.find((item) => item._id === selectedId);
        const nextId = keepSelected ? selectedId : response.data[0]._id;
        setSelectedId(nextId);
      } else {
        setSelectedId(null);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to fetch pickup requests:", error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchRequestDetails = async (id) => {
    if (!id) return;
    try {
      setLoadingDetails(true);
      const response = await getPickupRequestById(id);
      setSelectedRequest(response.data);
    } catch (error) {
      console.error("Failed to fetch pickup request details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  useEffect(() => {
    if (selectedId) {
      fetchRequestDetails(selectedId);
    }
  }, [selectedId]);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const keyword = searchTerm.toLowerCase();
      return (
        item.itemName?.toLowerCase().includes(keyword) ||
        item.address?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword)
      );
    });
  }, [requests, searchTerm]);

  const handleAccept = async (id) => {
    try {
      setAccepting(true);
      await acceptPickupRequest(id);
      await fetchRequests();
      await fetchRequestDetails(id);
      setActiveTab("accepted");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to accept request");
    } finally {
      setAccepting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdating(true);
      await updatePickupRequestStatus(id, status);
      await fetchRequests();
      await fetchRequestDetails(id);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f5f7fb]">
      <section className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
          <p className="uppercase tracking-[0.25em] text-xs text-white/80 mb-3">
            Recycler Dashboard
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold mb-3">Pickup Requests</h1>
          <p className="text-white/90 max-w-2xl text-sm md:text-base">
            Manage all customer pickup requests, review request details, and track your
            accepted collections.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                All Requests
              </button>

              <button
                onClick={() => setActiveTab("accepted")}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === "accepted"
                    ? "bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <CircleCheckBig className="w-4 h-4" />
                Accepted Requests
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full lg:w-[320px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0f55a7]"
                />
              </div>

              <button
                onClick={fetchRequests}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="space-y-4">
            {loadingList ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-slate-500">
                Loading pickup requests...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-slate-500">
                No pickup requests found.
              </div>
            ) : (
              filteredRequests.map((request) => (
                <PickupRequestCard
                  key={request._id}
                  request={request}
                  selected={selectedId === request._id}
                  onClick={() => setSelectedId(request._id)}
                />
              ))
            )}
          </div>

          <div>
            {loadingDetails ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-slate-500 min-h-[420px]">
                Loading request details...
              </div>
            ) : (
              <PickupRequestDetails
                request={selectedRequest}
                onAccept={handleAccept}
                onUpdateStatus={handleUpdateStatus}
                accepting={accepting}
                updating={updating}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RecyclerPickupsPage;