"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="p-6 text-gray-900">

          {/* FILTER */}
          <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-800">Tahun</p>
              <select className="border p-2 rounded">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>

            <button className="bg-blue-900 text-white px-4 py-2 rounded">
              🔍
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="space-y-4">

              {/* PEMILIK RISIKO */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold mb-3">Pemilik Risiko</h2>

                <div className="flex gap-3 items-center">
                  <Image
                    src="/pupr.png"
                    alt="user"
                    width={60}
                    height={60}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm">Nama User</p>
                    <p className="text-xs text-gray-800">
                      Jabatan / Instansi
                    </p>
                  </div>
                </div>
              </div>

              {/* PENGELOLA */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold mb-3">
                  Pengelola Risiko Organisasi
                </h2>

                <div className="flex gap-3 items-center">
                  <Image
                    src="/pupr.png"
                    alt="user"
                    width={60}
                    height={60}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm">Nama Pengelola</p>
                    <p className="text-xs text-gray-800">
                      Jabatan Pengelola
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT TABLE */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">

              <h2 className="font-bold mb-4 text-center text-blue-900">
                DIREKTORAT JENDERAL SUMBER DAYA AIR
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full text-sm border">

                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="p-2">Sasaran</th>
                      <th className="p-2">Uraian</th>
                      <th className="p-2">Target</th>
                      <th className="p-2">Risiko</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr className="border-b">
                      <td className="p-2">Strategis</td>
                      <td className="p-2">
                        Meningkatkan ketahanan air
                      </td>
                      <td className="p-2">10</td>
                      <td className="p-2 text-green-600 font-bold">
                        Rendah
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-2">Program</td>
                      <td className="p-2">
                        Transformasi pengelolaan SDA
                      </td>
                      <td className="p-2">5</td>
                      <td className="p-2 text-yellow-500 font-bold">
                        Sedang
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2">Kegiatan</td>
                      <td className="p-2">
                        Monitoring sistem air
                      </td>
                      <td className="p-2">3</td>
                      <td className="p-2 text-red-500 font-bold">
                        Tinggi
                      </td>
                    </tr>

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