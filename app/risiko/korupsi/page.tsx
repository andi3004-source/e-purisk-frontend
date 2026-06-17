"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilRisikoPage() {
  const router = useRouter();

  const [profilRisiko, setProfilRisiko] = useState<any[]>([]);

  const [komitmenList, setKomitmenList] = useState<any[]>([]);
  const [selectedKomitmen, setSelectedKomitmen] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const safeJson = (value: any) => {
  try {
    if (Array.isArray(value)) return value;
    if (!value || value === "") return [];
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const safeRtp = (rtp: any) => {
  return safeJson(rtp);
};
  useEffect(() => {
  const fetchKomitmen = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/komitmen");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setKomitmenList(data);
    } catch (error) {
      console.error("Gagal ambil komitmen:", error);
    }
  };

  fetchKomitmen();
}, []);

  // LOAD DATA

  useEffect(() => {
  const fetchProfilRisiko = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/profil-risiko");

      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const mapped = data.map((item: any) => {
        const rtpParsed = safeJson(item.rtp).map((x: any) => ({
          ...x,
          jenisRtp: x.jenisRtp || x.jenis_rtp || "-",
          jenis_rtp: x.jenis_rtp || x.jenisRtp || "-",
          penanggungJawab: x.penanggungJawab || x.penanggung_jawab || "-",
          penanggung_jawab: x.penanggung_jawab || x.penanggungJawab || "-",
          targetList: x.targetList || x.target || [],
        }));

        return {
          ...item,

          komitmenId: item.komitmen_id ?? item.komitmenId,
          dampakKategori: item.dampak_kategori ?? item.dampakKategori,
          penanggungJawab: item.penanggung_jawab ?? item.penanggungJawab,

          penyebab: safeJson(item.penyebab),
          penyebabList: safeJson(item.penyebab),
          rtp: rtpParsed,
          unitTembusan: safeJson(item.unit_tembusan),
        };
      });

      setProfilRisiko(mapped);
      console.log("DATA PROFIL DARI LARAVEL:", mapped);
    } catch (error) {
      console.error("Gagal ambil profil risiko:", error);
    }
  };

  fetchProfilRisiko();
}, []);

  
  useEffect(() => {
  if (!selectedKomitmen) {
    setSelectedData(null);
    return;
  }

  const found = komitmenList.find(
    (k) => Number(k.id) === Number(selectedKomitmen),
  );

  setSelectedData(found || null);
}, [selectedKomitmen, komitmenList]);


  const filteredRisiko = selectedKomitmen
  ? profilRisiko.filter(
      (r) => Number(r.komitmenId) === Number(selectedKomitmen),
    )
  : profilRisiko;

