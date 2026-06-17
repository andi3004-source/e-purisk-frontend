import { login } from "../../lib/api";

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await login({ email, password });

    localStorage.setItem("token", res.token);

    router.push("/dashboard");
  } catch (err) {
    alert(err.message);
  }
};