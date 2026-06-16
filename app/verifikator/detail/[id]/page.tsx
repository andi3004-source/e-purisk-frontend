"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DetailVerifikatorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [komitmen, setKomitmen] = useState<any>(null);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("verifikator-data") || "[]"
    );

    const found = data.find(
      (x: any) => String(x.id) === String(id)
    );

    setKomitmen(found);
  }, [id]);

  const handleApprove = () => {
    const data = JSON.parse(
      localStorage.getItem("verifikator-data") || "[]"
    );

    const updated = data.map((x: any) =>
      String(x.id) === String(id)
        ? { ...x, status: "Approved" }
        : x
    );

    localStorage.setItem(
      "verifikator-data",
      JSON.stringify(updated)
    );

    alert("Komitmen berhasil di Approve");
    router.push("/verifikator");
  };

  const handleReject = () => {
    const data = JSON.parse(
      localStorage.getItem("verifikator-data") || "[]"
    );

    const updated = data.map((x: any) =>
      String(x.id) === String(id)
        ? { ...x, status: "Rejected" }
        : x
    );

    localStorage.setItem(
      "verifikator-data",
      JSON.stringify(updated)
    );

    alert("Komitmen berhasil di Reject");
    router.push("/verifikator");
  };

  if (!komitmen) {
    return (
      <div className="p-10">
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

          <div className="bg-white rounded-xl shadow p-6">

            <h1 className="text-2xl font-bold mb-6">
              Detail Komitmen
            </h1>

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
            {/* PAKTA */}
<div className="mt-8">
  <h2 className="font-bold text-lg mb-2">
    1. Pakta Manajemen Risiko
  </h2>

  <div className="border rounded p-3 bg-gray-50">
    {komitmen.pakta || "-"}
  </div>
</div>

{/* TUJUAN */}
<div className="mt-8">
  <h2 className="font-bold text-lg mb-2">
    2. Tujuan Pelaksanaan Manajemen Risiko
  </h2>

  <div className="border rounded p-3 bg-gray-50">
    {komitmen.tujuan || "-"}
  </div>
</div>

{/* PEMANGKU KEPENTINGAN */}
<div className="mt-8">
  <h2 className="font-bold text-lg mb-2">
    3. Pemangku Kepentingan
  </h2>

  <table className="w-full border">
    <thead className="bg-purple-800 text-white">
      <tr>
        <th className="border p-2">No</th>
        <th className="border p-2">Jenis</th>
        <th className="border p-2">Nama</th>
        <th className="border p-2">Keterangan</th>
      </tr>
    </thead>

    <tbody>
      {komitmen.internal?.map((item:any,index:number)=>(
        <tr key={index}>
          <td className="border p-2">{index+1}</td>
          <td className="border p-2">Internal</td>
          <td className="border p-2">{item.nama}</td>
          <td className="border p-2">{item.ket}</td>
        </tr>
      ))}

      {komitmen.eksternal?.map((item:any,index:number)=>(
        <tr key={index}>
          <td className="border p-2">
            {(komitmen.internal?.length || 0)+index+1}
          </td>
          <td className="border p-2">Eksternal</td>
          <td className="border p-2">{item.nama}</td>
          <td className="border p-2">{item.ket}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* SASARAN */}
<div className="mt-8">
  <h2 className="font-bold text-lg mb-2">
    4. Sasaran Strategis / Program
  </h2>

  <table className="w-full border text-sm">
    <thead className="bg-purple-800 text-white">
      <tr>
        <th className="border p-2">No</th>
        <th className="border p-2">Strategis</th>
        <th className="border p-2">Program</th>
        <th className="border p-2">Kegiatan</th>
      </tr>
    </thead>

    <tbody>
      {komitmen.sasaranList?.map((s:any,i:number)=>(
        <tr key={i}>
          <td className="border p-2">{i+1}</td>
          <td className="border p-2">{s.sasaranStrategis}</td>
          <td className="border p-2">{s.sasaranProgram}</td>
          <td className="border p-2">{s.sasaranKegiatan}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* PROFIL RISIKO */}
<div className="mt-8">
  <h2 className="font-bold text-lg mb-2">
    5. Profil Risiko
  </h2>

  <div className="overflow-auto">
    <table className="w-full border text-sm">
      <thead className="bg-purple-800 text-white">
        <tr>
          <th className="border p-2">No</th>
          <th className="border p-2">Kode</th>
          <th className="border p-2">Tujuan</th>
          <th className="border p-2">Pernyataan</th>
          <th className="border p-2">Kategori</th>
          <th className="border p-2">Penyebab</th>
          <th className="border p-2">Dampak</th>
          <th className="border p-2">Prioritas</th>
          <th className="border p-2">Respon</th>
        </tr>
      </thead>

      <tbody>
        {komitmen.profilRisiko?.map((r:any,i:number)=>(
          <tr key={i}>
            <td className="border p-2">{i+1}</td>
            <td className="border p-2">{r.kode}</td>
            <td className="border p-2">{r.tujuan}</td>
            <td className="border p-2">{r.pernyataan}</td>
            <td className="border p-2">{r.kategori}</td>
            <td className="border p-2">{r.penyebab}</td>
            <td className="border p-2">{r.dampak}</td>
            <td className="border p-2">{r.prioritas}</td>
            <td className="border p-2">{r.respon}</td>
          </tr>
        ))}
      </tbody>
    </table>
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
    </div>
  );
}