"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DetailMRPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">

          {/* ================= HEADER ================= */}
          <div className="bg-white p-4 rounded shadow text-sm">
            <div className="grid grid-cols-2 gap-2">
              <p><b>Unit Organisasi:</b> DIREKTORAT JENDERAL SDA</p>
              <p><b>Unit Kerja:</b> BBWS Bengawan Solo</p>
              <p><b>Level:</b> UPR T2</p>
              <p><b>Anggaran:</b> Rp 753 M</p>
              <p><b>Periode:</b> 2026</p>
              <p>
                <b>Status:</b>{" "}
                <span className="bg-yellow-200 px-2 rounded">
                  Konsep
                </span>
              </p>
            </div>
          </div>

          {/* ================= 1. PAKTA ================= */}
          <Section title="1. Pakta Manajemen Risiko">
            <p className="text-sm text-gray-600">
              Dalam rangka menciptakan dan melindungi nilai serta memastikan tercapainya tujuan organisasi...
            </p>
          </Section>

          {/* ================= 2. LINGKUP ================= */}
          <Section title="2. Lingkup dan Konteks">

            <div className="flex gap-2 mb-3">
              <button className="bg-purple-600 text-white px-3 py-1 rounded">
                + Sasaran Kegiatan
              </button>
              <button className="bg-green-600 text-white px-3 py-1 rounded">
                Export Excel
              </button>
            </div>

            {/* 🔥 FIX SCROLL */}
            <div className="w-full overflow-x-auto border rounded">
              <div className="min-w-[1200px]">

                <table className="w-full text-xs">
                  <thead className="bg-purple-800 text-white">
                    <tr>
                      <th className="p-2">No</th>
                      <th>Sasaran</th>
                      <th>Indikator</th>
                      <th>Sub Indikator</th>
                      <th>Kegiatan</th>
                      <th>Tujuan</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">1</td>
                      <td>Data dari LED</td>
                      <td>Auto</td>
                      <td>Auto</td>
                      <td>Auto</td>
                      <td>Auto</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>

          </Section>

          {/* ================= 3. PEMANGKU ================= */}
          <Section title="3. Daftar Pemangku Kepentingan">

            <button className="bg-purple-600 text-white px-3 py-1 rounded mb-3">
              + Tambah Internal
            </button>

            <TableSimple title="Internal" />
            <TableSimple title="Eksternal" />

          </Section>

          {/* ================= 4. TUJUAN ================= */}
          <Section title="4. Tujuan Pelaksanaan Manajemen Risiko">
            <p className="text-sm text-gray-600">
              Tujuan pelaksanaan manajemen risiko adalah untuk menciptakan dan melindungi nilai organisasi.
            </p>
          </Section>

          {/* ================= 5. PROFIL RISIKO ================= */}
          <Section title="5. Profil Risiko">
            <button className="bg-purple-600 text-white px-3 py-1 rounded mb-2">
              + Tambah
            </button>

            <div className="text-gray-400 text-sm">
              Belum ada data
            </div>
          </Section>

          {/* ================= 6. RISIKO KORUPSI ================= */}
          <Section title="6. Profil Risiko Korupsi">

            <button className="bg-green-600 text-white px-3 py-1 rounded mb-3">
              Export Excel
            </button>

            {/* 🔥 FIX SCROLL BESAR */}
            <div className="w-full overflow-x-auto border rounded">
              <div className="min-w-[1600px]">

                <table className="w-full text-xs">
                  <thead className="bg-purple-800 text-white">
                    <tr>
                      <th>No</th>
                      <th>Kode Risiko</th>
                      <th>Tujuan</th>
                      <th>Sub Proses</th>
                      <th>Internal</th>
                      <th>Eksternal</th>
                      <th>Pernyataan</th>
                      <th>Kategori</th>
                      <th>Alat Bukti</th>
                      <th>Penyebab</th>
                      <th>Dampak</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan={11} className="text-center p-4 text-gray-400">
                        No data available
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>

          </Section>

          {/* ================= 7. PETA ================= */}
          <Section title="7. Peta Risiko">
            <div className="h-64 rounded grid grid-cols-5">
              <div className="bg-green-500"></div>
              <div className="bg-yellow-400"></div>
              <div className="bg-orange-400"></div>
              <div className="bg-red-400"></div>
              <div className="bg-red-600"></div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function TableSimple({ title }: any) {
  return (
    <div className="mb-4">

      <h3 className="font-medium mb-2">{title}</h3>

      <div className="w-full overflow-x-auto border rounded">
        <div className="min-w-[600px]">

          <table className="w-full text-sm">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2">1</td>
                <td>Contoh Nama</td>
                <td>Contoh Jabatan</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}