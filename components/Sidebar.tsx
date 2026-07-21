"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://idriskterdepan.id/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openKomitmen, setOpenKomitmen] = useState(false);
  const [openRisiko, setOpenRisiko] = useState(false);

  const [role, setRole] = useState("balai");
  const [komitmenIdAktif, setKomitmenIdAktif] = useState("");
  const [sudahIsiRisikoKorupsi, setSudahIsiRisikoKorupsi] = useState(false);
  const [loadingCekKorupsi, setLoadingCekKorupsi] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r || "balai");
  }, []);

  const isBalaiRole =
    role === "balai" || role === "user" || role === "admin";

  const isVerifikatorRole = role === "verifikator";

  const getKomitmenIdDariUrl = () => {
    if (typeof window === "undefined") return "";

    const params = new URLSearchParams(window.location.search);
    return params.get("komitmenId") || "";
  };

  const buatPathDenganKomitmen = (path: string) => {
    const id = getKomitmenIdDariUrl();

    if (path.startsWith("/risiko/") && id) {
      return `${path}?komitmenId=${id}`;
    }

    return path;
  };

  const cekKorupsiDiDatabase = async (komitmenIdManual?: string) => {
    try {
      setLoadingCekKorupsi(true);

      const idAktif = komitmenIdManual || getKomitmenIdDariUrl();

      setKomitmenIdAktif(idAktif);

      if (!idAktif) {
        setSudahIsiRisikoKorupsi(false);
        return false;
      }

      const res = await axios.get(`${API_URL}/profil-risiko`);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      console.log("KOMITMEN ID AKTIF:", idAktif);
      console.log("DATA CEK KORUPSI SIDEBAR:", data);

      const adaKorupsi = data.some((item: any) => {
        const kategori = String(
          item?.kategori ||
            item?.kategori_risiko ||
            item?.kategoriRisiko ||
            "",
        ).toLowerCase();

        const idData = String(
          item?.komitmen_id ||
            item?.komitmenId ||
            item?.id_komitmen ||
            "",
        );

        return kategori.includes("korup") && idData === String(idAktif);
      });

      console.log("ADA KORUPSI DI KOMITMEN INI?", adaKorupsi);

      setSudahIsiRisikoKorupsi(adaKorupsi);

      return adaKorupsi;
    } catch (error) {
      console.error("Gagal cek risiko korupsi:", error);
      setSudahIsiRisikoKorupsi(false);
      return false;
    } finally {
      setLoadingCekKorupsi(false);
    }
  };

  useEffect(() => {
    const jalan = () => {
      const id = getKomitmenIdDariUrl();
      setKomitmenIdAktif(id);

      if (id) {
        cekKorupsiDiDatabase(id);
      } else {
        setSudahIsiRisikoKorupsi(false);
      }
    };

    jalan();

    const interval = setInterval(jalan, 3000);

    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">
      {/* LOGO */}
      <div className="p-5 border-b border-blue-700 flex items-center gap-3">
        <Image
          src="/pupr.png"
          alt="logo"
          width={40}
          height={40}
          className="bg-white p-1 rounded-full"
        />

        <div>
          <h1 className="font-bold text-yellow-400 text-lg">e-PURISK</h1>
          <p className="text-xs text-gray-300">SI Manajemen Risiko</p>
        </div>
      </div>

      {/* MENU */}
      <div className="p-4 space-y-2 flex-1">
        {isBalaiRole && (
          <>
            <MenuItem name="Dashboard" path="/dashboard" />
            <MenuItem name="Daftar Pegawai" path="/pegawai" />
            <MenuItem name="Loss Event Database" path="/loss" />

            <div>
              <div
                onClick={() => setOpenKomitmen(!openKomitmen)}
                className="p-3 rounded-lg flex justify-between cursor-pointer hover:bg-blue-800"
              >
                <span>📋 Daftar Komitmen MR</span>
                <span>{openKomitmen ? "▲" : "▼"}</span>
              </div>

              {openKomitmen && (
                <div className="ml-4 mt-2 space-y-2">
                  <SubItem name="Komitmen MR" path="/komitmen" />

                  <div>
                    <div
                      onClick={() => setOpenRisiko(!openRisiko)}
                      className="p-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      ➤ Risiko
                    </div>

                    {openRisiko && (
                      <div className="ml-4 space-y-2">
                        <SubItem
                          name="Risiko Korupsi"
                          path="/risiko/korupsi"
                        />

                        <SubItem
                          name="Keuangan"
                          path="/risiko/keuangan"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Reputasi"
                          path="/risiko/reputasi"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Hukum"
                          path="/risiko/hukum"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Kecelakaan Kerja"
                          path="/risiko/kecelakaan-kerja"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Layanan"
                          path="/risiko/layanan"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Kinerja"
                          path="/risiko/kinerja"
                          wajibKorupsi
                        />

                        <SubItem
                          name="SPBE"
                          path="/risiko/spbe"
                          wajibKorupsi
                        />

                        <SubItem
                          name="Lainnya"
                          path="/risiko/lainnya"
                          wajibKorupsi
                        />

                        {!komitmenIdAktif && (
                          <p className="text-[11px] text-yellow-300 mt-2 leading-relaxed">
                            Pilih komitmen terlebih dahulu di halaman Risiko
                            Korupsi.
                          </p>
                        )}

                        {komitmenIdAktif && !sudahIsiRisikoKorupsi && (
                          <p className="text-[11px] text-yellow-300 mt-2 leading-relaxed">
                            Isi Risiko Korupsi terlebih dahulu untuk membuka
                            risiko lainnya.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <SubItem name="Profil Risiko" path="/profil" />
                </div>
              )}
            </div>

            <MenuItem name="Panduan Aplikasi" path="/panduan" />
          </>
        )}

        {isVerifikatorRole && (
          <>
            <MenuItem name="Dashboard Verifikator" path="/verifikator" />
            <MenuItem name="Approval Komitmen" path="/verifikator" />
          </>
        )}
      </div>
    </div>
  );

  function MenuItem({ name, path }: any) {
    const isActive = pathname === path;

    return (
      <div
        onClick={() => router.push(path)}
        className={`p-3 rounded-lg cursor-pointer transition ${
          isActive ? "bg-blue-700" : "hover:bg-blue-800"
        }`}
      >
        {name}
      </div>
    );
  }

  function SubItem({ name, path, wajibKorupsi = false }: any) {
    const isActive = pathname === path;
    const terkunci = wajibKorupsi && !sudahIsiRisikoKorupsi;

    const handleClick = async () => {
      const idAktif = getKomitmenIdDariUrl();

      if (wajibKorupsi) {
        if (!idAktif) {
          alert("Pilih komitmen terlebih dahulu di Risiko Korupsi.");
          router.push("/risiko/korupsi");
          return;
        }

        const adaKorupsi = await cekKorupsiDiDatabase(idAktif);

        if (!adaKorupsi) {
          alert(
            "Isi Risiko Korupsi terlebih dahulu pada komitmen ini sebelum membuka risiko lain.",
          );
          return;
        }
      }

      router.push(buatPathDenganKomitmen(path));
    };

    return (
      <div
        onClick={handleClick}
        className={`p-2 text-sm rounded transition flex items-center justify-between ${
          terkunci
            ? "cursor-pointer bg-blue-950 text-gray-400 opacity-80"
            : isActive
              ? "bg-blue-700 cursor-pointer"
              : "hover:bg-blue-700 cursor-pointer"
        }`}
      >
        <span>➤ {name}</span>

        {loadingCekKorupsi && wajibKorupsi ? (
          <span className="text-xs">...</span>
        ) : terkunci ? (
          <span className="text-xs">🔒</span>
        ) : null}
      </div>
    );
  }
}