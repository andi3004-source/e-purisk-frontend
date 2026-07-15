const API = "http://127.0.0.1:8000/api";

// ================= HELPER =================
const safeJson = async (res: Response) => {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON ERROR:", text);
    return [];
  }
};

const safeArray = (json: any) => {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
};

// ================= LOGIN =================
export const login = async (data: any) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ================= USER =================
export const getUser = async (token: string) => {
  const res = await fetch(`${API}/user`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return safeJson(res);
};

// ================= RISIKO =================
export const getRisiko = async (token: string) => {
  const res = await fetch(`${API}/risiko`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await safeJson(res);

  return safeArray(json);
};

export const createRisiko = async (data: any, token: string) => {
  const res = await fetch(`${API}/risiko`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

export const updateRisiko = async (
  id: number,
  data: any,
  token: string
) => {
  const res = await fetch(`${API}/risiko/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

export const deleteRisiko = async (
  id: number,
  token: string
) => {
  const res = await fetch(`${API}/risiko/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return safeJson(res);
};

// ================= DASHBOARD =================
export const getDashboard = async (
  token: string,
  tahun?: string
) => {
  const res = await fetch(
    `${API}/pegawai-dashboard${tahun ? `?tahun=${tahun}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return safeJson(res);
};

export const getSuperDashboard = async (
  tahun = ""
) => {
  const res = await fetch(
    `${API}/super-dashboard${tahun ? `?tahun=${tahun}` : ""}`
  );

  return safeJson(res);
};

// ================= REALISASI =================
export const getRealisasiChart = async (
  token: string,
  tahun?: string
) => {
  const res = await fetch(
    `${API}/realisasi-chart${tahun ? `?tahun=${tahun}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return safeJson(res);
};

// ================= KEGIATAN =================
export const getKegiatan = async (token: string) => {
  const res = await fetch(`${API}/kegiatan`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await safeJson(res);

  return safeArray(json);
};

export const createKegiatan = async (
  data: any,
  token: string
) => {
  const res = await fetch(`${API}/kegiatan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ================= REALISASI CREATE =================
export const createRealisasi = async (
  data: any,
  token: string
) => {
  const res = await fetch(`${API}/realisasi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ================= LOSS =================
export const getLoss = async () => {
  const res = await fetch(`${API}/loss`, {
    headers: {
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);

  return safeArray(json);
};

export const createLoss = async (data: any) => {
  const res = await fetch(`${API}/loss`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ================= PEGAWAI =================
export const getPegawai = async (
  search = "",
  page = 1
) => {
  const res = await fetch(
    `${API}/pegawai?search=${search}&page=${page}`
  );

  return safeJson(res);
};

export const getPegawaiById = async (
  id: number
) => {
  const res = await fetch(`${API}/pegawai/${id}`);

  return safeJson(res);
};

export const createPegawai = async (
  data: any
) => {
  const res = await fetch(`${API}/pegawai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

export const updatePegawai = async (
  id: number,
  data: any
) => {
  const res = await fetch(`${API}/pegawai/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

export const deletePegawai = async (
  id: number
) => {
  const res = await fetch(`${API}/pegawai/${id}`, {
    method: "DELETE",
  });

  return safeJson(res);
};

export const getPegawaiDashboard = async (
  tahun = ""
) => {
  const res = await fetch(
    `${API}/pegawai-dashboard${tahun ? `?tahun=${tahun}` : ""}`
  );

  return safeJson(res);
};

// ================= PROFIL RISIKO =================
export const getProfilRisiko = async () => {

  const res = await fetch(
    `${API}/profil-risiko`
  );

  if (!res.ok) {
    throw new Error("Gagal fetch profil risiko");
  }

  const json = await safeJson(res);

  return safeArray(json);
};

export const createProfilRisiko = async (
  data: any
) => {

  const res = await fetch(
    `${API}/profil-risiko`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return safeJson(res);
};

// ================= DOKUMEN =================
export const getDokumen = async () => {
  const res = await fetch(`${API}/dokumen`, {
    headers: {
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);

  return safeArray(json);
};

export const uploadDokumen = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/dokumen`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await safeJson(res);
    console.error("UPLOAD DOKUMEN ERROR:", err);
    throw new Error("Gagal upload dokumen");
  }

  return safeJson(res);
};

export const deleteDokumen = async (id: number) => {
  const res = await fetch(`${API}/dokumen/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  return safeJson(res);
};

// ================= VERIFIKATOR =================
export const getVerifikatorData = async () => {
  const res = await fetch(`${API}/verifikator-data`, {
    headers: {
      Accept: "application/json",
    },
  });

  const json = await safeJson(res);
  return safeArray(json);
};

export const getVerifikatorDetail = async (id: string | number) => {
  const res = await fetch(`${API}/verifikator-data/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });

  return safeJson(res);
};

export const updateVerifikatorStatus = async (
  id: string | number,
  status: string
) => {
  const res = await fetch(`${API}/verifikator-data/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return safeJson(res);
};

export const kirimVerifikatorData = async (data: any) => {
  const res = await fetch(`${API}/verifikator-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};
