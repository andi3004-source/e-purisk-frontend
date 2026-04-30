"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function TambahSasaranPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState({
    sasaranStrategis: "",
    indikatorStrategis: "",
    sasaranProgram: "",
    indikatorProgram: "",
    sasaranKegiatan: "",
    indikatorKegiatan: "", // 🔥 TAMBAHAN
    subIndikator: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!id) return;

    const oldData = JSON.parse(localStorage.getItem("sasaran-" + id) || "[]");

    const newItem = {
      sasaranStrategis: form.sasaranStrategis,
      indikatorStrategis: form.indikatorStrategis,
      sasaranProgram: form.sasaranProgram,
      indikatorProgram: form.indikatorProgram,

      // 🔥 LEVEL UTAMA MULAI DARI SINI
      sasaranKegiatan: form.sasaranKegiatan,

      indikator: [
        {
          nama: form.indikatorKegiatan, // 🔥 INI YANG BENAR

          sub: [
            {
              nama: form.subIndikator,

              kegiatan: [
                {
                  nama: form.sasaranKegiatan,
                  tujuan: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const newData = [...oldData, newItem];

    localStorage.setItem("sasaran-" + id, JSON.stringify(newData));

    router.push(`/komitmen/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
            <h1 className="font-bold text-lg mb-6">
              Tambah Sasaran / Kegiatan
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* SASARAN STRATEGIS */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Sasaran Strategis</label>
                <select
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, sasaranStrategis: e.target.value })
                  }
                >
                  <option value="">Pilih Sasaran Strategis</option>
                  <option>Meningkatkan Ketahanan Air</option>
                  <option>Peningkatan Infrastruktur SDA</option>
                </select>
              </div>

              {/* INDIKATOR STRATEGIS */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Indikator Sasaran Strategis</label>
                <select
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, indikatorStrategis: e.target.value })
                  }
                >
                  <option value="">Pilih Indikator</option>
                  <option>Kapasitas tampung air</option>
                  <option>Jumlah bendungan</option>
                </select>
              </div>

              {/* SASARAN PROGRAM */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Sasaran Program</label>
                <select
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, sasaranProgram: e.target.value })
                  }
                >
                  <option value="">Pilih Sasaran Program</option>
                  <option>Pengelolaan SDA</option>
                </select>
              </div>

              {/* INDIKATOR PROGRAM */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Indikator Sasaran Program</label>
                <select
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, indikatorProgram: e.target.value })
                  }
                >
                  <option value="">Pilih Indikator Program</option>
                  <option>Jumlah layanan air</option>
                </select>
              </div>

              {/* SASARAN KEGIATAN */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Sasaran Kegiatan</label>
                <input
                  placeholder="Masukkan Sasaran Kegiatan"
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, sasaranKegiatan: e.target.value })
                  }
                />
              </div>

              {/* 🔥 INDIKATOR KEGIATAN (BARU) */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Indikator Sasaran Kegiatan</label>
                <input
                  placeholder="Masukkan Indikator Kegiatan"
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, indikatorKegiatan: e.target.value })
                  }
                />
              </div>

              {/* SUB INDIKATOR */}
              <div>
                <label className="text-sm text-gray-800 font-medium">Sub Indikator</label>
                <select
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({ ...form, subIndikator: e.target.value })
                  }
                >
                  <option value="">Pilih Sub</option>
                  <option>Sub 1</option>
                  <option>Sub 2</option>
                </select>
              </div>

              {/* BUTTON */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Reset
                </button>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}