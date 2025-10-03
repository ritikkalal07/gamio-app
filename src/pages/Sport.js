import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function Sport() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    sport: "",
    price: 5000,
  });


  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.games)) setGames(data.games);
        else setGames([]);
      })
      .catch((err) => {
        console.error(err);
        setGames([]);
      });
  }, []);



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: name === "price" ? Number(value) : value });
  };

  const filteredGames = Array.isArray(games)
    ? games.filter((game) => {
        return (
          (!filters.location || game.place === filters.location) &&
          (!filters.sport || game.name === filters.sport) &&
          game.price <= filters.price
        );
      })
    : [];

  return (
    <main>
      <section className="section container">
        <div className="page__header">
          <h1 className="page__title">Find Your Arena</h1>
          <p className="page__subtitle">
            Filter by sport, location, and price to find the perfect spot for your next game.
          </p>
        </div>

        <div className="listing__layout">
          <aside className="listing__filters">
            <h3 className="filter__title">Filters</h3>

            <div className="form__group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                className="form__input"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Cities</option>
                {[...new Set(games.map((g) => g.place))].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="sport">Sport</label>
              <select
                id="sport"
                name="sport"
                className="form__input"
                value={filters.sport}
                onChange={handleFilterChange}
              >
                <option value="">All Sports</option>
                {[...new Set(games.map((g) => g.name))].map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="price">Price Range (₹)</label>
              <input
                type="range"
                id="price"
                name="price"
                min="0"
                max="5000"
                value={filters.price}
                onChange={handleFilterChange}
                className="price-slider"
              />
              <span id="price-value">₹{filters.price}</span>
            </div>
          </aside>

          <div className="listing__grid">
            {filteredGames.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>No games found.</p>
            ) : (
              filteredGames.map((game) => (
                <div className="venue__card" key={game._id}>
                  {game.photo && <img src={game.photo} alt={game.name} />}
                  <div className="venue__card-content">
                    <div className="venue__card-header">
                      <h3 className="venue__title">{game.name}</h3>
                      <span className="venue__price">₹{game.price}/hr</span>
                    </div>
                    <p className="venue__location">
                      <i className="fas fa-map-marker-alt"></i> {game.place}
                    </p>
                    <div className="venue__tags">
                      <span>{game.players} Players</span>
                    </div>
                    <p>{game.description}</p>
                    {/* <button className="btn btn--secondary">Book Now</button> */}
                     <Link to={`/venue/${game._id}`} className="btn btn--secondary">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Sport;

