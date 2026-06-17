"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  getVerifikatorData,
  updateVerifikatorStatus,
} from "@/lib/api";

export default function VerifikatorPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);

  // 🔒 PROTECT ROLE
  useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "verifikator") {
    router.push("/");
    return;
  }

  const fetchData = async () => {
    try {
      const res = await getVerifikatorData();
      setData(res);
    } catch (error) {
      console.error("Gagal ambil data verifikator:", error);
    }
  };

  fetchData();
}, [router]);

  // ✅ APPROVE
  const handleApprove = async (id: number) => {
  try {
    await updateVerifikatorStatus(id, "Approved");

    const fresh = await getVerifikatorData();
    setData(fresh);

    alert("Data berhasil di-approve");
  } catch (error) {
    console.error(error);
    alert("Gagal approve data");
  }
};

  // ❌ REJECT
  const handleReject = async (id: number) => {
  try {
    await updateVerifikatorStatus(id, "Rejected");

    const fresh = await getVerifikatorData();
    setData(fresh);

    alert("Data berhasil di-reject");
  } catch (error) {
    console.error(error);
    alert("Gagal reject data");
  }
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
                                 router.push(`/verifikator/detail/${item.id}`)
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