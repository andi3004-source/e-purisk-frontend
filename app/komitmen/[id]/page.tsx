"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DetailKomitmenPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [dataSasaran, setDataSasaran] = useState<any[]>([]);
const saveToKomitmen = () => {
  const all = JSON.parse(localStorage.getItem("komitmen") || "[]");

  const updated = all.map((k:any) => {
    if (k.id === Number(id)) {
      return {
        ...k,

        // 🔥 INI YANG MASUK KE PROFIL
        pakta: pakta,
        tujuan: tujuan,
        internal: internal,
        eksternal: eksternal,
      };
    }
    return k;
  });

  localStorage.setItem("komitmen", JSON.stringify(updated));
};
  // 🔥 TAMBAHAN
  const [pakta, setPakta] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [internal, setInternal] = useState<any[]>([]);
  const [eksternal, setEksternal] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sasaran-" + id) || "[]");
    setDataSasaran(data);

    setPakta(localStorage.getItem("pakta-" + id) || "");
    setTujuan(localStorage.getItem("tujuan-" + id) || "");

    setInternal(JSON.parse(localStorage.getItem("internal-" + id) || "[]"));
    setEksternal(JSON.parse(localStorage.getItem("eksternal-" + id) || "[]"));
  }, [id]);

  const savePakta = () => {
    localStorage.setItem("pakta-" + id, pakta);
  };

const saveTujuan = () => {
  localStorage.setItem("tujuan-" + id, tujuan);
};

const saveToProfil = () => {
  const profil = {
  id: Number(id),
  // 🔥 TAMBAHAN INI
  pemilik: komitmen?.pemilik,
  nip_pemilik: komitmen?.nip_pemilik,
  jabatan_pemilik: komitmen?.jabatan_pemilik,

  pengelola: komitmen?.pengelola,
  nip_pengelola: komitmen?.nip_pengelola,
  jabatan_pengelola: komitmen?.jabatan_pengelola,
    pakta,
    tujuan,
    internal,
    eksternal,
    sasaran: dataSasaran,
    jadwal,
  };

  localStorage.setItem(
  "komitmen-detail-" + Number(id),
  JSON.stringify(profil)
);

  alert("Data berhasil masuk ke Profil Risiko!");
};

function addInternal() {
    const nama = prompt("Nama Internal");
    const ket = prompt("Keterangan");
    if (!nama) return;

    const newData = [...internal, { nama, ket }];
    setInternal(newData);
    localStorage.setItem("internal-" + id, JSON.stringify(newData));
  }

  const addEksternal = () => {
    const nama = prompt("Nama Eksternal");
    const ket = prompt("Keterangan");
    if (!nama) return;

    const newData = [...eksternal, { nama, ket }];
    setEksternal(newData);
    localStorage.setItem("eksternal-" + id, JSON.stringify(newData));
  };
  const bulanList = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
];

const minggu = [1, 2, 3, 4];

const [jadwal, setJadwal] = useState<any[]>([
  {
    tahap: "Identifikasi Risiko",
    data: Array(48).fill(0),
  },
  {
    tahap: "Analisis Risiko",
    data: Array(48).fill(0),
  },
]);

const toggleCell = (rowIndex: number, colIndex: number) => {
  const newData = [...jadwal];
  newData[rowIndex].data[colIndex] =
    newData[rowIndex].data[colIndex] === 1 ? 0 : 1;

  setJadwal(newData);

  localStorage.setItem("jadwal-" + id, JSON.stringify(newData));
};
const [showModal, setShowModal] = useState(false);
const [selectedIndex, setSelectedIndex] = useState({
  i: 0,
  ind: 0,
  sub: 0,
});

const [kegiatanInput, setKegiatanInput] = useState("");
const [anggaranInput, setAnggaranInput] = useState("");
const [komitmen, setKomitmen] = useState<any>(null);

