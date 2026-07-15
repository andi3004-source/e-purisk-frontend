"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  getVerifikatorData,
  getVerifikatorDetail,
  updateVerifikatorStatus,
} from "@/lib/api";

export default function VerifikatorPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await getVerifikatorData();
      setData(res);
    } catch (error) {
      console.error("Gagal ambil data verifikator:", error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");


    if (role !== "verifikator") {
      router.push("/");
      return;
    }

    fetchData();


  }, [router]);

  const safeArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const safeText = (value: any) => {
    return String(value ?? "-")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br/>");
  };


  const handleDownloadPDF = async (id: number) => {
    try {
      const detail = await getVerifikatorDetail(id);
      console.log("DETAIL PDF:", detail);

      if (String(detail?.status || "").toLowerCase() !== "approved") {
        alert("PDF hanya bisa didownload jika status sudah Approved");
        return;
      }

      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      let profilRisiko = safeArray(
        detail?.profilRisiko ||
        detail?.profil_risiko ||
        detail?.profil_risikos ||
        detail?.risikos
      );

      const komitmenIdPDF =
        detail?.komitmen_id || detail?.komitmenId || detail?.id_komitmen;

      if (profilRisiko.length === 0 && komitmenIdPDF) {
        try {
          const resProfil = await fetch(
            `https://idriskterdepan.id/api/profil-risiko?komitmen_id=${komitmenIdPDF}`,
          );

          const jsonProfil = await resProfil.json();

          const semuaProfil = Array.isArray(jsonProfil)
            ? jsonProfil
            : Array.isArray(jsonProfil.data)
              ? jsonProfil.data
              : [];

          profilRisiko = semuaProfil.filter(
            (r: any) =>
              Number(r.komitmen_id || r.komitmenId) === Number(komitmenIdPDF),
          );
        } catch (error) {
          console.error("Gagal ambil profil risiko untuk PDF:", error);
        }
      }

      const sasaranList = safeArray(
        detail?.sasaran ||
        detail?.sasaranList ||
        detail?.sasarans
      ).map((s: any) => ({
        sasaranStrategis:
          s.sasaranStrategis || s.sasaran_strategis || "-",

        indikatorStrategis:
          s.indikatorStrategis || s.indikator_strategis || "-",

        sasaranProgram:
          s.sasaranProgram || s.sasaran_program || "-",

        indikatorProgram:
          s.indikatorProgram || s.indikator_program || "-",

        sasaranKegiatan:
          s.sasaranKegiatan || s.sasaran_kegiatan || "-",

        indikatorKegiatan:
          s.indikatorKegiatan || s.indikator_kegiatan || "-",

        indikator:
          Array.isArray(s.indikator) ? s.indikator : [],
      }));
      const internal = safeArray(detail?.internal);
      const eksternal = safeArray(detail?.eksternal);

      let ledDataPDF: any[] = [];

      try {
        const resLed = await fetch("https://idriskterdepan.id/api/loss");
        const jsonLed = await resLed.json();

        ledDataPDF = Array.isArray(jsonLed)
          ? jsonLed
          : Array.isArray(jsonLed.data)
            ? jsonLed.data
            : [];
      } catch (error) {
        console.error("Gagal ambil LED untuk PDF:", error);
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const warnaUtama: [number, number, number] = [88, 28, 135]; // ungu tua
      const warnaMuda: [number, number, number] = [243, 232, 255];

      let y = 18;

      doc.setFillColor(warnaUtama[0], warnaUtama[1], warnaUtama[2]);
      doc.rect(0, 0, pageWidth, 26, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("KOMITMEN PENERAPAN MANAJEMEN RISIKO", pageWidth / 2, 16, {
        align: "center",
      });

      doc.setTextColor(0, 0, 0);
      y = 36;

      const drawLabelValue = (label: string, value: any) => {
        const x = 14;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${label} :`, x, y);

        const labelWidth = doc.getTextWidth(`${label} : `);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(String(value || "-"), x + labelWidth, y);

        y += 8;
      };


      const ambil = (...values: any[]) => {
        return (
          values.find(
            (v) => v !== undefined && v !== null && String(v).trim() !== ""
          ) || "-"
        );
      };

      drawLabelValue("Nama Pemilik Risiko", ambil(detail?.pemilik));

      drawLabelValue(
        "NIP Pemilik Risiko",
        ambil(
          detail?.nip_pemilik,
          detail?.nipPemilik,
          detail?.nip_pemilik_risiko,
          detail?.pemilik_nip
        )
      );

      drawLabelValue(
        "Jabatan Pemilik Risiko",
        ambil(
          detail?.jabatan_pemilik,
          detail?.jabatanPemilik,
          detail?.jabatan_pemilik_risiko,
          detail?.pemilik_jabatan
        )
      );

      drawLabelValue("Nama Pengelola Risiko", ambil(detail?.pengelola));

      drawLabelValue(
        "NIP Pengelola Risiko",
        ambil(
          detail?.nip_pengelola,
          detail?.nipPengelola,
          detail?.nip_pengelola_risiko,
          detail?.pengelola_nip
        )
      );

      drawLabelValue(
        "Jabatan Pengelola Risiko",
        ambil(
          detail?.jabatan_pengelola,
          detail?.jabatanPengelola,
          detail?.jabatan_pengelola_risiko,
          detail?.pengelola_jabatan
        )
      );

      drawLabelValue("Periode", ambil(detail?.periode));


      y += 6;

      doc.setFont("helvetica", "bold");
      doc.text("1. Pakta Manajemen Risiko", 14, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      const paktaLines = doc.splitTextToSize(detail?.pakta || "-", 180);

doc.text(paktaLines, 14, y);

y += paktaLines.length * 5 + 10;

      doc.setFont("helvetica", "bold");
      doc.text("2. Sasaran Strategis / Program UPR", 14, y);
      y += 3;

      const sasaranRows: any[] = [];

      if (sasaranList.length === 0) {
        sasaranRows.push(["", "Belum ada data sasaran", "", "", ""]);
      } else {
        sasaranList.forEach((s: any, i: number) => {
          sasaranRows.push([
            i + 1,
            `Sasaran Strategis\n${s.sasaranStrategis || "-"}`,
            s.indikatorStrategis || "-",
            "-",
            "-",
          ]);

          sasaranRows.push([
            "",
            `Sasaran Program\n${s.sasaranProgram || "-"}`,
            s.indikatorProgram || "-",
            "-",
            "-",
          ]);

          let adaKegiatan = false;

          safeArray(s.indikator).forEach((ind: any) => {
            safeArray(ind.sub).forEach((sub: any) => {
              safeArray(sub.kegiatan).forEach((keg: any) => {
                adaKegiatan = true;

                sasaranRows.push([
                  "",
                  `Sasaran Kegiatan\n${s.sasaranKegiatan || "-"}`,
                  ind.nama || s.indikatorKegiatan || "-",
                  `${keg.nama || "-"}\nRp ${Number(keg.anggaran || 0).toLocaleString("id-ID")}`,
                  safeArray(keg.tujuan).length
                    ? safeArray(keg.tujuan)
                      .map((t: any, idx: number) => `${idx + 1}. ${t}`)
                      .join("\n")
                    : "-",
                ]);
              });
            });
          });

          if (!adaKegiatan) {
            sasaranRows.push([
              "",
              `Sasaran Kegiatan\n${s.sasaranKegiatan || "-"}`,
              s.indikatorKegiatan || "-",
              "-",
              "-",
            ]);
          }
        });
      }

      autoTable(doc, {
        startY: y,
        head: [["No", "Sasaran Strategis", "Indikator Strategis", "Sasaran Program", "Indikator Program"]],
        body: sasaranRows,
        styles: {
          fontSize: 5,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 7;

      doc.setFont("helvetica", "bold");
      doc.text("3. Daftar Pemangku Kepentingan", 14, y);
      y += 3;

      const pemangku = [
        ...internal.map((x: any) => ({ ...x, jenis: "Internal" })),
        ...eksternal.map((x: any) => ({ ...x, jenis: "Eksternal" })),
      ];

      autoTable(doc, {
        startY: y,
        head: [["No", "Jenis", "Nama", "Keterangan"]],
        body:
          pemangku.length === 0
            ? [["", "Belum ada data pemangku kepentingan", "", ""]]
            : pemangku.map((p: any, i: number) => [
              i + 1,
              p.jenis || "-",
              p.nama || "-",
              p.ket || "-",
            ]),
        styles: {
          fontSize: 5,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 7;

      doc.setFont("helvetica", "bold");
      doc.text("4. Tujuan Pelaksanaan Manajemen Risiko", 14, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(detail?.tujuan || "-", 180), 14, y);
      y += 8;

      if (y > pageHeight - 65) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text("5. Loss Event Database (LED)", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        margin: {
          top: 20,
          bottom: 18,
          left: 14,
          right: 14,
        },
        head: [[
          "No",
          "Sumber",
          "Tanggal Catat",
          "Uraian",
          "Waktu",
          "Lokasi",
          "Sebab",
          "Kondisi",
          "Dampak",
          "Rincian",
          "Unit",
        ]],
        body:
          ledDataPDF.length === 0
            ? [["", "Belum ada data LED", "", "", "", "", "", "", "", "", ""]]
            : ledDataPDF.map((item: any, index: number) => [
              index + 1,
              item.sumber || "-",
              item.tanggalCatat || item.tanggal_catat || "-",
              item.uraian || "-",
              item.waktu || "-",
              item.lokasi || "-",
              item.sebab || "-",
              item.kondisi || "-",
              item.dampak || "-",
              item.rincian || "-",
              item.unit || "-",
            ]),
        styles: {
          fontSize: 4,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 7;

      if (y > 235) {
        doc.addPage();
        y = 12;
      }

      doc.setFont("helvetica", "bold");
      doc.text("6. Profil Risiko", 14, y);
      y += 3;

      const toArray = (value: any) => {
        if (Array.isArray(value)) return value;
        if (!value) return [];

        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }

        if (typeof value === "object") return [value];

        return [];
      };

      autoTable(doc, {
        startY: y,
        head: [
          [
            { content: "No", rowSpan: 2 },
            { content: "Kode Risiko", rowSpan: 2 },
            { content: "Tujuan", rowSpan: 2 },
            { content: "Pernyataan Risiko", rowSpan: 2 },
            { content: "Kategori", rowSpan: 2 },
            { content: "Penyebab", rowSpan: 2 },
            { content: "Dampak", rowSpan: 2 },
            { content: "Pengendalian", colSpan: 2 },
            { content: "Nilai Risiko", colSpan: 3 },
            { content: "Prioritas", rowSpan: 2 },
            { content: "Respon", rowSpan: 2 },
            { content: "RTP", colSpan: 2 },
            { content: "Alokasi", rowSpan: 2 },
            { content: "Nilai Target", colSpan: 3 },
            { content: "Penanggung Jawab", rowSpan: 2 },
            { content: "Target Waktu", rowSpan: 2 },
            { content: "Indikator", rowSpan: 2 },
          ],
          [
            "Uraian",
            "Status",
            "K",
            "D",
            "Nilai",
            "Jenis",
            "Uraian",
            "K",
            "D",
            "Nilai",
          ],
        ],
        body:
          profilRisiko.length === 0
            ? [[
              "",
              "Belum ada data profil risiko",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ]]
            : profilRisiko.map((r: any, i: number) => {
              const penyebabArr = toArray(
                r.penyebabList || r.penyebab || r.penyebab_risikos,
              );

              const rtpArr = toArray(r.rtp || r.rtps);

              const nilai = Number(r.skor || r.nilai || 0);
              const nilaiTarget = Number(r.rtp_n || r.nilai_target || 0);

              const penyebabText =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.penyebab || p.uraian || "-" : p,
                  )
                  .join(", ") || "-";

              const pengendalianText =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.pengendalian || "-" : "-",
                  )
                  .join(", ") ||
                r.pengendalian ||
                "-";

              const statusText =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.status || "-" : "-",
                  )
                  .join(", ") ||
                r.hasil ||
                "-";

              const rtpJenis =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object"
                      ? x.jenisRtp || x.jenis_rtp || x.jenis || "-"
                      : "-",
                  )
                  .join(", ") || "-";

              const rtpUraian =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object" ? x.uraian || "-" : "-",
                  )
                  .join(", ") || "-";

              const targetWaktu =
                rtpArr
                  .flatMap((x: any) => toArray(x.targetList || x.target || x.targets))
                  .map((t: any) => t.waktu || t.target_waktu || "-")
                  .join(", ") || "-";

              const indikator =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object" ? x.indikator || "-" : "-",
                  )
                  .join(", ") || "-";

              return [
                i + 1,
                r.kode || "-",
                r.tujuan || "-",
                r.pernyataan || r.pernyataan_risiko || "-",
                r.kategori || "-",
                penyebabText,
                `${r.dampak_kategori || r.dampakKategori || "-"}\n${r.dampak || "-"}`,
                pengendalianText,
                statusText,
                r.k || "-",
                r.d || "-",
                nilai || "-",
                r.prioritas || "-",
                r.respon || "-",
                rtpJenis,
                rtpUraian,
                r.sumber || r.alokasi || "-",
                r.rtp_k || "-",
                r.rtp_d || "-",
                nilaiTarget || "-",
                r.penanggung_jawab || r.penanggungJawab || "-",
                targetWaktu,
                indikator,
              ];
            }),
        styles: {
          fontSize: 3.2,
          cellPadding: 0.6,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          fontSize: 4,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          valign: "top",
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 7;

      if (y > 260) {
        doc.addPage();
        y = 12;
      }

      doc.setFont("helvetica", "bold");
      doc.text("7. Profil Risiko Korupsi", 14, y);
      y += 3;

      const risikoKorupsi = profilRisiko.filter((r: any) => {
        const kategori = String(
          r.kategori ||
          r.kategori_risiko ||
          r.kategoriRisiko ||
          ""
        ).toLowerCase();

        return kategori.includes("korupsi");
      });

      autoTable(doc, {
        startY: y,
        head: [
          [
            { content: "No", rowSpan: 2 },
            { content: "Kode Risiko", rowSpan: 2 },
            { content: "Sub Proses", rowSpan: 2 },
            { content: "Pihak Terlibat", colSpan: 2 },
            { content: "Pernyataan", rowSpan: 2 },
            { content: "Sub Kategori", rowSpan: 2 },
            { content: "Alat Bukti", rowSpan: 2 },
            { content: "Penyebab", colSpan: 2 },
            { content: "Pengendalian", rowSpan: 2 },
            { content: "Nilai Risiko", colSpan: 3 },
            { content: "RTP", colSpan: 2 },
            { content: "Nilai Target", colSpan: 3 },
            { content: "Indikator", rowSpan: 2 },
            { content: "Waktu", colSpan: 2 },
            { content: "Penanggung Jawab", rowSpan: 2 },
          ],
          [
            "Internal",
            "Eksternal",
            "Jenis",
            "Uraian",
            "K",
            "D",
            "Nilai",
            "Jenis",
            "Uraian",
            "K",
            "D",
            "Nilai",
            "Rencana",
            "Realisasi",
          ],
        ],
        body:
          risikoKorupsi.length === 0
            ? [[
              "",
              "Belum ada data",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ]]
            : risikoKorupsi.map((r: any, i: number) => {
              const pihakArr = toArray(r.pihakList || r.pihak || r.pihak_terlibat);
              const penyebabArr = toArray(
                r.penyebabList || r.penyebab || r.penyebab_risikos,
              );
              const rtpArr = toArray(r.rtp || r.rtps);

              const nilai = Number(r.skor || r.nilai || 0);
              const nilaiTarget = Number(r.rtp_n || r.nilai_target || 0);

              const internalText =
                pihakArr
                  .filter((p: any) =>
                    String(p.jenis || p.tipe || "").toLowerCase().includes("internal"),
                  )
                  .map((p: any) => p.nama || p.name || "-")
                  .join(", ") || "-";

              const eksternalText =
                pihakArr
                  .filter((p: any) =>
                    String(p.jenis || p.tipe || "").toLowerCase().includes("eksternal"),
                  )
                  .map((p: any) => p.nama || p.name || "-")
                  .join(", ") || "-";

              const penyebabJenis =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.jenis || p.jenis_penyebab || "-" : "-",
                  )
                  .join(", ") || "-";

              const penyebabUraian =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.penyebab || p.uraian || "-" : p,
                  )
                  .join(", ") || "-";

              const pengendalian =
                penyebabArr
                  .map((p: any) =>
                    typeof p === "object" ? p.pengendalian || "-" : "-",
                  )
                  .join(", ") ||
                r.pengendalian ||
                "-";

              const rtpJenis =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object"
                      ? x.jenisRtp || x.jenis_rtp || x.jenis || "-"
                      : "-",
                  )
                  .join(", ") || "-";

              const rtpUraian =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object" ? x.uraian || "-" : "-",
                  )
                  .join(", ") || "-";

              const indikator =
                rtpArr
                  .map((x: any) =>
                    typeof x === "object" ? x.indikator || "-" : "-",
                  )
                  .join(", ") || "-";

              const targetList = rtpArr.flatMap((x: any) =>
                toArray(x.targetList || x.target || x.targets),
              );

              const waktuRencana =
                targetList
                  .map((t: any) => t.waktu || t.target_waktu || "-")
                  .join(", ") || "-";

              const waktuRealisasi =
                targetList
                  .map((t: any) => t.realisasi || t.waktu_realisasi || "-")
                  .join(", ") || "-";

              return [
                i + 1,
                r.kode || r.kode_risiko || "-",
                r.sub_proses || r.subProses || "-",
                internalText,
                eksternalText,
                r.pernyataan || r.pernyataan_risiko || "-",
                r.sub_kategori || r.subKategori || "-",
                r.alat_bukti || r.alatBukti || "-",
                penyebabJenis,
                penyebabUraian,
                pengendalian,
                r.k || "-",
                r.d || "-",
                nilai || "-",
                rtpJenis,
                rtpUraian,
                r.rtp_k || "-",
                r.rtp_d || "-",
                nilaiTarget || "-",
                indikator,
                waktuRencana,
                waktuRealisasi,
                r.penanggung_jawab || r.penanggungJawab || "-",
              ];
            }),
        styles: {
          fontSize: 2.8,
          cellPadding: 0.5,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          fontSize: 3.5,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          valign: "top",
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 8;

      if (y > 235) {
        doc.addPage();
        y = 14;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("8. Jadwal Pelaksanaan Manajemen Risiko", 14, y);
      y += 3;

      autoTable(doc, {
        startY: y,
        head: [["No", "Tahap Manajemen Risiko", "Status"]],
        body: [
          ["1", "Komunikasi dan Konsultasi", detail?.jadwalMR?.komunikasi ? "Ya" : "-"],
          ["2", "Penetapan Konteks", detail?.jadwalMR?.konteks ? "Ya" : "-"],
          ["3", "Identifikasi Risiko", detail?.jadwalMR?.identifikasi ? "Ya" : "-"],
          ["4", "Analisis Risiko", detail?.jadwalMR?.analisis ? "Ya" : "-"],
          ["5", "Evaluasi Risiko", detail?.jadwalMR?.evaluasi ? "Ya" : "-"],
          ["6", "Respon Risiko", detail?.jadwalMR?.respon ? "Ya" : "-"],
          ["7", "RTP", detail?.jadwalMR?.rtp ? "Ya" : "-"],
          ["8", "Pemantauan", detail?.jadwalMR?.pemantauan ? "Ya" : "-"],
          ["9", "Laporan MR", detail?.jadwalMR?.laporan ? "Ya" : "-"],
        ],
        styles: {
          fontSize: 5,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: warnaUtama,
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 120 },
          2: { cellWidth: 30, halign: "center" },
        },
        theme: "grid",
      });

      y = (doc as any).lastAutoTable.finalY + 8;

      if (y > 250) {
  doc.addPage();
  y = 14;
}

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("9. Peta Risiko", 14, y);
      y += 15;

      const getRisikoDiSel = (d: number, k: number) => {
        return profilRisiko.filter((r: any) => {
          const nilaiD = Number(r.d || r.D || 0);
          const nilaiK = Number(r.k || r.K || 0);
          return nilaiD === d && nilaiK === k;
        });
      };

      const startX = 30;
      const startY = y;
      const cellW = 24;
const cellH = 16;
      const dampakList = [5, 4, 3, 2, 1];
      const kemungkinanList = [1, 2, 3, 4, 5];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text("Dampak", 14, startY + cellH * 2.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);

      dampakList.forEach((d, rowIndex) => {
        doc.text(`D${d}`, 23, startY + rowIndex * cellH + 7);
      });

      dampakList.forEach((d, rowIndex) => {
        kemungkinanList.forEach((k, colIndex) => {
          const items = getRisikoDiSel(d, k);

          const getRiskColor = (k: number, d: number): [number, number, number] => {

            // D5
            if (d === 5) {
              if (k === 1) return [250, 204, 21];
              if (k === 2) return [239, 68, 68];
              if (k === 3) return [239, 68, 68];
              if (k === 4) return [185, 28, 28];
              return [185, 28, 28];
            }

            // D4
            if (d === 4) {
              if (k === 1) return [146, 208, 80] // hijau muda #92D050
              if (k === 2) return [250, 204, 21];
              if (k === 3) return [239, 68, 68];
              if (k === 4) return [239, 68, 68];
              return [185, 28, 28];
            }

            // D3
            if (d === 3) {
              if (k === 1) return [22, 163, 74];
              if (k === 2) return [146, 208, 80] // hijau muda #92D050
              if (k === 3) return [250, 204, 21];
              if (k === 4) return [239, 68, 68];
              return [185, 28, 28];
            }

            // D2
            if (d === 2) {
              if (k === 1) return [22, 163, 74];
              if (k === 2) return [146, 208, 80] // hijau muda #92D050
              if (k === 3) return [250, 204, 21];
              if (k === 4) return [250, 204, 21];
              return [185, 28, 28];
            }

            // D1
            if (k === 1) return [22, 163, 74];
            if (k === 2) return [22, 163, 74];
            if (k === 3) return [146, 208, 80] // hijau muda #92D050
            if (k === 4) return [146, 208, 80] // hijau muda #92D050
            return [185, 28, 28];
          };
          const [r, g, b] = getRiskColor(k, d);

          const x = startX + colIndex * cellW;
          const yy = startY + rowIndex * cellH;

          doc.setFillColor(r, g, b);
          doc.setDrawColor(0, 0, 0);
          doc.rect(x, yy, cellW, cellH, "FD");



          if (items.length > 0) {

    let yyText = yy + 3;

    doc.setFontSize(4);
    doc.setTextColor(255,255,255);

    items.forEach((item:any,index:number)=>{

        doc.setFillColor(255,255,255);

       doc.setFillColor(255,255,255);

doc.circle(
  x + (6 * (index + 1)),
  yy + 10,
  2.5,
  "F"
);

doc.setTextColor(0,0,0);

doc.text(
  String(index + 1),
  x + (6 * (index + 1)),
  yy + 10.8,
  { align: "center" }
);

        doc.setTextColor(0,0,0);

        doc.setFont("helvetica","bold");

        

        doc.setFont("helvetica","normal");

        if (items.length > 0) {
  items.forEach((item:any,index:number)=>{

    doc.setFillColor(255,255,255);

    doc.circle(
      x + (6 * (index + 1)),
      yy + 10,
      2.5,
      "F"
    );

    doc.setTextColor(0,0,0);

    doc.text(
      String(index + 1),
      x + (6 * (index + 1)),
      yy + 10.8,
      { align: "center" }
    );

  });
}

        yyText += 10;
    });

}
        });
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);

      kemungkinanList.forEach((k, colIndex) => {
        doc.text(
          `K${k}`,
          startX + colIndex * cellW + cellW / 2,
          startY + cellH * 5 + 5,
          { align: "center" },
        );
      });

      doc.setFont("helvetica", "bold");
      doc.text(
        "Kemungkinan",
        startX + (cellW * 5) / 2,
        startY + cellH * 5 + 11,
        { align: "center" },
      );

      let legendY = startY + cellH * 5 + 18;
      let legendX = 30;

      const legends = [
        { label: "Rendah", color: [22, 163, 74] },
        { label: "Sedang", color: [146, 208, 80] },
        { label: "Tinggi", color: [250, 204, 21] },
        { label: "Sangat Tinggi", color: [239, 68, 68] },
        { label: "Ekstrem", color: [185, 28, 28] },
      ];

      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");

      legends.forEach((item: any) => {
        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.rect(legendX, legendY, 5, 4, "F");

        doc.setTextColor(0, 0, 0);
        doc.text(item.label, legendX + 7, legendY + 3.5);

        legendX += 32;
      });

      doc.setTextColor(0, 0, 0);

   // setelah legend
y = legendY + 10;

// cek ruang tanda tangan
if (y + 65 > pageHeight) {
  doc.addPage();
  y = 30;
}

doc.setFont("times", "normal");
doc.setFontSize(12);

doc.text("Jakarta, November 2025", 190, y, {
  align: "center",
});

doc.text("Pimpinan UPR", 190, y + 8, {
  align: "center",
});

doc.setFont("times", "bold");
doc.text("Lina Fitriani, S.T., MDM", 190, y + 40, {
  align: "center",
});

doc.setFont("times", "normal");
doc.text("NIP. 198106232005022001", 190, y + 47, {
  align: "center",
});

const namaFile = `Komitmen-MR-${detail?.periode || ""}-${detail?.unit || ""}`
  .replace(/[\\/:*?"<>|]/g, "-")
  .replace(/\s+/g, "-");

doc.save(`${namaFile}.pdf`);

    } catch (error) {
      console.error("Gagal download PDF:", error);
      alert("Gagal download PDF");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateVerifikatorStatus(id, "Approved");
      await fetchData();


      alert("Data berhasil di-approve");
    } catch (error) {
      console.error(error);
      alert("Gagal approve data");
    }


  };

  const handleReject = async (id: number) => {
    try {
      await updateVerifikatorStatus(id, "Rejected");
      await fetchData();


      alert("Data berhasil di-reject");
    } catch (error) {
      console.error(error);
      alert("Gagal reject data");
    }


  };

  return (<div className="flex min-h-screen bg-gray-100"> <Sidebar />


    <div className="flex-1">
      <Navbar />

      <div className="p-6">
        <h1 className="text-xl font-bold mb-4 text-gray-900">
          Dashboard Verifikator
        </h1>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-900">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Periode</th>
                  <th className="p-2">Unit</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center p-4 text-gray-400"
                    >
                      Belum ada data komitmen
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => {
                    const status = String(
                      item.status || "Pending"
                    ).toLowerCase();

                    const isApproved = status === "approved";
                    const isRejected = status === "rejected";

                    return (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 text-center">{i + 1}</td>
                        <td className="p-2">{item.periode}</td>
                        <td className="p-2">{item.unit}</td>

                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${isApproved
                              ? "bg-green-500"
                              : isRejected
                                ? "bg-red-500"
                                : "bg-yellow-500"
                              }`}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="p-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                router.push(`/verifikator/detail/${item.id}`)
                              }
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Detail
                            </button>

                            {!isApproved && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleReject(item.id)}
                                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => handleDownloadPDF(item.id)}
                                className="bg-green-700 text-white px-2 py-1 rounded text-xs"
                              >
                                Download PDF
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>


  );
}
