import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GamesList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all games from backend
  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/games");
      if (res.data.success && Array.isArray(res.data.games)) {
        setGames(res.data.games);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await axios.delete(`http://localhost:5000/api/games/${id}`);
        setGames((prev) => prev.filter((game) => game._id !== id));
        alert("Game deleted successfully!");
      } catch (err) {
        console.error("Error deleting game:", err);
        alert("Failed to delete game.");
      }
    }
  };

  const handleEdit = (game) => {
    navigate("/admin/addgame", { state: { game } });
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Manage Games</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/addgame")}
        >
          Add New Game
        </button>
      </header>

      <div className="table-container">
        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>Loading games...</p>
        ) : games.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>No games added yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Location</th>
                <th>Price</th>
                <th>Players</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>{game.name}</td>
                  <td>{game.place}</td>
                  <td>₹{game.price}</td>
                  <td>{game.players}</td>
                  <td>{game.description}</td>
                  <td className="action-btns">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(game)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(game._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default GamesList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function GamesList() {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch all games from backend
//   const fetchGames = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/games");
//       // Ensure we set the actual games array
//       if (res.data.success && Array.isArray(res.data.games)) {
//         setGames(res.data.games);
//       } else {
//         setGames([]);
//       }
//     } catch (err) {
//       console.error("Error fetching games:", err);
//       setGames([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   // Delete a game from backend and state
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this game?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/games/${id}`);
//         setGames((prev) => prev.filter((game) => game._id !== id));
//         alert("Game deleted successfully!");
//       } catch (err) {
//         console.error("Error deleting game:", err);
//         alert("Failed to delete game.");
//       }
//     }
//   };

//   const handleEdit = (game) => {
//     navigate("/admin/addgame", { state: { game } });
//   };

//   return (
//     <main>
//       <section className="section container">
//         <div className="page__header">
//           <h1 className="page__title">Games List</h1>
//           <p className="page__subtitle">
//             View all added games. You can update or delete any game.
//           </p>
//         </div>

//         <div className="listing__grid">
//           {loading ? (
//             <p style={{ textAlign: "center", opacity: 0.7 }}>Loading games...</p>
//           ) : games.length === 0 ? (
//             <p style={{ textAlign: "center", opacity: 0.7 }}>No games added yet.</p>
//           ) : (
//             games.map((game) => (
//               <div className="venue__card" key={game._id}>
//                 {game.photo && <img src={game.photo} alt={game.name} />}
//                 <div className="venue__card-content">
//                   <div className="venue__card-header">
//                     <h3 className="venue__title">{game.name}</h3>
//                     <span className="venue__price">₹{game.price}</span>
//                   </div>
//                   <p className="venue__location">
//                     <i className="fas fa-map-marker-alt"></i> {game.place}
//                   </p>
//                   <div className="venue__tags">
//                     <span>{game.players} Players</span>
//                   </div>
//                   <p style={{ marginBottom: "1rem" }}>{game.description}</p>
//                   <div style={{ display: "flex", gap: "0.5rem" }}>
//                     <button
//                       type="button"
//                       className="btn btn--secondary"
//                       onClick={() => handleEdit(game)}
//                     >
//                       Update
//                     </button>
//                     <button
//                       type="button"
//                       className="btn btn--danger"
//                       onClick={() => handleDelete(game._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }

// export default GamesList;
