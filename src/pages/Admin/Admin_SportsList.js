import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin_SportsList() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  // Fetch all games from backend
  const fetchGames = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/games");
      setGames(res.data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Delete a game (frontend only, not DB)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this game from the website?")) {
      setGames((prev) => prev.filter((game) => game._id !== id));
      alert("Game removed from website (not deleted from database).");
    }
  };

  // Navigate to edit game page with data
  const handleEdit = (game) => {
    navigate("/add-game", { state: { game } });
  };

  return (
    <main>
      <section className="section container">
        <div className="page__header">
          <h1 className="page__title">Games List</h1>
          <p className="page__subtitle">
            View all added games. You can update or delete any game.
          </p>
        </div>

        <div className="listing__grid">
          {games.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>No games added yet.</p>
          ) : (
            games.map((game) => (
              <div className="venue__card" key={game._id}>
                {game.photo && <img src={game.photo} alt={game.name} />}
                <div className="venue__card-content">
                  <div className="venue__card-header">
                    <h3 className="venue__title">{game.name}</h3>
                    <span className="venue__price">₹{game.price}</span>
                  </div>
                  <p className="venue__location">
                    <i className="fas fa-map-marker-alt"></i> {game.place}
                  </p>
                  <div className="venue__tags">
                    <span>{game.players} Players</span>
                  </div>
                  <p style={{ marginBottom: "1rem" }}>{game.description}</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleEdit(game)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => handleDelete(game._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Admin_SportsList;
