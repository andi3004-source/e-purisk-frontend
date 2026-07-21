"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [ledData, setLedData] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [komitmen, setKomitmen] = useState<any>(null);
  const [jadwalMR, setJadwalMR] = useState<any[]>([]);
  const bulanList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const minggu = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setJadwalMR((prev) =>
      prev.map((item, index) => {
        if (index !== rowIndex) return item;
        const data = Array.isArray(item.data) ? [...item.data] : [];
        data[colIndex] = data[colIndex] ? 0 : 1;
        return { ...item, data };
      }),
    );
  };
const [showKomentar, setShowKomentar] = useState(false);
const [bagian, setBagian] = useState("");
const [komentar, setKomentar] = useState("");
const bukaKomentar = (section: string) => {
    setBagian(section);
    setKomentar("");
    setShowKomentar(true);
};
const kirimKomentar = () => {
    localStorage.setItem(
    `komentar-${komitmen?.komitmen_id ?? komitmen?.id}-${bagian}`,
    komentar
);

    alert("Komentar berhasil dikirim");

    setShowKomentar(false);
};
  const pakta = komitmen?.pakta || "";
  const safeArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const sasaranList = safeArray(
    komitmen?.sasaran ||
    komitmen?.sasaranList ||
    komitmen?.sasarans
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

    indikator:
      Array.isArray(s.indikator) ? s.indikator : [],
  }));
  const internal = komitmen?.internal || [];
  const eksternal = komitmen?.eksternal || [];
  const tujuan = komitmen?.tujuan || "";
  const profilRisikoRaw =
    komitmen?.profilRisiko ||
    komitmen?.profil_risiko ||
    komitmen?.profil_risikos ||
    komitmen?.risikos ||
    [];

  const profilRisiko = Array.isArray(profilRisikoRaw) ? profilRisikoRaw : [];

  const matrix = [
    [1, 3, 5, 9, 20],
    [2, 7, 10, 13, 21],
    [4, 8, 14, 17, 22],
    [6, 12, 16, 19, 24],
    [11, 15, 18, 23, 25],
  ];

  const getNilaiRisiko = (k: number, d: number) => {
  const matrix = [
    [1, 3, 5, 9, 20],
    [2, 7, 10, 13, 21],
    [4, 8, 14, 17, 22],
    [6, 12, 16, 19, 24],
    [11, 15, 18, 23, 25],
  ];

  if (!k || !d) return 0;

  return matrix[k - 1][d - 1];
};
  const risikoKorupsi = profilRisiko.filter(
    (r: any) => String(r.kategori || "").toLowerCase() === "risiko korupsi"
  );

  const mapA:any = {};
const mapB:any = {};

