import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const details = location.state?.details;

  // If user comes without state, redirect
  if (!booking || !details) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>❌ Invalid Access</h2>
        <p>No payment details available.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            background: "#111827",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 Payment Successful!</h2>

        <p style={styles.text}>
          <strong>Order ID:</strong> {details.id} <br />
          
          {/* <strong>Game:</strong> {booking.venueId?.name || "N/A"} <br /> */}
          
          <strong>Date:</strong> {booking.date} <br />
          <strong>Time:</strong> {booking.time} <br />

          {/* FIX: show final amount paid */}
          <strong>Amount Paid:</strong> ₹{booking.price * (booking.people || 1)}
        </p>

        <button
          onClick={() => navigate("/")}
          style={styles.button}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "450px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  title: {
    color: "green",
    marginBottom: "1rem",
  },
  text: {
    lineHeight: "1.6",
    marginBottom: "1rem",
    color: "#374151",
  },
  button: {
    marginTop: "1rem",
    padding: "12px 20px",
    background: "#111827",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default PaymentSuccess;

// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function PaymentSuccess() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const booking = location.state?.booking;
//   const details = location.state?.details;

//   // If user comes without state, redirect
//   if (!booking || !details) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "2rem" }}>
//         <h2>❌ Invalid Access</h2>
//         <p>No payment details available.</p>
//         <button
//           onClick={() => navigate("/")}
//           style={{
//             marginTop: "1rem",
//             padding: "10px 20px",
//             background: "#111827",
//             color: "#fff",
//             borderRadius: "6px",
//             border: "none",
//             cursor: "pointer"
//           }}
//         >
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <main style={styles.main}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>🎉 Payment Successful!</h2>

//         <p style={styles.text}>
//           <strong>Order ID:</strong> {details.id} <br />
//           <strong>Game:</strong> {booking.gameId?.name}<br />
//           <strong>Date:</strong> {booking.date} <br />
//           <strong>Time:</strong> {booking.time} <br />
//           <strong>Amount Paid:</strong> ₹{booking.price}
//         </p>

//         <button
//           onClick={() => navigate("/")}
//           style={styles.button}
//         >
//           Back to Home
//         </button>
//       </div>
//     </main>
//   );
// }

// const styles = {
//   main: {
//     padding: "2rem",
//     display: "flex",
//     justifyContent: "center",
//   },
//   card: {
//     width: "450px",
//     background: "#fff",
//     padding: "2rem",
//     borderRadius: "12px",
//     boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//     textAlign: "center"
//   },
//   title: {
//     color: "green",
//     marginBottom: "1rem",
//   },
//   text: {
//     lineHeight: "1.6",
//     marginBottom: "1rem",
//     color: "#374151",
//   },
//   button: {
//     marginTop: "1rem",
//     padding: "12px 20px",
//     background: "#111827",
//     color: "#fff",
//     borderRadius: "6px",
//     border: "none",
//     cursor: "pointer",
//   },
// };

// export default PaymentSuccess;
