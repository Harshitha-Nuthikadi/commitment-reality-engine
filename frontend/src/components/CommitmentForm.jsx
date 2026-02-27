import { useEffect, useState } from "react";
import api from "../api/axios";

const todayISO = () => new Date().toISOString().split("T")[0];

const CommitmentForm = ({ onSuccess, onAuthError, darkMode = false }) => {
  const [title, setTitle] = useState("");
  const [estimatedEffort, setEstimatedEffort] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [error, setError] = useState("");
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const loadSuggestion = async () => {
      try {
        const res = await api.get("/commitments/suggestion");
        setMultiplier(res?.data?.multiplier ?? 1);
      } catch (err) {
        if (err?.response?.status === 401) {
          onAuthError?.();
        }
      }
    };

    loadSuggestion();
  }, [onAuthError]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/commitments", {
        title,
        estimatedEffort: Number(estimatedEffort),
        startDate,
        endDate,
      });
      setTitle("");
      setEstimatedEffort("");
      setStartDate(todayISO());
      setEndDate(todayISO());
      onSuccess();
    } catch (err) {
      if (err?.response?.status === 401) {
        onAuthError?.();
        return;
      }
      const message = err?.response?.data?.message || "Failed to create commitment";
      setError(message);
    }
  };

  const showWarning = estimatedEffort !== "" && multiplier !== 1;
  const warningMessage =
    multiplier > 1
      ? "You usually underestimate effort. Consider increasing estimate."
      : "You usually overestimate effort.";

  const formClass = darkMode
    ? "bg-slate-800/80 border border-slate-700 p-6 rounded-xl shadow-xl space-y-4"
    : "bg-white p-6 rounded-xl shadow-md space-y-4";
  const inputClass = darkMode
    ? "w-full border border-slate-600 bg-slate-900 text-slate-100 rounded-lg p-2 placeholder:text-slate-400"
    : "w-full border rounded-lg p-2";

  return (
    <form
      onSubmit={submit}
      className={formClass}
    >
      <h3 className="text-lg font-semibold">New Commitment</h3>
      <input
        className={inputClass}
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        className={inputClass}
        placeholder="Estimated Effort (hours)"
        value={estimatedEffort}
        onChange={(e) => setEstimatedEffort(e.target.value)}
        required
      />
      <div className="space-y-2">
        <label className={darkMode ? "text-sm text-slate-300" : "text-sm text-gray-600"}>
          Start Date
        </label>
        <input
          type="date"
          className={inputClass}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className={darkMode ? "text-sm text-slate-300" : "text-sm text-gray-600"}>
          End Date
        </label>
        <input
          type="date"
          className={inputClass}
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      {showWarning && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
          {warningMessage}
        </div>
      )}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Create
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default CommitmentForm;
