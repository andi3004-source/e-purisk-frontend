"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://idriskterdepan.id/api";

const safeArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (typeof value === "object") return [value];

  return [];
};

const ambil = (...values: any[]) => {
  const found = values.find(
    (v) => v !== undefined && v !== null && String(v).trim() !== "",
  );

  return found ?? "-";
};

const textValue = (value: any, fallback = "-") => {
  if (value === undefined || value === null || value === "") return fallback;

  if (typeof value === "object") {
    return (
      value.nama ||
      value.name ||
      value.uraian ||
      value.penyebab ||
      value.pengendalian ||
      value.status ||
      value.jenis ||
      JSON.stringify(value)
    );
  }

  return String(value);
};

const joinText = (items: any[], picker: (item: any) => any) => {
  const result = items
    .map((item) => textValue(picker(item)))
    .filter((item) => item && item !== "-")
    .join(", ");

  return result || "-";
};

const getKategoriColor = (kategori: any) => {
  const k = String(kategori || "").toLowerCase();

  if (k.includes("korupsi")) return "bg-red-500 text-white";
  if (k.includes("keuangan")) return "bg-green-500 text-white";
  if (k.includes("hukum")) return "bg-blue-500 text-white";
  if (k.includes("kinerja")) return "bg-yellow-400 text-black";
  if (k.includes("layanan")) return "bg-cyan-500 text-white";
  if (k.includes("reputasi")) return "bg-purple-500 text-white";
  if (k.includes("kecelakaan")) return "bg-orange-500 text-white";
  if (k.includes("spbe")) return "bg-indigo-500 text-white";
  if (k.includes("lainnya")) return "bg-gray-500 text-white";

  return "bg-gray-500 text-white";
};

