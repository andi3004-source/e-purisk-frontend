"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  getUser,
  getRisiko,
  getSuperDashboard,
  getDokumen,
  uploadDokumen,
} from "@/lib/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [dokumen, setDokumen] = useState<any[]>([]);

  useEffect(() => {
  const fetchDokumen = async () => {
    try {
      const res = await getDokumen();
      setDokumen(res);
    } catch (error) {
      console.error("Gagal ambil dokumen:", error);
    }
  };

  fetchDokumen();
}, []);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    await uploadDokumen(file);

    const fresh = await getDokumen();
    setDokumen(fresh);

    toast.success("Dokumen berhasil diupload");
  } catch (error) {
    console.error(error);
    toast.error("Gagal upload dokumen");
  }

  e.target.value = "";
};

const [user, setUser] = useState<any>(null);

  const [data, setData] = useState<any[]>([]);

  const [dashboard, setDashboard] = useState<any>(null);

  const [tahun, setTahun] = useState<string>("");

  const fetchingRef = useRef(false);

  const lastTotalRef = useRef(0);

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#14b8a6",
  ];

  // ================= LOAD DATA =================
  const loadAll = async (tahunFilter?: string) => {

    if (fetchingRef.current) return;

    fetchingRef.current = true;

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      // USER
      const userRes = await getUser(token);
      setUser(userRes);

      // RISIKO
      const risikoRes = await getRisiko(token);

      const risiko = Array.isArray(risikoRes)
        ? risikoRes
        : risikoRes.data || [];

      const filtered = tahunFilter
        ? risiko.filter(
            (item: any) =>
              item.tahun?.toString() === tahunFilter
          )
        : risiko;

      setData(filtered);

      // DASHBOARD
      const dash = await getSuperDashboard(
        tahunFilter || ""
      );

      setDashboard(dash);

      // ================= TOAST REALTIME =================
      const totalNow =
        dash?.kpi?.total_risiko || 0;

      if (
        lastTotalRef.current !== 0 &&
        totalNow > lastTotalRef.current
      ) {

        toast.success(
          "Data risiko baru masuk!"
        );

      }

      lastTotalRef.current = totalNow;

    } catch (err) {

      console.log("Realtime Error:", err);

    } finally {

      fetchingRef.current = false;

    }

  };

  // ================= REALTIME =================
  useEffect(() => {

    let isMounted = true;

    const fetchRealtime = async () => {

      if (!isMounted) return;

      await loadAll(tahun);

    };

    // load pertama
    fetchRealtime();

    // realtime polling
    const interval = setInterval(() => {

      fetchRealtime();

    }, 2000);

    return () => {

      isMounted = false;

      clearInterval(interval);

    };

  }, [tahun]);

  // ================= CHART RISIKO =================
  const chartData = Object.values(

    data.reduce((acc: any, item: any) => {

      if (!acc[item.sasaran]) {

        acc[item.sasaran] = {
          sasaran: item.sasaran,
          Rendah: 0,
          Sedang: 0,
          Tinggi: 0,
        };

      }

      acc[item.sasaran][item.risiko] += 1;

      return acc;

    }, {})

  );

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6">

          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center mb-6">

            <div>

              <h1 className="text-2xl font-bold">
                Dashboard e-PURISK
              </h1>

              <p className="text-gray-500">
                Selamat datang, {user?.name}
              </p>

              <p className="text-green-600 text-sm mt-1 animate-pulse">
                ● Realtime Connected
              </p>

            </div>

            <div>

              <select
                value={tahun}
                onChange={(e) => {

                  const val = e.target.value;

                  setTahun(val);

                  loadAll(val);

                }}
                className="border p-2 rounded"
              >

                <option value="">
                  Semua Tahun
                </option>

                <option value="2024">
                  2024
                </option>

                <option value="2025">
                  2025
                </option>

                <option value="2026">
                  2026
                </option>

              </select>

            </div>

          </div>

          {/* ================= KPI UTAMA ================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-blue-600 text-white p-4 rounded shadow transition-all duration-300 hover:scale-105">

              <p>Total Pegawai</p>

              <h2 className="text-3xl font-bold">
                {dashboard?.kpi?.total_pegawai || 0}
              </h2>

            </div>

            <div className="bg-green-600 text-white p-4 rounded shadow transition-all duration-300 hover:scale-105">

              <p>Total Risiko</p>

              <h2 className="text-3xl font-bold">
                {dashboard?.kpi?.total_risiko || 0}
              </h2>

            </div>

            <div className="bg-yellow-500 text-white p-4 rounded shadow transition-all duration-300 hover:scale-105">

              <p>Risiko Sedang</p>

              <h2 className="text-3xl font-bold">
                {dashboard?.kpi?.sedang || 0}
              </h2>

            </div>

            <div className="bg-red-600 text-white p-4 rounded shadow transition-all duration-300 hover:scale-105">

              <p>Risiko Tinggi</p>

              <h2 className="text-3xl font-bold">
                {dashboard?.kpi?.tinggi || 0}
              </h2>

            </div>
             <div className="bg-white p-4 rounded-xl shadow mt-6">

  <h2 className="font-bold mb-4">
    Upload Dokumen PDF
  </h2>

  <input
    type="file"
    accept=".pdf"
    onChange={handleUpload}
    className="border p-2 rounded"
  />

</div>
            <div className="bg-white p-4 rounded-xl shadow mt-6">

  <h2 className="font-bold mb-4">
    Dokumen Terpublikasi
  </h2>

  <table className="w-full border">

    <thead className="bg-blue-900 text-white">
      <tr>
        <th className="p-2">Nama File</th>
        <th className="p-2">Tanggal</th>
        <th className="p-2">Status</th>
        <th className="p-2">Aksi</th>
      </tr>
    </thead>

    <tbody>
      {dokumen.map((item) => (
        <tr key={item.id}>
          <td className="border p-2">
            {item.nama}
          </td>

          <td className="border p-2">
            {item.tanggal}
          </td>

          <td className="border p-2">
            {item.status}
          </td>

          <td className="border p-2">
            <a
              href={item.url}
              target="_blank"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Lihat
            </a>
          </td>
        </tr>
      ))}
    </tbody>

  </table>

</div>
          </div>

          {/* KPI TAMBAHAN dan chart tetap */}
          
        </div>

      </div>

    </div>

  );

}