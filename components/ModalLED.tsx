"use client";

import { useState } from "react";

export default function ModalLED({ isOpen, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({});

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(form);

    // 🔥 KIRIM KE TABLE
    onSave(form);

    // unlock sidebar
    localStorage.setItem("led_filled", "true");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-[1000px] rounded-lg shadow-lg p-6">

        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="font-semibold text-lg">INPUT LED</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">

          <div>
            <label className="font-medium">Sumber Informasi (1)</label>
            <select name="sumber" onChange={handleChange} className="w-full border rounded p-2">
              <option>Hasil Audit Intern (ITJEN)</option>
              <option>Audit Ekstern</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Tanggal Pencatatan (2)</label>
            <input
                 type="date"
                  name="tanggalCatat"
                   onChange={handleChange}
                  className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Uraian Peristiwa (3)</label>
            <textarea name="uraian" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Waktu Terjadi (4)</label>
            <input type="date" name="waktu" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Lokasi (5)</label>
            <input name="lokasi" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Sebab (6)</label>
            <textarea name="sebab" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Kondisi Setelah Penanganan (7)</label>
            <textarea name="kondisi" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Dampak (8)</label>
            <textarea name="dampak" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-medium">Rincian Penanganan (10)</label>
            <textarea name="rincian" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div className="col-span-3">
            <label className="font-medium">Tagging Unit</label>
            <select name="unit" onChange={handleChange} className="w-full border rounded p-2">
              <option>Pilih Unit</option>
              <option>Unit A</option>
              <option>Unit B</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Simpan
          </button>
        </div>

      </div>
    </div>
  );
}