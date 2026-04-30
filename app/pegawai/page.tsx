"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* TYPE DATA */
type Pegawai = {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
};

export default function PegawaiPage() {
  const router = useRouter();

  const [dataPegawai, setDataPegawai] = useState<Pegawai[]>([]);

  // ✅ PINDAHIN KE DALAM COMPONENT
  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("pegawai") || "[]");
  setDataPegawai(stored);
}, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-gray-900">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-black">Daftar Pegawai</h1>

            <button
              onClick={() => router.push("/pegawai/tambah")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              + Tambah Pegawai
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow p-4">
            <table className="w-full text-sm text-gray-900">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">NIP</th>
                  <th className="p-3 text-left">Jabatan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {dataPegawai.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-gray-600">
                      Belum ada data pegawai
                    </td>
                  </tr>
                ) : (
                  dataPegawai.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3">{item.nip}</td>
                      <td className="p-3">{item.jabatan}</td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => alert("UI Edit (belum backend)")}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDataPegawai(dataPegawai.filter(p => p.id !== item.id))
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                        >
                          Hapus
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
  );
}