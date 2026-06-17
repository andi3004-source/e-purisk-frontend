"use client";

import { useState } from "react";

export default function ModalLED({ isOpen, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({
    sumber: "Hasil Audit Intern (ITJEN)",
    tanggalCatat: "",
    uraian: "",
    waktu: "",
    lokasi: "",
    sebab: "",
    kondisi: "",
    dampak: "",
    rincian: "",
    unit: "Unit A",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.tanggalCatat) {
      alert("Tanggal pencatatan wajib diisi");
      return;
    }

    if (!form.uraian) {
      alert("Uraian peristiwa wajib diisi");
      return;
    }

    await onSave(form);

    setForm({
      sumber: "Hasil Audit Intern (ITJEN)",
      tanggalCatat: "",
      uraian: "",
      waktu: "",
      lokasi: "",
      sebab: "",
      kondisi: "",
      dampak: "",
      rincian: "",
      unit: "Unit A",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[1000px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="font-semibold text-lg text-black">INPUT LED</h2>
          <button onClick={onClose} className="text-xl text-black">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-black">
          <div>
            <label className="font-medium">Sumber Informasi (1)</label>
            <select
              name="sumber"
              value={form.sumber}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Hasil Audit Intern (ITJEN)">
                Hasil Audit Intern (ITJEN)
              </option>
              <option value="Audit Ekstern">Audit Ekstern</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Tanggal Pencatatan (2)</label>
            <input
              type="date"
              name="tanggalCatat"
              value={form.tanggalCatat}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Uraian Peristiwa (3)</label>
            <textarea
              name="uraian"
              value={form.uraian}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Waktu Terjadi (4)</label>
            <input
              type="date"
              name="waktu"
              value={form.waktu}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Lokasi (5)</label>
            <input
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Sebab (6)</label>
            <textarea
              name="sebab"
              value={form.sebab}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Kondisi Setelah Penanganan (7)</label>
            <textarea
              name="kondisi"
              value={form.kondisi}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Dampak (8)</label>
            <textarea
              name="dampak"
              value={form.dampak}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-medium">Rincian Penanganan (10)</label>
            <textarea
              name="rincian"
              value={form.rincian}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="col-span-3">
            <label className="font-medium">Tagging Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Unit A">Unit A</option>
              <option value="Unit B">Unit B</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>

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