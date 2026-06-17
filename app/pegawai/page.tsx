"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPegawai, deletePegawai } from "@/lib/api";

export default function PegawaiPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Selamat Pagi"
      : hour < 15
        ? "Selamat Siang"
        : hour < 18
          ? "Selamat Sore"
          : "Selamat Malam";

  // LOAD DATA
  const loadData = async (keyword = "", pageNum = 1) => {
    try {
      setLoading(true);

      const res = await getPegawai(keyword, pageNum);

      setData(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(search, page);

    // AUTO REALTIME
    const interval = setInterval(() => {
      loadData(search, page);
    }, 3000);

    return () => clearInterval(interval);
  }, [search, page]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6 transition-all duration-300">
          <div className="flex justify-end mb-4">
            <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border text-sm text-gray-700">
              {new Date().toLocaleString("id-ID")}
            </div>
          </div>
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            {/* LEFT */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {greeting} 👋
              </h1>

              <p className="text-gray-500 mt-1">
                Monitoring dan manajemen data pegawai realtime
              </p>

              {/* STATUS */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

                <span className="text-sm font-medium text-gray-700">
                  System Online
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3 flex-wrap">
              {/* TAMBAH */}
              <button
                onClick={() => router.push("/pegawai/tambah")}
                className="
  bg-green-500
  hover:bg-green-600
  hover:scale-105
  hover:shadow-2xl
  text-white
  px-6
  py-3
  rounded-2xl
  shadow-lg
  transition-all
  duration-300
  font-semibold
"
              >
                + Tambah Pegawai
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-5 flex gap-3">
            <input
              type="text"
              placeholder="Cari pegawai..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 border border-gray-300 bg-white p-3 rounded-xl text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border hover:shadow-xl transition duration-300">
              <p className="text-gray-500 text-sm">Total Pegawai</p>

              <h2 className="text-4xl font-bold mt-2 text-blue-900">
                {data.length}
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Data aktif dalam sistem
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border hover:shadow-xl transition duration-300">
              <p className="text-gray-500 text-sm">Halaman</p>

              <h2 className="text-4xl font-bold mt-2 text-green-700">{page}</h2>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border hover:shadow-xl transition duration-300">
              <p className="text-gray-500 text-sm">Total Page</p>

              <h2 className="text-4xl font-bold mt-2 text-purple-700">
                {lastPage}
              </h2>
            </div>
          </div>

          {/* TABLE */}
          <div
            className="
  bg-white/80
  backdrop-blur
  rounded-3xl
  shadow-lg
  border
  border-gray-200
  overflow-hidden
"
          >
            <table className="w-full text-sm text-black">
              <thead className="bg-blue-900 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">NIP</th>
                  <th className="p-2 text-left">Jabatan</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-3">📂</div>

                        <h2 className="text-xl font-bold text-gray-700">
                          Data Kosong
                        </h2>

                        <p className="text-gray-400 mt-1">
                          Belum ada data pegawai
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-200"
                    >
                      {/* NO */}
                      <td className="px-4 py-4">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* NAMA */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {/* AVATAR */}
                          <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                            {item.nama?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold">{item.nama}</p>

                            <p className="text-xs text-gray-500">{item.nip}</p>
                          </div>
                        </div>
                      </td>

                      {/* JABATAN */}
                      <td className="px-4 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.jabatan}
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/pegawai/edit/${item.id}`)
                            }
                            className="
bg-yellow-400
hover:bg-yellow-500
hover:scale-105
text-white
px-4
py-2
rounded-xl
transition
duration-300
shadow-sm
"
                          >
                            Edit
                          </button>

                          <button
                            onClick={async () => {
                              const confirmDelete = confirm(
                                `Hapus ${item.nama}?`,
                              );

                              if (!confirmDelete) return;

                              await deletePegawai(item.id);
                              loadData(search, page);
                            }}
                            className="
bg-red-500
hover:bg-red-600
hover:scale-105
text-white
px-4
py-2
rounded-xl
transition
duration-300
shadow-sm
"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 🔥 PAGINATION */}
            <div className="flex justify-center mt-4 items-center space-x-2">
              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-black"
              >
                Prev
              </button>

              {/* 🔢 SMART PAGE */}
              {(() => {
                const pages = [];
                const range = 1;

                for (let i = 1; i <= lastPage; i++) {
                  if (
                    i === 1 ||
                    i === lastPage ||
                    (i >= page - range && i <= page + range)
                  ) {
                    pages.push(i);
                  } else if (
                    (i === page - range - 1 && i > 1) ||
                    (i === page + range + 1 && i < lastPage)
                  ) {
                    pages.push("...");
                  }
                }

                return pages.map((p, index) =>
                  p === "..." ? (
                    <span key={index} className="px-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`px-3 py-1 rounded text-black ${
                        p === page ? "bg-blue-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                );
              })()}

              {/* NEXT */}
              <button
                disabled={page === lastPage}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-black"
              >
                Next
              </button>
            </div>
          </div>
          {/* FOOTER */}
          <div className="mt-10 text-center text-sm text-gray-400">
            © 2026 Dashboard Pegawai
          </div>
        </div>
      </div>
    </div>
  );
}
