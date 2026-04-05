import React, { useEffect, useState } from "react";
import axios from "axios";

const EwasteList = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/ewaste", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="flex-1 bg-[#f5f7fb]">

      {/* HEADER (same style as pickup page) */}
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
        {items.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border text-center">
            No items found
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl border shadow-sm"
              >
                <h3 className="font-semibold text-lg">
                  {item.deviceType} - {item.brand}
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Condition: {item.condition}
                </p>
                <p className="text-sm text-slate-500">
                  Status: {item.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default EwasteList;