import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Admin_AddSports() {
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
        navigate("/games-list");
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
        <div className="page__header">
          <h1 className="page__title">{gameToEdit ? "Update Game" : "Add a New Game"}</h1>
          <p className="page__subtitle">
            {gameToEdit
              ? "Edit the details of your game."
              : "Fill out the form below to add a new sport to the system."}
          </p>
        </div>

        <div className="auth__form" style={{ maxWidth: "600px" }}>
          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="name">Game Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="photo">Game Photo</label>
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
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </div>

            <div className="form__group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form__input"
                required
              ></textarea>
            </div>

            <div className="form__group">
              <label htmlFor="place">Place</label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="players">Number of Players</label>
              <input
                type="number"
                id="players"
                name="players"
                value={formData.players}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              style={{ width: "100%" }}
            >
              {gameToEdit ? "Update Game" : "Add Game"}
            </button>
          </form>

          <button
            className="btn btn--secondary"
            style={{ width: "100%", marginTop: "10px" }}
            onClick={() => navigate("/games-list")}
          >
            Games List
          </button>
        </div>
      </section>
    </main>
  );
}

export default Admin_AddSports;
