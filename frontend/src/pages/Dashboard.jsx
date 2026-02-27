import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import BiasBadge from "../components/BiasBadge";
import CommitmentForm from "../components/CommitmentForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    commitments: [],
    realityScore: 0,
    biasType: "REALISTIC",
    currentPhase: 1,
  });
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : false;
  });
  const [actionError, setActionError] = useState("");
  const [completionNotes, setCompletionNotes] = useState({});

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const load = async () => {
    try {
      const res = await api.get("/commitments");
      setData(res.data);
      const notes = {};
      (res.data.commitments || [])
        .filter((c) => c.status === "PENDING")
        .forEach((c) => {
          notes[c._id] = c.pendingReason || "";
        });
      setCompletionNotes(notes);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleUnauthorized();
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      load();
    }
  }, []);

  const complete = async (id) => {
    setActionError("");
    const actual = prompt("How many hours did you complete?");
    if (!actual) return;

    const note = completionNotes[id] || "";

    try {
      await api.patch(`/commitments/${id}/complete`, {
        actualEffort: Number(actual),
        inaccurateNote: note,
      });
      setCompletionNotes((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to complete commitment";
      setActionError(message);
    }
  };

  const removeCommitment = async (id) => {
    setActionError("");
    try {
      await api.delete(`/commitments/${id}`);
      load();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete commitment";
      setActionError(message);
    }
  };

  const saveReason = async (id) => {
    setActionError("");
    try {
      await api.patch(`/commitments/${id}/pending-reason`, {
        pendingReason: completionNotes[id] || "",
      });
      load();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save reason";
      setActionError(message);
    }
  };

  const startNewPhase = async () => {
    setActionError("");
    const ok = window.confirm("Start New Phase? This will archive current commitments and reset score to 100.");
    if (!ok) return;

    try {
      await api.post("/commitments/start-new-phase");
      load();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to start new phase";
      setActionError(message);
    }
  };

  const pendingCommitments = data.commitments.filter((c) => c.status === "PENDING");
  const completedCommitments = data.commitments.filter((c) => c.status === "COMPLETED");

  const pageClass = darkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-slate-100"
    : "min-h-screen bg-gray-100 text-gray-900";
  const cardClass = darkMode
    ? "bg-slate-800/80 border border-slate-700 shadow-xl"
    : "bg-white shadow-md";
  const itemClass = darkMode
    ? "border border-slate-700 bg-slate-900/50"
    : "border";

  return (
    <div className={pageClass}>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M15.8 8.2a4.8 4.8 0 1 0 0 7.6A6.8 6.8 0 1 1 15.8 8.2Z" fill="currentColor" />
              <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={`${cardClass} p-6 rounded-xl flex justify-between items-center`}>
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              Reality Score: <span className="font-bold">{data.realityScore}</span>
            </p>
            <p className={darkMode ? "text-slate-300 text-sm" : "text-gray-600 text-sm"}>
               {data.currentPhase}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BiasBadge biasType={data.biasType} />
            <button
              type="button"
              onClick={startNewPhase}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400"
            >
              Restart
            </button>
          </div>
        </div>

        <CommitmentForm key={data.currentPhase} onSuccess={load} onAuthError={handleUnauthorized} darkMode={darkMode} />
        {actionError && (
          <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {actionError}
          </div>
        )}

        <div className={`${cardClass} p-6 rounded-xl`}>
          <h3 className="text-lg font-semibold mb-4">Pending Commitments</h3>
          <div className="space-y-3">
            {pendingCommitments.map((c) => (
              <div
                key={c._id}
                className={`${itemClass} p-3 rounded-lg flex justify-between items-start`}
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className={darkMode ? "text-sm text-slate-400" : "text-sm text-gray-500"}>
                    Estimated: {c.estimatedEffort}h
                  </p>
                  <textarea
                    value={completionNotes[c._id] || ""}
                    onChange={(e) =>
                      setCompletionNotes((prev) => ({ ...prev, [c._id]: e.target.value }))
                    }
                    placeholder="Reason for pending"
                    className={
                      darkMode
                        ? "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-slate-100 placeholder:text-slate-400"
                        : "mt-2 w-full rounded-lg border p-2 text-sm"
                    }
                    rows={2}
                  />
                  <button
                    onClick={() => saveReason(c._id)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => complete(c._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => removeCommitment(c._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {pendingCommitments.length === 0 && (
              <p className={darkMode ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>
                No pending commitments.
              </p>
            )}
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl`}>
          <h3 className="text-lg font-semibold mb-4">Completed Commitments</h3>
          <div className="space-y-3">
            {completedCommitments.map((c) => (
              <div
                key={c._id}
                className={`${itemClass} p-3 rounded-lg flex justify-between items-start`}
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className={darkMode ? "text-sm text-slate-400" : "text-sm text-gray-500"}>
                    Estimated: {c.estimatedEffort}h, Actual: {c.actualEffort}h
                  </p>
                  {c.inaccurateNote && (
                    <p className={darkMode ? "text-sm text-amber-300 mt-1" : "text-sm text-amber-700 mt-1"}>
                      Note: {c.inaccurateNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {completedCommitments.length === 0 && (
              <p className={darkMode ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>
                No completed commitments.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
