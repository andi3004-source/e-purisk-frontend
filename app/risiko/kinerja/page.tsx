"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ProfilRisikoPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const komitmenId = searchParams.get("komitmenId");

  // ======================================
  // STATE
  // ======================================
  const [profilRisiko, setProfilRisiko] = useState<any[]>([]);

  const [komitmenList, setKomitmenList] = useState<any[]>([]);

  const [selectedKomitmen, setSelectedKomitmen] = useState<number | null>(null);

  const [selectedData, setSelectedData] = useState<any>(null);

  const [open, setOpen] = useState(false);

  const [selectedKomitmenKorupsi, setSelectedKomitmenKorupsi] = useState<
    number | null
  >(null);

  const [form, setForm] = useState<any>({
    kode: "",
    tujuan: "",
    pernyataan: "",
    kategori: "",
    sebab: "",
    dampak: "",
    pengendalian: "",
    status: "",
    kemungkinan: "",
    dampakNilai: "",
    prioritas: "",
    respon: "",
    rtpJenis: "",
    rtpUraian: "",
    alokasi: "",
    kTarget: "",
    dTarget: "",
    penanggungJawab: "",
    waktu: "",
    output: "",
  });

  // ======================================
  // FILTER
  // ======================================
  const filteredRisiko = selectedKomitmen
    ? profilRisiko.filter(
        (r) => Number(r.komitmenId) === Number(selectedKomitmen),
      )
    : profilRisiko;

  const filteredKorupsi = selectedKomitmenKorupsi
    ? profilRisiko.filter((r) => r.komitmenId === selectedKomitmenKorupsi)
    : profilRisiko;

  // ======================================
  // FETCH KOMITMEN
  // ======================================
  const fetchKomitmen = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/komitmen");

      console.log("KOMITMEN:", res.data);

      if (Array.isArray(res.data)) {
        setKomitmenList(res.data);
      } else if (Array.isArray(res.data.data)) {
        setKomitmenList(res.data.data);
      }
    } catch (error) {
      console.error(error);

      alert("Gagal mengambil komitmen");
    }
  };

  // ======================================
  // FETCH RISIKO
  // ======================================
  const fetchProfilRisiko = async () => {
    try {
      const res = await axios.get(
  "http://127.0.0.1:8000/api/profil-risiko"
);

      console.log("PROFIL RISIKO:", res.data);

      if (Array.isArray(res.data)) {
        setProfilRisiko(res.data);
      } else if (Array.isArray(res.data.data)) {
        setProfilRisiko(res.data.data);
      }
    } catch (error) {
      console.error(error);

      alert("Gagal mengambil profil risiko");
    }
  };

  // ======================================
  // LOAD DATA
  // ======================================
  useEffect(() => {
    fetchKomitmen();

    fetchProfilRisiko();

    // REALTIME
    const interval = setInterval(() => {
      fetchKomitmen();

      fetchProfilRisiko();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ======================================
  // AUTO SELECT
  // ======================================
  useEffect(() => {
    if (komitmenId) {
      setSelectedKomitmen(Number(komitmenId));
    }
  }, [komitmenId]);

  // ======================================
  // AUTO DETAIL
  // ======================================
  useEffect(() => {
    if (!selectedKomitmen) return;

    const found = komitmenList.find(
      (k) => Number(k.id) === Number(selectedKomitmen),
    );

    setSelectedData(found);
  }, [selectedKomitmen, komitmenList]);

  // ======================================
  // HANDLE SUBMIT
  // ======================================
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,

        komitmenId: selectedKomitmen,
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/profil-risiko",
        payload,
      );

      console.log(res.data);

      alert("Berhasil tambah risiko");

      fetchProfilRisiko();

      setOpen(false);
    } catch (error) {
      console.error(error);

      alert("Gagal simpan risiko");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 max-w-full">
          {/* ================= PROFIL RISIKO ================= */}
          <div className="bg-white p-4 rounded-xl shadow mt-6">
            <h2 className="font-bold mb-3">1. Profil Risiko</h2>

            {selectedData && (
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-3 rounded">
                <div>
                  <p>
                    <b>Nama Pemilik:</b> {selectedData.pemilik}
                  </p>

                  <p>
                    <b>Jabatan:</b> {selectedData.jabatan_pemilik}
                  </p>

                  <p>
                    <b>NIP:</b> {selectedData.nip_pemilik}
                  </p>
                </div>

                <div>
                  <p>
                    <b>Nama Pengelola:</b> {selectedData.pengelola}
                  </p>

                  <p>
                    <b>Jabatan:</b> {selectedData.jabatan_pengelola}
                  </p>

                  <p>
                    <b>NIP:</b> {selectedData.nip_pengelola}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-3">
              {/* FILTER */}
              <select
                value={selectedKomitmen || ""}
                onChange={(e) =>
                  setSelectedKomitmen(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="border p-2 rounded"
              >
                <option value="">Semua Komitmen</option>

                {komitmenList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.periode}
                    {" - "}
                    {k.unit}
                  </option>
                ))}
              </select>

              {/* TAMBAH */}
              <button
                onClick={() => {
                  if (!selectedKomitmen) {
                    alert("Pilih komitmen dulu!");

                    return;
                  }

                  router.push(
                    `/risiko/kinerja/tambah?komitmenId=${selectedKomitmen}`,
                  );
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
              >
                + Tambah
              </button>

              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Export Excel Profil Risiko
              </button>
            </div>

            <div className="w-full overflow-hidden rounded-xl border">
              <div className="overflow-x-auto">
                <table className="min-w-[1800px] text-xs border border-gray-300">
                  {/* THEAD TETAP */}
                  <thead className="bg-purple-800 text-white text-[11px]">
                    <tr>
                      <th rowSpan={2} className="border p-2">
                        No
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Kode Risiko
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Tujuan
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Pernyataan Risiko
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Kategori
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Penyebab
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Dampak
                      </th>

                      <th colSpan={2} className="border p-2">
                        Pengendalian
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Risiko
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Prioritas
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Respon
                      </th>

                      <th colSpan={2} className="border p-2">
                        RTP
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Alokasi
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Target
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Penanggung Jawab
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Target Waktu
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Indikator
                      </th>
                    </tr>

                    <tr>
                      <th className="border">Uraian</th>

                      <th className="border">Status</th>

                      <th className="border">K</th>

                      <th className="border">D</th>

                      <th className="border">Nilai</th>

                      <th className="border">Jenis</th>

                      <th className="border">Uraian</th>

                      <th className="border">K</th>

                      <th className="border">D</th>

                      <th className="border">Nilai</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {filteredRisiko.length === 0 ? (
                      <tr>
                        <td
                          colSpan={23}
                          className="text-center p-4 text-gray-400"
                        >
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      filteredRisiko.map((r, i) => {
                        console.log("DATA R:", r);
                        const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);

                        const nilaiTarget =
                          (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

                        return (
                          <tr key={i}>
                            <td className="border p-2">{i + 1}</td>

                            <td className="border p-2">
  {typeof r.kode === "object"
    ? JSON.stringify(r.kode)
    : r.kode || "-"}
</td>

                            <td className="border p-2">
                              {typeof r.tujuan === "object"
                                ? JSON.stringify(r.tujuan)
                                : r.tujuan || "-"}
                            </td>

                            <td className="border p-2">
                              {typeof r.pernyataan === "object"
                                ? JSON.stringify(r.pernyataan)
                                : r.pernyataan || "-"}
                            </td>

                            <td className="border p-2">
                              {typeof r.kategori === "object"
                                ? JSON.stringify(r.kategori)
                                : r.kategori || "-"}
                            </td>

                            <td className="border p-2">
                              {Array.isArray(r.penyebab)
                                ? r.penyebab
                                    .map((p: any) =>
                                      typeof p === "object"
                                        ? p.penyebab || "-"
                                        : String(p),
                                    )
                                    .join(", ")
                                : typeof r.penyebab === "object"
                                  ? r.penyebab?.penyebab || "-"
                                  : r.penyebab || "-"}
                            </td>

                            <td className="border p-2">
                              {typeof r.dampak === "object"
                                ? JSON.stringify(r.dampak)
                                : r.dampak || "-"}
                            </td>

                            <td className="border p-2">
                              {Array.isArray(r.penyebab)
                                ? r.penyebab
                                    .map((p: any) =>
                                      typeof p === "object"
                                        ? p.pengendalian || "-"
                                        : "-",
                                    )
                                    .join(", ")
                                : "-"}
                            </td>

                            <td className="border p-2">
                              {Array.isArray(r.penyebab)
                                ? r.penyebab
                                    .map((p: any) =>
                                      typeof p === "object"
                                        ? p.status || "-"
                                        : "-",
                                    )
                                    .join(", ")
                                : "-"}
                            </td>

                            <td className="border p-2">
  {typeof r.k === "object"
    ? JSON.stringify(r.k)
    : r.k || "-"}
</td>

                            <td className="border p-2">
  {typeof r.d === "object"
    ? JSON.stringify(r.d)
    : r.d || "-"}
</td>

                            <td className="border p-2 bg-yellow-300 font-bold">
                              {nilai}
                            </td>

                            <td className="border p-2">
  {typeof r.prioritas === "object"
    ? JSON.stringify(r.prioritas)
    : r.prioritas || "-"}
</td>

                            <td className="border p-2">
  {typeof r.respon === "object"
    ? JSON.stringify(r.respon)
    : r.respon || "-"}
</td>

                            <td className="border p-2">-</td>

                            <td className="border p-2">-</td>

                            <td className="border p-2">
  {typeof r.respon === "object"
    ? JSON.stringify(r.respon)
    : r.respon || "-"}
</td>

                            <td className="border p-2">{r.rtp_k}</td>

                            <td className="border p-2">{r.rtp_d}</td>

                            <td className="border p-2 bg-green-500 text-white font-bold">
                              {nilaiTarget}
                            </td>

                            <td className="border p-2">
                              {r.penanggung_jawab || "-"}
                            </td>

                            <td className="border p-2">
                              {Array.isArray(r.rtp)
                                ? r.rtp
                                    .flatMap((x: any) => x.target || [])
                                    .map((t: any) => t.waktu || "-")
                                    .join(", ")
                                : "-"}
                            </td>

                            <td className="border p-2">
                              {Array.isArray(r.rtp)
                                ? r.rtp
                                    .map((x: any) =>
                                      typeof x === "object"
                                        ? x.indikator || "-"
                                        : "-",
                                    )
                                    .join(", ")
                                : "-"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
