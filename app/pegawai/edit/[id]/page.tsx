"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPegawaiById, updatePegawai } from "@/lib/api";

export default function EditPegawaiPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 LOAD DATA BY ID
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const data = await getPegawaiById(id);
        setForm({
          nip: data.nip || "",
          nama: data.nama || "",
          jabatan: data.jabatan || "",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal ambil data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 🔥 UPDATE
  const handleSubmit = async () => {
    if (!form.nip || !form.nama || !form.jabatan) {
      alert("Isi semua data!");
      return;
    }

    try {
      await updatePegawai(id, form);
      alert("Berhasil update");

      router.push("/pegawai");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal update");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 max-w-xl mx-auto">
          <h1 className="text-xl font-bold mb-4">
            Edit Pegawai
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <input
              value={form.nip}
              onChange={(e) =>
                setForm({ ...form, nip: e.target.value })
              }
              placeholder="NIP"
              className="w-full border p-2 rounded"
            />

            <input
              value={form.nama}
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
              placeholder="Nama"
              className="w-full border p-2 rounded"
            />

            <input
              value={form.jabatan}
              onChange={(e) =>
                setForm({ ...form, jabatan: e.target.value })
              }
              placeholder="Jabatan"
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handleSubmit}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}