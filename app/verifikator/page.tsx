"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function VerifikatorPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);

  // 🔒 PROTECT ROLE
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "verifikator") {
      router.push("/");
    }

    // 🔥 AMBIL DATA KOMITMEN (dummy dari localStorage)
    const komitmen = JSON.parse(localStorage.getItem("komitmen") || "[]");

    setData(komitmen);
  }, []);

  // ✅ APPROVE
  const handleApprove = (id: number) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: "Approved" } : item
    );

    setData(updated);
    localStorage.setItem("komitmen", JSON.stringify(updated));
  };

  // ❌ REJECT
  const handleReject = (id: number) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: "Rejected" } : item
    );

    setData(updated);
    localStorage.setItem("komitmen", JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          {/* HEADER */}
          <h1 className="text-xl font-bold mb-4">
            Dashboard Verifikator
          </h1>

          <div className="bg-white rounded-xl shadow p-4">

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Periode</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-400">
                        Belum ada data komitmen
                      </td>
                    </tr>
                  ) : (
                    data.map((item, i) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{item.periode}</td>
                        <td className="p-2">{item.unit}</td>

                        {/* STATUS */}
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs text-white
                              ${
                                item.status === "Approved"
                                  ? "bg-green-500"
                                  : item.status === "Rejected"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }
                            `}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="p-2 space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/komitmen/${item.id}`)
                            }
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Detail
                          </button>

                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}