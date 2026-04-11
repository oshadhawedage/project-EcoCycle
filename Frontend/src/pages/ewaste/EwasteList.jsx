import React, { useEffect, useState } from "react";
import { getMyEwasteItems, deleteEwasteItem, updateEwasteItem } from "../../services/api";
import { useNavigate } from "react-router-dom";

const EwasteList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole"); 

  //console.log("Role:", userRole); // DEBUG

  const fetchItems = async () => {
    try {
      const res = await getMyEwasteItems();
      setItems(res.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
   if (!window.confirm("Are you sure you want to delete this item?")) return;

   try {
      await deleteEwasteItem(id);
      fetchItems(); // refresh list

    } catch (error) {
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  const getStatusColor = (status) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-700";
    case "requested":
      return "bg-yellow-100 text-yellow-700";
    case "picked-up":
      return "bg-blue-100 text-blue-700";
    case "recycled":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

  const handlePickup = async (id) => {
    try {
       await updateEwasteItem(id, { status: "picked-up" });
       fetchItems();
    } catch (error) {
    alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  
  return (
  <main className="flex-1 bg-[#f5f7fb]">

    {/* HEADER */}
    <section className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        <p className="uppercase tracking-[0.25em] text-xs text-white/80 mb-3">
          E-Waste Management
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold mb-3">
          My E-Waste Items
        </h1>
        <p className="text-white/90 max-w-2xl text-sm md:text-base">
          Manage your electronic waste items and track their lifecycle.
        </p>
      </div>
    </section>

    {/* CONTENT */}
    <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">

      {/* ADD BUTTON */}
      {items.length > 0 && (
      <div className="flex justify-end mb-6">
      <button
        onClick={() => navigate("/user/ewaste/create")}
        className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90"
      >
        + Add New Item
      </button>
      </div>
   )}

      {items.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center shadow-sm flex flex-col items-center">
    
     {/* Icon */}
     <div className="text-5xl mb-4">♻️</div>

     {/* Title */}
     <h2 className="text-xl font-semibold text-slate-700 mb-2">
      No E-Waste Items Yet
     </h2>

     {/* Description */}
     <p className="text-slate-500 text-sm mb-6 max-w-md">
      Start by adding your first electronic waste item and help make the planet greener.
     </p>

     {/* CTA Button */}
     <button
      onClick={() => navigate("/user/ewaste/create")}
      className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90"
     >
      + Add Your First Item
     </button>

     </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.deviceType} - {item.brand}
                </h3>

                {/* Info Grid */}
              <div className="mt-3 space-y-1 text-sm text-slate-500">
               <p>Condition: <span className="text-slate-700">{item.condition}</span></p>
               <p>Age: <span className="text-slate-700">{item.age} yrs</span></p>
               <p>Weight: <span className="text-slate-700">{item.weight} kg</span></p>
               <p>
               Disposal:{" "}
             <span className="text-slate-700">{item.disposalType}</span>
             </p>
             </div>

                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-5">

                {/* USER BUTTONS */}
                {userRole === "USER" && (
                  <>
                    <button
                      onClick={() => navigate(`/user/ewaste/edit/${item._id}`)}
                      className="flex-1 border border-[#0f55a7] text-[#0f55a7] py-2 rounded-lg text-sm hover:bg-[#0f55a7] hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-sm hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </>
                )}

                {/* RECYCLER BUTTON */}
                {userRole === "RECYCLER" && item.status === "available" && (
                  <button
                    onClick={() => handlePickup(item._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Mark as Picked-Up
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </main>
 );
};

export default EwasteList;