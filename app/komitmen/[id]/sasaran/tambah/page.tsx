"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import axios from "axios";

export default function TambahSasaranPage() {

  const params = useParams();

  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({

    sasaranStrategis: "",

    indikatorStrategis: "",

    sasaranProgram: "",

    indikatorProgram: "",

    sasaranKegiatan: "",

    indikatorKegiatan: "",

    subIndikator: "",
  });

  // ======================================
  // SUBMIT
  // ======================================
  const handleSubmit = async (
    e: any
  ) => {

    e.preventDefault();

    if (!id) return;

    setLoading(true);

    try {

      const payload = {

        komitmen_id: Number(id),

        sasaran_strategis:
          form.sasaranStrategis,

        indikator_strategis:
          form.indikatorStrategis,

        sasaran_program:
          form.sasaranProgram,

        indikator_program:
          form.indikatorProgram,

        sasaran_kegiatan:
          form.sasaranKegiatan,

        indikator_kegiatan:
          form.indikatorKegiatan,

        // 🔥 FIX NULL
        sub_indikator:
          form.subIndikator || "-",
      };

      console.log("PAYLOAD:", payload);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/sasaran",
        payload
      );

      console.log("RESPONSE:", res.data);

      alert(
        "Sasaran berhasil disimpan"
      );

      router.push(`/komitmen/${id}`);

    } catch (error: any) {

      console.error(error);

      console.log(error.response);

      alert(
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );

    } finally {

      setLoading(false);
    }
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

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* SASARAN STRATEGIS */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Sasaran Strategis
                </label>

                <select
                  required
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sasaranStrategis:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Pilih Sasaran Strategis
                  </option>

                  <option>
                    Meningkatkan Ketahanan Air
                  </option>

                  <option>
                    Peningkatan Infrastruktur SDA
                  </option>

                </select>

              </div>

              {/* INDIKATOR STRATEGIS */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Indikator Sasaran Strategis
                </label>

                <select
                  required
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      indikatorStrategis:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Pilih Indikator
                  </option>

                  <option>
                    Kapasitas tampung air
                  </option>

                  <option>
                    Jumlah bendungan
                  </option>

                </select>

              </div>

              {/* SASARAN PROGRAM */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Sasaran Program
                </label>

                <select
                  required
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sasaranProgram:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Pilih Sasaran Program
                  </option>

                  <option>
                    Pengelolaan SDA
                  </option>

                </select>

              </div>

              {/* INDIKATOR PROGRAM */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Indikator Sasaran Program
                </label>

                <select
                  required
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      indikatorProgram:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Pilih Indikator Program
                  </option>

                  <option>
                    Jumlah layanan air
                  </option>

                </select>

              </div>

              {/* SASARAN KEGIATAN */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Sasaran Kegiatan
                </label>

                <input
                  required
                  placeholder="Masukkan Sasaran Kegiatan"
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sasaranKegiatan:
                        e.target.value
                    })
                  }
                />

              </div>

              {/* INDIKATOR KEGIATAN */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Indikator Sasaran Kegiatan
                </label>

                <input
                  required
                  placeholder="Masukkan Indikator Kegiatan"
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      indikatorKegiatan:
                        e.target.value
                    })
                  }
                />

              </div>

              {/* SUB INDIKATOR */}
              <div>

                <label className="text-sm text-gray-800 font-medium">
                  Sub Indikator
                </label>

                <select
                  required
                  className="w-full border p-2 rounded mt-1 text-black bg-white"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subIndikator:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Pilih Sub
                  </option>

                  <option value="Sub 1">
                    Sub 1
                  </option>

                  <option value="Sub 2">
                    Sub 2
                  </option>

                </select>

              </div>

              {/* BUTTON */}
              <div className="flex gap-2 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    router.back()
                  }
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >

                  {loading
                    ? "Loading..."
                    : "Simpan"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}