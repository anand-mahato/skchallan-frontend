import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo.png" alt="Sikkim Govt" className="navbar-logo-img" />
        <h2 className="navbar-logo">SKChallan</h2>
      </div>
      <div className="navbar-btns">
        {role === "user" && (
          <button className="btn-ghost" onClick={() => navigate("/user")}>Dashboard</button>
        )}
        {role === "officer" && (
          <button className="btn-ghost" onClick={() => navigate("/officer")}>Panel</button>
        )}
        {role && (
          <button className="btn-danger" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;