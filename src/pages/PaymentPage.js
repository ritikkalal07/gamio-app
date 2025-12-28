import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const paypalRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.bookingData;
  const [paid, setPaid] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Game Details (to get the real name if we only have an ID)
  useEffect(() => {
    const fetchGameName = async () => {
      if (!booking) return;

      // Determine if we have a name or just an ID
      const identifier = booking.venueName || booking.venueId;
      const isId = typeof identifier === 'string' && identifier.length > 20 && !identifier.includes(" ");

      if (isId) {
        try {
          // Fetch full game details using the ID
          const res = await axios.get(`http://localhost:5000/api/games/${identifier}`);
          setGameDetails(res.data.game || res.data);
        } catch (err) {
          console.error("Could not fetch game details", err);
        }
      } else if (typeof identifier === 'object') {
        setGameDetails(identifier);
      } else {
        // It's likely already a name string
        setGameDetails({ name: identifier });
      }
    };

    fetchGameName();
  }, [booking]);


  // 2. PayPal Integration
  useEffect(() => {
    if (!booking) return;
    
    // Cleanup previous buttons if any
    const paypalContainer = paypalRef.current;
    if (paypalContainer) paypalContainer.innerHTML = "";

    if (!window.paypal) {
      console.error("PayPal SDK not loaded");
      return;
    }

    const paypalButtons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color:  'gold',
        shape:  'rect',
        label:  'pay'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: `Booking for ${gameDetails?.name || "Game"}`,
              amount: {
                // Convert INR to USD (Approx rate: 1 USD = 84 INR)
                // PayPal Sandbox often requires USD
                value: (booking.price / 84).toFixed(2),
              },
            },
          ],
        });
      },

      onApprove: async (data, actions) => {
        setLoading(true);
        const details = await actions.order.capture();
        setPaid(true);

        try {
          await axios.post(
            "http://localhost:5000/api/payments/confirm",
            {
              bookingId: booking._id,
              transactionId: details.id,
              amount: booking.price,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          
          // Slight delay to show success animation before redirect
          setTimeout(() => {
             navigate("/payment-success", { state: { booking, details } });
          }, 1500);

        } catch (error) {
          console.error("Backend confirmation failed", error);
          alert("Payment processed on PayPal, but server confirmation failed. Please contact support.");
          setLoading(false);
        }
      },

      onError: (err) => {
        console.error("PayPal Error:", err);
        alert("Payment failed. Please try again.");
      },
    });

    if (paypalContainer) {
      paypalButtons.render(paypalContainer);
    }

    return () => {
      if (paypalButtons.close) paypalButtons.close();
      if (paypalContainer) paypalContainer.innerHTML = "";
    };
  }, [booking, navigate, gameDetails]);


  // --- RENDER ---

  if (!booking) {
    return (
      <div style={styles.pageBackground}>
        <div style={styles.errorCard}>
          <div style={styles.iconCircle}>⚠️</div>
          <h2 style={{color: '#333', marginBottom: '10px'}}>Booking Not Found</h2>
          <p style={{color: '#666'}}>We couldn't find the booking details. Please try booking again.</p>
          <button onClick={() => navigate("/")} style={styles.backButton}>Back to Home</button>
        </div>
      </div>
    );
  }

  const displayName = gameDetails?.name || "Game Session";
  const displayLocation = gameDetails?.place || "Venue Location";

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Checkout</h1>
          <p style={styles.breadcrumb}>Book Slot &gt; <span style={{color: '#333', fontWeight: '600'}}>Payment</span></p>
        </header>

        <div style={styles.grid}>
          
          {/* LEFT: ORDER SUMMARY */}
          <div style={styles.summaryCard}>
            <h3 style={styles.cardHeader}>Order Summary</h3>
            
            <div style={styles.gameInfo}>
               <div style={styles.gameIcon}>⚽</div>
               <div>
                 <h4 style={styles.gameName}>{displayName}</h4>
                 <p style={styles.gameLocation}>{displayLocation}</p>
               </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.detailRow}>
              <span style={styles.label}>Date</span>
              <span style={styles.value}>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.label}>Time</span>
              <span style={styles.value}>{booking.time}</span>
            </div>
            
            <div style={styles.divider}></div>

            <div style={styles.detailRow}>
              <span style={styles.label}>Subtotal</span>
              <span style={styles.value}>₹{booking.price}</span>
            </div>
             <div style={styles.detailRow}>
              <span style={styles.label}>Service Fee</span>
              <span style={styles.value}>₹0.00</span>
            </div>

            <div style={styles.totalContainer}>
              <span style={styles.totalLabel}>Total to Pay</span>
              <span style={styles.totalValue}>₹{booking.price}</span>
            </div>
          </div>

          {/* RIGHT: PAYMENT ACTION */}
          <div style={styles.paymentCard}>
            <h3 style={styles.cardHeader}>Payment Method</h3>
            
            {!paid ? (
                <>
                  <p style={styles.instructionText}>Select a payment method to complete your booking.</p>
                  
                  {/* PayPal Container */}
                  <div style={styles.paypalWrapper}>
                     <div ref={paypalRef}></div>
                  </div>

                  <div style={styles.secureBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>SSL Secure Payment</span>
                  </div>
                </>
            ) : (
                <div style={styles.successState}>
                   <div style={styles.successIcon}>✓</div>
                   <h3 style={{color: '#065f46'}}>Payment Successful!</h3>
                   <p>Finalizing your booking...</p>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- PROFESSIONAL STYLES ---
const styles = {
  pageBackground: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "5px",
  },
  breadcrumb: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap", // Makes it responsive
    gap: "30px",
    alignItems: "flex-start",
  },
  
  // -- SUMMARY CARD --
  summaryCard: {
    flex: "1 1 400px", // Grow, Shrink, Basis
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid #e5e7eb",
  },
  cardHeader: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px",
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "15px",
  },
  gameInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },
  gameIcon: {
    width: "50px",
    height: "50px",
    backgroundColor: "#e0f2fe",
    color: "#0284c7",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  gameName: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  gameLocation: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: 0,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "0.95rem",
  },
  label: {
    color: "#6b7280",
  },
  value: {
    color: "#374151",
    fontWeight: "500",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "20px 0",
  },
  totalContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    paddingTop: "15px",
    borderTop: "2px dashed #e5e7eb",
  },
  totalLabel: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#10b981", // Success Green
  },

  // -- PAYMENT CARD --
  paymentCard: {
    flex: "1 1 400px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
    border: "1px solid #e5e7eb",
  },
  instructionText: {
    color: "#4b5563",
    fontSize: "0.95rem",
    marginBottom: "20px",
  },
  paypalWrapper: {
    minHeight: "150px",
    marginBottom: "20px",
  },
  secureBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#9ca3af",
    fontSize: "0.85rem",
    marginTop: "20px",
  },
  
  // -- SUCCESS STATE --
  successState: {
    textAlign: "center",
    padding: "30px 0",
    animation: "fadeIn 0.5s ease",
  },
  successIcon: {
    width: "60px",
    height: "60px",
    backgroundColor: "#d1fae5",
    color: "#059669",
    borderRadius: "50%",
    fontSize: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
  },

  // -- ERROR / EMPTY STATE --
  errorCard: {
    maxWidth: "400px",
    margin: "60px auto",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  iconCircle: {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  backButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
};

export default PaymentPage;