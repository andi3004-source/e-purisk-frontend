"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPegawai } from "@/lib/api";

export default function TambahPegawaiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
  });

  const handleSubmit = async () => {
    if (!form.nip || !form.nama || !form.jabatan) {
      alert("Isi semua data!");
      return;
    }

    try {
      await createPegawai(form);

      alert("Berhasil tambah pegawai");

      router.push("/pegawai");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal simpan");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 text-black">
          <h1 className="text-xl font-bold mb-4 text-black">
            Tambah Pegawai
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <input
              type="text"
              placeholder="NIP"
              value={form.nip}
              onChange={(e) =>
                setForm({ ...form, nip: e.target.value })
              }
              className="w-full border p-2 rounded text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              placeholder="Nama Pegawai"
              value={form.nama}
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
              className="w-full border p-2 rounded text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              placeholder="Jabatan"
              value={form.jabatan}
              onChange={(e) =>
                setForm({ ...form, jabatan: e.target.value })
              }
              className="w-full border p-2 rounded text-black placeholder:text-gray-500"
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