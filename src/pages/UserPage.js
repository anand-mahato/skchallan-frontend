import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/UserPage.css";

function UserPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "user") {
      toast.error("Access Denied ❌");
      navigate("/");
      return;
    }
    const saved = localStorage.getItem("vehicle");
    if (saved) {
      setVehicle(saved);
      fetchChallan(saved);
    }
  }, [navigate]);

  const fetchChallan = async (veh) => {
    setLoading(true);
    try {
      const res = await fetch(`https://skchallan-backend.onrender.com/challan/${veh}`);
      const result = await res.json();
      setData(result);
    } catch {
      toast.error("Could not connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(`https://skchallan-backend.onrender.com/pay/${vehicle}`, { method: "PUT" });
      const result = await res.json();

      if (result.message && result.message.includes("successful")) {
        toast.success("Payment Successful ✅");
        // redirect to receipt page with challan data
        setTimeout(() => {
          navigate("/receipt", { state: { challan: result.challan } });
        }, 1000);
      } else {
        toast.error("Payment Failed ❌");
      }
    } catch {
      toast.error("Server Error ❌");
    }
  };

  return (
    <div className="user-page">
      <Navbar />

      <div className="user-wrap">
        <h1 className="user-title">My Challan</h1>
        <p className="user-vehicle">
          Vehicle: <strong>{localStorage.getItem("vehicle")}</strong>
        </p>

        <div className="card">
          <div className="stack">
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value.toUpperCase())}
              placeholder="Vehicle Number"
            />
            <button
              className="btn-primary btn-full"
              onClick={() => fetchChallan(vehicle)}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Challan"}
            </button>
          </div>

          {data && (
            <div className="user-result">
              {data.message ? (
                <p className="user-result-msg">{data.message}</p>
              ) : (
                <div className="user-result-inner">
                  <div className="stack user-rows">
                    <Row label="Vehicle" value={data.vehicle} />
                    <Row label="Reason" value={data.reason} />
                    <Row label="Status">
                      <span className={`tag ${data.status === "Paid" ? "tag-paid" : "tag-unpaid"}`}>
                        {data.status}
                      </span>
                    </Row>
                  </div>

                  <div className="user-amount-box">
                    {data.reducedAmount ? (
                      <>
                        <p className="user-amount-strike">₹{data.amount}</p>
                        <p className="user-amount-reduced">₹{data.reducedAmount}</p>
                        <p className="user-amount-note">Reduced fine</p>
                      </>
                    ) : (
                      <p className="user-amount">₹{data.amount}</p>
                    )}
                  </div>

                  <button
                    className={`btn-full ${data.status === "Paid" ? "btn-ghost" : "btn-success"}`}
                    onClick={handlePayment}
                    disabled={data.status === "Paid"}
                  >
                    {data.status === "Paid" ? "✅ Already Paid" : "Pay Now"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="user-row">
      <span className="user-row-label">{label}</span>
      {children || <span className="user-row-value">{value}</span>}
    </div>
  );
}

export default UserPage;