import React, { useState } from "react";
import axios from "axios";

function BulkUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/games/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setErrors(res.data.errors || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
      setErrors(err.response?.data?.errors || []);
    }
  };

  return (
    <main>
      <section className="section container">
        <div
          className="page__header"
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            paddingTop: "1rem",
          }}
        >
          <h1
            className="page__title"
            style={{ fontSize: "2rem", color: "#333", marginBottom: "0.5rem" }}
          >
            📤 Bulk Upload Games
          </h1>
          <p
            className="page__subtitle"
            style={{ color: "#666", fontSize: "1rem" }}
          >
            Upload multiple games at once using a CSV or Excel file.
          </p>
        </div>

        <div
          className="upload__card"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Select CSV or Excel File
            </label>

            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "10px",
                border: "2px dashed #ccc",
                cursor: "pointer",
                marginBottom: "1.5rem",
                transition: "border-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.borderColor = "#4ECDC4")}
              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#4ECDC4",
                color: "#fff",
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#3bb0a8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4ECDC4")}
            >
              Upload File
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "1.5rem",
                fontWeight: "500",
                color: message.includes("success") ? "#28a745" : "#d9534f",
              }}
            >
              {message}
            </p>
          )}

          {errors.length > 0 && (
            <div
              style={{
                marginTop: "1.5rem",
                background: "#ffecec",
                borderLeft: "5px solid #e74c3c",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <h4 style={{ marginBottom: "0.5rem" }}>⚠️ Validation Errors:</h4>
              <ul style={{ marginLeft: "1.2rem" }}>
                {errors.map((err, i) => (
                  <li key={i} style={{ color: "#a94442" }}>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#f9f9f9",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #eee",
              textAlign: "left",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>📄 Sample File Format:</h4>
            <pre
              style={{
                backgroundColor: "#fff",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                overflowX: "auto",
              }}
            >
{`name,photo,description,place,price,players
Cricket,https://example.com/cricket.jpg,Outdoor sport,Delhi,500,22
Football,https://example.com/football.jpg,Outdoor sport,Mumbai,400,22`}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BulkUpload;
