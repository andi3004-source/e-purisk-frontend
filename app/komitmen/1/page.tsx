"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DetailKomitmenPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6">

          {/* 🔥 HEADER */}
          <div className="bg-white p-4 rounded-xl shadow">

            <button
              onClick={() => router.back()}
              className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
            >
              ← Kembali
            </button>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>Unit Organisasi : BBWS Bengawan Solo</p>
              <p>Level : UPR T3</p>
              <p>Anggaran : Rp 18.150.000</p>
              <p>Periode : 2025</p>
              <p>
                Status :
                <span className="ml-2 bg-yellow-400 px-2 py-1 rounded text-xs">
                  Konsep
                </span>
              </p>
            </div>
          </div>

          {/* 🔥 PEMILIK */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">
                Pemilik Risiko / Pengelola Risiko
              </h2>

              <div className="space-x-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                  Export PDF
                </button>
                <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs">
                  Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 text-sm gap-4">
              <div>
                <p><b>Nama:</b> Riswanto</p>
                <p><b>Jabatan:</b> Pengelola SDA</p>
                <p><b>NIP:</b> 19840132010121001</p>
              </div>

              <div>
                <p><b>Nama:</b> Riswanto</p>
                <p><b>Jabatan:</b> Pengelola SDA</p>
                <p><b>NIP:</b> 19840132010121001</p>
              </div>
            </div>
          </div>

          {/* 🔥 1 PAKTA */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              1. Pakta Manajemen Risiko
            </h2>
            <p className="text-sm text-gray-600">
              Dalam rangka menciptakan dan melindungi nilai organisasi...
            </p>
          </div>

          {/* 🔥 2 LINGKUP */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              2. Lingkup dan Konteks
            </h2>

            <div className="flex gap-2 mb-3">
              <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs">
                ⏺ Tanggapan UPR
              </button>

              <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs">
                + Sasaran Kegiatan
              </button>

              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                ⬇ Export Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Sasaran</th>
                    <th className="p-2">Indikator</th>
                    <th className="p-2">Sub</th>
                    <th className="p-2">Kegiatan</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-2">1</td>
                    <td className="p-2">Pelayanan</td>
                    <td className="p-2">Kualitas</td>
                    <td className="p-2">Admin</td>
                    <td className="p-2">Operasi SDA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 🔥 3 PEMANGKU */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              3. Daftar Pemangku Kepentingan
            </h2>

            <div className="flex gap-2 mb-3">
              <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs">
                ⏺ Tanggapan UPR
              </button>

              <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs">
                + Tambah Internal
              </button>

              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                ⬇ Export Excel Pemangku Eksternal
              </button>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Nama</th>
                    <th className="p-2">Keterangan</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="p-2">1</td>
                    <td className="p-2">Riswanto</td>
                    <td className="p-2">PPK SDA</td>
                    <td className="p-2">
                      <button className="bg-red-500 text-white px-2 py-1 text-xs rounded">
                        Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs">
              + Tambah Eksternal
            </button>
          </div>

          {/* 🔥 4 TUJUAN */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              4. Tujuan Manajemen Risiko
            </h2>
            <p className="text-sm">
              Meningkatkan kinerja organisasi...
            </p>
          </div>

          {/* 🔥 5 JADWAL */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">
              5. Jadwal Pelaksanaan Kegiatan
            </h2>

            <button className="bg-green-600 text-white px-3 py-1 rounded text-xs mb-3">
              ⬇ Export Jadwal
            </button>

            <div className="overflow-x-auto">
              <table className="text-xs border">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="p-2">Kegiatan</th>
                    <th className="p-2">Jan</th>
                    <th className="p-2">Feb</th>
                    <th className="p-2">Mar</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="p-2">Analisis Risiko</td>
                    <td className="bg-green-500"></td>
                    <td></td>
                    <td className="bg-green-500"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}