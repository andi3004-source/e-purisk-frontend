"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TambahPegawaiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
  });

  const handleSubmit = () => {
    const oldData = JSON.parse(localStorage.getItem("pegawai") || "[]");

    const newData = [
      ...oldData,
      {
        id: Date.now(),
        ...form,
      },
    ];

    localStorage.setItem("pegawai", JSON.stringify(newData));

    alert("Pegawai berhasil disimpan");
    router.push("/pegawai");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-gray-900">
          <h1 className="text-xl font-bold mb-4 text-black">Tambah Pegawai</h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <input
              placeholder="NIP"
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              onChange={(e) =>
                setForm({ ...form, nip: e.target.value })
              }
            />

            <input
              placeholder="Nama Pegawai"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
            />

            <input
              placeholder="Jabatan"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, jabatan: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}