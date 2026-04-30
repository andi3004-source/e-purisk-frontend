"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KomitmenPage() {
  const router = useRouter();

  // 🔥 DATA DUMMY
  const [data, setData] = useState<any[]>([]);

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("komitmen") || "[]");
  setData(stored);
}, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-gray-900">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Daftar Komitmen MR</h1>

            <button
              onClick={() => router.push("/komitmen/tambah")}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              + Tambah Komitmen MR
            </button>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-xl shadow p-4 text-gray-900">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                ⬇ Export Excel
              </button>

              <input
                type="text"
                placeholder="Search..."
                className="border p-2 rounded text-black placeholder-gray-500"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-900">

                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Periode</th>
                    <th className="p-2">Level</th>
                    <th className="p-2">Unit Kerja</th>
                    <th className="p-2">Pemilik Risiko</th>
                    <th className="p-2">Pengelola Risiko</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-gray-600">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    data.map((item, i) => (
                      <tr key={item.id} className="border-b hover:bg-gray-100 text-gray-900">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{item.periode}</td>
                        <td className="p-2">{item.level}</td>
                        <td className="p-2">{item.unit}</td>
                        <td className="p-2">{item.pemilik}</td>
                        <td className="p-2">{item.pengelola}</td>
                        <td className="p-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2 space-x-2">
                          <button
  onClick={() => router.push(`/komitmen/${item.id}`)}
  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
>
  Detail
</button>
                          <button
                            onClick={() => router.push(`/komitmen/${item.id}/history`)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs"
                          >
                            History
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>
                Showing 1 to {data.length} of {data.length} entries
              </span>

              <div className="space-x-2">
                <button className="px-2 py-1 border rounded">Prev</button>
                <button className="px-2 py-1 border rounded">Next</button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}