useEffect(() => {
  const all = JSON.parse(localStorage.getItem("komitmen") || "[]");

  const found = all.find((item: any) => item.id == id);

  setKomitmen(found);

}, [id]);
return (
  <>
    {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[400px] text-black">

      <h2 className="font-bold mb-3">Tambah Kegiatan Utama</h2>

      <textarea
        value={kegiatanInput}
        onChange={(e) => setKegiatanInput(e.target.value)}
        placeholder="Isi kegiatan utama"
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="number"
        value={anggaranInput}
        onChange={(e) => setAnggaranInput(e.target.value)}
        placeholder="Isi anggaran"
        className="w-full border p-2 rounded mb-3"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Batal
        </button>

        <button
          onClick={() => {
            const newData = [...dataSasaran];

            const target =
              newData[selectedIndex.i]
                .indikator[selectedIndex.ind]
                .sub[selectedIndex.sub];

            if (!target.kegiatan) target.kegiatan = [];

            target.kegiatan.push({
  nama: kegiatanInput,
  anggaran: anggaranInput,
  tujuan: [],
});

            setDataSasaran(newData);

            localStorage.setItem(
              "sasaran-" + id,
              JSON.stringify(newData)
            );
setKegiatanInput("");
setAnggaranInput("");
setShowModal(false);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Simpan
        </button>
      </div>

  </div>
</div>
  )}
  <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 text-gray-900">

          {/* ================= HEADER ================= */}
          <div className="bg-white p-4 rounded-xl shadow text-sm">
            <button
              onClick={() => router.back()}
              className="mb-3 bg-purple-600 text-white px-3 py-1 rounded"
            >
              ← Kembali
            </button>

            <div className="grid grid-cols-2 gap-2">
              <p><b>Unit Organisasi</b> : {komitmen?.unit}</p>
<p><b>Unit Pemilik Risiko</b> : {komitmen?.unit}</p>
<p><b>Level</b> : {komitmen?.level}</p>
<p><b>Anggaran</b> : Rp {Number(komitmen?.anggaran || 0).toLocaleString("id-ID")}</p>
<p><b>Periode</b> : {komitmen?.periode}</p>
              <p>
                <b>Status</b> :
                <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  Kirim Perbaikan
                </button>
              </p>
            </div>
          </div>

          {/* ================= PEMILIK RISIKO ================= */}
          <div className="bg-white p-4 rounded-xl shadow text-sm">
            <h2 className="font-bold mb-3 text-center">
              Pemilik Risiko / Pengelola Risiko
            </h2>

            <div className="grid grid-cols-2 gap-4">
  {/* PEMILIK */}
  <div>
    <p><b>Nama</b> : {komitmen?.pemilik}</p>
    <p><b>Jabatan</b> : {komitmen?.jabatan_pemilik}</p>
    <p><b>NIP</b> : {komitmen?.nip_pemilik}</p>
  </div>

  {/* PENGELOLA */}
  <div>
    <p><b>Nama</b> : {komitmen?.pengelola}</p>
    <p><b>Jabatan</b> : {komitmen?.jabatan_pengelola}</p>
    <p><b>NIP</b> : {komitmen?.nip_pengelola}</p>
  </div>
</div>
          </div>
<button
  onClick={() => router.push(`/risiko/korupsi?komitmenId=${id}`)}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Kelola Risiko
</button>
          {/* ================= 1 PAKTA ================= */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              1. Pakta Manajemen Risiko
            </h2>

            <textarea
              value={pakta}
              onChange={(e) => setPakta(e.target.value)}
              onBlur={savePakta}
              className="w-full border p-3 rounded text-sm text-black bg-white"
              rows={4}
            />
          </div>

          {/* ================= 2 LINGKUP ================= */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              2. Lingkup dan Konteks
            </h2>

            <button
              onClick={() => router.push(`/komitmen/${id}/sasaran/tambah`)}
              className="bg-purple-500 text-white px-3 py-1 rounded text-xs mb-3"
            >
              + Sasaran Kegiatan
            </button>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border rounded-lg overflow-hidden">
                <thead className="bg-purple-900 text-white text-center">
  <tr>
    <th className="p-2 border">No</th>
    <th className="p-2 border">Sasaran Kegiatan</th>
    <th className="p-2 border">Indikator Sasaran</th>
    <th className="p-2 border">Sub Indikator</th>
    <th className="p-2 border">Kegiatan Utama</th>
    <th className="p-2 border">Tujuan Kegiatan</th>
  </tr>
</thead>

                <tbody>
  {dataSasaran.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center p-4 text-gray-400">
        Belum ada data
      </td>
    </tr>
  ) : (
    dataSasaran.map((item, i) => (
      <tr key={i} className="align-top border">
        
        {/* NO */}
        <td className="p-2 border text-center">{i + 1}</td>

        {/* SASARAN */}
        <td className="p-2 border">
{/* 🔥 ACTION BUTTON (WAJIB BALIKIN) */}
<div className="mt-2 flex gap-1">

  {/* TAMBAH INDIKATOR */}
  <button
    onClick={() => {
      const nama = prompt("Nama indikator");
      if (!nama) return;

      const newData = [...dataSasaran];

      if (!newData[i].indikator) newData[i].indikator = [];

      newData[i].indikator.push({
        nama,
        sub: [],
      });

      setDataSasaran(newData);
      localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
    }}
    className="bg-blue-600 text-white px-2 py-1 text-[10px] rounded"
  >
    Tambah Indikator
  </button>

  {/* HAPUS */}
  <button
    onClick={() => {
      const newData = dataSasaran.filter((_, index) => index !== i);
      setDataSasaran(newData);
      localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
    }}
    className="bg-red-500 text-white px-2 py-1 text-[10px] rounded"
  >
    Hapus
  </button>

</div>
  {/* STRATEGIS */}
  <div className="text-[11px] text-gray-800">
    <b>Sasaran Strategis:</b><br />
    {item.sasaranStrategis || "-"}
  </div>

  <div className="text-[11px] text-gray-500 mt-1">
    <b>Indikator Strategis:</b><br />
    {item.indikatorStrategis || "-"}
  </div>

  {/* PROGRAM */}
  <div className="text-[11px] text-gray-500 mt-2">
    <b>Sasaran Program:</b><br />
    {item.sasaranProgram || "-"}
  </div>

  <div className="text-[11px] text-gray-500 mt-1">
    <b>Indikator Program:</b><br />
    {item.indikatorProgram || "-"}
  </div>

  {/* KEGIATAN */}
  <div className="font-semibold text-gray-800 mt-2">
    <b>Sasaran Kegiatan:</b><br />
    {item.sasaranKegiatan || "-"}
  </div>

      <div className="text-[11px] text-gray-500 mt-1">
    <b>Indikator Program:</b><br />
    {item.indikatorKegiatan || "-"}
  </div>
</td>

        {/* INDIKATOR */}
        <td className="p-2 border space-y-2">
          {item.indikator?.length > 0 ? (
            item.indikator.map((ind: any, idx: number) => (
              <div key={idx} className="bg-gray-50 p-2 rounded border">
                <div>{ind.nama}</div>

                <button
  onClick={() => {
    const nama = prompt("Nama sub indikator");
    if (!nama) return;

    const newData = [...dataSasaran];

    if (!newData[i].indikator[idx].sub)
      newData[i].indikator[idx].sub = [];

    newData[i].indikator[idx].sub.push({
      nama,
      kegiatan: [],
    });

    setDataSasaran(newData);
    localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
  }}
  className="mt-1 bg-blue-500 text-white px-2 py-1 text-[10px] rounded"
>
  Tambah Sub
</button>
<button
  onClick={() => {
    const newData = [...dataSasaran];

    newData[i].indikator.splice(idx, 1);

    setDataSasaran(newData);
    localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
  }}
  className="mt-1 ml-1 bg-red-500 text-white px-2 py-1 text-[10px] rounded"
>
  Hapus
</button>

                
              </div>
            ))
          ) : (
            <span className="text-gray-800">-</span>
          )}
        </td>

{/* SUB */}
<td className="p-2 border space-y-2">
  {item.indikator?.map((ind: any, indIndex: number) =>
    ind.sub?.map((sub: any, idx: number) => (
      <div key={idx} className="bg-white p-2 rounded border">
        <div>{sub.nama}</div>

        <button
          onClick={() => {
            setSelectedIndex({ i, ind: indIndex, sub: idx });
            setShowModal(true);
          }}
          className="mt-1 bg-blue-600 text-white px-2 py-1 text-[10px] rounded"
        >
          Tambah Kegiatan
        </button>
        
      </div>
    ))
  )}
</td>

        {/* KEGIATAN */}
<td className="p-2 border space-y-2">
  {item.indikator?.map((ind: any, indIndex: number) =>
    ind.sub?.map((sub: any, subIndex: number) =>
      sub.kegiatan?.map((keg: any, idx: number) => (
        <div key={idx} className="bg-gray-50 p-2 rounded border">
          
          <div className="font-semibold">{keg.nama}</div>

          <div className="text-xs text-gray-500">
            Rp {Number(keg.anggaran || 0).toLocaleString("id-ID")}
          </div>

          <div className="flex gap-1 mt-1">
            
            {/* EDIT */}
            <button
              onClick={() => {
                const newNama = prompt("Edit kegiatan", keg.nama);
                if (!newNama) return;

                const newData = [...dataSasaran];

                newData[i]
                  .indikator[indIndex]
                  .sub[subIndex]
                  .kegiatan[idx].nama = newNama;

                setDataSasaran(newData);
                localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
              }}
              className="bg-gray-300 px-2 py-1 text-[10px] rounded"
            >
              ✏️
            </button>

            {/* HAPUS */}
            <button
              onClick={() => {
                const newData = [...dataSasaran];

                newData[i]
                  .indikator[indIndex]
                  .sub[subIndex]
                  .kegiatan.splice(idx, 1);

                setDataSasaran(newData);
                localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
              }}
              className="bg-gray-300 px-2 py-1 text-[10px] rounded"
            >
              🗑️
            </button>

            {/* TKU */}
            <button
              onClick={() => {
                const t = prompt("Tambah tujuan kegiatan");
                if (!t) return;

                const newData = [...dataSasaran];

                if (!newData[i].indikator[indIndex].sub[subIndex].kegiatan[idx].tujuan) {
                  newData[i].indikator[indIndex].sub[subIndex].kegiatan[idx].tujuan = [];
                }

                newData[i]
                  .indikator[indIndex]
                  .sub[subIndex]
                  .kegiatan[idx]
                  .tujuan.push(t);

                setDataSasaran(newData);
                localStorage.setItem("sasaran-" + id, JSON.stringify(newData));
              }}
              className="bg-blue-700 text-white px-2 py-1 text-[10px] rounded"
            >
              + TKU
            </button>

          </div>
        </div>
      ))
    )
  )}
</td>
        {/* TUJUAN */}
        <td className="p-2 border space-y-2">
          {item.indikator?.map((ind: any) =>
            ind.sub?.map((sub: any) =>
              sub.kegiatan?.map((keg: any) =>
                keg.tujuan?.map((t: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded border">
                    {idx + 1}. {t}
                  </div>
                ))
              )
            )
          )}
        </td>

      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>

          {/* ================= 3 PEMANGKU (FIX) ================= */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-4">
              3. Daftar Pemangku Kepentingan
            </h2>

            {/* INTERNAL */}
            <div className="mb-6">
              <button
                onClick={addInternal}
                className="bg-purple-500 text-white px-3 py-1 rounded text-xs mb-2"
              >
                + Tambah Internal
              </button>

              <table className="w-full text-sm border">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th>No</th>
                    <th>Internal</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {internal.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center p-3 text-gray-400">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    internal.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.ket}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* EKSTERNAL */}
            <div>
              <button
                onClick={addEksternal}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs mb-2"
              >
                + Tambah Eksternal
              </button>

              <table className="w-full text-sm border">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th>No</th>
                    <th>Eksternal</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {eksternal.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center p-3 text-gray-400">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    eksternal.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.ket}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= 4 TUJUAN ================= */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              4. Tujuan
            </h2>

            <textarea
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              onBlur={saveTujuan}
className="w-full border p-3 rounded text-sm text-black bg-white"
            />
          </div>
                  {/* ========================= */}
{/* 5 .JADWAL KEGIATAN */}
{/* ========================= */}
<div className="bg-white p-4 rounded-xl shadow overflow-auto">
  <h2 className="font-bold mb-3">
    5. Jadwal Pelaksanaan Kegiatan
  </h2>

  <table className="text-xs border min-w-[1200px]">
    <thead>
      <tr className="bg-blue-900 text-white">
        <th rowSpan={2} className="p-2">No</th>
        <th rowSpan={2} className="p-2">Tahap</th>

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
          ))
        )}
      </tr>
    </thead>

    <tbody>
      {jadwal.map((item, rowIndex) => (
        <tr key={rowIndex}>
          <td className="border p-1 text-center">
            {rowIndex + 1}
          </td>

          <td className="border p-1">
            {item.tahap}
          </td>

          {item.data.map((val: number, colIndex: number) => (
            <td
              key={colIndex}
              onClick={() => toggleCell(rowIndex, colIndex)}
              className={`border w-5 h-5 cursor-pointer ${
                val ? "bg-green-600" : "bg-gray-200"
              }`}
            ></td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  <div className="mt-4">
  <button
    onClick={saveToProfil}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Simpan ke Profil Risiko
  </button>
</div>
</div>

        </div>
      </div>
      </div>
    </>
  );
}