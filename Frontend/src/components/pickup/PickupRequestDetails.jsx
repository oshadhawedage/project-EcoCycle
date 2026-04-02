import React, { useMemo } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Package,
  CheckCircle2,
  Truck,
} from "lucide-react";
import PickupStatusBadge from "./PickupStatusBadge";

const PickupRequestDetails = ({
  request,
  onAccept,
  onUpdateStatus,
  accepting,
  updating,
}) => {
  const nextStatusOptions = useMemo(() => {
    if (!request) return [];
    if (request.status === "Accepted") return ["Collected", "Completed"];
    if (request.status === "Collected") return ["Completed"];
    return [];
  }, [request]);

  if (!request) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-8 min-h-[420px] flex items-center justify-center text-slate-500">
        Select a pickup request to view details.
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] px-6 py-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{request.itemName}</h2>
            <p className="text-white/90 text-sm mt-1">Pickup Request Details</p>
          </div>
          <PickupStatusBadge status={request.status} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-4">
              Request Information
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#0f55a7]" />
                <span><strong>Quantity:</strong> {request.quantity}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#0f55a7]" />
                <span><strong>Address:</strong> {request.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0f55a7]" />
                <span><strong>Email:</strong> {request.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-[#0f55a7]" />
                <span>
                  <strong>Preferred Date:</strong>{" "}
                  {new Date(request.preferredDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="w-4 h-4 text-[#0f55a7]" />
                <span>
                  <strong>Created:</strong>{" "}
                  {new Date(request.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-4">
              Recycler Actions
            </h3>

            {request.status === "Pending" && (
              <button
                onClick={() => onAccept(request._id)}
                disabled={accepting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white bg-gradient-to-r from-[#0f55a7] to-[#4db848] hover:opacity-95 transition disabled:opacity-60"
              >
                <Truck className="w-4 h-4" />
                {accepting ? "Accepting..." : "Accept Request"}
              </button>
            )}

            {nextStatusOptions.length > 0 && (
              <div className="space-y-3">
                {nextStatusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(request._id, status)}
                    disabled={updating}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {updating ? "Updating..." : `Mark as ${status}`}
                  </button>
                ))}
              </div>
            )}

            {request.status === "Completed" && (
              <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-4 py-4 text-sm font-medium">
                This pickup request has been completed.
              </div>
            )}

            {request.acceptedAt && (
              <div className="mt-5 text-sm text-slate-600">
                <strong>Accepted At:</strong>{" "}
                {new Date(request.acceptedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestDetails;