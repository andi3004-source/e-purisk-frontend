"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function TambahKomitmenPage() {
  const [form, setForm] = useState<any>({});
  const [pegawai, setPegawai] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pegawai") || "[]");
    setPegawai(data);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // 🔥 HANDLE AUTO JABATAN
    if (name === "pemilik") {
      const selected = pegawai.find((p) => p.nama === value);
      setForm({
        ...form,
        pemilik: value,
        jabatan_pemilik: selected?.jabatan || "",
      });
      return;
    }

    if (name === "pengelola") {
      const selected = pegawai.find((p) => p.nama === value);
      setForm({
        ...form,
        pengelola: value,
        jabatan_pengelola: selected?.jabatan || "",
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log(form);
    alert("✅ UI + auto fill sudah jalan");
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

            <h2 className="font-semibold mb-4 text-sm text-gray-700">
              Konteks/Pemilik/Pengelola Risiko
            </h2>

            <div className="space-y-4">

              {/* TAHUN */}
              <div>
                <label className="text-sm">Tahun</label>
                <select
                  name="tahun"
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option>Pilih Tahun</option>
                  {[2023, 2024, 2025, 2026].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* PEMILIK RISIKO */}
              <div>
                <label className="text-sm">Pemilik Risiko</label>
                <select
                  name="pemilik"
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option>Pilih Pemilik Risiko</option>
                  {pegawai.map((p) => (
                    <option key={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {/* JABATAN PEMILIK */}
              <div>
                <label className="text-sm">Jabatan Pemilik Risiko</label>
                <input
                  value={form.jabatan_pemilik || ""}
                  readOnly
                  className="w-full border rounded p-2 mt-1 bg-gray-100"
                />
              </div>

              {/* PENGELOLA */}
              <div>
                <label className="text-sm">
                  Pengelola Risiko Organisasi
                </label>
                <select
                  name="pengelola"
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option>Pilih Pengelola</option>
                  {pegawai.map((p) => (
                    <option key={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {/* JABATAN PENGELOLA */}
              <div>
                <label className="text-sm">
                  Jabatan Pengelola Risiko Organisasi
                </label>
                <input
                  value={form.jabatan_pengelola || ""}
                  readOnly
                  className="w-full border rounded p-2 mt-1 bg-gray-100"
                />
              </div>

              {/* ANGGARAN */}
              <div>
                <label className="text-sm">Anggaran</label>
                <input
                  name="anggaran"
                  onChange={handleChange}
                  placeholder="Masukkan Anggaran"
                  className="w-full border rounded p-2 mt-1"
                />
              </div>

              {/* LINK */}
              <div>
                <label className="text-sm">
                  Tautan Dokumen Anggaran
                </label>
                <input
                  name="link"
                  onChange={handleChange}
                  placeholder="Masukkan Link"
                  className="w-full border rounded p-2 mt-1"
                />
              </div>

            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded"
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