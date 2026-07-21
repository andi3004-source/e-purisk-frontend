"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahKomitmenPage() {
  const router = useRouter();

  const [form, setForm] = useState<any>({});
  const [pegawai, setPegawai] = useState<any[]>([]);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const res = await fetch("https://idriskterdepan.id/api/pegawai", {
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();

        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.data)
          ? json.data.data
          : [];

        setPegawai(data);
      } catch (error) {
        console.error("Gagal ambil pegawai:", error);
      }
    };

    fetchPegawai();
  }, []);

  const handleSelectPegawai = (
    type: "pemilik" | "pengelola",
    idPegawai: string
  ) => {
    const selected = pegawai.find((p: any) => String(p.id) === idPegawai);

    if (!selected) return;

    if (type === "pemilik") {
      setForm((prev: any) => ({
        ...prev,
        pemilik: selected.nama || "",
        nip_pemilik: selected.nip || "",
        jabatan_pemilik: selected.jabatan || "",
      }));
    }

    if (type === "pengelola") {
      setForm((prev: any) => ({
        ...prev,
        pengelola: selected.nama || "",
        nip_pengelola: selected.nip || "",
        jabatan_pengelola: selected.jabatan || "",
      }));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
try {
if (!form.tahun) {
alert("Tahun wajib dipilih");
return;
}

if (!form.pemilik) {
  alert("Pemilik Risiko wajib dipilih");
  return;
}

if (!form.pengelola) {
  alert("Pengelola Risiko wajib dipilih");
  return;
}

const payload = {
  periode: form.tahun,
  level: "UPR T2",
  unit: "OPERASI DAN PEMELIHARAAN SUMBER DAYA AIR BENGAWAN SOLO",

  pemilik: form.pemilik || "",
  nip_pemilik: form.nip_pemilik || "",
  jabatan_pemilik: form.jabatan_pemilik || "",

  pengelola: form.pengelola || "",
  nip_pengelola: form.nip_pengelola || "",
  jabatan_pengelola: form.jabatan_pengelola || "",

  anggaran: Number(form.anggaran || 0),
  link: form.link || "",

  status: "Draft",
};

const res = await fetch("https://idriskterdepan.id/api/komitmen", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(payload),
});

const json = await res.json();

if (!res.ok) {
  console.error("Gagal simpan komitmen:", json);
  alert("Gagal simpan komitmen ke database");
  return;
}

alert("✅ Komitmen berhasil disimpan ke database");

const savedData = json.data || json;

router.push(`/komitmen/${savedData.id}`);

} catch (error) {
console.error("ERROR SIMPAN KOMITMEN:", error);
alert("Terjadi error saat menyimpan komitmen");
}
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-lg font-semibold mb-4 text-gray-900">
            Tambah Komitmen MR
          </h1>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-800 font-medium">
                  Tahun
                </label>

                <select
                  name="tahun"
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1 text-black bg-white"
                >
                  <option value="">Pilih Tahun</option>

                  {[2023, 2024, 2025, 2026].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-800 font-medium">
                  Pemilik Risiko
                </label>

                <select
                  onChange={(e) =>
                    handleSelectPegawai("pemilik", e.target.value)
                  }
                  className="w-full border rounded p-2 mt-1 bg-white text-gray-900"
                >
                  <option value="">Pilih Pemilik Risiko</option>

                  {pegawai.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} - {p.jabatan}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.jabatan_pemilik || ""}
                readOnly
                placeholder="Jabatan Pemilik"
                className="w-full border p-2 bg-white text-black rounded"
              />

              <input
                value={form.nip_pemilik || ""}
                readOnly
                placeholder="NIP Pemilik"
                className="w-full border p-2 bg-white text-black rounded"
              />

              <div>
                <label className="text-sm text-gray-800 font-medium">
                  Pengelola Risiko
                </label>

                <select
                  onChange={(e) =>
                    handleSelectPegawai("pengelola", e.target.value)
                  }
                  className="w-full border rounded p-2 mt-1 bg-white text-gray-900"
                >
                  <option value="">Pilih Pengelola Risiko</option>

                  {pegawai.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} - {p.jabatan}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.jabatan_pengelola || ""}
                readOnly
                placeholder="Jabatan Pengelola"
                className="w-full border p-2 bg-white text-black rounded"
              />

              <input
                value={form.nip_pengelola || ""}
                readOnly
                placeholder="NIP Pengelola"
                className="w-full border p-2 bg-white text-black rounded"
              />

              <input
                name="anggaran"
                onChange={handleChange}
                placeholder="Anggaran"
                className="w-full border p-2 rounded text-black bg-white"
              />

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