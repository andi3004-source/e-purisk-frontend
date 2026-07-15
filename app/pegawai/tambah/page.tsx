"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPegawai } from "@/lib/api";

export default function TambahPegawaiPage() {
const router = useRouter();

const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
nip: "",
nama: "",
jabatan: "",
});

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


if (!form.nip || !form.nama || !form.jabatan) {
  alert("Isi semua data!");
  return;
}

try {
  setLoading(true);

  await createPegawai({
    nip: form.nip,
    nama: form.nama,
    jabatan: form.jabatan,
  });

  alert("Berhasil tambah pegawai");

  router.push("/pegawai");
} catch (err) {
  console.error(err);
  alert("Gagal simpan");
} finally {
  setLoading(false);
}


};

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar />


  <div className="flex-1">
    <Navbar />

    <div className="p-6 text-black">
      <h1 className="text-xl font-bold mb-4 text-black">
        Tambah Pegawai
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          placeholder="NIP"
          value={form.nip}
          onChange={(e) =>
            setForm({
              ...form,
              nip: e.target.value,
            })
          }
          className="w-full border p-2 rounded text-black placeholder:text-gray-500 bg-white"
        />

        <input
          type="text"
          placeholder="Nama Pegawai"
          value={form.nama}
          onChange={(e) =>
            setForm({
              ...form,
              nama: e.target.value,
            })
          }
          className="w-full border p-2 rounded text-black placeholder:text-gray-500 bg-white"
        />

        <input
          type="text"
          placeholder="Jabatan"
          value={form.jabatan}
          onChange={(e) =>
            setForm({
              ...form,
              jabatan: e.target.value,
            })
          }
          className="w-full border p-2 rounded text-black placeholder:text-gray-500 bg-white"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/pegawai")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>


);
}
