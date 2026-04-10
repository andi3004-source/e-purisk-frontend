"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (email && password) {
      // ✅ FIX UTAMA
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("user", email);

      router.push("/dashboard");
    } else {
      alert("Email & Password wajib diisi!");
    }
  };

  return (
    <div className="min-h-screen flex">

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
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-[350px] mx-4">

          {/* MOBILE HEADER */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <Image
              src="/pupr.png"
              alt="Logo PUPR"
              width={70}
              height={70}
              className="mb-2 bg-white p-2 rounded-full"
            />
            <h1 className="text-xl font-bold text-blue-900">e-PURISK</h1>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition"
            >
              Masuk
            </button>

          </form>

          {/* REGISTER */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-700 font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>

          <p className="text-sm text-center text-gray-500 mt-2">
            ©️ 2026 Direktorat Jenderal SDA
          </p>

        </div>
      </div>

    </div>
  );
}