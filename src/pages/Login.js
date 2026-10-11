import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [mobile, setMobile] = useState("");
  const [badge, setBadge] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r) setRole(r);
  }, [location]);

  const handleLogin = async () => {
    if (!role) { toast.error("Role not selected ❌"); return; }

    if (role === "officer") {
      if (!badge.trim()) { toast.error("Enter Badge Number ❌"); return; }
      setLoading(true);
      try {
        const res = await fetch("https://skchallan-backend.onrender.com/officer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ badge }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.message); return; }
        localStorage.setItem("role", "officer");
        localStorage.setItem("badge", badge);
        toast.success("Welcome Officer 👮");
        setTimeout(() => navigate("/officer"), 1000);
      } catch {
        toast.error("Server not reachable ❌");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (role === "user") {
      if (!vehicle || !mobile) { toast.error("Enter Vehicle & Mobile ❌"); return; }
      localStorage.setItem("role", "user");
      localStorage.setItem("vehicle", vehicle.toUpperCase());
      localStorage.setItem("mobile", mobile);
      toast.success("Welcome 👤");
      setTimeout(() => navigate("/user"), 1000);
    }
  };

  const roleLabel = role === "user" ? "👤 User" : role === "officer" ? "👮 Officer" : "...";

  return (
    <div className="login-page">
      <div className="login-card card">

        <button className="btn-ghost login-back" onClick={() => navigate("/")}>
          ← Back
        </button>

        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">
          Continuing as <span className={`login-role-label login-role-${role}`}>{roleLabel}</span>
        </p>

        <div className="stack">
          {role === "user" && (
            <>
              <input
                placeholder="Vehicle Number (e.g. WB02AB1234)"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value.toUpperCase())}
              />
              <input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
              />
            </>
          )}

          {role === "officer" && (
            <input
              placeholder="Badge Number"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
          )}

          <button
            className={`btn-full login-submit ${role === "user" ? "btn-success" : "btn-blue"}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Continue →"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;