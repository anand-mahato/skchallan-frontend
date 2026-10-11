import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/ReceiptPage.css";

function ReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const challan = location.state?.challan;

  useEffect(() => {
    if (!challan) {
      navigate("/");
    }
  }, [challan, navigate]);

  if (!challan) return null;

  const now = new Date();
  const date = now.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit"
  });

  const amountPaid = challan.reducedAmount || challan.amount;

  return (
    <div className="receipt-page">
      <div className="receipt-card" id="receipt-print">

        {/* HEADER */}
        <div className="receipt-header">
          <img src="/logo.png" alt="Sikkim Govt" className="receipt-logo" />
          <div>
            <h2 className="receipt-gov">Government of Sikkim</h2>
            <p className="receipt-dept">Traffic Police Department</p>
          </div>
        </div>

        <div className="receipt-divider" />

        {/* TITLE */}
        <div className="receipt-title-row">
          <div className="receipt-paid-badge">✅ PAID</div>
          <h3 className="receipt-title">Payment Receipt</h3>
        </div>

        <div className="receipt-divider" />

        {/* DETAILS */}
        <div className="receipt-details">
          <Row label="Receipt No"     value={`SKC-${Date.now().toString().slice(-6)}`} />
          <Row label="Date"           value={date} />
          <Row label="Time"           value={time} />
          <Row label="Vehicle Number" value={challan.vehicle} />
          <Row label="Violation"      value={challan.reason} />
          <Row label="Mobile"         value={localStorage.getItem("mobile") || "N/A"} />
        </div>

        <div className="receipt-divider" />

        {/* AMOUNT */}
        <div className="receipt-amount-section">
          {challan.reducedAmount && (
            <div className="receipt-amount-row">
              <span className="receipt-amount-label">Original Fine</span>
              <span className="receipt-amount-strike">₹{challan.amount}</span>
            </div>
          )}
          <div className="receipt-amount-row">
            <span className="receipt-amount-label">Amount Paid</span>
            <span className="receipt-amount-paid">₹{amountPaid}</span>
          </div>
          {challan.reducedAmount && (
            <div className="receipt-amount-row">
              <span className="receipt-amount-label">You Saved</span>
              <span className="receipt-saved">₹{challan.amount - challan.reducedAmount}</span>
            </div>
          )}
        </div>

        <div className="receipt-divider" />

        {/* FOOTER */}
        <p className="receipt-footer-text">
          This is a computer generated receipt and does not require a signature.
        </p>
        <p className="receipt-footer-text">
          SKChallan · Government of Sikkim Traffic Management System
        </p>

      </div>

      {/* BUTTONS */}
      <div className="receipt-btns">
        <button className="btn-primary" onClick={() => window.print()}>
          🖨️ Print Receipt
        </button>
        <button className="btn-ghost" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>

    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="receipt-row">
      <span className="receipt-row-label">{label}</span>
      <span className="receipt-row-value">{value}</span>
    </div>
  );
}

export default ReceiptPage;