"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ModalLED from "@/components/ModalLED";
import { getLoss, createLoss } from "@/lib/api";

interface LossData {
  id: number;
  sumber: string;
  tanggalCatat: string;
  tanggal_catat?: string;
  uraian: string;
  waktu: string;
  lokasi: string;
  sebab: string;
  kondisi: string;
  dampak: string;
  rincian: string;
  unit: string;
}

function LossContent() {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<LossData[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [page, setPage] = useState(1);

  const fetchLoss = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const res = await getLoss();

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];

      const sortedList = [...list].sort(
        (a: LossData, b: LossData) => Number(a.id) - Number(b.id),
      );

      setData(sortedList);
    } catch (error) {
      console.error("Gagal ambil data LED:", error);
      setData([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoss(true);

    const interval = setInterval(() => {
      fetchLoss(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        String(item.sumber || "").toLowerCase().includes(keyword) ||
        String(item.tanggalCatat || item.tanggal_catat || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.uraian || "").toLowerCase().includes(keyword) ||
        String(item.waktu || "").toLowerCase().includes(keyword) ||
        String(item.lokasi || "").toLowerCase().includes(keyword) ||
        String(item.sebab || "").toLowerCase().includes(keyword) ||
        String(item.kondisi || "").toLowerCase().includes(keyword) ||
        String(item.dampak || "").toLowerCase().includes(keyword) ||
        String(item.rincian || "").toLowerCase().includes(keyword) ||
        String(item.unit || "").toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const totalPage = Math.max(1, Math.ceil(filteredData.length / showEntries));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * showEntries;
    const end = start + showEntries;

    return filteredData.slice(start, end);
  }, [filteredData, page, showEntries]);

  useEffect(() => {
    setPage(1);
  }, [search, showEntries]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage);
    }
  }, [page, totalPage]);

  const handleAddData = async (newData: Omit<LossData, "id">) => {
    try {
      await createLoss(newData);

      await fetchLoss(false);

      setOpenModal(false);
      alert("Data berhasil disimpan");
    } catch (err) {
      alert("Gagal simpan data");
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data LED masih kosong");
      return;
    }

    const header = [
      "No",
      "Sumber",
      "Tanggal Catat",
      "Uraian",
      "Waktu",
      "Lokasi",
      "Sebab",
      "Kondisi",
      "Dampak",
      "Rincian",
      "Unit",
    ];

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.sumber || "",
      item.tanggalCatat || item.tanggal_catat || "",
      item.uraian || "",
      item.waktu || "",
      item.lokasi || "",
      item.sebab || "",
      item.kondisi || "",
      item.dampak || "",
      item.rincian || "",
      item.unit || "",
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "loss_event_database.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const startEntry =
    filteredData.length === 0 ? 0 : (page - 1) * showEntries + 1;

  const endEntry = Math.min(page * showEntries, filteredData.length);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Tambah LED
              </button>

              <button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                ⬇ Export Excel
              </button>
            </div>

            <div className="flex justify-between mb-2 text-sm text-gray-900">
              <div>
                Show
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                  className="mx-2 border p-1 rounded bg-white text-black"
                  aria-label="Number of entries to show"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                entries
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-1 rounded bg-white text-black placeholder-gray-500"
              />
            </div>

            <div className="p-6 text-black overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Sumber</th>
                    <th className="p-2">Tanggal Catat</th>
                    <th className="p-2">Uraian</th>
                    <th className="p-2">Waktu</th>
                    <th className="p-2">Lokasi</th>
                    <th className="p-2">Sebab</th>
                    <th className="p-2">Kondisi</th>
                    <th className="p-2">Dampak</th>
                    <th className="p-2">Rincian</th>
                    <th className="p-2">Unit</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center p-4 text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center p-4 text-gray-400"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">
                          {(page - 1) * showEntries + i + 1}
                        </td>

                        <td className="p-2">{item.sumber || "-"}</td>

                        <td className="p-2">
                          {item.tanggalCatat || item.tanggal_catat || "-"}
                        </td>

                        <td className="p-2">{item.uraian || "-"}</td>

                        <td className="p-2">{item.waktu || "-"}</td>

                        <td className="p-2">{item.lokasi || "-"}</td>

                        <td className="p-2">{item.sebab || "-"}</td>

                        <td className="p-2">{item.kondisi || "-"}</td>

                        <td className="p-2">{item.dampak || "-"}</td>

                        <td className="p-2">{item.rincian || "-"}</td>

                        <td className="p-2">{item.unit || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-3 text-sm text-gray-500">
              <span>
                Showing {startEntry} to {endEntry} of {filteredData.length}{" "}
                entries
              </span>

              <div className="space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-2 py-1 text-gray-700">
                  {page} / {totalPage}
                </span>

                <button
                  disabled={page >= totalPage}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPage))
                  }
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalLED
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleAddData}
      />
    </div>
  );
}

export default function LossPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
          Memuat data loss event database...
        </div>
      }
    >
      <LossContent />
    </Suspense>
  );
}