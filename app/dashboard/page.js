import { getUser } from "../../lib/api";

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  getUser(token)
    .then(setUser)
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
}, []);