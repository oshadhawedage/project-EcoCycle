//PickupStatusBadge.jsx
// Purpose:
// - Shows a colored label for the current pickup request status.
// - Colors are mapped in `statusStyles`.
import React from "react";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Accepted: "bg-blue-100 text-blue-700 border border-blue-200",
  Collected: "bg-purple-100 text-purple-700 border border-purple-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
};

const PickupStatusBadge = ({ status }) => {
  return (
    <span
      // If status is unknown/missing, fall back to a neutral style.
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

export default PickupStatusBadge;