profilRisiko.forEach((item:any,index:number) => {
  const kA = Number(item.k);
  const dA = Number(item.d);

  if(kA && dA){
    const keyA = `${kA}-${dA}`;
    if(!mapA[keyA]) mapA[keyA] = [];
    mapA[keyA].push({
      label:index + 1,
      data:item
    });
  }

  const kB = Number(item.rtp_k);
  const dB = Number(item.rtp_d);

  if(kB && dB){
    const keyB = `${kB}-${dB}`;
    if(!mapB[keyB]) mapB[keyB] = [];
    mapB[keyB].push({
      label:index + 1,
      data:item
    });
  }
});


  const getMapColor = (nilai: number) => {
  // Hijau tua
  if ([1, 2, 4, 5].includes(nilai)) {
    return "bg-green-700 text-white";
  }

  // Hijau muda
  if ([3, 6, 7, 8, 9, 10].includes(nilai)) {
    return "bg-lime-400 text-black";
  }

  // Kuning
  if ([11, 12, 13, 14, 15].includes(nilai)) {
    return "bg-yellow-300 text-black";
  }

  // Orange
  if ([16, 17, 18, 19].includes(nilai)) {
    return "bg-orange-500 text-black";
  }

  // Merah
  if ([20, 21, 22, 23, 24, 25].includes(nilai)) {
    return "bg-red-600 text-white";
  }

  return "bg-gray-200";
};
const getRiskColor = (nilai:number) => {
  if (nilai >= 1 && nilai <= 5)
    return "bg-green-600 text-white";

  if (nilai >= 6 && nilai <= 10)
    return "bg-lime-400 text-black";

  if (nilai >= 11 && nilai <= 15)
    return "bg-yellow-300 text-black";

  if (nilai >= 16 && nilai <= 19)
    return "bg-orange-500 text-white";

  return "bg-red-600 text-white";
};
 const renderCell = (k:number,d:number) => {
  const nilai = matrix[k-1][d-1];
  const key = `${k}-${d}`;

  const itemsA = mapA[key] || [];
  const itemsB = mapB[key] || [];

  return (
    <div
      className={`
        ${getMapColor(nilai)}
        relative
        h-24
        border
        border-white
        flex
        items-center
        justify-center
      `}
    >
      <span className="absolute top-1 right-1 text-xs font-bold">
        {nilai}
      </span>

      <div className="flex gap-1 flex-wrap justify-center">
        {itemsA.map((item:any,i:number)=>(
  <div
    key={i}
    className="
      w-6 h-6
      rounded-full
      bg-white
      border-2 border-blue-700
      text-blue-700
      text-[10px]
      font-bold
      flex
      items-center
      justify-center
    "
  >
    {item.label}
  </div>
))}

        {itemsB.map((item:any,i:number)=>(
  <div
    key={i}
    className="
      w-6 h-6
      rounded-full
      bg-white
      border-2 border-green-700
      text-green-700
      text-[10px]
      font-bold
      flex
      items-center
      justify-center
    "
  >
    {item.label}
  </div>
))}
      </div>
    </div>
  );
};


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

  const openDetail = () => { };
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await getVerifikatorDetail(String(id));
        setJadwalMR(
  safeArray(
    res.jadwalMR ||
    res.jadwal_mr ||
    res.jadwal
  )
);
        setKomitmen(res);
      } catch (error) {
        console.error("Gagal ambil detail verifikator:", error);
      }
    };

    fetchDetail();
  }, [id]);

  const downloadApprovedPDF = async () => {
    const content = document.getElementById("verifikator-pdf-area");

    if (!content) {
      alert("Area PDF tidak ditemukan!");
      return;
    }

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const wrapper = document.createElement("div");

      wrapper.innerHTML = `
      <style>
        .pdf-container {
          width: 800px;
          background: white;
          color: black;
          font-family: Arial, sans-serif;
          padding: 10px;
          box-sizing: border-box;
          font-size: 8px;
          line-height: 1.2;
        }

        .pdf-container * {
          color: black !important;
          box-sizing: border-box;
        }

        .pdf-container h1 {
          text-align: center;
          font-size: 12px;
          margin: 4px 0 10px 0;
          font-weight: bold;
        }

        .pdf-container h2 {
          font-size: 9px;
          margin: 8px 0 4px 0;
          font-weight: bold;
        }

        .pdf-container p {
          margin: 2px 0;
          font-size: 8px;
        }

        .pdf-container table {
          width: 100% !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 3px 0 8px 0;
        }

        .pdf-container table,
        .pdf-container th,
        .pdf-container td {
          border: 1px solid black !important;
        }

        .pdf-container th {
          background: white !important;
          color: black !important;
          font-weight: bold !important;
          text-align: center !important;
          font-size: 5.5px !important;
          padding: 2px !important;
        }

        .pdf-container td {
          font-size: 5.5px !important;
          padding: 2px !important;
          vertical-align: top !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
          white-space: normal !important;
        }

        .pdf-container tr {
          page-break-inside: avoid !important;
        }

        .pdf-container .bg-white,
        .pdf-container .bg-gray-100 {
          background: white !important;
        }

        .pdf-container .shadow {
          box-shadow: none !important;
        }

        .pdf-container .rounded-xl,
        .pdf-container .rounded {
          border-radius: 0 !important;
        }

        .pdf-container .p-6,
        .pdf-container .p-5,
        .pdf-container .p-4 {
          padding: 0 !important;
        }

        .pdf-container .mt-6,
        .pdf-container .mb-6,
        .pdf-container .mb-4,
        .pdf-container .mb-3,
        .pdf-container .mb-2 {
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }

        .pdf-container .space-y-6 > * + *,
        .pdf-container .space-y-3 > * + *,
        .pdf-container .space-y-1 > * + * {
          margin-top: 2px !important;
        }

        .pdf-container .overflow-x-auto {
          overflow: visible !important;
        }

        .pdf-container .min-w-\\[1800px\\],
        .pdf-container .min-w-\\[900px\\],
        .pdf-container .min-w-full {
          min-width: 100% !important;
          width: 100% !important;
        }

        .pdf-container .text-xs,
        .pdf-container .text-sm,
        .pdf-container .text-\\[11px\\],
        .pdf-container .text-\\[10px\\] {
          font-size: 6px !important;
        }

        .pdf-container .text-2xl {
          font-size: 12px !important;
        }

        .pdf-container .font-bold,
        .pdf-container .font-semibold {
          font-weight: bold !important;
        }

        .pdf-container .grid {
          display: grid !important;
          width: 100% !important;
        }

        .pdf-container .grid-cols-5 {
          grid-template-columns: repeat(5, 1fr) !important;
        }

        .pdf-container .grid > div {
          min-height: 28px !important;
          height: 28px !important;
          border: 1px solid black !important;
          padding: 2px !important;
          font-size: 5px !important;
          overflow: hidden !important;
        }

        .pdf-container .bg-green-700,
        .pdf-container .bg-green-500,
        .pdf-container .bg-blue-500,
        .pdf-container .bg-blue-600,
        .pdf-container .bg-blue-900,
        .pdf-container .bg-yellow-300,
        .pdf-container .bg-yellow-400,
        .pdf-container .bg-yellow-500,
        .pdf-container .bg-red-500,
        .pdf-container .bg-red-600,
        .pdf-container .bg-red-700,
        .pdf-container .bg-purple-700,
        .pdf-container .bg-purple-800,
        .pdf-container .bg-purple-900 {
          background: white !important;
          color: black !important;
        }

        .pdf-container button,
        .pdf-container select,
        .pdf-container label {
          display: none !important;
        }

        .pdf-container .line-clamp-3 {
          display: block !important;
          overflow: visible !important;
        }
      </style>

      <div class="pdf-container">
        ${content.innerHTML}
      </div>
    `;

      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.background = "white";

      document.body.appendChild(wrapper);

      const namaFile = `Komitmen-MR-${komitmen?.periode || ""}-${komitmen?.unit || ""}`
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, "-");

      await html2pdf()
        .set({
          margin: [5, 5, 5, 5],
          filename: `${namaFile}.pdf`,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 800,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        } as any)
        .from(wrapper)
        .save();

      document.body.removeChild(wrapper);
    } catch (error) {
      console.error("Gagal download PDF:", error);
      alert("Gagal download PDF");
    }
  };

  useEffect(() => {
    if (!komitmen) return;

    const shouldDownload = searchParams.get("download") === "1";
    const isApproved =
      String(komitmen?.status || "").toLowerCase() === "approved";

    if (!shouldDownload) return;

    if (!isApproved) {
      alert("PDF hanya bisa didownload setelah status Approved");
      return;
    }

    const timer = setTimeout(() => {
      downloadApprovedPDF();
    }, 1000);

    return () => clearTimeout(timer);
  }, [komitmen, searchParams]);


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
const kirimKomentar = () => {
    console.log("komitmen_id =", komitmen?.komitmen_id);
    console.log("bagian =", bagian);

    localStorage.setItem(
    `komentar-${komitmen?.komitmen_id ?? komitmen?.id}-${bagian}`,
    komentar
);

    console.log(
        localStorage.getItem(`komentar-${id}-${bagian}`)
    );

    alert("Komentar berhasil dikirim");
};
  const daftarBagian = [
    "pakta",
    "sasaran",
    "pemangku",
    "tujuan",
    "led",
    "profil-risiko",
    "profil-risiko-korupsi",
    "jadwal",
    "peta-risiko",
  ];

  const keyId = komitmen?.komitmen_id ?? komitmen?.id;

