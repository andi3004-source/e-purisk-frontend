"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ModalLED from "@/components/ModalLED";
import { useEffect, useState } from "react";

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

const [komitmenList, setKomitmenList] = useState<any[]>([]);
const [selectedId, setSelectedId] = useState<number | null>(null);

useEffect(() => {
  const komitmen = JSON.parse(
    localStorage.getItem("komitmen") || "[]"
  );

  setKomitmenList(komitmen);

  if (komitmen.length > 0) {
    setSelectedId(komitmen[0].id);
  }
}, []);

useEffect(() => {
  if (!selectedId) return;

  const allLED = JSON.parse(
    localStorage.getItem("loss-event") || "[]"
  );

  const filtered = allLED.filter(
    (item: any) => item.komitmenId === selectedId
  );

  setData(filtered);
}, [selectedId]);
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
      <div className="mb-4">
  <label className="font-semibold">
    Pilih Komitmen
  </label>

  <select
    value={selectedId || ""}
    onChange={(e) =>
      setSelectedId(Number(e.target.value))
    }
    className="w-full border rounded p-2 mt-2"
  >
    {komitmenList.map((k) => (
      <option key={k.id} value={k.id}>
        {k.periode} - {k.unit}
      </option>
    ))}
  </select>
</div>
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
<div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
  <table className="min-w-[1200px] w-full border-collapse text-sm text-gray-900">
    <thead className="sticky top-0 z-10 bg-purple-800 text-white">
      <tr>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">No</th>
        <th
          onClick={() => handleSort("sumber")}
          className="px-4 py-3 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-purple-700"
        >
          Sumber
        </th>
        <th
          onClick={() => handleSort("tanggalCatat")}
          className="px-4 py-3 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-purple-700"
        >
          Tanggal Catat
        </th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Uraian</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Waktu</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Lokasi</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sebab</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Kondisi</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Dampak</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Rincian</th>
        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Unit</th>
      </tr>
    </thead>

    <tbody className="bg-white">
      {processedData.length === 0 ? (
        <tr>
          <td colSpan={11} className="px-4 py-6 text-center text-gray-500">
            No data available
          </td>
        </tr>
      ) : (
        processedData.map((item, i) => (
          <tr
            key={item.id}
            className="border-t border-gray-200 hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3 whitespace-nowrap">{i + 1}</td>
            <td className="px-4 py-3 whitespace-nowrap">{item.sumber}</td>
            <td className="px-4 py-3 whitespace-nowrap">{item.tanggalCatat}</td>
            <td className="px-4 py-3">{item.uraian}</td>
            <td className="px-4 py-3 whitespace-nowrap">{item.waktu}</td>
            <td className="px-4 py-3">{item.lokasi}</td>
            <td className="px-4 py-3">{item.sebab}</td>
            <td className="px-4 py-3">{item.kondisi}</td>
            <td className="px-4 py-3">{item.dampak}</td>
            <td className="px-4 py-3">{item.rincian}</td>
            <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
            {/* FOOTER */}
            {/* FOOTER */}
<div className="bg-white rounded-xl shadow p-5 text-gray-900">
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

function setData(arg0: any) {
  throw new Error("Function not implemented.");
}
