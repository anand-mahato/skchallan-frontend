import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import SectionCard from "../components/SectionCard";
import Footer from "../components/Footer";
import "../styles/OfficerPage.css";

function OfficerPage() {
  const navigate = useNavigate();

  const [addForm, setAddForm] = useState({ vehicle: "", reason: "", amount: "" });
  const [reduceForm, setReduceForm] = useState({ vehicle: "", reducedAmount: "" });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "officer") {
      toast.error("Access Denied ❌");
      navigate("/");
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("https://skchallan-backend.onrender.com/challans");
      const result = await res.json();
      setHistory(result);
    } catch {
      toast.error("Could not load history ❌");
    } finally {
      setLoadingHistory(false);
    }
  };

  const addChallan = async () => {
    const { vehicle, reason, amount } = addForm;
    if (!vehicle || !reason || !amount) { toast.error("Fill all fields ❌"); return; }
    try {
      await fetch("https://skchallan-backend.onrender.com/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle, reason, amount }),
      });
      toast.success("Challan Added ✅");
      setAddForm({ vehicle: "", reason: "", amount: "" });
      fetchHistory();
    } catch {
      toast.error("Server Error ❌");
    }
  };

  const reduceFine = async () => {
    const { vehicle, reducedAmount } = reduceForm;
    if (!vehicle || !reducedAmount) { toast.error("Fill all fields ❌"); return; }
    try {
      await fetch(`https://skchallan-backend.onrender.com/reduce/${vehicle}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reducedAmount }),
      });
      toast.success("Fine Reduced ✅");
      setReduceForm({ vehicle: "", reducedAmount: "" });
      fetchHistory();
    } catch {
      toast.error("Server Error ❌");
    }
  };

  return (
    <div className="officer-page">
      <Navbar />

      <div className="officer-wrap">
        <h1 className="officer-title">Officer Panel</h1>

        <div className="officer-sections">

          {/* ADD CHALLAN */}
          <SectionCard title="➕ Add Challan">
            <div className="stack">
              <input
                placeholder="Vehicle Number"
                value={addForm.vehicle}
                onChange={(e) => setAddForm({ ...addForm, vehicle: e.target.value.toUpperCase() })}
              />
              <input
                placeholder="Reason"
                value={addForm.reason}
                onChange={(e) => setAddForm({ ...addForm, reason: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
              />
              <button className="btn-success btn-full" onClick={addChallan}>
                Add Challan
              </button>
            </div>
          </SectionCard>

          {/* REDUCE FINE */}
          <SectionCard title="💰 Reduce Fine">
            <div className="stack">
              <input
                placeholder="Vehicle Number"
                value={reduceForm.vehicle}
                onChange={(e) => setReduceForm({ ...reduceForm, vehicle: e.target.value.toUpperCase() })}
              />
              <input
                type="number"
                placeholder="Reduced Amount (₹)"
                value={reduceForm.reducedAmount}
                onChange={(e) => setReduceForm({ ...reduceForm, reducedAmount: e.target.value })}
              />
              <button className="btn-blue btn-full" onClick={reduceFine}>
                Reduce Fine
              </button>
            </div>
          </SectionCard>

          {/* CHALLAN HISTORY */}
          <SectionCard title="📋 Challan History">
            {loadingHistory ? (
              <p className="officer-history-empty">Loading...</p>
            ) : history.length === 0 ? (
              <p className="officer-history-empty">No challans found.</p>
            ) : (
              <div className="officer-history-list">
                {history.map((c, i) => (
                  <div key={i} className="officer-history-item">
                    <div className="officer-history-top">
                      <span className="officer-history-vehicle">{c.vehicle}</span>
                      <span className={`tag ${c.status === "Paid" ? "tag-paid" : "tag-unpaid"}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="officer-history-reason">{c.reason}</p>
                    <div className="officer-history-bottom">
                      <span className="officer-history-amount">₹{c.reducedAmount || c.amount}</span>
                      {c.reducedAmount && (
                        <span className="officer-history-original">was ₹{c.amount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OfficerPage;