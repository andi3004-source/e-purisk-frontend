"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("login");
    router.push("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <h1 className="font-bold text-lg">Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-600">Admin</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

    </div>
  );
}