import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin_Feedback() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const downloadCSV = () => {
    if (messages.length === 0) {
      alert("No messages to export!");
      return;
    }

    const headers = ["Name", "Email", "Message", "Date"];
    const rows = messages.map((msg) => [
      msg.name,
      msg.email,
      msg.message.replace(/[\r\n]+/g, " "), 
      new Date(msg.createdAt).toLocaleString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_messages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="main-content">
      <header className="main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Contact Messages</h1>
        <button className="btn btn-primary" onClick={downloadCSV}>
          Download CSV
        </button>
      </header>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No messages received yet.
        </p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Admin_Feedback;