const getNilaiRisikoColor = (nilai: number) => {
  if (nilai >= 20) return "bg-red-600 text-white";
  if (nilai >= 16) return "bg-orange-400 text-black";
  if (nilai >= 11) return "bg-yellow-400 text-black";
  if (nilai >= 6) return "bg-lime-400 text-black";
  return "bg-green-600 text-white";
};
const hitungMatriksRisiko = (k: number, d: number) => {
  const matrix = [
    [1, 3, 5, 9, 20],
    [2, 7, 10, 13, 21],
    [4, 8, 14, 17, 22],
    [6, 12, 16, 19, 24],
    [11, 15, 18, 23, 25],
  ];

  return matrix[k - 1]?.[d - 1] || 0;
};
function ProfilRisikoKorupsiContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const komitmenId = searchParams.get("komitmenId");

  const [profilRisiko, setProfilRisiko] = useState<any[]>([]);
  const [komitmenList, setKomitmenList] = useState<any[]>([]);
  const [selectedKomitmen, setSelectedKomitmen] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  // TABEL PERTAMA TETAP BERCAMPUR SEMUA KATEGORI
  const filteredRisiko = useMemo(() => {
    if (!selectedKomitmen) return profilRisiko;

    return profilRisiko.filter((r: any) => {
      const id = ambil(r.komitmen_id, r.komitmenId, r.id_komitmen);
      return Number(id) === Number(selectedKomitmen);
    });
  }, [profilRisiko, selectedKomitmen]);

  // TABEL KEDUA KHUSUS KORUPSI
  const filteredKorupsiOnly = useMemo(() => {
    return filteredRisiko.filter((r: any) => {
      const kategori = String(
        ambil(r.kategori, r.kategori_risiko, r.kategoriRisiko),
      ).toLowerCase();

      return kategori.includes("korupsi");
    });
  }, [filteredRisiko]);

  const fetchKomitmen = async () => {
    try {
      const res = await axios.get(`${API_URL}/komitmen`);

      if (Array.isArray(res.data)) {
        setKomitmenList(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setKomitmenList(res.data.data);
      } else {
        setKomitmenList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil komitmen:", error);
    }
  };

  const fetchProfilRisiko = async () => {
    try {
      const res = await axios.get(`${API_URL}/profil-risiko`);

      if (Array.isArray(res.data)) {
        setProfilRisiko(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setProfilRisiko(res.data.data);
      } else {
        setProfilRisiko([]);
      }
    } catch (error) {
      console.error("Gagal mengambil profil risiko:", error);
    }
  };

  useEffect(() => {
    fetchKomitmen();
    fetchProfilRisiko();

    const interval = setInterval(() => {
      fetchKomitmen();
      fetchProfilRisiko();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (komitmenId) {
    setSelectedKomitmen(Number(komitmenId));
  } else {
    setSelectedKomitmen(null);
  }
}, [komitmenId]);

  useEffect(() => {
    if (!selectedKomitmen) {
      setSelectedData(null);
      return;
    }

    const found = komitmenList.find(
      (k: any) => Number(k.id) === Number(selectedKomitmen),
    );

    setSelectedData(found || null);
  }, [selectedKomitmen, komitmenList]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 max-w-full text-gray-900">
          {/* ================= PROFIL RISIKO CAMPURAN ================= */}
          <div className="bg-white p-4 rounded-xl shadow mt-6 text-gray-900">
            <h2 className="font-bold mb-3">1. Profil Risiko</h2>

            {selectedData && (
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-3 rounded">
                <div>
                  <p>
                    <b>Nama Pemilik:</b> {selectedData.pemilik || "-"}
                  </p>
                  <p>
                    <b>Jabatan:</b> {selectedData.jabatan_pemilik || "-"}
                  </p>
                  <p>
                    <b>NIP:</b> {selectedData.nip_pemilik || "-"}
                  </p>
                </div>

                <div>
                  <p>
                    <b>Nama Pengelola:</b> {selectedData.pengelola || "-"}
                  </p>
                  <p>
                    <b>Jabatan:</b> {selectedData.jabatan_pengelola || "-"}
                  </p>
                  <p>
                    <b>NIP:</b> {selectedData.nip_pengelola || "-"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <select
                value={selectedKomitmen ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedKomitmen(value ? Number(value) : null);

                  if (value) {
                    router.replace(`${pathname}?komitmenId=${value}`);
                  } else {
                    router.replace(pathname);
                  }
                }}
                className="border p-2 rounded bg-white text-gray-900"
              >
                <option value="">Semua Komitmen</option>

                {komitmenList.map((k: any) => (
                  <option key={k.id} value={k.id}>
                    {k.periode} - {k.unit}
                  </option>
                ))}
              </select>

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
                <table className="min-w-[1800px] text-xs border border-gray-300 text-gray-900">
                  <thead className="bg-purple-800 text-white text-[11px]">
                    <tr>
                      <th rowSpan={2} className="border p-2">No</th>
                      <th rowSpan={2} className="border p-2">Kode Risiko</th>
                      <th rowSpan={2} className="border p-2">Tujuan</th>
                      <th rowSpan={2} className="border p-2">
                        Pernyataan Risiko
                      </th>
                      <th rowSpan={2} className="border p-2">Kategori</th>
                      <th rowSpan={2} className="border p-2">Penyebab</th>
                      <th rowSpan={2} className="border p-2">Dampak</th>

                      <th colSpan={2} className="border p-2">
                        Pengendalian
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Risiko
                      </th>

                      <th rowSpan={2} className="border p-2">Prioritas</th>
                      <th rowSpan={2} className="border p-2">Respon</th>

                      <th colSpan={2} className="border p-2">
                        RTP
                      </th>

                      <th rowSpan={2} className="border p-2">Alokasi</th>

                      <th colSpan={3} className="border p-2">
                        Nilai Target
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Penanggung Jawab
                      </th>
                      <th rowSpan={2} className="border p-2">
                        Target Waktu
                      </th>
                      <th rowSpan={2} className="border p-2">Indikator</th>
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
                      filteredRisiko.map((r: any, i: number) => {
                        const penyebabList = safeArray(
                          ambil(r.penyebabList, r.penyebab, r.penyebab_risikos),
                        );

                        const rtpList = safeArray(ambil(r.rtp, r.rtps));

                        const targetList = rtpList.flatMap((x: any) =>
                          safeArray(ambil(x.targetList, x.target, x.targets)),
                        );

                        const k = Number(ambil(r.k, r.K, 0)) || 0;
                        const d = Number(ambil(r.d, r.D, 0)) || 0;

                        const nilai =
                          Number(ambil(r.skor, r.nilai, 0)) || k * d;

                        const rtpK = Number(ambil(r.rtp_k, r.rtpK, 0)) || 0;
                        const rtpD = Number(ambil(r.rtp_d, r.rtpD, 0)) || 0;

                       const nilaiTarget =
  Number(
    ambil(r.rtp_n, r.nilai_target, r.nilaiTarget, 0),
  ) ||
  hitungMatriksRisiko(rtpK, rtpD);

                        return (
                          <tr key={r.id || i}>
                            <td className="border p-2 text-center">{i + 1}</td>

                            <td className="border p-2">
                              {textValue(ambil(r.kode, r.kode_risiko))}
                            </td>

                            <td className="border p-2">
                              {textValue(r.tujuan)}
                            </td>

                            <td className="border p-2">
                              {textValue(
                                ambil(r.pernyataan, r.pernyataan_risiko),
                              )}
                            </td>

                            <td className="border p-2 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getKategoriColor(
                                  ambil(
                                    r.kategori,
                                    r.kategori_risiko,
                                    r.kategoriRisiko,
                                  ),
                                )}`}
                              >
                                {textValue(
                                  ambil(
                                    r.kategori,
                                    r.kategori_risiko,
                                    r.kategoriRisiko,
                                  ),
                                )}
                              </span>
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.penyebab, p.uraian, p),
                                )
                                : textValue(r.penyebab)}
                            </td>

                            <td className="border p-2">
                              <div className="text-blue-600 font-semibold">
                                {textValue(
                                  ambil(
                                    r.dampakKategori,
                                    r.dampak_kategori,
                                  ),
                                )}
                              </div>
                              <div className="text-xs">
                                {textValue(r.dampak)}
                              </div>
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.pengendalian, p.pengendalian_risiko),
                                )
                                : textValue(r.pengendalian)}
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.status, p.status_pengendalian),
                                )
                                : textValue(r.status)}
                            </td>

                            <td className="border p-2 text-center">
                              {k || "-"}
                            </td>

                            <td className="border p-2 text-center">
                              {d || "-"}
                            </td>

                            <td
                              className={`border p-2 font-bold text-center ${getNilaiRisikoColor(
                                nilai,
                              )}`}
                            >
                              {nilai || "-"}
                            </td>

                            <td className="border p-2">
                              {textValue(r.prioritas)}
                            </td>

                            <td className="border p-2">
                              {textValue(r.respon)}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) =>
                                  ambil(x.jenisRtp, x.jenis_rtp, x.jenis),
                                )
                                : textValue(ambil(r.rtpJenis, r.rtp_jenis))}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) => x.uraian)
                                : textValue(ambil(r.rtpUraian, r.rtp_uraian))}
                            </td>

                            <td className="border p-2">
                              {textValue(ambil(r.alokasi, r.sumber))}
                            </td>

                            <td className="border p-2 text-center">
                              {rtpK || "-"}
                            </td>

                            <td className="border p-2 text-center">
                              {rtpD || "-"}
                            </td>

                            <td
                              className={`border p-2 font-bold text-center ${getNilaiRisikoColor(
                                nilaiTarget,
                              )}`}
                            >
                              {nilaiTarget || "-"}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) =>
                                  ambil(
                                    x.penanggungJawab,
                                    x.penanggung_jawab,
                                  ),
                                )
                                : textValue(
                                  ambil(
                                    r.penanggungJawab,
                                    r.penanggung_jawab,
                                  ),
                                )}
                            </td>

                            <td className="border p-2">
                              {targetList.length > 0
                                ? joinText(targetList, (t: any) =>
                                  ambil(t.waktu, t.target_waktu),
                                )
                                : textValue(ambil(r.waktu, r.target_waktu))}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) => x.indikator)
                                : textValue(ambil(r.output, r.indikator))}
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
                value={selectedKomitmen ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedKomitmen(value ? Number(value) : null);

                  if (value) {
                    localStorage.setItem("selectedKomitmen", value);
                  } else {
                    localStorage.removeItem("selectedKomitmen");
                  }
                }}
                className="border p-2 rounded bg-white text-gray-900"
              >
                <option value="">Semua Komitmen</option>

                {komitmenList.map((k: any) => (
                  <option key={k.id} value={k.id}>
                    {k.periode} - {k.unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full overflow-hidden rounded-xl border">
              <div className="overflow-x-auto">
                <table className="min-w-[2200px] text-xs border border-gray-300 text-gray-900">
                  <thead className="bg-purple-900 text-white text-[11px]">
                    <tr>
                      <th rowSpan={2} className="border p-2">No</th>
                      <th rowSpan={2} className="border p-2">Kode Risiko</th>
                      <th rowSpan={2} className="border p-2">
                        Sub Proses Bisnis
                      </th>

                      <th colSpan={2} className="border p-2">
                        Pihak Terlibat
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Pernyataan Risiko
                      </th>
                      <th rowSpan={2} className="border p-2">Kategori</th>
                      <th rowSpan={2} className="border p-2">
                        Sub Kategori
                      </th>
                      <th rowSpan={2} className="border p-2">Alat Bukti</th>

                      <th colSpan={2} className="border p-2">
                        Penyebab Korupsi
                      </th>

                      <th rowSpan={2} className="border p-2">
                        Pengendalian
                      </th>

                      <th colSpan={3} className="border p-2">
                        Nilai Risiko
                      </th>

                      <th colSpan={2} className="border p-2">RTP</th>

                      <th colSpan={3} className="border p-2">
                        Nilai Target
                      </th>

                      <th rowSpan={2} className="border p-2">Indikator</th>

                      <th colSpan={2} className="border p-2">Waktu</th>

                      <th rowSpan={2} className="border p-2">
                        Penanggung Jawab
                      </th>
                    </tr>

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
                          colSpan={24}
                          className="text-center p-4 text-gray-400"
                        >
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      filteredKorupsiOnly.map((r: any, i: number) => {
                        const pihakList = safeArray(
                          ambil(r.pihakList, r.pihak, r.pihak_terlibat),
                        );

                        const penyebabList = safeArray(
                          ambil(r.penyebabList, r.penyebab, r.penyebab_risikos),
                        );

                        const rtpList = safeArray(ambil(r.rtp, r.rtps));

                        const targetList = rtpList.flatMap((x: any) =>
                          safeArray(ambil(x.targetList, x.target, x.targets)),
                        );

                        const k = Number(ambil(r.k, r.K, 0)) || 0;
                        const d = Number(ambil(r.d, r.D, 0)) || 0;

                        const nilai =
                          Number(ambil(r.skor, r.nilai, 0)) || k * d;

                        const rtpK = Number(ambil(r.rtp_k, r.rtpK, 0)) || 0;
                        const rtpD = Number(ambil(r.rtp_d, r.rtpD, 0)) || 0;

                        const nilaiTarget =
                          Number(
                            ambil(r.rtp_n, r.nilai_target, r.nilaiTarget, 0),
                          ) ||
                          rtpK * rtpD;

                        const pihakInternal =
                          pihakList
                            .filter((p: any) =>
                              String(ambil(p.jenis, p.tipe))
                                .toLowerCase()
                                .includes("internal"),
                            )
                            .map((p: any) => ambil(p.nama, p.name))
                            .join(", ") || "-";

                        const pihakEksternal =
                          pihakList
                            .filter((p: any) =>
                              String(ambil(p.jenis, p.tipe))
                                .toLowerCase()
                                .includes("eksternal"),
                            )
                            .map((p: any) => ambil(p.nama, p.name))
                            .join(", ") || "-";

                        return (
                          <tr key={r.id || i}>
                            <td className="border p-2 text-center">{i + 1}</td>

                            <td className="border p-2">
                              {textValue(ambil(r.kode, r.kode_risiko))}
                            </td>

                            <td className="border p-2">
                              {textValue(ambil(r.subProses, r.sub_proses))}
                            </td>

                            <td className="border p-2">{pihakInternal}</td>
                            <td className="border p-2">{pihakEksternal}</td>

                            <td className="border p-2">
                              {textValue(
                                ambil(r.pernyataan, r.pernyataan_risiko),
                              )}
                            </td>

                            <td className="border p-2 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getKategoriColor(
                                  ambil(
                                    r.kategori,
                                    r.kategori_risiko,
                                    r.kategoriRisiko,
                                  ),
                                )}`}
                              >
                                {textValue(
                                  ambil(
                                    r.kategori,
                                    r.kategori_risiko,
                                    r.kategoriRisiko,
                                  ),
                                )}
                              </span>
                            </td>

                            <td className="border p-2">
                              {textValue(ambil(r.subKategori, r.sub_kategori))}
                            </td>

                            <td className="border p-2">
                              {textValue(ambil(r.alatBukti, r.alat_bukti))}
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.jenis, p.jenis_penyebab),
                                )
                                : "-"}
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.penyebab, p.uraian, p),
                                )
                                : textValue(r.penyebab)}
                            </td>

                            <td className="border p-2">
                              {penyebabList.length > 0
                                ? joinText(penyebabList, (p: any) =>
                                  ambil(p.pengendalian, p.pengendalian_risiko),
                                )
                                : textValue(r.pengendalian)}
                            </td>

                            <td className="border p-2 text-center">
                              {k || "-"}
                            </td>

                            <td className="border p-2 text-center">
                              {d || "-"}
                            </td>

                            <td
                              className={`border p-2 text-center font-bold ${getNilaiRisikoColor(
                                nilai,
                              )}`}
                            >
                              {nilai || "-"}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) =>
                                  ambil(x.jenisRtp, x.jenis_rtp, x.jenis),
                                )
                                : textValue(ambil(r.rtpJenis, r.rtp_jenis))}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) => x.uraian)
                                : textValue(ambil(r.rtpUraian, r.rtp_uraian))}
                            </td>

                            <td className="border p-2 text-center">
                              {rtpK || "-"}
                            </td>

                            <td className="border p-2 text-center">
                              {rtpD || "-"}
                            </td>

                            <td
                              className={`border p-2 text-center font-bold ${getNilaiRisikoColor(
                                nilaiTarget,
                              )}`}
                            >
                              {nilaiTarget || "-"}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) => x.indikator)
                                : textValue(ambil(r.output, r.indikator))}
                            </td>

                            <td className="border p-2">
                              {targetList.length > 0
                                ? joinText(targetList, (t: any) =>
                                  ambil(t.waktu, t.target_waktu),
                                )
                                : textValue(ambil(r.waktu, r.target_waktu))}
                            </td>

                            <td className="border p-2">
                              {targetList.length > 0
                                ? joinText(targetList, (t: any) =>
                                  ambil(t.realisasi, t.waktu_realisasi),
                                )
                                : textValue(
                                  ambil(r.realisasi, r.waktu_realisasi),
                                )}
                            </td>

                            <td className="border p-2">
                              {rtpList.length > 0
                                ? joinText(rtpList, (x: any) =>
                                  ambil(
                                    x.penanggungJawab,
                                    x.penanggung_jawab,
                                  ),
                                )
                                : textValue(
                                  ambil(
                                    r.penanggungJawab,
                                    r.penanggung_jawab,
                                  ),
                                )}
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

export default function ProfilRisikoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
          Memuat data profil risiko korupsi...
        </div>
      }
    >
      <ProfilRisikoKorupsiContent />
    </Suspense>
  );
}