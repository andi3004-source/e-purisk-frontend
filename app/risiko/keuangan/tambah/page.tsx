"use client";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { usePathname } from "next/navigation";
export default function TambahProfilRisikoPage() {

  const router = useRouter();

  // STATE
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [selectedKomitmen, setSelectedKomitmen] = useState<any>(null);
  const [paketList, setPaketList] = useState<any[]>([]);
  const [risikoList, setRisikoList] = useState<any[]>([]);
  const [penyebabList, setPenyebabList] = useState<any[]>([]);
  const [pihakList, setPihakList] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [komitmenList, setKomitmenList] = useState<any[]>([]);
const komitmenId = searchParams.get("komitmenId");
const [pihakForm, setPihakForm] = useState({
  nama: "",
  jenis: "",
  jabatan: ""
});
const [step3Form, setStep3Form] = useState({
  respon: ""
});
  // HEADER
  const [header, setHeader] = useState<any>({
    unit: "",
    pemilik: "",
    level: "",
    periode: "",
    namaPemilik: "",
    jabatanPemilik: "",
    nipPemilik: "",
    namaPengelola: "",
    jabatanPengelola: "",
    nipPengelola: "",
  });
const [form, setForm] = useState<any>({
  kegiatan: "",
  tujuan: "",
  paket: "",
  kodePaket: "",
  kodePPK: "",
  namaPPK: "",
  nipPPK: "",
  tahapan: "",
  led: "",
  pernyataan: "",
  penanggungJawab: "",
  dampakKategori: "",
  alatBukti: "",
  dampak: "",
});
const [rtpList, setRtpList] = useState<any[]>([]);

const [step4Form, setStep4Form] = useState({
  penyebabId: "",
  respon: "",
  jenisRtp: "",
  berbagi: "",
  uraian: "",
  indikator: "",
  periode: "SEMESTER"
});
const [rtpScore, setRtpScore] = useState({
  k: 1,
  d: 1,
  n: 1,
  sumber: "",
  ketK: "",
  ketD: "",
});

const [unitForm, setUnitForm] = useState("");
const [unitList, setUnitList] = useState<any[]>([]);
const [klasifikasi, setKlasifikasi] = useState("");
const [openTargetModal, setOpenTargetModal] = useState(false);
const [selectedRtpId, setSelectedRtpId] = useState(null);
const pathname = usePathname();

useEffect(() => {
  if (pathname.includes("keuangan")) {
    setForm((prev:any) => ({
      ...prev,
      kategori: "Risiko Keuangan"
    }));
  }
}, [pathname]);
const [targetForm, setTargetForm] = useState({
  waktu: "",
  uraian: ""
});
  // LOAD DATA KOMITMEN
  useEffect(() => {
  const list = JSON.parse(localStorage.getItem("komitmen") || "[]");
setKomitmenList(list);

  if (!komitmenId) return;

  const found = list.find((k:any) => k.id === Number(komitmenId));

  if (found) {
    setSelectedKomitmen(found.id);

    setHeader({
      unit: found.unit,
      pemilik: found.unit,
      level: found.level,
      periode: found.periode,
      namaPemilik: found.pemilik,
      jabatanPemilik: found.jabatan_pemilik,
      nipPemilik: found.nip_pemilik,
      namaPengelola: found.pengelola,
      jabatanPengelola: found.jabatan_pengelola,
      nipPengelola: found.nip_pengelola,
    });
  }
}, [komitmenId]);
useEffect(() => {
  const paket = JSON.parse(localStorage.getItem("paket") || "[]");
  setPaketList(paket);
}, []);
useEffect(() => {
  if (komitmenId) {
    setSelectedKomitmen(Number(komitmenId));
  }
}, [komitmenId]);
useEffect(() => {
  const existing = JSON.parse(localStorage.getItem("paket") || "[]");

  if (existing.length === 0) {
    const dummy = [
      {
        id: 1,
        nama: "Paket Bendungan A",
        kode: "PKT-001",
        ppk: "PPK-01",
        namaPPK: "Budi Santoso",
        nip: "1987654321"
      },
      {
        id: 2,
        nama: "Paket Irigasi B",
        kode: "PKT-002",
        ppk: "PPK-02",
        namaPPK: "Siti Aminah",
        nip: "1981234567"
      }
    ];

    localStorage.setItem("paket", JSON.stringify(dummy));
    setPaketList(dummy);
  } else {
    setPaketList(existing);
  }
}, []);
const [step2Form, setStep2Form] = useState({
  jenis: "",
  penyebab: "",
  pengendalian: "",
  status: "",
  kemungkinan: 1,
  dampak: 1,
  skor: 1,
});
useEffect(() => {
  const matrix = [
  [1, 3, 5, 9, 20],
  [2, 7, 10, 13, 21],
  [4, 8, 14, 17, 22],
  [6, 12, 16, 19, 24],
  [11, 15, 18, 23, 25]
];

// index -1 karena array mulai dari 0
const k = Number(step2Form.kemungkinan) - 1;
const d = Number(step2Form.dampak) - 1;

const n = matrix[k]?.[d] || 0;

  setStep2Form(prev => {
    if (prev.skor === n) return prev; // ⛔ anti loop
    return { ...prev, skor: n };
  });
}, [step2Form.kemungkinan, step2Form.dampak]);
  // SELECT KOMITMEN
  const handleSelect = (e: any) => {
    const found = komitmenList.find(
  (k) => String(k.id) === e.target.value
);

    if (found) {
      setSelectedKomitmen(found.id);

      setHeader({
        unit: found.unit,
        pemilik: found.unit,
        level: found.level,
        periode: found.periode,
        namaPemilik: found.pemilik,
        jabatanPemilik: found.jabatan_pemilik,
        nipPemilik: found.nip_pemilik,
        namaPengelola: found.pengelola,
        jabatanPengelola: found.jabatan_pengelola,
        nipPengelola: found.nip_pengelola,
      });
    }
  };
  const kegiatanList = [
  {
    nama: "Operasi dan Pemeliharaan SDA",
    tujuanList: ["Operasi Bendung", "Pengelolaan SDA"]
  },
  {
    nama: "Pembangunan Bendungan",
    tujuanList: ["Peningkatan Infrastruktur"]
  }
];

const subKategoriList = [
  "Kerugian Keuangan Negara",
  "Penyalahgunaan Wewenang",
  "Gratifikasi"
];

const indikatorList = [
  "Tekanan / Pressure",
  "Kesempatan / Opportunity",
  "Rasionalisasi"
];
useEffect(() => {
  const matrix = [
    [1, 3, 5, 9, 20],
    [2, 7, 10, 13, 21],
    [4, 8, 14, 17, 22],
    [6, 12, 16, 19, 24],
    [11, 15, 18, 23, 25]
  ];

  const k = rtpScore.k - 1;
  const d = rtpScore.d - 1;

  const n = matrix[k]?.[d] || 0;

  setRtpScore(prev => {
    if (prev.n === n) return prev;
    return { ...prev, n };
  });

}, [rtpScore.k, rtpScore.d]);
const saveToStorage = () => {
  const existing = JSON.parse(localStorage.getItem("profil-risiko") || "[]");

  const newData = [...existing, ...risikoList];

  localStorage.setItem("profil-risiko", JSON.stringify(newData));
};
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

          {/* SELECT */}
          <select
            onChange={handleSelect}
            className="border p-2 rounded mb-3"
          >
            <option value="">Pilih Komitmen</option>
            {komitmenList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.periode} - {k.unit}
              </option>
            ))}
          </select>

          {/* HEADER */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm space-y-2">
              <div><b>Unit Organisasi :</b> {header.unit}</div>
              <div><b>Unit Pemilik Risiko :</b> {header.pemilik}</div>
              <div><b>Level :</b> {header.level}</div>
              <div><b>Periode :</b> {header.periode}</div>
            </div>
          </div>

          {/* PEMILIK */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow text-sm">
              <p><b>Nama Pemilik Risiko :</b> {header.namaPemilik}</p>
              <p><b>Jabatan :</b> {header.jabatanPemilik}</p>
              <p><b>NIP :</b> {header.nipPemilik}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow text-sm">
              <p><b>Nama Pengelola Risiko :</b> {header.namaPengelola}</p>
              <p><b>Jabatan :</b> {header.jabatanPengelola}</p>
              <p><b>NIP :</b> {header.nipPengelola}</p>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white p-4 rounded-xl shadow">

            <div className="flex justify-between mb-3">
              <button
                onClick={() => router.back()}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
              >
                ← Kembali
              </button>

              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                + Tambah Profil Risiko
              </button>
            </div>

            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm mb-3">
              Export Excel
            </button>

            {/* TABLE */}
            {/* TABLE */}
            <div className="w-full overflow-x-auto">
  <table className="w-full min-w-[1800px] text-xs border border-gray-300">

    <thead className="bg-purple-800 text-white text-center">

      {/* BARIS 1 */}
      <tr>
        <th rowSpan={2} className="border p-2">No</th>
        <th rowSpan={2} className="border p-2">Kode Risiko</th>
        <th rowSpan={2} className="border p-2">Tujuan Kegiatan Utama</th>
        <th rowSpan={2} className="border p-2">Pernyataan Risiko</th>
        <th rowSpan={2} className="border p-2">Kategori Risiko</th>
        <th rowSpan={2} className="border p-2">Penyebab</th>
        <th rowSpan={2} className="border p-2">Dampak</th>

        <th colSpan={2} className="border p-2">
          Pengendalian yang dilaksanakan
        </th>

        <th colSpan={3} className="border p-2">
          Nilai Risiko Setelah Pengendalian
        </th>

        <th rowSpan={2} className="border p-2">Prioritas Risiko</th>
        <th rowSpan={2} className="border p-2">Respon Risiko</th>

        <th colSpan={2} className="border p-2">
          Rencana Tindak Pengendalian (RTP)
        </th>

        <th rowSpan={2} className="border p-2">Alokasi Sumberdaya</th>

        <th colSpan={3} className="border p-2">
          Nilai Risiko yang Diharapkan
        </th>

        <th rowSpan={2} className="border p-2">Penanggung Jawab RTP</th>
        <th rowSpan={2} className="border p-2">Target Waktu</th>
        <th rowSpan={2} className="border p-2">Indikator Keluaran</th>
        <th rowSpan={2} className="border p-2">Action</th>
      </tr>

      {/* BARIS 2 */}
      <tr>
        <th className="border p-2">Uraian</th>
        <th className="border p-2">Hasil Pengendalian</th>

        <th className="border p-2">K</th>
        <th className="border p-2">D</th>
        <th className="border p-2">Nilai</th>

        <th className="border p-2">Jenis</th>
        <th className="border p-2">Uraian</th>

        <th className="border p-2">K</th>
        <th className="border p-2">D</th>
        <th className="border p-2">Nilai</th>
      </tr>

    </thead>

    <tbody>
  {risikoList.length === 0 ? (
    <tr>
      <td colSpan={20} className="text-center p-3 text-gray-400">
        Belum ada data
      </td>
    </tr>
  ) : (
    risikoList.map((r, i) => (
      <tr key={r.id}>
        <td className="border p-2">{i + 1}</td>
        <td className="border p-2">{r.kode}</td>
        <td className="border p-2">{r.tujuan}</td>
        <td className="border p-2">{r.pernyataan}</td>

        <td className="border p-2">
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
            {r.kategori}
          </span>
        </td>

        <td className="border p-2">{r.penyebab || "-"}</td>

        <td className="border p-2">
  {r.dampakKategori || r.dampak ? (
    <>
      <div className="text-blue-600 font-semibold">
        {r.dampakKategori || "-"}
      </div>
      <div className="text-xs">
        {r.dampak || "-"}
      </div>
    </>
  ) : (
    "-"
  )}
</td>

        <td className="border p-2">{r.pengendalian || "-"}</td>
        <td className="border p-2">{r.hasil || "-"}</td>

        <td className="border p-2">{r.k || "-"}</td>
        <td className="border p-2">{r.d || "-"}</td>
        <td className="border p-2">{r.skor || "-"}</td>

        <td className="border p-2">{r.prioritas || "-"}</td>

        {/* sisanya kosong dulu */}
        <td className="border p-2">{r.respon || "-"}</td>
        {/* 🔥 RTP */}
<td className="border p-2">
  {r.rtp?.map((x:any)=>x.jenisRtp).join(", ") || "-"}
</td>

<td className="border p-2">
  {r.rtp?.map((x:any)=>x.uraian).join(", ") || "-"}
</td>

{/* 🔥 ALOKASI */}
<td className="border p-2">
  {r.sumber || "-"}
</td>

{/* 🔥 NILAI RTP */}
<td className="border p-2">{r.rtp_k || "-"}</td>
<td className="border p-2">{r.rtp_d || "-"}</td>
<td className="border p-2">{r.rtp_n || "-"}</td>

{/* 🔥 PENANGGUNG JAWAB (DARI STEP 1) */}
<td className="border p-2">
  {r.penanggungJawab || "-"}
</td>

{/* 🔥 TARGET WAKTU */}
<td className="border p-2">
  {r.rtp?.flatMap((x:any)=>x.targetList || [])
    .map((t:any)=>t.waktu)
    .join(", ") || "-"}
</td>

{/* 🔥 INDIKATOR */}
<td className="border p-2">
  {r.rtp?.map((x:any)=>x.indikator).join(", ") || "-"}
</td>    
<td className="border p-2 text-center">
  <button
    onClick={() => {
      if(confirm("Yakin mau hapus data ini?")){
        setRisikoList(prev => prev.filter(x => x.id !== r.id));
      }
    }}
    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
  >
    Hapus
  </button>
</td>
  </tr>

    ))
  )}
</tbody>
</table>
            </div>

            {/* 🔥 MODAL STEP */}
            {openModal && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                <div className="bg-white w-[900px] rounded-xl max-h-[90vh] overflow-y-auto">

                  {/* HEADER */}
                  <div className="flex justify-between bg-purple-800 text-white p-3">
                    <h2>Formulir Pengisian Profil Risiko</h2>
                    <button onClick={() => setOpenModal(false)}>✕</button>
                  </div>

                  {/* STEP */}
                  <div className="flex gap-4 p-3 bg-purple-700 text-white">
                    <span className={step === 1 ? "font-bold" : ""}>Step 1</span>
                    <span className={step === 2 ? "font-bold" : ""}>Step 2</span>
                    <span className={step === 3 ? "font-bold" : ""}>Step 3</span>
                    <span className={step === 4 ? "font-bold" : ""}>Step 4</span>
                  </div>

                  <div className="p-4 space-y-4">

                    {step === 1 && (
  <>
    <div className="bg-blue-50 p-3 text-xs border rounded">
      Step 1: Isi data kegiatan, kategori risiko, dan pernyataan risiko
    </div>

    {/* KATEGORI (AUTO) */}
    <div>
      <label className="text-sm">Kategori Risiko</label>
      <input
        value="Risiko Keuangan"
        disabled
        className="w-full border p-2 rounded bg-gray-100"
      />
    </div>

    {/* NAMA KEGIATAN */}
    <div>
      <label className="text-sm">Nama Kegiatan</label>
      <select
  className="w-full border p-2 rounded"
  onChange={(e) => {
    const val = e.target.value;
    const selected = kegiatanList.find(k => k.nama === val);

    setForm((prev:any) => ({
      ...prev,
      kegiatan: val,
      tujuanList: selected?.tujuanList || []
    }));
  }}
>
  <option value="">Pilih Kegiatan</option>
  {kegiatanList.map((k,i) => (
    <option key={i} value={k.nama}>{k.nama}</option>
  ))}
</select>
    </div>

    {/* TUJUAN */}
    <div>
      <label className="text-sm">Tujuan Kegiatan Utama</label>
      <select
  className="w-full border p-2 rounded"
  onChange={(e) =>
    setForm((prev:any)=>({
      ...prev,
      tujuan: e.target.value
    }))
  }
>
  <option value="">Pilih Tujuan</option>
  {(form.tujuanList || []).map((t:any,i:number)=>(
    <option key={i}>{t}</option>
  ))}
</select>
    </div>

    {/* PAKET */}
    <div>
      <label className="text-sm">Nama Paket</label>

      <select
      
        className="w-full border p-2 rounded"
        onChange={(e) => {
          const value = e.target.value;
          <p className="text-xs text-red-500">
           Jumlah paket: {paketList.length}
          </p>
          const paket = (paketList || []).find(
  (p:any) => String(p.id) === value
);

          setSelectedPaket(paket || null);

          setForm((prev: any) => ({
            ...prev,
            paket: paket?.nama || "",
            kodePaket: paket?.kode || "",
            kodePPK: paket?.ppk || "",
            namaPPK: paket?.namaPPK || "",
            nipPPK: paket?.nip || "",
          }));
        }}
      >
        <option value="">Pilih Paket</option>
        {(paketList || []).map((p: any) => (
  <option key={p.id} value={p.id}>
    {p.nama}
  </option>
))}
      </select>

      {/* AUTO ISI */}
      {selectedPaket && (
        <div className="border rounded p-3 bg-gray-50 text-sm space-y-1 mt-2">
          <div><b>Kode Paket:</b> {selectedPaket.kode}</div>
          <div><b>Kode PPK:</b> {selectedPaket.ppk}</div>
          <div><b>Nama PPK:</b> {selectedPaket.namaPPK}</div>
          <div><b>NIP:</b> {selectedPaket.nip}</div>
        </div>
      )}
    </div>

    {/* TAHAPAN */}
    <div>
      <label className="text-sm">Tahapan Pekerjaan</label>
      <select
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm((prev: any) => ({
            ...prev,
            tahapan: e.target.value,
          }))
        }
      >
        <option>Perencanaan</option>
        <option>Pelaksanaan</option>
      </select>
    </div>

    {/* LED */}
    <div>
      <label className="text-sm">Referensi Lost Event</label>
      <select
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm((prev: any) => ({
            ...prev,
            led: e.target.value,
          }))
        }
      >
        <option value="">Pilih Referensi</option>
        <option>Data LED 1</option>
        <option>Data LED 2</option>
      </select>
    </div>

    {/* PERNYATAAN */}
    <div>
      <label className="text-sm">Pernyataan Risiko</label>
      <textarea
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm((prev: any) => ({
            ...prev,
            pernyataan: e.target.value,
          }))
        }
      />
    </div>
   
    
    {/* PJ */}
    <div>
      <label className="text-sm">Penanggung Jawab</label>
      <textarea
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm((prev: any) => ({
            ...prev,
            penanggungJawab: e.target.value,
          }))
        }
      />
    </div>

    {/* KATEGORI DAMPAK */}
    <div>
      <label className="text-sm">Kategori Dampak</label>
      <select
  className="w-full border p-2 rounded"
  value={form.dampakKategori}   // ✅ TAMBAH INI
  onChange={(e) =>
    setForm((prev: any) => ({
      ...prev,
      dampakKategori: e.target.value,
    }))
  }
>
        <option>Keuangan Negara</option>
        <option>Reputasi</option>
      </select>
    </div>

   

    {/* URAIAN DAMPAK */}
    <div>
      <label className="text-sm">Uraian Dampak</label>
      <textarea
  className="w-full border p-2 rounded"
  value={form.dampak}   // ✅ TAMBAH INI
  onChange={(e) =>
    setForm((prev: any) => ({
      ...prev,
      dampak: e.target.value,
    }))
  }
/>
    </div>

    {/* BUTTON */}
    <div className="flex justify-end">
      <button
        onClick={() => {

  // 🔥 TAMBAH INI
  if (!form.dampakKategori || !form.dampak) {
    alert("Dampak belum diisi!");
    return;
  }

  const newData = {
  id: Date.now(),
  kode: "KR-" + Math.floor(Math.random() * 1000),

  tujuan: form.tujuan,
  pernyataan: form.pernyataan,
  kategori: form.kategori,

  
  // 🔥 WAJIB BUAT FILTER
  komitmenId: selectedKomitmen,

  penyebab: "-",
  dampakKategori: form.dampakKategori,
  dampak: form.dampak,

  kegiatan: form.kegiatan,
  paket: form.paket,
  tahapan: form.tahapan,
  penanggungJawab: form.penanggungJawab,
};
          setRisikoList((prev) => [...prev, newData]);

          setStep(2);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Selanjutnya
      </button>
    </div>
  </>
)}

                    {step === 2 && (
  <>
    {/* INFO */}
    <div className="bg-blue-50 p-3 text-xs border rounded">
      Step 2: Isi penyebab, pengendalian, pihak terlibat, dan skor
    </div>
      {/* 🔥 PERNYATAAN RISIKO (AUTO DARI STEP 1) */}
<div>
  <label className="text-sm">Pernyataan Risiko</label>

  <select
    className="w-full border p-2 rounded bg-gray-100"
    value={risikoList[risikoList.length - 1]?.id || ""}
    disabled
  >
    {risikoList.map((r) => (
      <option key={r.id} value={r.id}>
        {r.kode} | {r.pernyataan}
      </option>
    ))}
  </select>
</div>
    {/* ========================= */}
    {/* 🔴 BLOK A: PENYEBAB */}
    {/* ========================= */}

    <div>
      <label className="text-sm">Jenis Penyebab</label>
      <select
        className="w-full border p-2 rounded"
        value={step2Form.jenis}
        onChange={(e)=>
          setStep2Form(prev=>({...prev, jenis:e.target.value}))
        }
      >
        <option value="">Pilih</option>
        <option>Tekanan / Pressure</option>
        <option>Kesempatan / Opportunity</option>
        <option>Rasionalisasi</option>
      </select>
    </div>

    <div>
      <label className="text-sm">Penyebab Risiko</label>
      <textarea
        className="w-full border p-2 rounded"
        value={step2Form.penyebab}
        onChange={(e)=>
          setStep2Form(prev=>({...prev, penyebab:e.target.value}))
        }
      />
    </div>

    <div>
      <label className="text-sm">Uraian Pengendalian</label>
      <textarea
        className="w-full border p-2 rounded"
        value={step2Form.pengendalian}
        onChange={(e)=>
          setStep2Form(prev=>({...prev, pengendalian:e.target.value}))
        }
      />
    </div>

    <div>
      <label className="text-sm">Status</label>
      <select
        className="w-full border p-2 rounded"
        value={step2Form.status}
        onChange={(e)=>
          setStep2Form(prev=>({...prev, status:e.target.value}))
        }
      >
        <option value="">Pilih</option>
        <option>Memadai</option>
        <option>Belum Memadai</option>
      </select>
    </div>

    {/* BUTTON TAMBAH PENYEBAB */}
    <div className="flex justify-end">
      <button
       onClick={()=>{
  if(!step2Form.penyebab) return;

  const newItem = {
    id: Date.now(),
    kode: "P-" + Math.floor(Math.random()*1000),

    jenis: step2Form.jenis,
    penyebab: step2Form.penyebab,
    pengendalian: step2Form.pengendalian,
    status: step2Form.status
  };

  setPenyebabList(prev=>[...prev, newItem]);

  setStep2Form({
    jenis: "",
    penyebab: "",
    pengendalian: "",
    status: "",
    kemungkinan: 1,
    dampak: 1,
    skor: 1,
  });
}}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2"
      >
        Tambah +
      </button>
    </div>

    {/* TABLE PENYEBAB */}
    <table className="w-full text-xs border mt-3">
      <thead className="bg-purple-800 text-white">
        <tr>
          <th className="p-2 border">No</th>
          <th className="p-2 border">Jenis</th>
          <th className="p-2 border">Penyebab</th>
          <th className="p-2 border">Pengendalian</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>

      <tbody>
        {penyebabList.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-3 text-gray-400">
              Belum ada data
            </td>
          </tr>
        ) : (
          penyebabList.map((p,i)=>(
            <tr key={p.id}>
              <td className="border p-2">{p.kode}</td>
              <td className="border p-2">{p.jenis}</td>
              <td className="border p-2">{p.penyebab}</td>
              <td className="border p-2">{p.pengendalian}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={()=>setPenyebabList(prev=>prev.filter(x=>x.id!==p.id))}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    

    {/* ========================= */}
    {/* 🟢 BLOK C: SKOR */}
    {/* ========================= */}

    <div className="mt-5 border-t pt-4">

  <h4 className="text-sm font-bold mb-3 text-blue-700">
    Skor Risiko Setelah Pengendalian
  </h4>

  {/* K & D */}
  <div className="grid grid-cols-2 gap-3">

    {/* KEMUNGKINAN */}
    <div>
      <label className="text-xs">Tingkat Kemungkinan</label>
      <select
        value={step2Form.kemungkinan}
        onChange={(e)=>
          setStep2Form(prev=>({
            ...prev,
            kemungkinan: Number(e.target.value)
          }))
        }
        className="w-full border p-2 rounded"
      >
        <option value={1}>1 - Hampir Tidak Terjadi</option>
        <option value={2}>2 - Jarang Terjadi</option>
        <option value={3}>3 - Kadang Terjadi</option>
        <option value={4}>4 - Sering Terjadi</option>
        <option value={5}>5 - Hampir Pasti Terjadi</option>
      </select>
    </div>

    {/* DAMPAK */}
    <div>
      <label className="text-xs">Tingkat Dampak</label>
      <select
        value={step2Form.dampak}
        onChange={(e)=>
          setStep2Form(prev=>({
            ...prev,
            dampak: Number(e.target.value)
          }))
        }
        className="w-full border p-2 rounded"
      >
        <option value={1}>1 - Tidak Signifikan</option>
        <option value={2}>2 - Minor</option>
        <option value={3}>3 - Moderat</option>
        <option value={4}>4 - Signifikan</option>
        <option value={5}>5 - Sangat Signifikan</option>
      </select>
    </div>

  </div>

  {/* PENJELASAN */}
  <div className="grid grid-cols-2 gap-3 mt-3">

    <textarea
      placeholder="Penjelasan Tingkat Kemungkinan"
      className="border p-2 rounded"
    />

    <textarea
      placeholder="Penjelasan Tingkat Dampak"
      className="border p-2 rounded"
    />

  </div>

  {/* SKOR */}
  <div className="mt-3">
    <label className="text-xs">Skor Risiko (K x D)</label>

    <input
      value={step2Form.skor}
      readOnly
      className={`w-full border p-2 rounded text-center font-bold ${
        step2Form.skor >= 20 ? "bg-red-500 text-white" :
        step2Form.skor >= 16 ? "bg-orange-400 text-black" :
        step2Form.skor >= 11 ? "bg-yellow-400 text-black" :
        "bg-green-400 text-black"
      }`}
    />
  </div>

</div>

    {/* ========================= */}
    {/* 🚀 FINAL */}
    {/* ========================= */}

    <div className="flex justify-end mt-4">
      <button
        onClick={() => {
          setRisikoList(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (lastIndex >= 0) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                 // STEP 2
  penyebabList,
  

  // STEP 4
  rtp: rtpList,

  // RTP SCORE
  rtp_k: rtpScore.k,
  rtp_d: rtpScore.d,
  rtp_n: rtpScore.n,
  sumber: rtpScore.sumber,
                penyebab: penyebabList.map(p=>p.penyebab).join(", "),
                pengendalian: penyebabList.map(p=>p.pengendalian).join(", "),
                hasil: penyebabList.map(p=>p.status).join(", "),

                k: step2Form.kemungkinan,
                d: step2Form.dampak,
                skor: step2Form.skor,

                prioritas:
                  step2Form.skor >= 20 ? 1 :
                  step2Form.skor >= 15 ? 2 :
                  step2Form.skor >= 10 ? 3 : 4
              };
            }

            return updated;
          });

          setStep(3);
        }}
        className="bg-blue-700 text-white px-4 py-2 rounded"
      >
        Selanjutnya
      </button>
    </div>

  </>
)}
                    {step === 3 && (
  <>
    <div className="bg-blue-50 p-3 text-xs border rounded">
      Step 3: Pilih respon risiko
    </div>

    <div>
      <label className="text-sm">Respon Risiko</label>
      <select
        className="w-full border p-2 rounded"
        value={step3Form.respon}
        onChange={(e)=>
          setStep3Form({ respon: e.target.value })
        }
      >
        <option value="">Pilih</option>
        <option value="Menerima">Menerima</option>
        <option value="Mengurangi">Mengurangi</option>
        <option value="Menghindari">Menghindari</option>
        <option value="Mentransfer">Mentransfer</option>
      </select>
    </div>

    <div className="flex justify-end mt-3">
      <button
        onClick={() => {

          if (!step3Form.respon) {
            alert("Respon belum dipilih!");
            return;
          }

          setRisikoList(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (lastIndex >= 0) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                respon: step3Form.respon
              };
            }

            return updated;
          });

          setStep(4);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Selanjutnya
      </button>
    </div>
  </>
)}

                    {step === 4 && (
  <div className="space-y-4">

    <div className="bg-blue-50 p-3 text-xs border rounded">
      Step 4: Rencana Tindak Pengendalian (RTP)
    </div>

    {/* PILIH PENYEBAB */}
    <div>
      <label className="text-sm">Pilih Penyebab Risiko</label>
      <select
        className="w-full border p-2 rounded"
        value={step4Form.penyebabId}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, penyebabId:e.target.value}))
        }
      >
        <option value="">Pilih</option>
        {penyebabList.map(p=>(
          <option key={p.id} value={p.id}>
            {p.kode} - {p.penyebab}
          </option>
        ))}
      </select>
    </div>

    {/* RESPON */}
    <div>
      <label className="text-sm">Respon Risiko</label>
      <select
        className="w-full border p-2 rounded"
        value={step4Form.respon}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, respon:e.target.value}))
        }
      >
        <option value="">Pilih</option>
        <option>Mengurangi Dampak</option>
        <option>Mengurangi Frekuensi</option>
      </select>
    </div>

    {/* BERBAGI */}
    <div>
      <label className="text-sm">Berbagi Risiko</label>
      <textarea
        className="w-full border p-2 rounded"
        value={step4Form.berbagi}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, berbagi:e.target.value}))
        }
      />
    </div>

    
    {/* JENIS RTP */}
    <div>
      <label className="text-sm">Jenis RTP</label>
      <input
        className="w-full border p-2 rounded"
        value={step4Form.jenisRtp}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, jenisRtp:e.target.value}))
        }
      />
    </div>

    {/* URAIAN */}
    <div>
      <label className="text-sm">Uraian RTP</label>
      <textarea
        className="w-full border p-2 rounded"
        value={step4Form.uraian}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, uraian:e.target.value}))
        }
      />
    </div>

    {/* INDIKATOR */}
    <div>
      <label className="text-sm">Indikator Keluaran</label>
      <textarea
        className="w-full border p-2 rounded"
        value={step4Form.indikator}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, indikator:e.target.value}))
        }
      />
    </div>

    {/* PERIODE */}
    <div>
      <label className="text-sm">Periode</label>
      <select
        className="w-full border p-2 rounded"
        value={step4Form.periode}
        onChange={(e)=>
          setStep4Form(prev=>({...prev, periode:e.target.value}))
        }
      >
        <option>SEMESTER</option>
        <option>TAHUNAN</option>
      </select>
    </div>

    {/* BUTTON TAMBAH */}
    <div className="flex justify-end">
      <button
        onClick={()=>{
          if(!step4Form.penyebabId){
            alert("Penyebab belum dipilih!");
            return;
          }

          const penyebab = penyebabList.find(p=>p.id == step4Form.penyebabId);

          const newItem = {
            id: Date.now(),
            kode: penyebab?.kode,
            penyebab: penyebab?.penyebab,
            penanggungJawab: form.penanggungJawab,
            targetList: [],
            ...step4Form
          };

          setRtpList(prev=>[...prev, newItem]);

          setStep4Form({
            penyebabId: "",
            respon: "",
            berbagi: "",
            jenisRtp: "",
            uraian: "",
            indikator: "",
            periode: "SEMESTER"
          });
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Tambah +
      </button>
    </div>

    {/* TABLE */}
    <table className="w-full text-xs border mt-4">
      <thead className="bg-purple-800 text-white">
        <tr>
          <th className="border p-2">No</th>
          <th className="border p-2">K. Penyebab</th>
          <th className="border p-2">Uraian Penyebab</th>
          <th className="border p-2">Jenis Korupsi</th>
          <th className="border p-2">Jenis RTP</th>
          <th className="border p-2">Uraian RTP</th>
          <th className="border p-2">Respon</th>
          <th className="border p-2">Berbagi</th>
          <th className="border p-2">Indikator</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
  {rtpList.length === 0 ? (
    <tr>
      <td colSpan={10} className="text-center p-3 text-gray-400">
        Belum ada data
      </td>
    </tr>
  ) : (
    <>
      {rtpList.map((r,i)=>(
        <React.Fragment key={r.id}>
          <tr>
            <td className="border p-2">{i+1}</td>
            <td className="border p-2">{r.kode}</td>
            <td className="border p-2">{r.penyebab}</td>
            <td className="border p-2">{r.jenisKorupsi}</td>
            <td className="border p-2">{r.jenisRtp}</td>
            <td className="border p-2">{r.uraian}</td>
            <td className="border p-2">{r.respon}</td>
            <td className="border p-2">{r.berbagi}</td>
            <td className="border p-2">{r.indikator}</td>

            <td className="border p-2 text-center">
              <button 
                onClick={()=>{
                  setSelectedRtpId(r.id);
                  setOpenTargetModal(true);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
              >
                Target
              </button>

              <button
                onClick={()=>setRtpList(prev=>prev.filter(x=>x.id!==r.id))}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>

          {/* 🔥 SUB TARGET */}
          {r.targetList && r.targetList.map((t:any)=>(
            <tr key={t.id} className="bg-gray-100">
              <td colSpan={3}></td>
              <td colSpan={3} className="border p-2 text-xs">
                📅 {t.waktu}
              </td>
              <td colSpan={3} className="border p-2 text-xs">
                {t.uraian}
              </td>
              <td></td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </>
  )}
</tbody>
    </table>
{/* ========================= */}
{/* 🔵 SKOR RISIKO RTP */}
{/* ========================= */}

<div className="mt-6">

  <h4 className="text-sm font-bold text-blue-700 mb-3">
    Skor Risiko Rencana Tindak Pengendalian (RTP)
  </h4>

  {/* ALOKASI */}
  <textarea
    placeholder="Alokasi Sumber Daya"
    className="w-full border p-2 rounded mb-3"
    value={rtpScore.sumber}
    onChange={(e)=>setRtpScore(prev=>({...prev, sumber:e.target.value}))}
  />

  <div className="grid grid-cols-2 gap-3">
<div className="grid grid-cols-2 gap-3 mt-3">

  <textarea
    placeholder="Penjelasan Tingkat Kemungkinan"
    className="border p-2 rounded"
    value={rtpScore.ketK}
    onChange={(e)=>
      setRtpScore(prev=>({...prev, ketK:e.target.value}))
    }
  />

  <textarea
    placeholder="Penjelasan Tingkat Dampak"
    className="border p-2 rounded"
    value={rtpScore.ketD}
    onChange={(e)=>
      setRtpScore(prev=>({...prev, ketD:e.target.value}))
    }
  />

</div>
    {/* KEMUNGKINAN */}
    <select
      className="border p-2 rounded"
      value={rtpScore.k}
      onChange={(e)=>setRtpScore(prev=>({...prev, k:Number(e.target.value)}))}
    >
      <option value={1}>1 - Hampir Tidak Terjadi</option>
      <option value={2}>2 - Jarang Terjadi</option>
      <option value={3}>3 - Kadang Terjadi</option>
      <option value={4}>4 - Sering Terjadi</option>
      <option value={5}>5 - Hampir Pasti</option>
    </select>

    {/* DAMPAK */}
    <select
      className="border p-2 rounded"
      value={rtpScore.d}
      onChange={(e)=>setRtpScore(prev=>({...prev, d:Number(e.target.value)}))}
    >
      <option value={1}>1 - Tidak Signifikan</option>
      <option value={2}>2 - Minor</option>
      <option value={3}>3 - Moderat</option>
      <option value={4}>4 - Signifikan</option>
      <option value={5}>5 - Sangat Signifikan</option>
    </select>

  </div>

  {/* NILAI */}
  <input
    value={rtpScore.n}
    readOnly
    className={`w-full mt-3 p-2 text-center font-bold rounded ${
      rtpScore.n >= 20 ? "bg-red-500 text-white" :
      rtpScore.n >= 16 ? "bg-orange-400" :
      rtpScore.n >= 11 ? "bg-yellow-400" :
      "bg-green-400"
    }`}
  />

</div>

{/* ========================= */}
{/* 🟣 UNIT TEMBUSAN */}
{/* ========================= */}

<div className="mt-6">

  <h4 className="text-sm font-bold text-blue-700 mb-2">
    Unit Tembusan
  </h4>

  <div className="flex gap-2">
    <input
      className="border p-2 w-full rounded"
      value={unitForm}
      onChange={(e)=>setUnitForm(e.target.value)}
    />

    <button
      onClick={()=>{
        if(!unitForm) return;

        setUnitList(prev=>[
          ...prev,
          { id: Date.now(), nama: unitForm }
        ]);

        setUnitForm("");
      }}
      className="bg-blue-600 text-white px-3 rounded"
    >
      Tambah +
    </button>
  </div>

  <table className="w-full text-xs border mt-3">
    <thead className="bg-purple-800 text-white">
      <tr>
        <th className="border p-2">No</th>
        <th className="border p-2">Nama Unit / Satker</th>
        <th className="border p-2">Action</th>
      </tr>
    </thead>

    <tbody>
  {unitList.map((u,i)=>(
    <tr key={u.id}>
      <td className="border p-2">{i+1}</td>
      <td className="border p-2">{u.nama}</td>
      <td className="border p-2 text-center">
        <button
          onClick={()=>setUnitList(prev=>prev.filter(x=>x.id!==u.id))}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Hapus
        </button>
      </td>
    </tr>
  ))}
</tbody>
  </table>

</div>

{/* ========================= */}
{/* 🟢 KLASIFIKASI */}
{/* ========================= */}

<div className="mt-6">
  <label className="text-sm">Klasifikasi</label>

  <select
    className="w-full border p-2 rounded"
    value={klasifikasi}
    onChange={(e)=>setKlasifikasi(e.target.value)}
  >
    <option value="">Pilih</option>
    <option>Risiko Organisasi</option>
    <option>Risiko Strategis</option>
  </select>
</div>
{openTargetModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div className="bg-white w-[500px] rounded-xl p-4">

      <div className="flex justify-between mb-3">
        <h3 className="font-bold">Target Waktu</h3>
        <button onClick={()=>setOpenTargetModal(false)}>✕</button>
      </div>

      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        value={targetForm.waktu}
        onChange={(e)=>setTargetForm(prev=>({...prev, waktu:e.target.value}))}
      />

      <textarea
        placeholder="Uraian"
        className="w-full border p-2 rounded mb-3"
        value={targetForm.uraian}
        onChange={(e)=>setTargetForm(prev=>({...prev, uraian:e.target.value}))}
      />

      <button
        onClick={()=>{
          if(!targetForm.waktu) return;

          setRtpList(prev=>{
            return prev.map(r=>{
              if(r.id === selectedRtpId){
                return {
                  ...r,
                  targetList: [
                    ...(r.targetList || []),
                    {
                      id: Date.now(),
                      waktu: targetForm.waktu,
                      uraian: targetForm.uraian
                    }
                  ]
                };
              }
              return r;
            });
          });

          setTargetForm({ waktu:"", uraian:"" });
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Tambah +
      </button>

    </div>
  </div>
)}
{/* ========================= */}
{/* 🚀 SIMPAN */}
{/* ========================= */}

<div className="flex justify-end mt-5">
  <button
   onClick={()=>{
  setRisikoList(prev=>{
    const updated = [...prev];
    const last = updated.length - 1;

    if(last >= 0){

      const allTarget = rtpList.flatMap(r=>r.targetList || []);

      const newData = {
        ...updated[last],

        komitmenId: selectedKomitmen,

        rtp: rtpList,
        rtp_k: rtpScore.k,
        rtp_d: rtpScore.d,
        rtp_n: rtpScore.n,
        sumber: rtpScore.sumber,

        targetGabungan: allTarget.map(t=>t.waktu).join(", "),
        targetUraian: allTarget.map(t=>t.uraian).join(", "),

        unit: unitList.map(u=>u.nama).join(", "),
        klasifikasi
      };

      updated[last] = newData;

      // 🔥 SIMPAN KE localStorage
      const existing = JSON.parse(localStorage.getItem("profil-risiko") || "[]");

// 🔥 ANTI DOUBLE BERDASARKAN ID
const exists = existing.find((x:any) => x.id === newData.id);

const updatedStorage = exists
  ? existing.map((x:any)=> x.id === newData.id ? newData : x)
  : [...existing, newData];

localStorage.setItem("profil-risiko", JSON.stringify(updatedStorage));
    }

    return updated;
  });

  setOpenModal(false);
  setStep(1);
}}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Simpan
  </button>
</div>
    

    </div>

  
)}

                  </div>
                  </div>
                </div>
              
             )}
          </div>
        </div>
      </div>
    </div>

  );
}