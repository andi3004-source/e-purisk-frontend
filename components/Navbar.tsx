"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState("User");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setName(user.name || "User");
      } catch {
        setName("User");
      }
    }

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const getRoleLabel = () => {
    if (role === "admin") return "Admin";
    if (role === "verifikator") return "Verifikator";
    if (role === "balai") return "Balai";
    if (role === "user") return "User";
    return "User";
  };

  const getTitle = () => {
    if (pathname.startsWith("/verifikator")) return "Dashboard Verifikator";
    if (pathname.startsWith("/pegawai")) return "Daftar Pegawai";
    if (pathname.startsWith("/loss")) return "Loss Event Database";
    if (pathname.startsWith("/komitmen")) return "Komitmen MR";
    if (pathname.startsWith("/profil")) return "Profil Risiko";
    if (pathname.startsWith("/risiko")) return "Risiko";
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    return "Dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    router.push("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* LEFT */}
      <div>
        <h1 className="font-bold text-lg text-gray-800">
          {getTitle()}
        </h1>
        <p className="text-xs text-gray-500">
          Masuk sebagai {getRoleLabel()}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-700">
            {name}
          </p>

          <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            {getRoleLabel()}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}