const adaKomentar = daftarBagian.some((bagian) =>
    localStorage.getItem(`komentar-${keyId}-${bagian}`)
);

  if (!adaKomentar) {
    alert("Silakan isi minimal satu komentar sebelum melakukan Reject.");
    return;
  }

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
  return (
    <div className="p-6">
      Loading...
    </div>
  );
}
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div
            id="verifikator-pdf-area"
            className="bg-white p-6 text-gray-900 space-y-6"
          >
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
  <div className="flex justify-between items-center mb-2">
    <h2 className="font-bold">
      1. Pakta Manajemen Risiko
    </h2>

    <button
      onClick={() => bukaKomentar("pakta")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
    >
      💬 Komentar
    </button>
  </div>

  <div className="text-sm whitespace-pre-line">
    {pakta}
  </div>
</div>

              {/* 2 SASARAN */}
              <div>
                <h2 className="font-bold mb-2">
                  2. Sasaran Strategis / Program UPR
                </h2>
              <button
      onClick={() => bukaKomentar("sasaran")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
    >
      💬 Komentar
    </button>
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
                      <React.Fragment key={`sasaran - ${i} `}>
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
                              <tr key={`kegiatan - ${i} -${kIdx} `}>
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
                     <button
      onClick={() => bukaKomentar("pemangku")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
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
                   <button
      onClick={() => bukaKomentar("tujuan")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
                <div className="text-sm whitespace-pre-line">{tujuan}</div>
              </div>
            </div>

            {/* 5 LOSS EVENT DATABASE */}
            <div>
              <h2 className="font-bold mb-2">5. Loss Event Database (LED)</h2>
                   <button
      onClick={() => bukaKomentar("led")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
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
                    <button
      onClick={() => bukaKomentar("profil-risiko")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
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
                        <tr key={`risiko - ${r.id} -${i} `}>
                          <td className="border p-2">{i + 1}</td>
                          <td className="border p-2">{r.kode}</td>
                          <td className="border p-2">{r.tujuan}</td>
                          <td className="border p-2">{r.pernyataan}</td>

                          <td className="border p-2">
                            <span
                              className={`px - 2 py - 1 rounded text - xs text - white
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
                          <td className={`border p-2 font-bold ${getRiskColor(nilai)}`}>
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
                         <td className={`border p-2 font-bold ${getRiskColor(nilaiTarget)}`}>
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
                       <button
      onClick={() => bukaKomentar("profil-risiko-korupsi")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
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
                            <td className={`border p-2 font-bold text-center ${getRiskColor(nilai)}`}>
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
                            <td className={`border p-2 font-bold text-center ${getRiskColor(nilaiTarget)}`}>
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
                     <button
    onClick={() => bukaKomentar("jadwal")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
  >
    💬 Komentar
  </button>
            <table className="text-xs border min-w-[1200px]">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th rowSpan={2} className="p-2">
                      No
                    </th>
                    <th rowSpan={2} className="p-2">
                      Tahap
                    </th>

                    {bulanList.map((b, i) => (
                      <th key={i} colSpan={4} className="p-2 border">
                        {b}
                      </th>
                    ))}
                  </tr>

                  <tr className="bg-blue-700 text-white">
                    {bulanList.map((_, i) =>
                      minggu.map((m, j) => (
                        <th key={i + "-" + j} className="p-1 border">
                          {m}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {jadwalMR.map((item: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="border p-1 text-center">
  {item.no}
</td>

                      <td className="border p-1">{item.tahap}</td>

                      {item.data.map((val: number, colIndex: number) => (
                        <td
                          key={colIndex}
                          onClick={() => toggleCell(rowIndex, colIndex)}
                          className={`border w-5 h-5 cursor-pointer ${val ? "bg-green-600" : "bg-gray-200"
                            }`}
                        ></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            {/* 🔥 PETA RISIKO */}
            <div className="bg-white rounded-xl shadow p-5 mt-6">
              <h2 className="font-semibold mb-3 text-gray-900">
                Peta Risiko
              </h2>
                    <button
      onClick={() => bukaKomentar("peta-risiko")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
    >
      💬 Komentar
    </button>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 w-full rounded overflow-hidden min-w-[900px]">
                 {[5,4,3,2,1].flatMap((k) =>
  [1,2,3,4,5].map((d) => renderCell(k,d))
)}
                </div>
              </div>
            </div>

          </div>
          {/* ===== MODAL KOMENTAR ===== */}
{showKomentar && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">

      <h2 className="text-xl font-bold mb-4">
        Komentar Verifikator
      </h2>

      <p className="text-sm text-gray-500 mb-2">
        Bagian: <b>{bagian}</b>
      </p>

      <textarea
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        rows={6}
        className="w-full border rounded p-3"
        placeholder="Tulis komentar..."
      />

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={() => setShowKomentar(false)}
          className="border px-4 py-2 rounded"
        >
          Batal
        </button>

        <button
          onClick={kirimKomentar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kirim
        </button>
      </div>

    </div>
  </div>
)}

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
