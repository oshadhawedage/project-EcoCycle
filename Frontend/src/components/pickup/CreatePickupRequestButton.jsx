import React, { useState } from "react";
import { Truck } from "lucide-react";
import CreatePickupRequestModal from "./CreatePickupRequestModal";

const CreatePickupRequestButton = ({ item, onCreated }) => {
  const [open, setOpen] = useState(false);

  const isDisabled = item?.status && item.status !== "available";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
          isDisabled
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "text-white bg-gradient-to-r from-[#0f55a7] to-[#4db848] hover:opacity-95"
        }`}
      >
        <Truck className="w-4 h-4" />
        {isDisabled ? "Pickup Requested" : "Create Pickup Request"}
      </button>

      <CreatePickupRequestModal
        item={item}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={onCreated}
      />
    </>
  );
};

export default CreatePickupRequestButton;