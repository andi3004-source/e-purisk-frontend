"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";



export default function ProfilPage() {
  const [komitmenList, setKomitmenList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [risiko, setRisiko] = useState<any[]>([]);
  const [sasaranList, setSasaranList] = useState<any[]>([]);
  const komitmen = komitmenList.find((k) => k.id === selectedId);
  console.log("KOMITMEN", komitmen);
console.log("JADWAL", komitmen?.jadwalMR);
const [pakta, setPakta] = useState("");
const [tujuan, setTujuan] = useState("");
const [internal, setInternal] = useState<any[]>([]);
const [eksternal, setEksternal] = useState<any[]>([]);
const [profilRisiko, setProfilRisiko] = useState<any[]>([]);

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

        /* GRID FIX */
        .grid {
          display: grid !important;
        }

        .grid-cols-5 {
          display: grid !important;
          grid-template-columns: repeat(5, 1fr) !important;
        }

        .grid-rows-5 {
          grid-template-rows: repeat(5, 1fr) !important;
        }

        .grid > div {
          height: 80px;
          border: 1px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* WARNA */
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
@media print {
  body {
    zoom: 0.6;
  }
}
.grid > div {
  height: 60px !important;
}

.grid {
  width: 100%;
  aspect-ratio: 1 / 1;
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

  // 🔥 auto print
  setTimeout(() => {
    win.print();
  }, 500);
};const rows: any[] = [];
sasaranList.forEach((s: any) => {
  s.indikator?.forEach((ind: any) => {
    ind.sub?.forEach((sub: any) => {
      sub.kegiatan?.forEach((keg: any) => {
        rows.push({
          strategis: s.sasaranStrategis,
          indikatorStrategis: s.indikatorStrategis,

          program: s.sasaranProgram,
          indikatorProgram: s.indikatorProgram,

          kegiatan: s.sasaranKegiatan,
          indikatorKegiatan: ind.nama,

          namaKegiatan: keg.nama,
          anggaran: keg.anggaran,
          tujuan: keg.tujuan || [],
        });
      });
    });
  });
});

useEffect(() => {
  if (!selectedId) return;

  const data = JSON.parse(
    localStorage.getItem("sasaran-" + selectedId) || "[]"
  );

  setSasaranList(data);

}, [selectedId]);

useEffect(() => {
  const stored = JSON.parse(
    localStorage.getItem("profil-risiko") || "[]"
  );

  setProfilRisiko(stored);
  console.log(stored);
}, []);
const jadwalMR = [
  {
    tahap: "Komunikasi & Konsultasi",
    bulan: komitmen?.jadwalMR?.komunikasi
  },
  {
    tahap: "Penetapan Konteks",
    bulan: komitmen?.jadwalMR?.konteks || []
  },
  {
    tahap: "Identifikasi Risiko",
    bulan: komitmen?.jadwalMR?.identifikasi || []
  },
  {
    tahap: "Analisis Risiko",
    bulan: komitmen?.jadwalMR?.analisis || []
  },
  {
    tahap: "Evaluasi Risiko",
    bulan: komitmen?.jadwalMR?.evaluasi || []
  },
  {
    tahap: "Respon Risiko",
    bulan: komitmen?.jadwalMR?.respon || []
  },
  {
    tahap: "RTP",
    bulan: komitmen?.jadwalMR?.rtp || []
  },
  {
    tahap: "Pemantauan",
    bulan: komitmen?.jadwalMR?.pemantauan || []
  },
  {
    tahap: "Laporan MR",
    bulan: komitmen?.jadwalMR?.laporan || []
  }
];

const bulanList = Array.from(
  new Set(
    jadwalMR.flatMap(
      (item) =>
        (Array.isArray(item.bulan)
          ? item.bulan
          : []
        ).map((x:any) => x.bulan)
    )
  )
).filter(Boolean);
const jadwalRTP = profilRisiko.flatMap((r:any) =>
  (r.rtp || []).flatMap((rtp:any) =>
    (rtp.targetList || []).map((t:any) => ({
      kegiatan: rtp.indikator || r.pernyataan,
      waktu: t.waktu
    }))
  )
);

  // 🔥 LOAD KOMITMEN
 useEffect(() => {
  const k = JSON.parse(localStorage.getItem("komitmen") || "[]");
  const r = JSON.parse(localStorage.getItem("risiko") || "[]");

  setKomitmenList(k);
  setRisiko(r);

  // 🔥 TAMBAHAN INI
  if (k.length > 0) {
    setSelectedId(k[0].id);
  }
}, []); 
  // 🔥 LOAD RISIKO SESUAI KOMITMEN
  useEffect(() => {
  if (!selectedId) return;

  const all = JSON.parse(localStorage.getItem("profil-risiko") || "[]");

  const filtered = all.filter((r: any) => r.komitmenId === selectedId);

  setRisiko(filtered);

}, [selectedId]);


useEffect(() => {
  if (!selectedId) return;

  setPakta(localStorage.getItem("pakta-" + selectedId) || "");
  setTujuan(localStorage.getItem("tujuan-" + selectedId) || "");

  setInternal(JSON.parse(localStorage.getItem("internal-" + selectedId) || "[]"));
  setEksternal(JSON.parse(localStorage.getItem("eksternal-" + selectedId) || "[]"));

}, [selectedId]);

useEffect(() => {
  if (!selectedId) return;

  const all = JSON.parse(localStorage.getItem("profil-risiko") || "[]");

  const data = all.filter((r: any) => r.komitmenId === selectedId);

  setProfilRisiko(data);

}, [selectedId]);
const mapA: any = {};
const mapB: any = {};

profilRisiko.forEach((item: any, index: number) => {

  const kA = Number(item.kemungkinan);
  const dA = Number(item.dampakNilai);

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
  // ===== MAP =====
  const map: any = {};
  risiko.forEach((item: any, index: number) => {
    const k = Number(item.kemungkinan);
    const d = Number(item.dampakNilai);
    if (!k || !d) return;

    const key = `${k}-${d}`;
    if (!map[key]) map[key] = [];
    map[key].push(`${index + 1}`);
  });

  // ===== STATUS =====
  const isAllApproved =
    risiko.length >= 4 &&
    risiko.every((r: any) => r.status === "approved");

  const kirimVerifikator = () => {

  if (!komitmen) return;

  const paktaData =
    localStorage.getItem("pakta-" + selectedId) || "";

  const tujuanData =
    localStorage.getItem("tujuan-" + selectedId) || "";

  const internalData = JSON.parse(
    localStorage.getItem("internal-" + selectedId) || "[]"
  );

  const eksternalData = JSON.parse(
    localStorage.getItem("eksternal-" + selectedId) || "[]"
  );

  const sasaranData = JSON.parse(
    localStorage.getItem("sasaran-" + selectedId) || "[]"
  );

  const profilData = JSON.parse(
    localStorage.getItem("profil-risiko") || "[]"
  ).filter(
    (r:any) => r.komitmenId === selectedId
  );

  const dataVerifikator = JSON.parse(
    localStorage.getItem("verifikator-data") || "[]"
  );

  dataVerifikator.push({
    ...komitmen,

    pakta: paktaData,
    tujuan: tujuanData,

    internal: internalData,
    eksternal: eksternalData,

    sasaranList: sasaranData,
    profilRisiko: profilData,

    jadwalMR: komitmen.jadwalMR,

    status: "Pending",
    tanggalKirim: new Date().toISOString()
  });

  localStorage.setItem(
    "verifikator-data",
    JSON.stringify(dataVerifikator)
  );

  alert("Berhasil dikirim");
};
const filtered = selectedId
  ? risiko.filter((r) => r.komitmenId === selectedId)
  : risiko;
  const risikoKorupsi = profilRisiko.filter((r: any) =>
  (r.kategori || "").toLowerCase().includes("korupsi")
);
const matrix = [
  [1, 3, 5, 9, 20],
  [2, 7, 10, 13, 21],
  [4, 8, 14, 17, 22],
  [6, 12, 16, 19, 24],
  [11, 15, 18, 23, 25]
];
  // ===== COLOR =====
  const [detail, setDetail] = useState<any>(null);

const openDetail = (data:any) => {
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
  const nilai = matrix[k-1][d-1];
  const key = `${k}-${d}`;

  const itemsA = mapA[key] || [];
  const itemsB = mapB[key] || [];

  return (
    <div className={`${getColor(nilai)} relative h-20 flex flex-col items-center justify-center border border-white`}>
      <span className="absolute top-1 right-1 text-[10px] font-bold text-black">
        {nilai}
      </span>

      <div className="flex gap-1 flex-wrap justify-center">
        {itemsA.map((item:any, i:number) => (
          <div
            key={`A-${item.data.id}-${i}`}
            onClick={() => openDetail(item.data)}
            className="w-6 h-6 bg-blue-900 text-white text-[10px] flex items-center justify-center rounded-full cursor-pointer"
          >
            {item.label}
          </div>
        ))}

        {itemsB.map((item:any, i:number) => (
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
  onChange={(e) => setSelectedId(Number(e.target.value))}
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
  <div className="bg-white rounded-xl shadow p-5 space-y-6" >

    {/* HEADER */}
    <div className="text-sm">
      <h2 className="text-center font-bold mb-3">
        KOMITMEN PENERAPAN MANAJEMEN RISIKO
      </h2>

      <p><b>Nama Pemilik Risiko</b> : {komitmen?.pemilik}</p>
      <p><b>NIP Pemilik Risiko</b> : {komitmen?.nip_pemilik}</p>
      <p><b>Jabatan Pemilik Risiko</b> : {komitmen?.jabatan_pemilik}</p>

      <p className="mt-2"><b>Nama Pengelola Risiko</b> : {komitmen?.pengelola}</p>
      <p><b>NIP Pengelola Risiko</b> : {komitmen?.nip_pengelola}</p>
      <p><b>Jabatan Pengelola Risiko</b> : {komitmen?.jabatan_pengelola}</p>

      <p className="mt-2"><b>Periode</b> : {komitmen?.periode}</p>
    </div>

    {/* 1 PAKTA */}
    <div>
      <h2 className="font-bold mb-2">1. Pakta Manajemen Risiko</h2>
      <div className="text-sm whitespace-pre-line">
        {pakta}
      </div>
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
          <b>Sasaran Strategis</b><br />
          {s.sasaranStrategis}
        </td>

        <td className="border p-2">
          {s.indikatorStrategis}
        </td>

        <td className="border p-2">-</td>
        <td className="border p-2">-</td>
      </tr>

      {/* 🟡 PROGRAM */}
      <tr>
        <td className="border p-2"></td>

        <td className="border p-2">
          <b>Sasaran Program</b><br />
          {s.sasaranProgram}
        </td>

        <td className="border p-2">
          {s.indikatorProgram}
        </td>

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
                <b>Sasaran Kegiatan</b><br />
                {s.sasaranKegiatan}
              </td>

              {/* INDIKATOR (FIX DISINI) */}
              <td className="border p-2">
                {ind.nama}
              </td>

              {/* KEGIATAN */}
              <td className="border p-2">
                {keg.nama}<br />
                <span className="text-xs text-gray-500">
                  Rp {Number(keg.anggaran || 0).toLocaleString("id-ID")}
                </span>
              </td>

              {/* TUJUAN */}
              <td className="border p-2">
                {keg.tujuan?.length
                  ? keg.tujuan.map((t: any, idx: number) => (
                      <div key={idx}>{idx + 1}. {t}</div>
                    ))
                  : "-"}
              </td>
            </tr>
          ))
        )
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
         {(internal || []).map((item:any,i:number)=>(
            <tr key={"i"+i}>
              <td>{i+1}</td>
              <td>Internal</td>
              <td>{item.nama}</td>
              <td>{item.ket}</td>
            </tr>
          ))}

         {(eksternal || []).map((item:any,i:number)=>(
            <tr key={"e"+i}>
              <td>{(komitmen.internal?.length || 0)+i+1}</td>
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

      <div className="text-sm whitespace-pre-line">
        {tujuan}
      </div>
    </div>

  </div>
)}

        {/* 5 RISIKO */}
<div>
  <h2 className="font-bold mb-2">
    5. Profil Risiko
  </h2>

  {/* VALIDASI */}
  {(() => {
    const data = profilRisiko;
    const total = data.length;

    const adaKorupsi = data.some(
      (r: any) =>
        (r.kategori || "").toLowerCase() === "risiko korupsi"
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
        <th rowSpan={2} className="border p-2">No</th>
        <th rowSpan={2} className="border p-2">Kode Risiko</th>
        <th rowSpan={2} className="border p-2">Tujuan</th>
        <th rowSpan={2} className="border p-2">Pernyataan Risiko</th>
        <th rowSpan={2} className="border p-2">Kategori</th>
        <th rowSpan={2} className="border p-2">Penyebab</th>
        <th rowSpan={2} className="border p-2">Dampak</th>

        <th colSpan={2} className="border p-2">Pengendalian</th>
        <th colSpan={3} className="border p-2">Nilai Risiko</th>

        <th rowSpan={2} className="border p-2">Prioritas</th>
        <th rowSpan={2} className="border p-2">Respon</th>

        <th colSpan={2} className="border p-2">RTP</th>

        <th rowSpan={2} className="border p-2">Alokasi</th>

        <th colSpan={3} className="border p-2">Nilai Target</th>

        <th rowSpan={2} className="border p-2">Penanggung Jawab</th>
        <th rowSpan={2} className="border p-2">Target Waktu</th>
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
      
      {profilRisiko.map((r: any, i: number) => {
        const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
        const nilaiTarget = (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

        return (
          <tr key={`risiko-${r.id}-${i}`}>
            <td className="border p-2">{i + 1}</td>
            <td className="border p-2">{r.kode}</td>
            <td className="border p-2">{r.tujuan}</td>
            <td className="border p-2">{r.pernyataan}</td>

            <td className="border p-2">
              <span className={`px-2 py-1 rounded text-xs text-white
                ${r.kategori === "Risiko Korupsi" ? "bg-red-500" : ""}
                ${r.kategori === "Risiko Keuangan" ? "bg-green-500" : ""}
                ${r.kategori === "Risiko Hukum" ? "bg-blue-500" : ""}
              `}>
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
            <td className="border p-2 bg-yellow-300 font-bold">{nilai}</td>

            <td className="border p-2">{r.prioritas}</td>
            <td className="border p-2">{r.respon}</td>

            <td className="border p-2">
              {r.rtp?.map((x:any)=>x.jenisRtp).join(", ") || "-"}
            </td>

            <td className="border p-2">
              {r.rtp?.map((x:any)=>x.uraian).join(", ") || "-"}
            </td>

            <td className="border p-2">{r.sumber}</td>

            <td className="border p-2">{r.rtp_k}</td>
            <td className="border p-2">{r.rtp_d}</td>
            <td className="border p-2 bg-green-500 text-white font-bold">
              {nilaiTarget}
            </td>

            <td className="border p-2">
              {r.rtp?.map((x:any)=>x.penanggungJawab).join(", ") || "-"}
            </td>

            <td className="border p-2">
              {r.rtp?.flatMap((x:any)=>x.targetList || []).map((t:any)=>t.waktu).join(", ") || "-"}
            </td>

            <td className="border p-2">
              {r.rtp?.map((x:any)=>x.indikator).join(", ") || "-"}
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
  <h2 className="font-bold mb-2">
    6. Profil Risiko Korupsi
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full text-xs border border-gray-300">

      {/* ================= HEADER ================= */}
      <thead className="bg-purple-900 text-white text-[11px]">
        <tr>
          <th rowSpan={3} className="border p-2">No</th>
          <th rowSpan={3} className="border p-2">Kode Risiko</th>
          <th rowSpan={3} className="border p-2">Sub Proses</th>

          <th colSpan={2} className="border p-2">Pihak Terlibat</th>

          <th rowSpan={3} className="border p-2">Pernyataan</th>
          <th rowSpan={3} className="border p-2">Sub Kategori</th>
          <th rowSpan={3} className="border p-2">Alat Bukti</th>

          <th colSpan={2} className="border p-2">Penyebab</th>

          <th rowSpan={3} className="border p-2">Pengendalian</th>

          <th colSpan={3} className="border p-2">Nilai Risiko</th>

          <th colSpan={2} className="border p-2">RTP</th>

          <th colSpan={3} className="border p-2">Nilai Target</th>

          <th rowSpan={3} className="border p-2">Indikator</th>

          <th colSpan={2} className="border p-2">Waktu</th>

          <th rowSpan={3} className="border p-2">Penanggung Jawab</th>
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
            <td colSpan={23} className="text-center p-4 text-gray-400">
              Belum ada data
            </td>
          </tr>
        ) : (
          risikoKorupsi.map((r: any, i: number) => {
            const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
            const nilaiTarget = (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

            return (
              <tr key={r.id || i}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{r.kode || "-"}</td>
                <td className="border p-2">{r.subProses || "-"}</td>

                {/* INTERNAL */}
                <td className="border p-2">
                  {r.pihakList?.filter((p:any)=>p.jenis==="INTERNAL")
                    .map((p:any)=>p.nama).join(", ") || "-"}
                </td>

                {/* EKSTERNAL */}
                <td className="border p-2">
                  {r.pihakList?.filter((p:any)=>p.jenis==="EKSTERNAL")
                    .map((p:any)=>p.nama).join(", ") || "-"}
                </td>

                <td className="border p-2">{r.pernyataan || "-"}</td>
                <td className="border p-2">{r.subKategori || "-"}</td>
                <td className="border p-2">{r.alatBukti || "-"}</td>

                {/* PENYEBAB */}
                <td className="border p-2">
                  {r.penyebabList?.map((p:any)=>p.jenis).join(", ") || "-"}
                </td>

                <td className="border p-2">
                  {r.penyebabList?.map((p:any)=>p.penyebab).join(", ") || "-"}
                </td>

                {/* PENGENDALIAN */}
                <td className="border p-2">
                  {r.penyebabList?.map((p:any)=>p.pengendalian).join(", ") || "-"}
                </td>

                {/* NILAI */}
                <td className="border p-2">{r.k || "-"}</td>
                <td className="border p-2">{r.d || "-"}</td>
                <td className="border p-2 bg-yellow-300 font-bold text-center">
                  {nilai}
                </td>

                {/* RTP */}
                <td className="border p-2">
                  {r.rtp?.map((x:any)=>x.jenisRtp).join(", ") || "-"}
                </td>

                <td className="border p-2">
                  {r.rtp?.map((x:any)=>x.uraian).join(", ") || "-"}
                </td>

                {/* TARGET */}
                <td className="border p-2">{r.rtp_k || "-"}</td>
                <td className="border p-2">{r.rtp_d || "-"}</td>
                <td className="border p-2 bg-green-500 text-white font-bold text-center">
                  {nilaiTarget}
                </td>

                {/* INDIKATOR */}
                <td className="border p-2">
                  {r.rtp?.map((x:any)=>x.indikator).join(", ") || "-"}
                </td>

                {/* WAKTU */}
                <td className="border p-2">
                  {r.rtp?.flatMap((x:any)=>x.targetList || [])
                    .map((t:any)=>t.waktu).join(", ") || "-"}
                </td>

                <td className="border p-2">
                  {r.rtp?.flatMap((x:any)=>x.targetList || [])
                    .map((t:any)=>t.realisasi || "-").join(", ") || "-"}
                </td>

                {/* PIC */}
                <td className="border p-2">
                  {r.rtp?.length
                    ? r.rtp.map((x:any)=>x.penanggungJawab).join(", ")
                    : r.penanggungJawab || "-"
                  }
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
              {renderCell(5,1)}{renderCell(5,2)}{renderCell(5,3)}{renderCell(5,4)}{renderCell(5,5)}
              {renderCell(4,1)}{renderCell(4,2)}{renderCell(4,3)}{renderCell(4,4)}{renderCell(4,5)}
              {renderCell(3,1)}{renderCell(3,2)}{renderCell(3,3)}{renderCell(3,4)}{renderCell(3,5)}
              {renderCell(2,1)}{renderCell(2,2)}{renderCell(2,3)}{renderCell(2,4)}{renderCell(2,5)}
              {renderCell(1,1)}{renderCell(1,2)}{renderCell(1,3)}{renderCell(1,4)}{renderCell(1,5)}
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
      
      <div className="font-bold mb-2">
        {detail.kode || "-"}
      </div>

      <div className="mb-2 text-xs text-gray-500">
        {detail.subProses || "-"}
      </div>

      <div className="mb-2">
        <b>Pernyataan Risiko :</b><br />
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