"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://idriskterdepan.id/api";

export default function KomitmenPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchKomitmen = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/komitmen`);

      console.log("DATA KOMITMEN:", res.data);

      if (Array.isArray(res.data)) {
        setData(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data komitmen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomitmen();
  }, []);

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      String(item.periode || "").toLowerCase().includes(keyword) ||
      String(item.level || "").toLowerCase().includes(keyword) ||
      String(item.unit || "").toLowerCase().includes(keyword) ||
      String(item.pemilik || "").toLowerCase().includes(keyword) ||
      String(item.pengelola || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Daftar Komitmen MR</h1>

            <button
              onClick={() => router.push("/komitmen/tambah")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              + Tambah Komitmen MR
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-gray-900">
            <div className="flex justify-between items-center mb-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                ⬇ Export Excel
              </button>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded text-black placeholder-gray-500"
              />
            </div>

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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center p-4 text-gray-600"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center p-4 text-gray-600"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, i) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-100 text-gray-900"
                      >
                        <td className="p-2">{i + 1}</td>

                        <td className="p-2">{item.periode || "-"}</td>

                        <td className="p-2">{item.level || "-"}</td>

                        <td className="p-2">{item.unit || "-"}</td>

                        <td className="p-2">{item.pemilik || "-"}</td>

                        <td className="p-2">{item.pengelola || "-"}</td>

                        <td className="p-2">
                          <span
                            className={`
                              px-2 py-1 rounded text-xs text-white
                              ${item.status === "Approved"
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

                        <td className="p-2 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() =>
                              router.push(`/komitmen/${item.id}?komitmenId=${item.id}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => {
                              console.log("KOMITMEN ID DIKIRIM:", item.id);

                              router.push(`/risiko/korupsi?komitmenId=${item.id}`);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Risiko
                          </button>

                          
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>
                Showing 1 to {filteredData.length} of {filteredData.length}{" "}
                entries
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