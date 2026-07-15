"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
export default  function TambahProfilRisikoPage() {
  type Komitmen = {
    id: number;
    unit: string;
    level: string;
    periode: string;
    pemilik: string;
    jabatan_pemilik: string;
    nip_pemilik: string;
    pengelola: string;
    jabatan_pengelola: string;
    nip_pengelola: string;
  };
  const router = useRouter();

  // STATE
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [selectedKomitmen, setSelectedKomitmen] = useState<any>(null);
  const [komitmenList, setKomitmenList] = useState<any[]>([]);
  const [paketList, setPaketList] = useState<any[]>([]);
  const [risikoList, setRisikoList] = useState<any[]>([]);
  const [penyebabList, setPenyebabList] = useState<any[]>([]);
  const [pihakList, setPihakList] = useState<any[]>([]);
  const [referensiList, setReferensiList] = useState<any[]>([]);
  const [pernyataanList, setPernyataanList] = useState<any[]>([]);
   const [dampakList, setDampakList] = useState<any[]>([]);
   useEffect(() => {
  const fetchReferensi = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/referensi-risiko?kategori=Risiko Korupsi"
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      console.log("REFERENSI", data);

      setReferensiList(data);
      setPernyataanList(data);
      setDampakList(data);

    } catch (err) {
      console.error(err);
    }
  };

  fetchReferensi();
}, []);
  const searchParams = useSearchParams();
  const [pihakForm, setPihakForm] = useState({
    nama: "",
    jenis: "",
    jabatan: "",
  });
  const [step3Form, setStep3Form] = useState({
    respon: "",
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
const getRiskColor = (nilai:number) => {
  if (nilai <= 6) return "bg-green-600 text-white";
  if (nilai <= 10) return "bg-lime-300 text-black";
  if (nilai <= 15) return "bg-yellow-400 text-black";
  if (nilai <= 19) return "bg-orange-400 text-black";
  return "bg-red-600 text-white";
};
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
    berbagi: "",
    jenisKorupsi: "",
    jenisRtp: "",
    uraian: "",
    indikator: "",
    periode: "SEMESTER",
  });
  const [rtpScore, setRtpScore] = useState({
  k: 1,
  d: 1,
  n: 1,
  sumber: [] as string[],
  ketK: "",
  ketD: "",
});

  const [unitForm, setUnitForm] = useState("");
  const [unitList, setUnitList] = useState<any[]>([]);
  const [klasifikasi, setKlasifikasi] = useState("");
  const [openTargetModal, setOpenTargetModal] = useState(false);
  const [selectedRtpId, setSelectedRtpId] = useState(null);
  const [tahapanList, setTahapanList] = useState<any[]>([]);
  useEffect(() => {
    const fetchTahapan = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/tahapan"
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setTahapanList(data);
      } catch (error) {
        console.error("Gagal ambil tahapan", error);
      }
    };

    fetchTahapan();
  }, []);

  const [targetForm, setTargetForm] = useState({
    waktu: "",
    uraian: "",
  });
  // LOAD DATA KOMITMEN
  useEffect(() => {
    const fetchKomitmen = async () => {
      try {
        const komitmenId = searchParams.get("komitmenId");

        if (!komitmenId) {
          alert("Komitmen tidak ditemukan!");
          router.push("/risiko/profil");
          return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/komitmen");
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        setKomitmenList(list);

        const found = list.find(
          (k: any) => Number(k.id) === Number(komitmenId),
        );

        if (!found) {
          alert("Data komitmen tidak valid!");
          router.push("/risiko/profil");
          return;
        }

        setSelectedKomitmen(found.id);

        setHeader({
          id: found.id,
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
      } catch (error) {
        console.error("Gagal ambil komitmen:", error);
        alert("Gagal ambil data komitmen dari Laravel");
      }
    };

    fetchKomitmen();
  }, [searchParams, router]);

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/paket");


        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setPaketList(data);
      } catch (error) {
        console.error("Gagal ambil paket:", error);
      }


    };

    fetchPaket();
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
      [11, 15, 18, 23, 25],
    ];