const filteredKorupsiOnly = filteredRisiko.filter((r) => {
  return (r.kategori || "").toLowerCase().includes("korupsi");
});

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
              {/* 🔥 FILTER KOMITMEN */}
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
                    {k.periode} - {k.unit}
                  </option>
                ))}
              </select>

              {/* 🔥 BUTTON KE DASH TAMBAH */}
              <button
                onClick={() => {
                  if (!selectedKomitmen) {
                    alert("Pilih komitmen dulu!");
                    return;
                  }

                  router.push(
                    `/risiko/korupsi/tambah?komitmenId=${selectedKomitmen}`,
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
                        const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
                        const nilaiTarget =
                          (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

                        return (
                          <tr key={i}>
                            <td className="border p-2">{i + 1}</td>
                            <td className="border p-2">{r.kode}</td>
                            <td className="border p-2">{r.tujuan}</td>
                            <td className="border p-2">{r.pernyataan}</td>

                            <td className="border p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs text-white
      ${(r.kategori || "").toLowerCase().includes("korupsi") ? "bg-red-500" : ""}
      ${r.kategori === "Risiko Keuangan" ? "bg-green-500" : ""}
      ${r.kategori === "Risiko Hukum" ? "bg-blue-500" : ""}
      ${r.kategori === "Risiko kinerja" ? "bg-yellow-500 text-black" : ""}
      ${r.kategori === "Risiko layanan" ? "bg-gray-500" : ""}
      ${r.kategori === "Risiko reputasi" ? "bg-purple-500" : ""}
      ${r.kategori === "Risiko kecelakaan kerja" ? "bg-orange-500" : ""}
      ${r.kategori === "Risiko spbe" ? "bg-indigo-500" : ""}
    `}
                              >
                                {r.kategori}
                              </span>
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
                              <div className="text-blue-600 font-semibold">
                                {r.dampakKategori}
                              </div>
                              <div className="text-xs">{r.dampak}</div>
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

                            <td className="border p-2">{r.k}</td>
                            <td className="border p-2">{r.d}</td>
                            <td className="border p-2 bg-yellow-300 font-bold">
                              {nilai}
                            </td>

                            <td className="border p-2">{r.prioritas}</td>
                            <td className="border p-2">{r.respon}</td>

                            <td className="border p-2">
                              {(Array.isArray(r.rtp)
                                ? r.rtp
                                : JSON.parse(r.rtp || "[]")
                              )
                                .map((x: any) => x.jenis_rtp || x.jenisRtp)
                                .join(", ") || "-"}
                            </td>

                            <td className="border p-2">
                              {(Array.isArray(r.rtp)
                                ? r.rtp
                                : JSON.parse(r.rtp || "[]")
                              )
                                .map((x: any) => x.uraian)
                                .join(", ")}
                            </td>

                            <td className="border p-2">{r.sumber}</td>

                            <td className="border p-2">{r.rtp_k}</td>
                            <td className="border p-2">{r.rtp_d}</td>
                            <td className="border p-2 bg-green-500 text-white font-bold">
                              {nilaiTarget}
                            </td>

                            <td className="border p-2">
                              {(Array.isArray(r.rtp)
                                ? r.rtp
                                : JSON.parse(r.rtp || "[]")
                              )
                                .map((x: any) => x.penanggung_jawab)
                                .join(", ") ||
                                r.penanggungJawab ||
                                "-"}
                            </td>

                            <td className="border p-2">
                              {safeRtp(r.rtp)
  .flatMap((x: any) => x.targetList || [])
  .map((t: any) => t.waktu)
  .join(", ") || "-"}
                            </td>

                            <td className="border p-2">
                              {safeRtp(r.rtp)
  .map((x: any) => x.indikator)
  .join(", ") || "-"}
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
          {/* ================= PROFIL RISIKO KORUPSI ================= */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-3">2. Profil Risiko Korupsi</h2>
            <div className="flex gap-2 mb-3">
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
                    {k.periode} - {k.unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full overflow-hidden rounded-xl border">
              <div className="overflow-x-auto">
                <table className="min-w-[2000px] text-xs border border-gray-300">
                  <thead className="bg-purple-900 text-white text-[11px]">
                    {/* BARIS 1 */}
                    <tr>
                      <th rowSpan={3} className="border p-2">
                        No
                      </th>
                      <th rowSpan={3} className="border p-2">
                        Kode Risiko
                      </th>
                      <th rowSpan={3} className="border p-2">
                        Sub Proses Bisnis
                      </th>

                      <th colSpan={2} className="border p-2">
                        Pihak Terlibat
                      </th>

                      <th rowSpan={3} className="border p-2">
                        Pernyataan Risiko
                      </th>
                      <th rowSpan={3} className="border p-2">
                        Sub Kategori
                      </th>
                      <th rowSpan={3} className="border p-2">
                        Alat Bukti
                      </th>

                      <th colSpan={2} className="border p-2">
                        Penyebab Korupsi
                      </th>

                      <th rowSpan={3} className="border p-2">
                        Pengendalian yang sudah berjalan
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Risiko
                      </th>

                      <th colSpan={2} className="border p-2">
                        Rencana Tindak Pengendalian (RTP)
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Target
                      </th>

                      <th rowSpan={3} className="border p-2">
                        Indikator
                      </th>

                      <th colSpan={2} className="border p-2">
                        Waktu
                      </th>

                      <th rowSpan={3} className="border p-2">
                        Penanggung Jawab
                      </th>
                    </tr>

                    {/* BARIS 2 */}
                    <tr>
                      <th className="border p-1">Internal</th>
                      <th className="border p-1">Eksternal</th>

                      <th className="border p-1">Jenis</th>
                      <th className="border p-1">Uraian</th>

                      <th className="border p-1">K</th>
                      <th className="border p-1">D</th>
                      <th className="border p-1">Nilai</th>

                      <th className="border p-1">Jenis</th>
                      <th className="border p-1">Uraian</th>

                      <th className="border p-1">K</th>
                      <th className="border p-1">D</th>
                      <th className="border p-1">Nilai</th>

                      <th className="border p-1">Rencana</th>
                      <th className="border p-1">Realisasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKorupsiOnly.length === 0 ? (
                      <tr>
                        <td
                          colSpan={23}
                          className="text-center p-4 text-gray-400"
                        >
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      filteredKorupsiOnly.map((r, i) => {
                        const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
                        const nilaiTarget =
                          (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

                      
                      

                        return (
                          <tr key={i}>
                            {/* NO */}
                            <td className="border p-2">{i + 1}</td>

                            {/* KODE */}
                            <td className="border p-2">{r.kode || "-"}</td>

                            {/* SUB PROSES */}
                            <td className="border p-2">{r.subProses || "-"}</td>

                            {/* INTERNAL */}
                            <td className="border p-2">
                              {r.pihakList?.length
                                ? r.pihakList
                                    .filter((p: any) => p.jenis === "INTERNAL")
                                    .map((p: any) => p.nama)
                                    .join(", ")
                                : "-"}
                            </td>

                            {/* EKSTERNAL */}
                            <td className="border p-2">
                              {r.pihakList?.length
                                ? r.pihakList
                                    .filter((p: any) => p.jenis === "EKSTERNAL")
                                    .map((p: any) => p.nama)
                                    .join(", ")
                                : "-"}
                            </td>

                            {/* PERNYATAAN */}
                            <td className="border p-2">
                              {r.pernyataan || "-"}
                            </td>

                            {/* SUB KATEGORI */}
                            <td className="border p-2">
                              {r.subKategori || "-"}
                            </td>

                            {/* ALAT BUKTI */}
                            <td className="border p-2">{r.alatBukti || "-"}</td>

                            {/* PENYEBAB JENIS */}
                            <td className="border p-2">
                              {r.penyebabList
                                ?.map((p: any) => p.jenis)
                                .join(", ") || "-"}
                            </td>

                            {/* PENYEBAB URAIAN */}
                            <td className="border p-2">
                              {r.penyebabList
                                ?.map((p: any) => p.penyebab)
                                .join(", ") || "-"}
                            </td>

                            {/* PENGENDALIAN */}
                            <td className="border p-2">
                              {r.penyebabList
                                ?.map((p: any) => p.pengendalian)
                                .join(", ") || "-"}
                            </td>

                            {/* NILAI */}
                            <td className="border p-2">{r.k || "-"}</td>
                            <td className="border p-2">{r.d || "-"}</td>

                            <td className="border p-2 bg-yellow-300 font-bold text-center">
                              {nilai}
                            </td>

                            {/* RTP */}
                            <td className="border p-2">
                              {safeRtp(r.rtp)?.map((x: any) => x.jenis_rtp).join(", ") ||
                                "-"}
                            </td>

                            <td className="border p-2">
                              {safeRtp(r.rtp)?.map((x: any) => x.uraian).join(", ") ||
                                "-"}
                            </td>

                            {/* TARGET */}
                            <td className="border p-2">{r.rtp_k || "-"}</td>
                            <td className="border p-2">{r.rtp_d || "-"}</td>

                            <td className="border p-2 bg-green-500 text-white font-bold text-center">
                              {nilaiTarget}
                            </td>

                            {/* INDIKATOR */}
                            <td className="border p-2">
                              {safeRtp(r.rtp)
  .map((x: any) => x.indikator)
  .join(", ") || "-"}
                            </td>

                            {/* WAKTU */}
                            <td className="border p-2">
                              {safeRtp(r.rtp)
  .flatMap((x: any) => x.targetList || [])
  .map((t: any) => t.waktu)
  .join(", ") || "-"}
                            </td>

                            {/* REALISASI */}
                            <td className="border p-2">
                             {safeRtp(r.rtp)
  .flatMap((x: any) => x.targetList || [])
  .map((t: any) => t.realisasi || "-")
  .join(", ") || "-"}
                            </td>

                            {/* PIC */}
                            <td className="border p-2">
                              {safeRtp(r.rtp).length
  ? safeRtp(r.rtp)
      .map((x: any) => x.penanggungJawab)
      .join(", ")
  : r.penanggungJawab || "-"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>{" "}
              {/* overflow-x-auto */}
            </div>{" "}
            {/* border wrapper */}
          </div>{" "}
          {/* card */}
        </div>{" "}
        {/* p-6 */}
      </div>{" "}
      {/* flex-1 */}
    </div>
  );
}
