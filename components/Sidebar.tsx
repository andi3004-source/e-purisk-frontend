"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openKomitmen, setOpenKomitmen] = useState(false);
  const [openRisiko, setOpenRisiko] = useState(false);

  // 🔥 TAMBAHAN ROLE
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r || "");
  }, []);

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

        {/* ================= BALAI ================= */}
        {role === "balai" && (
          <>
            <MenuItem name="Dashboard" path="/dashboard" />
            <MenuItem name="Daftar Pegawai" path="/pegawai" />
            <MenuItem name="Loss Event Database" path="/loss" />

            {/* KOMITMEN */}
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

                  {/* RISIKO */}
                  <div>
                    <div
                      onClick={() => setOpenRisiko(!openRisiko)}
                      className="p-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      ➤ Risiko
                    </div>

                    {openRisiko && (
                      <div className="ml-4 space-y-2">

                        <SubItem name="Risiko Korupsi" path="/risiko/korupsi" />

                        {[
                          "Keuangan",
                          "Reputasi",
                          "Hukum",
                          "Kecelakaan Kerja",
                          "Layanan",
                          "Kinerja",
                          "SPBE",
                        ].map((r) => (
                          <SubItem
                            key={r}
                            name={r}
                            path={`/risiko/${r.toLowerCase().replace(/\s+/g, "-")}`}
                          />
                        ))}

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

        {/* ================= VERIFIKATOR ================= */}
        {role === "verifikator" && (
          <>
            <MenuItem name="Dashboard Verifikator" path="/verifikator" />
            <MenuItem name="Approval Komitmen" path="/verifikator" />
            <MenuItem name="Monitoring Risiko" path="/verifikator/monitoring" />
          </>
        )}

      </div>
    </div>
  );

  // 🔥 MENU UTAMA
  function MenuItem({ name, path }: any) {
    const isActive = pathname === path;

    return (
      <div
        onClick={() => router.push(path)}
        className={`p-3 rounded-lg cursor-pointer transition
          ${isActive ? "bg-blue-700" : "hover:bg-blue-800"}
        `}
      >
        {name}
      </div>
    );
  }

  // 🔥 SUB MENU
  function SubItem({ name, path }: any) {
    return (
      <div
        onClick={() => router.push(path)}
        className="p-2 text-sm rounded cursor-pointer transition hover:bg-blue-700"
      >
        ➤ {name}
      </div>
    );
  }
}