console.log("RTP SCORE", rtpScore);
    // index -1 karena array mulai dari 0
    const k = Number(step2Form.kemungkinan) - 1;
    const d = Number(step2Form.dampak) - 1;

    const n = matrix[k]?.[d] || 0;

    setStep2Form((prev) => {
      if (prev.skor === n) return prev; // ⛔ anti loop
      return { ...prev, skor: n };
    });
  }, [step2Form.kemungkinan, step2Form.dampak]);
  // SELECT KOMITMEN
  const handleSelect = (e: any) => {
    const found = komitmenList.find((k) => String(k.id) === e.target.value);

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
      tujuanList: ["Operasi Bendung", "Pengelolaan SDA"],
    },
    {
      nama: "Pembangunan Bendungan",
      tujuanList: ["Peningkatan Infrastruktur"],
    },
  ];

  const subKategoriList = [
    "Kerugian Keuangan Negara",
    "Penyalahgunaan Wewenang",
    "Gratifikasi",
  ];

  const indikatorList = [
    "Tekanan / Pressure",
    "Kesempatan / Opportunity",
    "Rasionalisasi",
  ];
  useEffect(() => {
    const matrix = [
      [1, 3, 5, 9, 20],
      [2, 7, 10, 13, 21],
      [4, 8, 14, 17, 22],
      [6, 12, 16, 19, 24],
      [11, 15, 18, 23, 25],
    ];

    const k = rtpScore.k - 1;
    const d = rtpScore.d - 1;

    const n = matrix[k]?.[d] || 0;

    setRtpScore((prev) => {
      if (prev.n === n) return prev;
      return { ...prev, n };
    });
  }, [rtpScore.k, rtpScore.d]);

  const simpanLangsungDatabase = async () => {
    try {
      const lastRisk = risikoList[risikoList.length - 1];

      if (!lastRisk) {
        alert("Data risiko belum ada");
        return;
      }

      const payload = {
        komitmen_id: selectedKomitmen,
        paket_id: selectedPaket?.id || null,

        kode: lastRisk.kode,
        kategori: "Risiko Korupsi",
        kegiatan: lastRisk.kegiatan || form.kegiatan || "-",
        tujuan: lastRisk.tujuan || form.tujuan || "-",
        tahapan: lastRisk.tahapan || form.tahapan || "-",
        pernyataan: lastRisk.pernyataan || "-",

        dampak: lastRisk.dampak || form.dampak || "-",
        dampak_kategori: lastRisk.dampakKategori || form.dampakKategori || "-",

        penanggung_jawab:
          lastRisk.penanggungJawab || form.penanggungJawab || "-",

        k: lastRisk.k || step2Form.kemungkinan,
        d: lastRisk.d || step2Form.dampak,
        skor: lastRisk.skor || step2Form.skor,
        prioritas: lastRisk.prioritas || "-",
        respon: lastRisk.respon || step3Form.respon || "-",

        rtp_k: rtpScore.k,
        rtp_d: rtpScore.d,
        rtp_n: rtpScore.n,
        sumber: rtpScore.sumber || "-",
        klasifikasi: klasifikasi || "-",

        sub_proses: lastRisk.subProses || form.subProses || "-",
        sub_kategori: lastRisk.subKategori || form.subKategori || "-",
        alat_bukti: lastRisk.alatBukti || form.alatBukti || "-",

        penyebab: JSON.stringify(penyebabList),
        pihak: JSON.stringify(pihakList),
        rtp: JSON.stringify(rtpList),
        unit_tembusan: JSON.stringify(unitList.map((u) => u.nama)),
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/profil-risiko",
        payload
      );

      setRisikoList((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastRisk,
          id: res.data?.data?.id || lastRisk.id,
          penyebabList,
          pihakList,
          rtp: rtpList,
        };
        return updated;
      });

      alert("Profil risiko berhasil disimpan ke database");

      setOpenModal(false);
      setStep(1);

      setPenyebabList([]);
      setPihakList([]);
      setRtpList([]);
      setUnitList([]);
      setKlasifikasi("");

      router.refresh();
    } catch (error: any) {
      console.error("Gagal simpan profil risiko:", error);

      alert(
        JSON.stringify(
          error.response?.data || error.message,
          null,
          2
        )
      );
    }
  };

  if (!selectedKomitmen) return null;
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* SELECT */}
          <div className="border p-2 rounded bg-gray-100 text-sm">
            {header.periode} - {header.unit}
          </div>

          {/* HEADER */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm space-y-2">
              <div>
                <b>Unit Organisasi :</b> {header.unit}
              </div>
              <div>
                <b>Unit Pemilik Risiko :</b> {header.pemilik}
              </div>
              <div>
                <b>Level :</b> {header.level}
              </div>
              <div>
                <b>Periode :</b> {header.periode}
              </div>
            </div>
          </div>

          {/* PEMILIK */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow text-sm">
              <p>
                <b>Nama Pemilik Risiko :</b> {header.namaPemilik}
              </p>
              <p>
                <b>Jabatan :</b> {header.jabatanPemilik}
              </p>
              <p>
                <b>NIP :</b> {header.nipPemilik}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow text-sm">
              <p>
                <b>Nama Pengelola Risiko :</b> {header.namaPengelola}
              </p>
              <p>
                <b>Jabatan :</b> {header.jabatanPengelola}
              </p>
              <p>
                <b>NIP :</b> {header.nipPengelola}
              </p>
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
                    <th rowSpan={2} className="border p-2">
                      No
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Kode Risiko
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Tujuan Kegiatan Utama
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Pernyataan Risiko
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Kategori Risiko
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Penyebab
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Dampak
                    </th>

                    <th colSpan={2} className="border p-2">
                      Pengendalian yang dilaksanakan
                    </th>

                    <th colSpan={3} className="border p-2">
                      Nilai Risiko Setelah Pengendalian
                    </th>

                    <th rowSpan={2} className="border p-2">
                      Prioritas Risiko
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Respon Risiko
                    </th>

                    <th colSpan={2} className="border p-2">
                      Rencana Tindak Pengendalian (RTP)
                    </th>

                    <th rowSpan={2} className="border p-2">
                      Alokasi Sumberdaya
                    </th>

                    <th colSpan={3} className="border p-2">
                      Nilai Risiko yang Diharapkan
                    </th>

                    <th rowSpan={2} className="border p-2">
                      Penanggung Jawab RTP
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Target Waktu
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Indikator Keluaran
                    </th>
                    <th rowSpan={2} className="border p-2">
                      Action
                    </th>
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
                      <td
                        colSpan={20}
                        className="text-center p-3 text-gray-400"
                      >
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
                              <div className="text-xs">{r.dampak || "-"}</div>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="border p-2">{r.pengendalian || "-"}</td>
                        <td className="border p-2">{r.hasil || "-"}</td>

                        <td className="border p-2">{r.k || "-"}</td>
                        <td className="border p-2">{r.d || "-"}</td>
                        <td
  className={`border p-2 text-center font-bold ${
    getRiskColor(Number(r.skor))
  }`}
>
  {r.skor || "-"}
</td>

                        <td className="border p-2">{r.prioritas || "-"}</td>

                        {/* sisanya kosong dulu */}
                        <td className="border p-2">{r.respon || "-"}</td>
                        {/* 🔥 RTP */}
                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.jenisRtp).join(", ") || "-"}
                        </td>

                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.uraian).join(", ") || "-"}
                        </td>

                        {/* 🔥 ALOKASI */}
                        <td className="border p-2">{r.sumber || "-"}</td>

                        {/* 🔥 NILAI RTP */}
                        <td className="border p-2">{r.rtp_k || "-"}</td>
                        <td className="border p-2">{r.rtp_d || "-"}</td>
                       <td
  className={`border p-2 text-center font-bold ${
    getRiskColor(Number(r.rtp_n))
  }`}
