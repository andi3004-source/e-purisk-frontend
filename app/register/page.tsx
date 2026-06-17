"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // nanti diganti API backend Laravel
    alert("Registrasi berhasil!");

    router.push("/login"); // balik ke login
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-10">
        
        <Image
          src="/pupr.png"
          alt="Logo PUPR"
          width={100}
          height={100}
          className="mb-4 bg-white p-2 rounded-full"
        />

        <h1 className="text-4xl font-bold mb-4">e-PURISK</h1>

        <p className="text-lg text-center max-w-md">
          Sistem Manajemen Risiko  
          Direktorat Jenderal Sumber Daya Air
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 px-4 py-10">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-[87.5]">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full p-3 border rounded-lg font-bold text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg font-bold text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg font-bold text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition"
            >
              Daftar
            </button>

          </form>

          {/* LINK KE LOGIN */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-700 font-semibold hover:underline">
              Login di sini
            </Link>
          </p>

          <p className="text-sm text-center text-gray-500 mt-2">
            © 2026 Direktorat Jenderal SDA
          </p>

        </div>
      </div>

    </div>
  );
}