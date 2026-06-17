const API = "http://127.0.0.1:8000/api";

export const login = async (data) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login gagal");
  }

  return result;
};

export const getUser = async (token) => {
  const res = await fetch(`${API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal ambil user");
  }

  return result;
};