>
  {r.rtp_n || "-"}
</td>

                        {/* 🔥 PENANGGUNG JAWAB (DARI STEP 1) */}
                        <td className="border p-2">
                          {r.penanggungJawab || "-"}
                        </td>

                        {/* 🔥 TARGET WAKTU */}
                        <td className="border p-2">
                          {r.rtp
                            ?.flatMap((x: any) => x.targetList || [])
                            .map((t: any) => t.waktu)
                            .join(", ") || "-"}
                        </td>

                        {/* 🔥 INDIKATOR */}
                        <td className="border p-2">
                          {r.rtp?.map((x: any) => x.indikator).join(", ") ||
                            "-"}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => {
                              if (confirm("Yakin mau hapus data ini?")) {
                                setRisikoList((prev) =>
                                  prev.filter((x) => x.id !== r.id),
                                );
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
                    <span className={step === 1 ? "font-bold" : ""}>
                      Step 1
                    </span>
                    <span className={step === 2 ? "font-bold" : ""}>
                      Step 2
                    </span>
                    <span className={step === 3 ? "font-bold" : ""}>
                      Step 3
                    </span>
                    <span className={step === 4 ? "font-bold" : ""}>
                      Step 4
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {step === 1 && (
                      <>
                        <div className="
  bg-white
  w-[1100px]
  rounded-xl
  max-h-[90vh]
  overflow-y-auto
  opacity-100
  text-gray-900
">
                          Step 1: Isi data kegiatan, kategori risiko, dan
                          pernyataan risiko
                        </div>

                        {/* KATEGORI (AUTO) */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Kategori Risiko</label>
                          <input
                            value="Risiko Korupsi"
                            disabled
                            className="
    bg-white
  w-[1100px]
  rounded-xl
  max-h-[90vh]
  overflow-y-auto
  opacity-100
  text-gray-900
"
                          />
                        </div>

                        {/* NAMA KEGIATAN */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Nama Kegiatan</label>
                          <select
                            className="
  bg-white
  w-[1100px]
  rounded-xl
  max-h-[90vh]
  overflow-y-auto
  opacity-100
  text-gray-900
  font-bold
"
                            onChange={(e) => {
                              const val = e.target.value;
                              const selected = kegiatanList.find(
                                (k) => k.nama === val,
                              );

                              setForm((prev: any) => ({
                                ...prev,
                                kegiatan: val,
                                tujuanList: selected?.tujuanList || [],
                              }));
                            }}
                          >
                            <option value="">Pilih Kegiatan</option>
                            {kegiatanList.map((k, i) => (
                              <option key={i} value={k.nama}>
                                {k.nama}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* TUJUAN */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">
                            Tujuan Kegiatan Utama
                          </label>
                          <select
                            className=" bg-white
  w-[1100px]
  rounded-xl
  max-h-[90vh]
  overflow-y-auto
  opacity-100
  text-gray-900 font-bold"
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                tujuan: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih Tujuan</option>
                            {(form.tujuanList || []).map(
                              (t: any, i: number) => (
                                <option key={i}>{t}</option>
                              ),
                            )}
                          </select>
                        </div>

                        {/* PAKET */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Nama Paket</label>

                          <select
                            className=" bg-white
  w-[1100px]
  rounded-xl
  max-h-[90vh]
  overflow-y-auto
  opacity-100
  text-gray-900"
                            onChange={(e) => {
                              const value = e.target.value;
                              <p className="text-xs text-red-500">
                                Jumlah paket: {paketList.length}
                              </p>;
                              const paket = (paketList || []).find(
                                (p: any) => String(p.id) === value,
                              );

                              setSelectedPaket(paket || null);

                              setForm((prev: any) => ({
                                ...prev,
                                paket: paket?.nama || paket?.nama_paket || "",
                                kodePaket: paket?.kode || "",
                                kodePPK: paket?.ppk || paket?.kode_ppk || "",
                                namaPPK:
                                  paket?.namaPPK || paket?.nama_ppk || "",
                                nipPPK: paket?.nip || paket?.nip_ppk || "",
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
                            <div className="border rounded p-3 bg-gray-50 text-sm space-y-1 mt-2 font-bold">
                              <div>
                                <b>Kode Paket:</b> {selectedPaket.kode}
                              </div>
                              <div>
                                <b>Kode PPK:</b> {selectedPaket.ppk}
                              </div>
                              <div>
                                <b>Nama PPK:</b> {selectedPaket.namaPPK}
                              </div>
                              <div>
                                <b>NIP:</b> {selectedPaket.nip}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* TAHAPAN */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Tahapan Pekerjaan</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold "
                            value={form.tahapan}
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                tahapan: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih Tahapan</option>

                            {tahapanList.map((item: any) => (
                              <option
                                key={item.id}
                                value={item.tahapan}
                              >
                                {item.tahapan}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* LED */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">
                            Referensi Lost Event
                          </label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
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

                          <select
                            className="w-full border p-2 rounded bg-white text-black"
                            value={form.pernyataan}
                            onChange={(e) => {
                              const selected = referensiList.find(
                                (item: any) =>
                                  item.pernyataan === e.target.value,
                              );

                              setForm((prev: any) => ({
                                ...prev,
                                pernyataan: selected?.pernyataan || "",
                                dampak: selected?.dampak || prev.dampak,
                                dampakKategori:
                                  selected?.dampak_kategori ||
                                  selected?.kategori_dampak ||
                                  prev.dampakKategori,
                              }));

                              setStep2Form((prev: any) => ({
                                ...prev,
                                jenis:
                                  selected?.jenis ||
                                  selected?.jenis_penyebab ||
                                  prev.jenis,
                                penyebab: selected?.penyebab || prev.penyebab,
                                pengendalian:
                                  selected?.pengendalian || prev.pengendalian,
                                status: selected?.status || prev.status,
                              }));
                            }}
                          >
                            <option value="">Pilih Pernyataan Risiko</option>

                            {pernyataanList.map((item: any) => (
                              <option key={item.id} value={item.pernyataan}>
                                {item.kode ? `${item.kode} | ` : ""}
                                {item.pernyataan}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* sub kategori risiko*/}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">
                            Sub Kategori Risiko Korupsi
                          </label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                subKategori: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            {subKategoriList.map((s, i) => (
                              <option key={i}>{s}</option>
                            ))}
                          </select>
                        </div>
                        {/* sub proses bisnis */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Sub Proses Bisnis</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                subProses: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* TAMBAH INDIKATOR KECURANGAN */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">
                            Indikator Kecurangan
                          </label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                indikator: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            {indikatorList.map((i2, i) => (
                              <option key={i}>{i2}</option>
                            ))}
                          </select>
                        </div>
                        {/* PJ */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Penanggung Jawab</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black font-bold"
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
                          <label className="text-sm font-semibold text-gray-800 font-bold">Kategori Dampak</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={form.dampakKategori} // ✅ TAMBAH INI
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                dampakKategori: e.target.value,
                              }))
                            }
                          >
                            <option>Keuangan Negara</option>
                            <option>Reputasi</option>
                            <option>Korupsi</option>
                          </select>
                        </div>

                        {/* ALAT BUKTI */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Alat Bukti</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            onChange={(e) =>
                              setForm((prev: any) => ({
                                ...prev,
                                alatBukti: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* URAIAN DAMPAK */}
                        <div>
                          <label className="text-sm">Uraian Dampak</label>

                          <select
                            id="dampak"
                            className="w-full border p-2 rounded bg-white text-black"
                            value={form.dampak}
                            onChange={(e) => {
                              const selected = referensiList.find(
                                (item: any) => item.dampak === e.target.value,
                              );

                              setForm((prev: any) => ({
                                ...prev,
                                dampak: selected?.dampak || e.target.value,
                                dampakKategori:
                                  selected?.dampak_kategori ||
                                  selected?.kategori_dampak ||
                                  prev.dampakKategori,
                              }));
                            }}
                          >
                            <option value="">Pilih Uraian Dampak</option>

                            {dampakList.map((item: any) => (
                              <option key={item.id} value={item.dampak}>
                                {item.dampak}
                              </option>
                            ))}
                          </select>
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
                                kategori: "Risiko Korupsi",

                                // 🔥 TAMBAH INI
                                subProses: form.subProses,
                                subKategori: form.subKategori,
                                indikator: form.indikator,
                                alatBukti: form.alatBukti,

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
                              const komitmen = JSON.parse(
                                localStorage.getItem("komitmen") || "[]",
                              );

                              const updatedKomitmen = komitmen.map((k: any) =>
                                k.id === selectedKomitmen
                                  ? {
                                    ...k,
                                    jadwalMR: {
                                      ...k.jadwalMR,
                                      komunikasi: true,
                                      konteks: true,
                                      identifikasi: true,
                                    },
                                  }
                                  : k,
                              );


                              setStep(2);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
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
                          Step 2: Isi penyebab, pengendalian, pihak terlibat,
                          dan skor
                        </div>
                        {/* 🔥 PERNYATAAN RISIKO (AUTO DARI STEP 1) */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Pernyataan Risiko</label>

                          <select
                            className="w-full border p-2 rounded bg-gray-100 bg- white" text-black
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
                          <label className="text-sm font-semibold text-gray-800 font-bold">Jenis Penyebab</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={step2Form.jenis}
                            onChange={(e) =>
                              setStep2Form((prev) => ({
                                ...prev,
                                jenis: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            <option>Tekanan / Pressure</option>
                            <option>Kesempatan / Opportunity</option>
                            <option>Rasionalisasi</option>
                             <option>Gaya Hidup</option>
                            <option>Kapasitas</option>
                            <option>Arogansi</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Penyebab Risiko</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={step2Form.penyebab}
                            onChange={(e) =>
                              setStep2Form((prev) => ({
                                ...prev,
                                penyebab: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800 font-bold">Uraian Pengendalian</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={step2Form.pengendalian}
                            onChange={(e) =>
                              setStep2Form((prev) => ({
                                ...prev,
                                pengendalian: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800 ">Status</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step2Form.status}
                            onChange={(e) =>
                              setStep2Form((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            <option>Memadai</option>
                            <option>Belum Memadai</option>
                          </select>
                        </div>

                        {/* BUTTON TAMBAH PENYEBAB */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              if (!step2Form.penyebab) return;

                              const newItem = {
                                id: Date.now(),
                                kode: "S00" + (penyebabList.length + 1),
                                jenis: step2Form.jenis,
                                penyebab: step2Form.penyebab,
                                pengendalian: step2Form.pengendalian,
                                status: step2Form.status,
                              };

                              setPenyebabList((prev) => [...prev, newItem]);

                              setStep2Form((prev) => ({
                                ...prev,
                                penyebab: "",
                                pengendalian: "",
                                status: "",
                              }));
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2 font-bold"
                          >
                            Tambah +
                          </button>
                        </div>

                        {/* TABLE PENYEBAB */}
                        <table className="w-full text-xs border mt-3">
                          <thead className="bg-purple-800 text-white  text-center">
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
                                <td
                                  colSpan={6}
                                  className="text-center p-3 text-gray-400 bg-white font-bold"
                                >
                                  Belum ada data
                                </td>
                              </tr>
                            ) : (
                              penyebabList.map((p, i) => (
                                <tr key={p.id}>
                                  <td className="border p-2">{p.kode}</td>
                                  <td className="border p-2 font-bold">{p.jenis}</td>
                                  <td className="border p-2 font-bold">{p.penyebab}</td>
                                  <td className="border p-2 font-bold">
                                    {p.pengendalian}
                                  </td>
                                  <td className="border p-2 font-bold">{p.status}</td>
                                  <td className="border p-2 text-center">
                                    <button
                                      onClick={() =>
                                        setPenyebabList((prev) =>
                                          prev.filter((x) => x.id !== p.id),
                                        )
                                      }
                                      className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
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
                        {/* 🔵 BLOK B: PIHAK TERLIBAT */}
                        {/* ========================= */}

                        <div className="mt-5">
                          <label className="text-sm font-semibold text-gray-800">Pihak Terlibat</label>
                          <textarea
                            value={pihakForm.nama}
                            onChange={(e) =>
                              setPihakForm((prev) => ({
                                ...prev,
                                nama: e.target.value,
                              }))
                            }
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800">
                            Internal / Eksternal
                          </label>
                          <select
                            value={pihakForm.jenis}
                            onChange={(e) =>
                              setPihakForm((prev) => ({
                                ...prev,
                                jenis: e.target.value,
                              }))
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="">Pilih</option>
                            <option value="INTERNAL">INTERNAL</option>
                            <option value="EKSTERNAL">EKSTERNAL</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800">Jabatan</label>
                          <textarea
                            value={pihakForm.jabatan}
                            onChange={(e) =>
                              setPihakForm((prev) => ({
                                ...prev,
                                jabatan: e.target.value,
                              }))
                            }
                            className="w-full border p-2 rounded bg-white text-black"
                          />
                        </div>

                        {/* BUTTON TAMBAH PIHAK */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              if (!pihakForm.nama || !pihakForm.jenis) return;

                              const newItem = {
                                id: Date.now(),
                                kode: "P00" + (pihakList.length + 1),
                                nama: pihakForm.nama,
                                jenis: pihakForm.jenis,
                                jabatan: pihakForm.jabatan,
                              };

                              setPihakList((prev) => [...prev, newItem]);

                              setPihakForm({
                                nama: "",
                                jenis: "",
                                jabatan: "",
                              });
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2 font-bold"
                          >
                            Tambah +
                          </button>
                        </div>

                        {/* TABLE PIHAK */}
                        <table className="w-full text-xs border mt-3">
                          <thead className="bg-purple-800 text-white">
                            <tr>
                              <th className="border p-2">No</th>
                              <th className="border p-2">Nama</th>
                              <th className="border p-2">
                                Internal / Eksternal
                              </th>
                              <th className="border p-2">Jabatan</th>
                              <th className="border p-2">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {pihakList.map((p, i) => (
                              <tr key={p.id}>
                                <td className="border p-2">{p.kode}</td>
                                <td className="border p-2">{p.nama}</td>
                                <td className="border p-2">{p.jenis}</td>
                                <td className="border p-2">{p.jabatan}</td>
                                <td className="border p-2 text-center">
                                  <button
                                    onClick={() =>
                                      setPihakList((prev) =>
                                        prev.filter((x) => x.id !== p.id),
                                      )
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))}
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
                              <label className="text-xs">
                                Tingkat Kemungkinan
                              </label>
                              <select
                                value={step2Form.kemungkinan}
                                onChange={(e) =>
                                  setStep2Form((prev) => ({
                                    ...prev,
                                    kemungkinan: Number(e.target.value),
                                  }))
                                }
                                className="w-full border p-2 rounded bg-white text-black font-bold"
                              >
                                <option value={1}>
                                  1 - Hampir Tidak Terjadi
                                </option>
                                <option value={2}>2 - Jarang Terjadi</option>
                                <option value={3}>3 - Kadang Terjadi</option>
                                <option value={4}>4 - Sering Terjadi</option>
                                <option value={5}>
                                  5 - Hampir Pasti Terjadi
                                </option>
                              </select>
                            </div>

                            {/* DAMPAK */}
                            <div>
                              <label className="text-xs">Tingkat Dampak</label>
                              <select
                                value={step2Form.dampak}
                                onChange={(e) =>
                                  setStep2Form((prev) => ({
                                    ...prev,
                                    dampak: Number(e.target.value),
                                  }))
                                }
                                className="w-full border p-2 rounded bg-white text-black font-bold"
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
                              className="border p-2 rounded bg-white text-black"
                            />

                            <textarea
                              placeholder="Penjelasan Tingkat Dampak"
                              className="border p-2 rounded bg-white text-black"
                            />
                          </div>

                          {/* SKOR */}
                          <div className="mt-3">
                            <label className="text-xs">
                              Skor Risiko (K x D)
                            </label>

                           <input
  value={step2Form.skor}
  readOnly
  className={`w-full border p-2 rounded text-center font-bold ${
    getRiskColor(step2Form.skor)
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
                              setRisikoList((prev) => {
                                const updated = [...prev];
                                const lastIndex = updated.length - 1;

                                if (lastIndex >= 0) {
                                  updated[lastIndex] = {
                                    ...updated[lastIndex],

                                    penyebabList,
                                    pihakList,

                                    penyebab: penyebabList.map((p) => p.penyebab).join(", "),
                                    pengendalian: penyebabList.map((p) => p.pengendalian).join(", "),
                                    hasil: penyebabList.map((p) => p.status).join(", "),

                                    k: step2Form.kemungkinan,
                                    d: step2Form.dampak,
                                    skor: step2Form.skor,

                                    prioritas:
                                      step2Form.skor >= 20
                                        ? 1
                                        : step2Form.skor >= 15
                                          ? 2
                                          : step2Form.skor >= 10
                                            ? 3
                                            : 4,
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
                          <label className="text-sm font-semibold text-gray-800">Respon Risiko</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={step3Form.respon}
                            onChange={(e) =>
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

                              setRisikoList((prev) => {
                                const updated = [...prev];
                                const lastIndex = updated.length - 1;

                                if (lastIndex >= 0) {
                                  updated[lastIndex] = {
                                    ...updated[lastIndex],
                                    respon: step3Form.respon,
                                  };
                                }

                                return updated;
                              });
                              const komitmen = JSON.parse(
                                localStorage.getItem("komitmen") || "[]",
                              );

                              const updatedKomitmen = komitmen.map((k: any) =>
                                k.id === selectedKomitmen
                                  ? {
                                    ...k,
                                    jadwalMR: {
                                      ...k.jadwalMR,
                                      respon: true,
                                    },
                                  }
                                  : k,
                              );

                              localStorage.setItem(
                                "komitmen",
                                JSON.stringify(updatedKomitmen),
                              );
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
                      <div className="space-y-4 text-black opacity-100">
                        <div className="bg-blue-50 p-3 text-xs border rounded">
                          Step 4: Rencana Tindak Pengendalian (RTP)
                        </div>
                        {/* PILIH PENYEBAB */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">
                            Pilih Penyebab Risiko
                          </label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black font-bold"
                            value={step4Form.penyebabId}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                penyebabId: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            {penyebabList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.kode} - {p.penyebab}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* RESPON */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Respon Risiko</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.respon}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                respon: e.target.value,
                              }))
                            }
                          >
                            <option value="">Pilih</option>
                            <option>Mengurangi Dampak</option>
                            <option>Mengurangi Frekuensi</option>
                          </select>
                        </div>
                        {/* BERBAGI */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Berbagi Risiko</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.berbagi}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                berbagi: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* JENIS KORUPSI */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Jenis RTP Korupsi</label>
                          <input
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.jenisKorupsi}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                jenisKorupsi: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* JENIS RTP */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Jenis RTP</label>
                          <input
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.jenisRtp}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                jenisRtp: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* URAIAN */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Uraian RTP</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.uraian}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                uraian: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* INDIKATOR */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Indikator Keluaran</label>
                          <textarea
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.indikator}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                indikator: e.target.value,
                              }))
                            }
                          />
                        </div>
                        {/* PERIODE */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800">Periode</label>
                          <select
                            className="w-full border p-2 rounded bg-white text-black"
                            value={step4Form.periode}
                            onChange={(e) =>
                              setStep4Form((prev) => ({
                                ...prev,
                                periode: e.target.value,
                              }))
                            }
                          >
                            <option>SEMESTER</option>
                            <option>TAHUNAN</option>
                          </select>
                        </div>
                        {/* BUTTON TAMBAH */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              if (!step4Form.penyebabId) {
                                alert("Penyebab belum dipilih!");
                                return;
                              }

                              const penyebab = penyebabList.find(
                                (p) => p.id == step4Form.penyebabId,
                              );

                              const newItem = {
                                id: Date.now(),
                                kode: penyebab?.kode,
                                penyebab: penyebab?.penyebab,
                                penanggungJawab: form.penanggungJawab,
                                targetList: [],
                                ...step4Form,
                              };

                              setRtpList((prev) => [...prev, newItem]);

                              setStep4Form({
                                penyebabId: "",
                                respon: "",
                                berbagi: "",
                                jenisKorupsi: "",
                                jenisRtp: "",
                                uraian: "",
                                indikator: "",
                                periode: "SEMESTER",
                              });
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Tambah +
                          </button>
                        </div>
                        {/* TABLE */}
                        <table className="w-full text-xs border mt-4">
                          <thead className="bg-purple-800 text-white ">
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
                                <td
                                  colSpan={10}
                                  className="text-center p-3 text-gray-400"
                                >
                                  Belum ada data
                                </td>
                              </tr>
                            ) : (
                              <>
                                {rtpList.map((r, i) => (
                                  <React.Fragment key={r.id}>
                                    <tr>
                                      <td className="border p-2">{i + 1}</td>
                                      <td className="border p-2">{r.kode}</td>
                                      <td className="border p-2">
                                        {r.penyebab}
                                      </td>
                                      <td className="border p-2">
                                        {r.jenisKorupsi}
                                      </td>
                                      <td className="border p-2">
                                        {r.jenisRtp}
                                      </td>
                                      <td className="border p-2">{r.uraian}</td>
                                      <td className="border p-2">{r.respon}</td>
                                      <td className="border p-2">
                                        {r.berbagi}
                                      </td>
                                      <td className="border p-2">
                                        {r.indikator}
                                      </td>

                                      <td className="border p-2 text-center">
                                        <button
                                          onClick={() => {
                                            setSelectedRtpId(r.id);
                                            setOpenTargetModal(true);
                                          }}
                                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
                                        >
                                          Target
                                        </button>

                                        <button
                                          onClick={() =>
                                            setRtpList((prev) =>
                                              prev.filter((x) => x.id !== r.id),
                                            )
                                          }
                                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                        >
                                          Hapus
                                        </button>
                                      </td>
                                    </tr>

                                    {/* 🔥 SUB TARGET */}
                                    {r.targetList &&
                                      r.targetList.map((t: any) => (
                                        <tr key={t.id} className="bg-gray-100">
                                          <td colSpan={3}></td>
                                          <td
                                            colSpan={3}
                                            className="border p-2 text-xs"
                                          >
                                            📅 {t.waktu}
                                          </td>
                                          <td
                                            colSpan={3}
                                            className="border p-2 text-xs"
                                          >
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
                        <div className="border rounded p-3 mb-3">
  <label className="font-semibold text-sm block mb-2">
    Alokasi Sumber Daya (5M)
  </label>

  {["Man", "Money", "Method", "Machine", "Material"].map((item) => (
    <label key={item} className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={rtpScore.sumber.includes(item)}
        onChange={(e) => {
          if (e.target.checked) {
            setRtpScore((prev) => ({
              ...prev,
              sumber: [...prev.sumber, item],
            }));
          } else {
            setRtpScore((prev) => ({
              ...prev,
              sumber: prev.sumber.filter((x) => x !== item),
            }));
          }
        }}
      />
      {item}
    </label>
  ))}
</div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <textarea
                                placeholder="Penjelasan Tingkat Kemungkinan"
                                className="border p-2 rounded"
                                value={rtpScore.ketK}
                                onChange={(e) =>
                                  setRtpScore((prev) => ({
                                    ...prev,
                                    ketK: e.target.value,
                                  }))
                                }
                              />

                              <textarea
                                placeholder="Penjelasan Tingkat Dampak"
                                className="border p-2 rounded"
                                value={rtpScore.ketD}
                                onChange={(e) =>
                                  setRtpScore((prev) => ({
                                    ...prev,
                                    ketD: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            {/* KEMUNGKINAN */}
                            <select
                              className="border p-2 rounded"
                              value={rtpScore.k}
                              onChange={(e) =>
                                setRtpScore((prev) => ({
                                  ...prev,
                                  k: Number(e.target.value),
                                }))
                              }
                            >
                              <option value={1}>
                                1 - Hampir Tidak Terjadi
                              </option>
                              <option value={2}>2 - Jarang Terjadi</option>
                              <option value={3}>3 - Kadang Terjadi</option>
                              <option value={4}>4 - Sering Terjadi</option>
                              <option value={5}>5 - Hampir Pasti</option>
                            </select>

                            {/* DAMPAK */}
                            <select
                              className="border p-2 rounded"
                              value={rtpScore.d}
                              onChange={(e) =>
                                setRtpScore((prev) => ({
                                  ...prev,
                                  d: Number(e.target.value),
                                }))
                              }
                            >
                              <option value={1}>1 - Tidak Signifikan</option>
                              <option value={2}>2 - Minor</option>
                              <option value={3}>3 - Moderat</option>
                              <option value={4}>4 - Signifikan</option>
                              <option value={5}>5 - Sangat Signifikan</option>
                            </select>
                          </div>

                          {/* NILAI */}
                          {/* NILAI RTP */}
<input
  value={rtpScore.n}
  readOnly
  className={`w-full border p-2 rounded text-center font-bold ${
    getRiskColor(rtpScore.n)
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
                              onChange={(e) => setUnitForm(e.target.value)}
                            />

                            <button
                              onClick={() => {
                                if (!unitForm) return;

                                setUnitList((prev) => [
                                  ...prev,
                                  { id: Date.now(), nama: unitForm },
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
                                <th className="border p-2">
                                  Nama Unit / Satker
                                </th>
                                <th className="border p-2">Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {unitList.map((u, i) => (
                                <tr key={u.id}>
                                  <td className="border p-2">{i + 1}</td>
                                  <td className="border p-2">{u.nama}</td>
                                  <td className="border p-2 text-center">
                                    <button
                                      onClick={() =>
                                        setUnitList((prev) =>
                                          prev.filter((x) => x.id !== u.id),
                                        )
                                      }
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
                            onChange={(e) => setKlasifikasi(e.target.value)}
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
                                <button
                                  onClick={() => setOpenTargetModal(false)}
                                >
                                  ✕
                                </button>
                              </div>

                              <input
                                type="date"
                                className="w-full border p-2 rounded mb-3"
                                value={targetForm.waktu}
                                onChange={(e) =>
                                  setTargetForm((prev) => ({
                                    ...prev,
                                    waktu: e.target.value,
                                  }))
                                }
                              />

                              <textarea
                                placeholder="Uraian"
                                className="w-full border p-2 rounded mb-3"
                                value={targetForm.uraian}
                                onChange={(e) =>
                                  setTargetForm((prev) => ({
                                    ...prev,
                                    uraian: e.target.value,
                                  }))
                                }
                              />

                              <button
                                onClick={() => {
                                  if (!targetForm.waktu) return;

                                  setRtpList((prev) => {
                                    return prev.map((r) => {
                                      if (r.id === selectedRtpId) {
                                        return {
                                          ...r,
                                          targetList: [
                                            ...(r.targetList || []),
                                            {
                                              id: Date.now(),
                                              waktu: targetForm.waktu,
                                              uraian: targetForm.uraian,
                                            },
                                          ],
                                        };
                                      }
                                      return r;
                                    });
                                  });

                                  setTargetForm({ waktu: "", uraian: "" });
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
                            onClick={simpanLangsungDatabase}
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
