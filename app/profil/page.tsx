"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { kirimVerifikatorData } from "@/lib/api";

export default function ProfilPage() {
  const [komitmenList, setKomitmenList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [risiko, setRisiko] = useState<any[]>([]);
  const [sasaranList, setSasaranList] = useState<any[]>([]);
  const komitmen = komitmenList.find(
    (k) => Number(k.id) === Number(selectedId),
  );
  console.log("selectedId =", selectedId);
  console.log("komitmen =", komitmen);
  console.log("komitmenList =", komitmenList);
  const [pakta, setPakta] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [internal, setInternal] = useState<any[]>([]);
  const [eksternal, setEksternal] = useState<any[]>([]);
  const [profilRisiko, setProfilRisiko] = useState<any[]>([]);
  const [jadwalMR, setJadwalMR] = useState<any[]>([]);
  const [ledData, setLedData] = useState<any[]>([]);

 const [jadwal, setJadwal] = useState([
  {
    no: "1",
    tahap: "Komunikasi dan Konsultasi",
    data: Array(48).fill(0),
  },

  {
    no: "2",
    tahap: "Komitmen MR",
    header: true,
    data: Array(48).fill(0),
  },

  {
    no: "2.a",
    tahap: "Penetapan Konteks dan Lingkup",
    data: Array(48).fill(0),
  },

  {
    no: "2.b",
    tahap: "Identifikasi Risiko",
    data: Array(48).fill(0),
  },

  {
    no: "2.c",
    tahap: "Analisis Risiko",
    data: Array(48).fill(0),
  },

  {
    no: "2.d",
    tahap: "Evaluasi Risiko",
    data: Array(48).fill(0),
  },

  {
    no: "3",
    tahap: "Respon Risiko",
    data: Array(48).fill(0),
  },

  {
    no: "4",
    tahap: "Rencana Tindak Pengendalian",
    header: true,
    data: Array(48).fill(0),
  },

  {
    no: "4.a",
    tahap: "Eskalasi",
    data: Array(48).fill(0),
  },

  {
    no: "4.b",
    tahap: "Penguatan",
    data: Array(48).fill(0),
  },

  {
    no: "4.c",
    tahap: "Penguatan",
    data: Array(48).fill(0),
  },

  {
    no: "5",
    tahap: "Pemantauan dan Tinjauan",
    data: Array(48).fill(0),
  },

  {
    no: "6",
    tahap: "Laporan Penerapan MR",
    data: Array(48).fill(0),
  },
]);
const toggleCell = (rowIndex: number, colIndex: number) => {
  const newData = [...jadwalMR];

  newData[rowIndex].data[colIndex] =
    newData[rowIndex].data[colIndex] === 1 ? 0 : 1;

  setJadwalMR(newData);
};
  const safeJson = (value: any) => {
    try {
      if (Array.isArray(value)) return value;
      if (!value || value === "") return [];
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const mapProfilRisiko = (item: any) => {
    const penyebabParsed = safeJson(item.penyebab);

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
      subProses: item.sub_proses ?? item.subProses,
      subKategori: item.sub_kategori ?? item.subKategori,
      alatBukti: item.alat_bukti ?? item.alatBukti,

      penyebab:
        penyebabParsed.map((p: any) => p.penyebab).join(", ") ||
        item.penyebab ||
        "-",

      pengendalian:
        penyebabParsed.map((p: any) => p.pengendalian).join(", ") || "-",

      hasil: penyebabParsed.map((p: any) => p.status).join(", ") || "-",
      penyebabList: penyebabParsed,
      rtp: rtpParsed,
      pihakList: safeJson(item.pihak),
      unitTembusan: safeJson(item.unit_tembusan),
    };
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
    if (k.includes("umum")) return "bg-slate-500 text-white";

    return "bg-gray-500 text-white";
  };
  const downloadPDF = () => {
    const content = document.getElementById("pdf-area");

    if (!content) {
      alert("Area PDF tidak ditemukan!");
      return;
    }

    const win = window.open("", "", "width=1200,height=800");

    if (!win) return;

    win.document.write(`
    <html>
      <head>
        <title>PDF</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
            zoom: 0.6;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid black;
          }

          th, td {
            padding: 5px;
            font-size: 10px;
          }

          .grid {
            display: grid !important;
            width: 100%;
            aspect-ratio: 1 / 1;
          }

          .grid-cols-5 {
            display: grid !important;
            grid-template-columns: repeat(5, 1fr) !important;
          }

          .grid-rows-5 {
            grid-template-rows: repeat(5, 1fr) !important;
          }

          .grid > div {
            height: 60px !important;
            border: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bg-green-700 { background: #166534; color: white; }
          .bg-green-400 { background: #4ade80; }
          .bg-yellow-400 { background: #facc15; }
          .bg-orange-400 { background: #fb923c; }
          .bg-red-600 { background: #dc2626; color: white; }

          .rounded-full {
            border-radius: 9999px;
          }

          #pdf-area {
            width: 800px;
            margin: auto;
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
    }, 500);
  };

  useEffect(() => {
    if (!selectedId) return;

    const fetchSasaran = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/sasaran?komitmen_id=${selectedId}`,
        );

        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const mapped = data.map((s: any) => ({
          sasaranStrategis: s.sasaran_strategis || "-",
          indikatorStrategis: s.indikator_strategis || "-",
          sasaranProgram: s.sasaran_program || "-",
          indikatorProgram: s.indikator_program || "-",
          sasaranKegiatan: s.sasaran_kegiatan || "-",
          indikator: [
            {
              nama: s.indikator_kegiatan || "-",
              sub: [
                {
                  kegiatan: [
                    {
                      nama: s.sub_indikator || "-",
                      anggaran: s.anggaran || 0,
                      tujuan: [s.sasaran_kegiatan || "-"],
                    },
                  ],
                },
              ],
            },
          ],
        }));

        setSasaranList(mapped);
      } catch (error) {
        console.error("Gagal ambil sasaran:", error);
      }
    };

    fetchSasaran();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    const fetchProfilRisiko = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/profil-risiko?komitmen_id=${selectedId}`,
        );

        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const mapped = data.map((item: any) => mapProfilRisiko(item));

        setProfilRisiko(mapped);
        setRisiko(mapped);
      } catch (error) {
        console.error("Gagal ambil profil risiko:", error);
      }
    };

    fetchProfilRisiko();
  }, [selectedId]);

  useEffect(() => {
    const fetchLed = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/loss");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setLedData(data);
      } catch (error) {
        console.error("Gagal ambil data LED:", error);
      }
    };

    fetchLed();
  }, []);

  useEffect(() => {
    const fetchKomitmen = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/komitmen");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log(res.data);
        setKomitmenList(data);

        if (data.length > 0) {
          setSelectedId(Number(data[0].id));
        }
      } catch (error) {
        console.error("Gagal ambil komitmen:", error);
      }
    };

    fetchKomitmen();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    const found = komitmenList.find(
      (k: any) => Number(k.id) === Number(selectedId),
    );

    setPakta(found?.pakta || "");
    setTujuan(found?.tujuan || "");
    setInternal(safeJson(found?.internal));
    setEksternal(safeJson(found?.eksternal));
    setJadwalMR(
  safeJson(
    found?.jadwalMR ||
    found?.jadwal_mr ||
    found?.jadwal
  )
);
    const sasaranFromKomitmen = safeJson(
      found?.sasaran ||
      found?.sasaranList ||
      found?.sasarans
    ).map((s: any) => ({
      sasaranStrategis:
        s.sasaranStrategis || s.sasaran_strategis || "-",


      indikatorStrategis:
        s.indikatorStrategis || s.indikator_strategis || "-",

      sasaranProgram:
        s.sasaranProgram || s.sasaran_program || "-",

      indikatorProgram:
        s.indikatorProgram || s.indikator_program || "-",

      sasaranKegiatan:
        s.sasaranKegiatan || s.sasaran_kegiatan || "-",

      indikatorKegiatan:
        s.indikatorKegiatan || s.indikator_kegiatan || "-",

      indikator: Array.isArray(s.indikator)
        ? s.indikator
        : [
          {
            nama: s.indikatorKegiatan || s.indikator_kegiatan || "-",
            sub: [
              {
                nama: s.subIndikator || s.sub_indikator || "-",
                kegiatan: [
                  {
                    nama: s.subIndikator || s.sub_indikator || "-",
                    anggaran: 0,
                    tujuan: [s.sasaranKegiatan || s.sasaran_kegiatan || "-"],
                  },
                ],
              },
            ],
          },
        ],


    }));

    setSasaranList(sasaranFromKomitmen);
  }, [selectedId, komitmenList]);


  const mapA: any = {};
  const mapB: any = {};

  profilRisiko.forEach((item: any, index: number) => {
    const kA = Number(item.k ?? item.kemungkinan);
    const dA = Number(item.d ?? item.dampakNilai);

    if (kA && dA) {
      const keyA = `${kA}-${dA}`;
      if (!mapA[keyA]) mapA[keyA] = [];
      mapA[keyA].push({ label: index + 1, data: item });
    }

    const kB = Number(item.rtp_k);
    const dB = Number(item.rtp_d);

    if (kB && dB) {
      const keyB = `${kB}-${dB}`;
      if (!mapB[keyB]) mapB[keyB] = [];
      mapB[keyB].push({ label: index + 1, data: item });
    }
  });

  // ===== STATUS =====
  const isAllApproved =
    risiko.length >= 4 && risiko.every((r: any) => r.status === "approved");

  const kirimVerifikator = async () => {
    if (!komitmen) {
      alert("Komitmen belum dipilih!");
      return;
    }

    try {
      await kirimVerifikatorData({
        komitmen_id: komitmen.id,
        periode: komitmen.periode,
        unit: komitmen.unit,
        pemilik: komitmen.pemilik,
        pengelola: komitmen.pengelola,

        pakta,
        tujuan,
        internal,
        eksternal,
        sasaranList,
        profilRisiko,

        jadwalMR: komitmen.jadwalMR || {},
        status: "Pending",
        tanggalKirim: new Date().toISOString(),
      });

      alert("Berhasil dikirim ke Verifikator");
    } catch (error) {
      console.error(error);
      alert("Gagal kirim ke Verifikator");
    }
  };

  const risikoKorupsi = profilRisiko.filter((r: any) =>
    (r.kategori || "").toLowerCase().includes("korupsi"),
  );
  const matrix = [
    [1, 3, 5, 9, 20],
    [2, 7, 10, 13, 21],
    [4, 8, 14, 17, 22],
    [6, 12, 16, 19, 24],
    [11, 15, 18, 23, 25],
  ];
  const getNilaiRisiko = (k: number, d: number) => {
    if (!k || !d) return 0;
    return matrix[k - 1][d - 1];
  };


  // ===== COLOR =====
  const [detail, setDetail] = useState<any>(null);

  const openDetail = (data: any) => {
    setDetail(data);
  };

  // ===== COLOR =====
  const getColor = (n: number) => {
    if (n <= 5) return "bg-green-700";
    if (n <= 10) return "bg-green-400";
    if (n <= 15) return "bg-yellow-400";
    if (n <= 19) return "bg-orange-400";
    return "bg-red-600";
  };

  // ===== CELL =====
  const renderCell = (k: number, d: number) => {
    const nilai = matrix[k - 1][d - 1];
    const key = `${k}-${d}`;

    const itemsA = mapA[key] || [];
    const itemsB = mapB[key] || [];

    return (
      <div
        className={`${getColor(nilai)} relative h-20 flex flex-col items-center justify-center border border-white`}
      >
        <span className="absolute top-1 right-1 text-[10px] font-bold text-black">
          {nilai}
        </span>

        <div className="flex gap-1 flex-wrap justify-center">
          {itemsA.map((item: any, i: number) => (
            <div
              key={`A-${item.data.id}-${i}`}
              onClick={() => openDetail(item.data)}
              className="w-6 h-6 bg-blue-900 text-white text-[10px] flex items-center justify-center rounded-full cursor-pointer"
            >
              {item.label}
            </div>
          ))}

          {itemsB.map((item: any, i: number) => (
            <div
              key={`B-${item.data.id}-${k}-${d}-${i}`}
              onClick={() => openDetail(item.data)}
              className="w-6 h-6 bg-green-800 text-white text-[10px] flex items-center justify-center rounded-full cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-x-hidden">
        <Navbar />

        <div
          id="pdf-area"
          className="p-6 space-y-6 text-gray-900 overflow-x-auto max-w-full"
        >
          {/* 🔥 SELECT KOMITMEN */}
          <div className="bg-white p-4 rounded-xl shadow">
            <label className="text-sm font-semibold">Pilih Komitmen</label>

            <select
              value={selectedId || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedId(value ? Number(value) : null);

                if (!value) {
                  setPakta("");
                  setTujuan("");
                  setInternal([]);
                  setEksternal([]);
                  setSasaranList([]);
                  setProfilRisiko([]);
                  setRisiko([]);
                }
              }}
              className="w-full mt-2 border p-2 rounded"
            >
              <option value="">Semua Komitmen</option>

              {komitmenList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.periode} - {k.unit}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
          {/* 🔥 DETAIL KOMITMEN */}
          {komitmen && (
            <div className="bg-white rounded-xl shadow p-5 space-y-6">
              {/* HEADER */}
              <div className="text-sm">
                <h2 className="text-center font-bold mb-3">
                  KOMITMEN PENERAPAN MANAJEMEN RISIKO
                </h2>

                <p>
                  <b>Nama Pemilik Risiko</b> : {komitmen?.pemilik}
                </p>
                <p>
                  <b>NIP Pemilik Risiko</b> : {komitmen?.nip_pemilik}
                </p>
                <p>
                  <b>Jabatan Pemilik Risiko</b> : {komitmen?.jabatan_pemilik}
                </p>

                <p className="mt-2">
                  <b>Nama Pengelola Risiko</b> : {komitmen?.pengelola}
                </p>
                <p>
                  <b>NIP Pengelola Risiko</b> : {komitmen?.nip_pengelola}
                </p>
                <p>
                  <b>Jabatan Pengelola Risiko</b> :{" "}
                  {komitmen?.jabatan_pengelola}
                </p>

                <p className="mt-2">
                  <b>Periode</b> : {komitmen?.periode}
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
                <h2 className="font-bold mb-2">
                  3. Daftar Pemangku Kepentingan
                </h2>

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
                        <td>{(internal.length || 0) + i + 1}</td>
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
          )}

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
                        <td className="border p-2">{item.sumber || "-"}</td>
                        <td className="border p-2">
                          {item.tanggalCatat || item.tanggal_catat || "-"}
                        </td>
                        <td className="border p-2">{item.uraian || "-"}</td>
                        <td className="border p-2">{item.waktu || "-"}</td>
                        <td className="border p-2">{item.lokasi || "-"}</td>
                        <td className="border p-2">{item.sebab || "-"}</td>
                        <td className="border p-2">{item.kondisi || "-"}</td>
                        <td className="border p-2">{item.dampak || "-"}</td>
                        <td className="border p-2">{item.rincian || "-"}</td>
                        <td className="border p-2">{item.unit || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. PROFIL RISIKO */}
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
                    const nilai = getNilaiRisiko(
                      Number(r.k),
                      Number(r.d)
                    );
                    const nilaiTarget = getNilaiRisiko(
                      Number(r.rtp_k),
                      Number(r.rtp_d)
                    );

                    return (
                      <tr key={`risiko-${r.id}-${i}`}>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{r.kode}</td>
                        <td className="border p-2">{r.tujuan}</td>
                        <td className="border p-2">{r.pernyataan}</td>

                        <td className="border p-2">
                          <td className="border p-2">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getKategoriColor(
                                r.kategori
                              )}`}
                            >
                              {typeof r.kategori === "object"
                                ? JSON.stringify(r.kategori)
                                : r.kategori || "-"}
                            </span>
                          </td>
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

          {/* 7. PROFIL RISIKO KORUPSI */}
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
                      const nilai = getNilaiRisiko(
                        Number(r.k),
                        Number(r.d)
                      );
                      const nilaiTarget = getNilaiRisiko(
                        Number(r.rtp_k),
                        Number(r.rtp_d)
                      );

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

        <div className="bg-white rounded-xl shadow p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800">
        Jadwal Pelaksanaan Manajemen Risiko
      </h2>
      <p className="text-sm text-gray-500">
        Klik kotak untuk menandai minggu pelaksanaan
      </p>
    </div>

    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded" />
        <span>Aktif</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border rounded" />
        <span>Belum Direncanakan</span>
      </div>
    </div>
  </div>

  <div className="overflow-auto border rounded-lg">
    <table className="border-collapse text-xs min-w-max w-full">
      <thead className="sticky top-0 z-10">
        <tr className="bg-blue-900 text-white">
          <th
            rowSpan={2}
            className="border px-3 py-2 min-w-[60px]"
          >
            No
          </th>

          <th
            rowSpan={2}
            className="border px-3 py-2 min-w-[280px]"
          >
            Tahap
          </th>

          {[
            "Jan","Feb","Mar","Apr",
            "Mei","Jun","Jul","Agt",
            "Sep","Okt","Nov","Des"
          ].map((bulan) => (
            <th
              key={bulan}
              colSpan={4}
              className="border px-2 py-2"
            >
              {bulan}
            </th>
          ))}
        </tr>

        <tr className="bg-blue-700 text-white">
          {Array.from({ length: 48 }).map((_, i) => (
            <th
              key={i}
              className="border w-8 h-8"
            >
              {(i % 4) + 1}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {jadwalMR.map((item, rowIndex) => (
          <tr
            key={rowIndex}
            className="hover:bg-gray-50"
          >
            <td className="border text-center">
              {item.no}
            </td>

            <td
              className={`border px-3 py-2 ${
                item.header
                  ? "font-bold bg-gray-100"
                  : ""
              }`}
            >
              {item.tahap}
            </td>

            {item.data.map(
              (v: any, colIndex: number) => (
                <td
                  key={colIndex}
                  className={`
                    border
                    w-8
                    h-8
                    cursor-pointer
                    transition
                    hover:bg-green-200
                    ${
                      v
                        ? "bg-green-500"
                        : "bg-white"
                    }
                  `}
                />
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-end mt-4">
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
    >
      Simpan Jadwal MR
    </button>
  </div>
</div>
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

          {/* 🔥 STATUS */}
          <div>
            {isAllApproved ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                ✅ Siap Export
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                ⏳ Minimal 4 Risiko + Approval
              </span>
            )}

            <button
              onClick={() => kirimVerifikator()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Kirim ke Verifikator
            </button>
          </div>

          {detail && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-4 w-[300px] text-sm">
                <div className="font-bold mb-2">{detail.kode || "-"}</div>

                <div className="mb-2 text-xs text-gray-500">
                  {detail.subProses || "-"}
                </div>

                <div className="mb-2">
                  <b>Pernyataan Risiko :</b>
                  <br />
                  {detail.pernyataan}
                </div>

                <button
                  onClick={() => setDetail(null)}
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
