"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ModalLED from "@/components/ModalLED";
import { useState, useEffect } from "react";

// tambahan
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

export default function LossPage() {
  const [openModal, setOpenModal] = useState(false);

  const [data, setData] = useState<LossData[]>([]);

  useEffect(() => {
    getLoss().then(setData);
  }, []);

  // HANDLE TAMBAH DATA
  const handleAddData = async (newData: Omit<LossData, "id">) => {
    try {
      await createLoss(newData);

      const fresh = await getLoss();
      setData(fresh);

      setOpenModal(false);
      alert("Data berhasil disimpan");
    } catch (err) {
      alert("Gagal simpan data");
      console.error(err);
    }
  };

  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-4">
            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                + Tambah LED
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                ⬇ Export Excel
              </button>
            </div>

            {/* FILTER */}
            <div className="flex justify-between mb-2 text-sm">
              <div>
                Show
                <select
                  className="mx-2 border p-1 rounded"
                  aria-label="Number of entries to show"
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                entries
              </div>

              <input
                type="text"
                placeholder="Search..."
                className="border p-1 rounded"
              />
            </div>

            {/* TABLE */}
            <div className="p-6 text-black">
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
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center p-4 text-gray-400"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    data.map((item, i) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{item.sumber}</td>
                        <td className="p-2">
                          {item.tanggalCatat || item.tanggal_catat || "-"}
                        </td>
                        <td className="p-2">{item.uraian}</td>
                        <td className="p-2">{item.waktu}</td>
                        <td className="p-2">{item.lokasi}</td>
                        <td className="p-2">{item.sebab}</td>
                        <td className="p-2">{item.kondisi}</td>
                        <td className="p-2">{item.dampak}</td>
                        <td className="p-2">{item.rincian}</td>
                        <td className="p-2">{item.unit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between mt-3 text-sm text-gray-500">
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

      {/* MODAL */}
      <ModalLED
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleAddData}
      />
    </div>
  );
}
