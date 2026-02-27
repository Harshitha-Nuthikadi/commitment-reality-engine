import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : false;
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      // Backward compatibility: if backend returns only a message, log in immediately.
      const token = res?.data?.token
        ? res.data.token
        : (await api.post("/auth/login", {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }))?.data?.token;

      if (!token) {
        throw new Error("No token returned from server");
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={darkMode ? "min-h-screen flex items-center justify-center bg-slate-900 text-slate-100" : "min-h-screen flex items-center justify-center bg-gray-100"}>
      <form className={darkMode ? "bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg w-96 space-y-4" : "bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"} onSubmit={register}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Register</h2>
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
        {["name", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            className={darkMode ? "w-full border border-slate-600 bg-slate-900 text-slate-100 p-2 rounded-lg" : "w-full border p-2 rounded-lg"}
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            required
          />
        ))}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Register
        </button>
        <button type="button" onClick={() => navigate("/")} className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
          Back to login
        </button>
      </form>
    </div>
  );
};

export default Register;
