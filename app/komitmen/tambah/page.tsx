"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahKomitmenPage() {
  const router = useRouter();

  const [form, setForm] = useState<any>({});
  const [pegawai, setPegawai] = useState<any[]>([]);

  // 🔥 ambil pegawai dari localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pegawai") || "[]");
    setPegawai(data);
  }, []);

  // 🔥 HANDLE SELECT (AUTO NIP + JABATAN)
  const handleSelect = (type: "pemilik" | "pengelola", nama: string) => {
    const selected = pegawai.find((p: any) => p.nama === nama);
    if (!selected) return;

    if (type === "pemilik") {
      setForm({
        ...form,
        pemilik: selected.nama,
        nip_pemilik: selected.nip,
        jabatan_pemilik: selected.jabatan,
      });
    }

    if (type === "pengelola") {
      setForm({
        ...form,
        pengelola: selected.nama,
        nip_pengelola: selected.nip,
        jabatan_pengelola: selected.jabatan,
      });
    }
  };

  // 🔥 HANDLE INPUT BIASA
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // 🔥 SIMPAN
  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem("komitmen") || "[]");

    const newData = {
      id: Date.now(),
      periode: form.tahun,
      level: "UPR T3",
      unit: "BALAI WILAYAH SUNGAI BENGAWAN SOLO",

      pemilik: form.jabatan_pemilik,
      nip_pemilik: form.nip_pemilik,
      jabatan_pemilik: form.jabatan_pemilik,

      pengelola: form.jabatan_pengelola,
      nip_pengelola: form.nip_pengelola,
      jabatan_pengelola: form.jabatan_pengelola,

      anggaran: form.anggaran,
      link: form.link,

      status: "Draft",
    };

    const updated = [...existing, newData];

    localStorage.setItem("komitmen", JSON.stringify(updated));

    alert("✅ Komitmen berhasil disimpan");

    router.push(`/komitmen/${newData.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-lg font-semibold mb-4">
            Tambah Komitmen MR
          </h1>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="space-y-4">

              {/* TAHUN */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Tahun</label>
                <select
                  name="tahun"
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1 text-black bg-white"
                >
                  <option>Pilih Tahun</option>
                  {[2023, 2024, 2025, 2026].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* PEMILIK */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Pemilik Risiko</label>
                <select
                  onChange={(e) =>
                    handleSelect("pemilik", e.target.value)
                  }
                  className="w-full border rounded p-2 mt-1"
                >
                  <option>Pilih Pemilik Risiko</option>
                  {pegawai.map((p) => (
                    <option key={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {/* JABATAN PEMILIK */}
              <input
                value={form.jabatan_pemilik || ""}
                readOnly
                className="w-full border p-2 bg-white text-black rounded"
              />

              {/* PENGELOLA */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Pengelola Risiko</label>
                <select
                  onChange={(e) =>
                    handleSelect("pengelola", e.target.value)
                  }
                  className="w-full border rounded p-2 mt-1"
                >
                  <option>Pilih Pengelola</option>
                  {pegawai.map((p) => (
                    <option key={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {/* JABATAN PENGELOLA */}
              <input
                value={form.jabatan_pengelola || ""}
                readOnly
                className="w-full border p-2 bg-white text-black rounded"
              />

              {/* ANGGARAN */}
              <input
                name="anggaran"
                onChange={handleChange}
                placeholder="Anggaran"
                className="w-full border p-2 rounded text-black bg-white"
              />

              {/* LINK */}
              <input
                name="link"
                onChange={handleChange}
                placeholder="Link"
                className="w-full border p-2 rounded text-black bg-white"
              />

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}