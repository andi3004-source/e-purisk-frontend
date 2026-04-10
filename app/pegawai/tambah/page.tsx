"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function TambahPegawaiPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <h1 className="text-xl font-bold mb-4">
            Tambah Pegawai
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <input
              type="text"
              placeholder="NIP"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Nama Pegawai"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Jabatan"
              className="w-full border p-2 rounded"
            />

            <button
              onClick={() => router.push("/pegawai")}
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