import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const paypalRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.bookingData;
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!booking) return; 

    if (!window.paypal) {
      console.error("PayPal SDK not loaded");
      return;
    }

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: (booking.price / 85).toFixed(2),
                },
              },
            ],
          });
        },

        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          setPaid(true);  
          await axios.post(
          "http://localhost:5000/api/payments/confirm",
          {
            bookingId: booking._id,
            transactionId: details.id,
            amount: booking.price,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
          navigate("/payment-success", { state: { booking, details } });
        },

        onError: (err) => {
          console.error("PayPal Error:", err);
          alert("Payment failed. Please try again.");
        },
      })
      .render(paypalRef.current);
  }, [booking, navigate]);

  //  RENDER CONDITION COMES **AFTER HOOKS**
  if (!booking) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        ❌ No booking data found. Go back and book again.
      </h2>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h2 style={styles.title}>Complete Payment</h2>

        <p style={styles.text}>
          {/* <strong>Game:</strong> {booking.venueName} <br /> */}
          <strong>Game:</strong> {booking.venueName?.name}
          <strong>Date:</strong> {booking.date} <br />
          <strong>Time:</strong> {booking.time} <br />
          <strong>Amount:</strong> ₹{booking.price}
        </p>

        <div ref={paypalRef} style={{ marginTop: "20px" }}></div>

        {paid && (
          <h3 style={{ color: "green", marginTop: "20px" }}>
            ✔ Payment Successful!
          </h3>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { padding: "2rem", display: "flex", justifyContent: "center" },
  card: {
    width: "450px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },
  title: { marginBottom: "1rem", textAlign: "center", color: "#111827" },
  text: { color: "#374151", lineHeight: "1.6", marginBottom: "1rem" },
};

export default PaymentPage;
