import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkChallan = async () => {
    if (!vehicle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://skchallan-backend.onrender.com/challan/${vehicle}`);
      const result = await res.json();
      setData(result);
    } catch {
      setData({ message: "Could not connect to server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      {/* TOP NAV */}
<nav className="home-nav">
  <div className="home-brand">
    <img src="/logo.png" alt="Sikkim Govt" className="home-logo-img" />
    <div>
      <h2 className="home-logo">SKChallan</h2>
      <p className="home-logo-sub">Government of Sikkim</p>
    </div>
  </div>
  <div className="home-nav-btns">
    <button className="btn-success" onClick={() => navigate("/login?role=user")}>
      Login as User
    </button>
    <button className="btn-blue" onClick={() => navigate("/login?role=officer")}>
      Login as Officer
    </button>
  </div>
</nav>

      {/* HERO */}
      <div className="home-hero">
        <div className="home-overlay" />

        <div className="home-content">

          {/* HEADLINE */}
          <div className="home-headline">
            <h1 className="home-title">
              Traffic Challan<br />
              <span className="home-title-accent">Made Simple</span>
            </h1>
            <p className="home-subtitle">
              Check, pay, and manage your fines instantly.
            </p>
          </div>

          {/* CARD */}
          <div className="card home-card">
            <h3 className="home-card-title">Check Challan</h3>

            <div className="stack">
              <input
                type="text"
                placeholder="Enter Vehicle Number (e.g. SK01AB1234)"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && checkChallan()}
              />
              <button
                className="btn-primary btn-full"
                onClick={checkChallan}
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Challan"}
              </button>
            </div>

            {/* RESULT */}
            {data && (
              <div className="home-result">
                {data.message ? (
                  <p className="home-result-msg">{data.message}</p>
                ) : (
                  <div className="stack home-result-stack">
                    <Row label="Vehicle" value={data.vehicle} />
                    <Row label="Reason" value={data.reason} />
                    <Row label="Status">
                      <span className={`tag ${data.status === "Paid" ? "tag-paid" : "tag-unpaid"}`}>
                        {data.status}
                      </span>
                    </Row>

                    <div className="home-amount-box">
                      {data.reducedAmount ? (
                        <>
                          <p className="home-amount-strike">₹{data.amount}</p>
                          <p className="home-amount-reduced">₹{data.reducedAmount}</p>
                        </>
                      ) : (
                        <p className="home-amount">₹{data.amount}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="home-row">
      <span className="home-row-label">{label}</span>
      {children || <span className="home-row-value">{value}</span>}
    </div>
  );
}

export default Home;