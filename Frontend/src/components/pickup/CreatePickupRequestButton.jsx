// CreatePickupRequestButton.jsx
// Purpose:
// - Renders the "Create Pickup Request" CTA for an e-waste item.
// - Opens `CreatePickupRequestModal` to collect pickup details and submit the request.
//
// Props:
// - item: the e-waste item object (must include `_id` and a `status` field)
// - onCreated: optional callback invoked after a successful pickup request creation
import React, { useState } from "react";
import { Truck } from "lucide-react"; //truck icon from lucide-react
import CreatePickupRequestModal from "./CreatePickupRequestModal"; // Modal component for creating pickup requests

// Button component to create a pickup request
const CreatePickupRequestButton = ({ item, onCreated }) => {

  //State to control modal open/close
  const [open, setOpen] = useState(false);

  // Business rule:
  // - Only "available" items can create a pickup request.
  // - Any other item status implies a pickup is already requested/processed.
  const isDisabled = item?.status && item.status !== "available";

  return (
    <>
      {/* Button to trigger pickup request modal */}
      <button
        onClick={() => setOpen(true)} //Open modal on click
        disabled={isDisabled} //Disable if item is not available

        // Dynamic styles:
        // Disabled → grey
        // Active → gradient button
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
          isDisabled
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "text-white bg-gradient-to-r from-[#0f55a7] to-[#4db848] hover:opacity-95"
        }`}
      >
        {/*Truck icon*/}
        <Truck className="w-4 h-4" />

        {/*Button text changes based on state*/}
        {isDisabled ? "Pickup Requested" : "Create Pickup Request"}
      </button>

      {/* Modal for creating pickup request */}
      <CreatePickupRequestModal
        item={item} //Pass item details to modal
        isOpen={open} //Control modal visibility
        onClose={() => setOpen(false)} //Close model
        onSuccess={onCreated} //Callback after successful creation to refresh data
      />
    </>
  );
};

export default CreatePickupRequestButton;