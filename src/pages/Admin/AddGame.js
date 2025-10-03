import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const gameToEdit = location.state?.game || null;

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
    place: "",
    price: "",
    players: "",
  });

  const [preview, setPreview] = useState("");

  // Pre-fill form if editing
  useEffect(() => {
    if (gameToEdit) {
      setFormData(gameToEdit);
      if (gameToEdit.photo) {
        setPreview(gameToEdit.photo); // show existing image
      }
    }
  }, [gameToEdit]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let base64data = formData.photo;

      // Only convert if new file selected
      if (formData.photo && typeof formData.photo !== "string") {
        base64data = await toBase64(formData.photo);
      }

      const res = await fetch(
        gameToEdit
          ? `http://localhost:5000/api/games/${gameToEdit._id}`
          : "http://localhost:5000/api/games",
        {
          method: gameToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, photo: base64data }),
        }
      );

      if (res.ok) {
        alert(gameToEdit ? "Game updated successfully!" : "Game added successfully!");
        navigate("/admin/gameslist");
      } else {
        const errorData = await res.json();
        alert("Failed to save game: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error saving game: " + err.message);
    }
  };

  return (
  <main>
  <section className="section container">
    <div className="page__header" style={{ textAlign: "center", marginBottom: "2rem" }}>
      <h1 className="page__title" style={{ fontSize: "2rem", color: "#333" }}>
        {gameToEdit ? "Update Game" : "Add a New Game"}
      </h1>
      <p className="page__subtitle" style={{ color: "#555", fontSize: "1rem" }}>
        {gameToEdit
          ? "Edit the details of your game."
          : "Fill out the form below to add a new sport to the system."}
      </p>
    </div>

    <div
      className="auth__form"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="form__group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ fontWeight: "600", marginBottom: "0.25rem", display: "block" }}>
            Game Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form__input"
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            required
          />
        </div>

        <div className="form__group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="photo" style={{ fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>
            Game Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="form__input"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "120px",
                marginTop: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </div>

        <div className="form__group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="description" style={{ fontWeight: "600", marginBottom: "0.25rem", display: "block" }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form__input"
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            required
          ></textarea>
        </div>

        <div className="form__group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label htmlFor="place" style={{ fontWeight: "600", marginBottom: "0.25rem", display: "block" }}>
              Place
            </label>
            <input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="form__input"
              style={{
                width: "100%",
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="price" style={{ fontWeight: "600", marginBottom: "0.25rem", display: "block" }}>
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form__input"
              style={{
                width: "100%",
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              required
            />
          </div>
        </div>

        <div className="form__group" style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="players" style={{ fontWeight: "600", marginBottom: "0.25rem", display: "block" }}>
            Number of Players
          </label>
          <input
            type="number"
            id="players"
            name="players"
            value={formData.players}
            onChange={handleChange}
            className="form__input"
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            backgroundColor: "#4ECDC4",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {gameToEdit ? "Update Game" : "Add Game"}
        </button>
      </form>

      <button
        className="btn btn--secondary"
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "0.75rem",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "1rem",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onClick={() => navigate("/admin/gameslist")}
      >
        Games List
      </button>
    </div>
  </section>
</main>

  );
}

export default AddGame;
