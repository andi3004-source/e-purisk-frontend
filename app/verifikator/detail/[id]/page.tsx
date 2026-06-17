"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import React from "react";
import {
  getLoss,
  getVerifikatorDetail,
  updateVerifikatorStatus,
} from "@/lib/api";

export default function DetailVerifikatorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ledData, setLedData] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [komitmen, setKomitmen] = useState<any>(null);

  const pakta = komitmen?.pakta || "";
  const sasaranList = komitmen?.sasaranList || [];
  const internal = komitmen?.internal || [];
  const eksternal = komitmen?.eksternal || [];
  const tujuan = komitmen?.tujuan || "";
  const profilRisiko = komitmen?.profilRisiko || [];
  const risikoKorupsi = profilRisiko.filter(
    (r: any) => String(r.kategori).toLowerCase() === "risiko korupsi",
  );

  const matrix: any[] = [];
  const mapA: Record<string, any> = {};
  const mapB: Record<string, any> = {};

  const getColor = (row: number, col: number) => {
    return "";
  };

  const renderCell = (row: number, col: number) => (
    <div className="border p-4">
      {row},{col}
    </div>
  );

  useEffect(() => {
    const fetchLed = async () => {
      try {
        const res = await getLoss();
        setLedData(res);
      } catch (error) {
        console.error("Gagal ambil LED:", error);
      }
    };

    fetchLed();
  }, []);

  const openDetail = () => {};
  useEffect(() => {
  if (!id) return;

  const fetchDetail = async () => {
    try {
      const res = await getVerifikatorDetail(String(id));
      setKomitmen(res);
    } catch (error) {
      console.error("Gagal ambil detail verifikator:", error);
    }
  };

  fetchDetail();
}, [id]);

  const handleApprove = async () => {
  try {
    await updateVerifikatorStatus(String(id), "Approved");

    alert("Komitmen berhasil di Approve");
    router.push("/verifikator");
  } catch (error) {
    console.error(error);
    alert("Gagal approve");
  }
};

  const handleReject = async () => {
  try {
    await updateVerifikatorStatus(String(id), "Rejected");

    alert("Komitmen berhasil di Reject");
    router.push("/verifikator");
  } catch (error) {
    console.error(error);
    alert("Gagal reject");
  }
};

  if (!komitmen) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Detail Komitmen</h1>

            <div className="space-y-3">
              <p>
                <b>Periode:</b> {komitmen.periode}
              </p>

              <p>
                <b>Unit:</b> {komitmen.unit}
              </p>

              <p>
                <b>Pemilik Risiko:</b> {komitmen.pemilik}
              </p>

              <p>
                <b>Pengelola Risiko:</b> {komitmen.pengelola}
              </p>

              <p>
                <b>Status:</b> {komitmen.status}
              </p>
            </div>
            {/* 1 PAKTA */}
            <div>
              <h2 className="font-bold mb-2">1. Pakta Manajemen Risiko</h2>
              <div className="text-sm whitespace-pre-line">{pakta}</div>
            </div>

            {/* 2 SASARAN */}
            <div>
              <h2 className="font-bold mb-2">
                2. Sasaran Strategis / Program UPR
              </h2>

              <table className="w-full border text-xs">
                <thead className="bg-purple-700 text-white text-xs">
                  <tr>
                    <th>No</th>
                    <th>Nama Konteks</th>
                    <th>Indikator</th>
                    <th>Kegiatan</th>
                    <th>Tujuan</th>
                  </tr>
                </thead>

                <tbody>
                  {sasaranList.map((s: any, i: number) => (
                    <React.Fragment key={`sasaran-${i}`}>
                      {/* 🔵 STRATEGIS */}
                      <tr>
                        <td className="border p-2">{i + 1}</td>

                        <td className="border p-2">
                          <b>Sasaran Strategis</b>
                          <br />
                          {s.sasaranStrategis}
                        </td>

                        <td className="border p-2">{s.indikatorStrategis}</td>

                        <td className="border p-2">-</td>
                        <td className="border p-2">-</td>
                      </tr>

                      {/* 🟡 PROGRAM */}
                      <tr>
                        <td className="border p-2"></td>

                        <td className="border p-2">
                          <b>Sasaran Program</b>
                          <br />
                          {s.sasaranProgram}
                        </td>

                        <td className="border p-2">{s.indikatorProgram}</td>

                        <td className="border p-2">-</td>
                        <td className="border p-2">-</td>
                      </tr>

                      {/* 🟢 KEGIATAN (INI YANG FIX) */}
                      {s.indikator?.map((ind: any) =>
                        ind.sub?.map((sub: any) =>
                          sub.kegiatan?.map((keg: any, kIdx: number) => (
                            <tr key={`kegiatan-${i}-${kIdx}`}>
                              <td className="border p-2"></td>

                              {/* KONTEKS */}
                              <td className="border p-2">
                                <b>Sasaran Kegiatan</b>
                                <br />
                                {s.sasaranKegiatan}
                              </td>

                              {/* INDIKATOR (FIX DISINI) */}
                              <td className="border p-2">{ind.nama}</td>

                              {/* KEGIATAN */}
                              <td className="border p-2">
                                {keg.nama}
                                <br />
                                <span className="text-xs text-gray-500">
                                  Rp{" "}
                                  {Number(keg.anggaran || 0).toLocaleString(
                                    "id-ID",
                                  )}
                                </span>
                              </td>

                              {/* TUJUAN */}
                              <td className="border p-2">
                                {keg.tujuan?.length
                                  ? keg.tujuan.map((t: any, idx: number) => (
                                      <div key={idx}>
                                        {idx + 1}. {t}
                                      </div>
                                    ))
                                  : "-"}
                              </td>
                            </tr>
                          )),
                        ),
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3 PEMANGKU */}
            <div>
              <h2 className="font-bold mb-2">3. Daftar Pemangku Kepentingan</h2>

              <table className="w-full border text-xs">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th>No</th>
                    <th>Jenis</th>
                    <th>Nama</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>

                <tbody>
                  {(internal || []).map((item: any, i: number) => (
                    <tr key={"i" + i}>
                      <td>{i + 1}</td>
                      <td>Internal</td>
                      <td>{item.nama}</td>
                      <td>{item.ket}</td>
                    </tr>
                  ))}

                  {(eksternal || []).map((item: any, i: number) => (
                    <tr key={"e" + i}>
                      <td>{(komitmen.internal?.length || 0) + i + 1}</td>
                      <td>Eksternal</td>
                      <td>{item.nama}</td>
                      <td>{item.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4 TUJUAN */}
            <div>
              <h2 className="font-bold mb-2">
                4. Tujuan Pelaksanaan Manajemen Risiko
              </h2>

              <div className="text-sm whitespace-pre-line">{tujuan}</div>
            </div>
          </div>

          {/* 5 LOSS EVENT DATABASE */}
          <div>
            <h2 className="font-bold mb-2">5. Loss Event Database (LED)</h2>

            <div className="overflow-x-auto">
              <table className="w-full border text-xs">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Sumber</th>
                    <th className="border p-2">Tanggal Catat</th>
                    <th className="border p-2">Uraian</th>
                    <th className="border p-2">Waktu</th>
                    <th className="border p-2">Lokasi</th>
                    <th className="border p-2">Sebab</th>
                    <th className="border p-2">Kondisi</th>
                    <th className="border p-2">Dampak</th>
                    <th className="border p-2">Rincian</th>
                    <th className="border p-2">Unit</th>
                  </tr>
                </thead>

                <tbody>
                  {ledData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center p-4">
                        Belum ada data LED
                      </td>
                    </tr>
                  ) : (
                    ledData.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{item.sumber}</td>
                        <td className="border p-2">
                          {item.tanggalCatat || item.tanggal_catat || "-"}
                        </td>
                        <td className="border p-2">{item.uraian}</td>
                        <td className="border p-2">{item.waktu}</td>
                        <td className="border p-2">{item.lokasi}</td>
                        <td className="border p-2">{item.sebab}</td>
                        <td className="border p-2">{item.kondisi}</td>
                        <td className="border p-2">{item.dampak}</td>
                        <td className="border p-2">{item.rincian}</td>
                        <td className="border p-2">{item.unit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5 RISIKO */}
          <div>
            <h2 className="font-bold mb-2">6. Profil Risiko</h2>

            {/* VALIDASI */}
            {(() => {
              const data = profilRisiko;
              const total = data.length;

              const adaKorupsi = data.some(
                (r: any) =>
                  (r.kategori || "").toLowerCase() === "risiko korupsi",
              );

              if (total < 4 || !adaKorupsi) {
                return (
                  <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                    ❌ Minimal 4 risiko & wajib ada Risiko Korupsi
                  </div>
                );
              }

              return null;
            })()}

            {/* TABLE */}
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
                  {profilRisiko.map((r: any, i: number) => {
                    const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
                    const nilaiTarget =
                      (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

                    return (
                      <tr key={`risiko-${r.id}-${i}`}>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{r.kode}</td>
                        <td className="border p-2">{r.tujuan}</td>
                        <td className="border p-2">{r.pernyataan}</td>

                        <td className="border p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs text-white
                            ${r.kategori === "Risiko Korupsi" ? "bg-red-500" : ""}
                            ${r.kategori === "Risiko Keuangan" ? "bg-green-500" : ""}
                            ${r.kategori === "Risiko Hukum" ? "bg-blue-500" : ""}
                          `}
                          >
                            {r.kategori}
                          </span>
                        </td>

                        <td className="border p-2">{r.penyebab}</td>

                        <td className="border p-2">
                          <div className="text-blue-600 font-semibold">
                            {r.dampakKategori}
                          </div>
                          <div className="text-xs">{r.dampak}</div>
                        </td>

                        <td className="border p-2">{r.pengendalian}</td>
                        <td className="border p-2">{r.hasil}</td>

                        <td className="border p-2">{r.k}</td>
                        <td className="border p-2">{r.d}</td>
                        <td className="border p-2 bg-yellow-300 font-bold">
                          {nilai}
                        </td>

                        <td className="border p-2">{r.prioritas}</td>
                        <td className="border p-2">{r.respon}</td>

                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.jenisRtp).join(", ") || "-"}
                        </td>

                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.uraian).join(", ") || "-"}
                        </td>

                        <td className="border p-2">{r.sumber}</td>

                        <td className="border p-2">{r.rtp_k}</td>
                        <td className="border p-2">{r.rtp_d}</td>
                        <td className="border p-2 bg-green-500 text-white font-bold">
                          {nilaiTarget}
                        </td>

                        <td className="border p-2">
                          {r.rtp
                            ?.map((x: any) => x.penanggungJawab)
                            .join(", ") || "-"}
                        </td>

                        <td className="border p-2">
                          {r.rtp
                            ?.flatMap((x: any) => x.targetList || [])
                            .map((t: any) => t.waktu)
                            .join(", ") || "-"}
                        </td>

                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.indikator).join(", ") ||
                            "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6 PROFIL RISIKO KORUPSI */}
          <div className="mt-6">
            <h2 className="font-bold mb-2">7. Profil Risiko Korupsi</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-gray-300">
                {/* ================= HEADER ================= */}
                <thead className="bg-purple-900 text-white text-[11px]">
                  <tr>
                    <th rowSpan={3} className="border p-2">
                      No
                    </th>
                    <th rowSpan={3} className="border p-2">
                      Kode Risiko
                    </th>
                    <th rowSpan={3} className="border p-2">
                      Sub Proses
                    </th>

                    <th colSpan={2} className="border p-2">
                      Pihak Terlibat
                    </th>

                    <th rowSpan={3} className="border p-2">
                      Pernyataan
                    </th>
                    <th rowSpan={3} className="border p-2">
                      Sub Kategori
                    </th>
                    <th rowSpan={3} className="border p-2">
                      Alat Bukti
                    </th>

                    <th colSpan={2} className="border p-2">
                      Penyebab
                    </th>

                    <th rowSpan={3} className="border p-2">
                      Pengendalian
                    </th>

                    <th colSpan={3} className="border p-2">
                      Nilai Risiko
                    </th>

                    <th colSpan={2} className="border p-2">
                      RTP
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

                  <tr>
                    <th className="border">Internal</th>
                    <th className="border">Eksternal</th>

                    <th className="border">Jenis</th>
                    <th className="border">Uraian</th>

                    <th className="border">K</th>
                    <th className="border">D</th>
                    <th className="border">Nilai</th>

                    <th className="border">Jenis</th>
                    <th className="border">Uraian</th>

                    <th className="border">K</th>
                    <th className="border">D</th>
                    <th className="border">Nilai</th>

                    <th className="border">Rencana</th>
                    <th className="border">Realisasi</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {risikoKorupsi.length === 0 ? (
                    <tr>
                      <td
                        colSpan={23}
                        className="text-center p-4 text-gray-400"
                      >
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    risikoKorupsi.map((r: any, i: number) => {
                      const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
                      const nilaiTarget =
                        (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

                      return (
                        <tr key={r.id || i}>
                          <td className="border p-2">{i + 1}</td>
                          <td className="border p-2">{r.kode || "-"}</td>
                          <td className="border p-2">{r.subProses || "-"}</td>

                          {/* INTERNAL */}
                          <td className="border p-2">
                            {r.pihakList
                              ?.filter((p: any) => p.jenis === "INTERNAL")
                              .map((p: any) => p.nama)
                              .join(", ") || "-"}
                          </td>

                          {/* EKSTERNAL */}
                          <td className="border p-2">
                            {r.pihakList
                              ?.filter((p: any) => p.jenis === "EKSTERNAL")
                              .map((p: any) => p.nama)
                              .join(", ") || "-"}
                          </td>

                          <td className="border p-2">{r.pernyataan || "-"}</td>
                          <td className="border p-2">{r.subKategori || "-"}</td>
                          <td className="border p-2">{r.alatBukti || "-"}</td>

                          {/* PENYEBAB */}
                          <td className="border p-2">
                            {r.penyebabList
                              ?.map((p: any) => p.jenis)
                              .join(", ") || "-"}
                          </td>

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
                            {r.rtp?.map((x: any) => x.jenisRtp).join(", ") ||
                              "-"}
                          </td>

                          <td className="border p-2">
                            {r.rtp?.map((x: any) => x.uraian).join(", ") || "-"}
                          </td>

                          {/* TARGET */}
                          <td className="border p-2">{r.rtp_k || "-"}</td>
                          <td className="border p-2">{r.rtp_d || "-"}</td>
                          <td className="border p-2 bg-green-500 text-white font-bold text-center">
                            {nilaiTarget}
                          </td>

                          {/* INDIKATOR */}
                          <td className="border p-2">
                            {r.rtp?.map((x: any) => x.indikator).join(", ") ||
                              "-"}
                          </td>

                          {/* WAKTU */}
                          <td className="border p-2">
                            {r.rtp
                              ?.flatMap((x: any) => x.targetList || [])
                              .map((t: any) => t.waktu)
                              .join(", ") || "-"}
                          </td>

                          <td className="border p-2">
                            {r.rtp
                              ?.flatMap((x: any) => x.targetList || [])
                              .map((t: any) => t.realisasi || "-")
                              .join(", ") || "-"}
                          </td>

                          {/* PIC */}
                          <td className="border p-2">
                            {r.rtp?.length
                              ? r.rtp
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
            </div>
          </div>
          {/* JADWAL */}
          <p className="font-semibold mb-2">
            Jadwal Pelaksanaan Manajemen Risiko
          </p>

          <table className="w-full border text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="border p-2">Tahap MR</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">Komunikasi & Konsultasi</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.komunikasi ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Penetapan Konteks</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.konteks ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Identifikasi Risiko</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.identifikasi ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Analisis Risiko</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.analisis ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Evaluasi Risiko</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.evaluasi ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Respon Risiko</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.respon ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">RTP</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.rtp ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Pemantauan</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.pemantauan ? "✔" : "-"}
                </td>
              </tr>

              <tr>
                <td className="border p-2">Laporan MR</td>
                <td className="border p-2 text-center">
                  {komitmen?.jadwalMR?.laporan ? "✔" : "-"}
                </td>
              </tr>
            </tbody>
          </table>
          {/* 🔥 PETA RISIKO */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-2">Peta Risiko</h2>

            <div className="grid grid-cols-5 grid-rows-5 w-full rounded overflow-hidden">
              {renderCell(5, 1)}
              {renderCell(5, 2)}
              {renderCell(5, 3)}
              {renderCell(5, 4)}
              {renderCell(5, 5)}
              {renderCell(4, 1)}
              {renderCell(4, 2)}
              {renderCell(4, 3)}
              {renderCell(4, 4)}
              {renderCell(4, 5)}
              {renderCell(3, 1)}
              {renderCell(3, 2)}
              {renderCell(3, 3)}
              {renderCell(3, 4)}
              {renderCell(3, 5)}
              {renderCell(2, 1)}
              {renderCell(2, 2)}
              {renderCell(2, 3)}
              {renderCell(2, 4)}
              {renderCell(2, 5)}
              {renderCell(1, 1)}
              {renderCell(1, 2)}
              {renderCell(1, 3)}
              {renderCell(1, 4)}
              {renderCell(1, 5)}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
