import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : false;
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  return (
    <div className={darkMode ? "min-h-screen flex items-center justify-center bg-slate-900 text-slate-100" : "min-h-screen flex items-center justify-center bg-gray-100"}>
      <form className={darkMode ? "bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg w-96 space-y-4" : "bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"} onSubmit={login}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Login</h2>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setDarkMode((v) => !v)}
            className={
              darkMode
                ? "p-2 rounded-full bg-slate-700 text-amber-300 hover:bg-slate-600 transition"
                : "p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition"
            }
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M15.8 8.2a4.8 4.8 0 1 0 0 7.6A6.8 6.8 0 1 1 15.8 8.2Z" fill="currentColor" />
              <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <input
          type="email"
          className={darkMode ? "w-full border border-slate-600 bg-slate-900 text-slate-100 p-2 rounded-lg" : "w-full border p-2 rounded-lg"}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className={darkMode ? "w-full border border-slate-600 bg-slate-900 text-slate-100 p-2 rounded-lg" : "w-full border p-2 rounded-lg"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
        >
          Create account
        </button>
      </form>
    </div>
  );
};

export default Login;
