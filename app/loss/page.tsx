"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ModalLED from "@/components/ModalLED";
import { useState } from "react";

// 🔥 LIB EXCEL (LAMA - BIAR GAK RUSAK)
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// 🔥 TAMBAHAN EXCELJS
import ExcelJS from "exceljs";

interface LossData {
  id: number;
  sumber: string;
  tanggalCatat: string;
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

  // 🔥 TAMBAHAN SORT + SEARCH
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof LossData | null>(null);
  const [asc, setAsc] = useState(true);

  const handleAddData = (newData: Omit<LossData, "id">) => {
    setData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newData,
      },
    ]);
  };

  // 🔥 SORT HANDLER
  const handleSort = (key: keyof LossData) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  // 🔥 FILTER + SORT DATA
  const processedData = data
    .filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });

  // 🔥 EXPORT EXCEL (TETAP SAMA)
  const exportToExcel = async () => {
    if (data.length === 0) {
      alert("Data kosong!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Loss Event");

    const headers = [
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

    worksheet.addRow(headers);

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "6B21A8" },
      };
      cell.alignment = { horizontal: "center" };
    });

    data.forEach((item, i) => {
      worksheet.addRow([
        i + 1,
        item.sumber,
        item.tanggalCatat,
        item.uraian,
        item.waktu,
        item.lokasi,
        item.sebab,
        item.kondisi,
        item.dampak,
        item.rincian,
        item.unit,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "loss-event.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-gray-900">
          <div className="bg-white rounded-xl shadow p-4 text-gray-900">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                + Tambah LED
              </button>

              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                ⬇ Export Excel
              </button>
            </div>

            {/* FILTER */}
            <div className="flex justify-between mb-2 text-sm text-gray-900">
              <div>
                Show
                <select className="border p-2 rounded text-black bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                entries
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-1 rounded text-black placeholder-gray-500"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-900">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th onClick={() => handleSort("sumber")} className="p-2 cursor-pointer">Sumber</th>
                    <th onClick={() => handleSort("tanggalCatat")} className="p-2 cursor-pointer">Tanggal Catat</th>
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
                  {processedData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center p-4 text-gray-600">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    processedData.map((item, i) => (
                      <tr key={item.id} className="border-b hover:bg-gray-100 text-gray-900">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{item.sumber}</td>
                        <td className="p-2">{item.tanggalCatat}</td>
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
            <div className="flex justify-between mt-3 text-sm text-gray-700">
              <span>
                Showing 1 to {processedData.length} of {processedData.length} entries
              </span>
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