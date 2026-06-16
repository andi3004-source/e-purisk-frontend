"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
export default function ProfilRisikoPage() {

  const router = useRouter();

  const [profilRisiko, setProfilRisiko] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedKomitmenKorupsi, setSelectedKomitmenKorupsi] = useState<number | null>(null);
  const searchParams = useSearchParams();
  
const komitmenId = searchParams.get("komitmenId");
const filteredKorupsi = selectedKomitmenKorupsi
  ? profilRisiko.filter((r) => r.komitmenId === selectedKomitmenKorupsi)
  : profilRisiko;
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

  const handleSubmit = () => {
    const newData = [
  ...profilRisiko,
  {
    ...form,
    komitmenId: selectedKomitmen
     // 🔥 INI WAJIB
  }
  
];
    setProfilRisiko(newData);
    localStorage.setItem("profil-risiko", JSON.stringify(newData));
    setOpen(false);

    setForm({
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
  };
  const kategoriColorMap: Record<string, string> = {
  "risiko korupsi": "bg-red-500",
  "risiko keuangan": "bg-green-500",
  "risiko hukum": "bg-blue-500",
  "risiko kinerja": "bg-yellow-500",
  "risiko layanan": "bg-gray-500",
  "risiko reputasi": "bg-purple-500",
  "risiko kecelakaan kerja": "bg-orange-500",
  "risiko spbe": "bg-indigo-500",
  "risiko lainnya": "bg-violet-500",
};
const getKategoriColor = (kategori: string) => {
  return kategoriColorMap[kategori?.toLowerCase()] || "bg-gray-400";
};
const [komitmenList, setKomitmenList] = useState<any[]>([]);
const [selectedKomitmen, setSelectedKomitmen] = useState<number | null>(null);
const [selectedData, setSelectedData] = useState<any>(null);
useEffect(() => {
  const data = JSON.parse(localStorage.getItem("komitmen") || "[]");
  setKomitmenList(data);
}, []);
const filteredRisiko = selectedKomitmen
  ? profilRisiko.filter((r) => r.komitmenId === selectedKomitmen)
  : profilRisiko;
  // LOAD DATA
  
    useEffect(() => {
  const data = JSON.parse(localStorage.getItem("profil-risiko") || "[]");
  setProfilRisiko(data);
  console.log("DATA PROFIL:", data);
}, []);
useEffect(() => {
  if (komitmenId) {
    setSelectedKomitmen(Number(komitmenId));
  }
}, [komitmenId]);
const handleSaveRisiko = () => {
  if (!selectedKomitmen) {
    alert("Pilih komitmen dulu!");
    return;
  }

  const existing = JSON.parse(localStorage.getItem("risiko") || "[]");

  const newRisiko = {
    id: Date.now(),
    komitmenId: selectedKomitmen, // 🔥 KUNCI
    jenis: "lainnya",
    uraian: form.uraian,
    dampak: form.dampak,
  };

  localStorage.setItem("risiko", JSON.stringify([...existing, newRisiko]));
};
useEffect(() => {
  if (!selectedKomitmen) return;

  const found = komitmenList.find(
    (k) => k.id === selectedKomitmen
  );

  setSelectedData(found);
}, [selectedKomitmen, komitmenList]);
  // AUTO MAP KE KORUPSI
  
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
      <p><b>Nama Pemilik:</b> {selectedData.pemilik}</p>
      <p><b>Jabatan:</b> {selectedData.jabatan_pemilik}</p>
      <p><b>NIP:</b> {selectedData.nip_pemilik}</p>
    </div>

    <div>
      <p><b>Nama Pengelola:</b> {selectedData.pengelola}</p>
      <p><b>Jabatan:</b> {selectedData.jabatan_pengelola}</p>
      <p><b>NIP:</b> {selectedData.nip_pengelola}</p>
    </div>

  </div>
)}
           <div className="flex gap-2 mb-3">

  {/* 🔥 FILTER KOMITMEN */}
  <select
    value={selectedKomitmen || ""}
    onChange={(e) =>
      setSelectedKomitmen(
        e.target.value ? Number(e.target.value) : null
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

  router.push(`/risiko/lainnya/tambah?komitmenId=${selectedKomitmen}`);
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
{filteredRisiko.length === 0 ? (
  <tr>
    <td colSpan={23} className="text-center p-4 text-gray-400">
      Belum ada data
    </td>
  </tr>
) : (
  filteredRisiko.map((r, i) => {

    const nilai = (Number(r.k) || 0) * (Number(r.d) || 0);
    const nilaiTarget = (Number(r.rtp_k) || 0) * (Number(r.rtp_d) || 0);

    return (
      <tr key={i}>

        <td className="border p-2">{i+1}</td>
        <td className="border p-2">{r.kode}</td>
        <td className="border p-2">{r.tujuan}</td>
        <td className="border p-2">{r.pernyataan}</td>

        <td className="border p-2">
          <span
  className={`px-2 py-1 rounded text-xs text-white ${getKategoriColor(r.kategori)}`}
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
          {r.rtp?.length
  ? r.rtp.map((x:any)=>x.penanggungJawab).join(", ")
  : r.penanggungJawab || "-"
}
        </td>

        <td className="border p-2">
          {r.rtp?.flatMap((x:any)=>x.targetList || [])
            .map((t:any)=>t.waktu).join(", ") || "-"}
        </td>

        <td className="border p-2">
          {r.rtp?.map((x:any)=>x.indikator).join(", ") || "-"}
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

          
      </div> {/* p-6 */}
    </div>   {/* flex-1 */}
  </div>   

);}
