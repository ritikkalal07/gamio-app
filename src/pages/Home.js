import React, { useEffect, useState } from "react";
import gamioVideo from "../image/gamio.mp4";
import badminton from "../image/badminton.png";
import pool from "../image/pool.png";
import cricket from "../image/cricket.png";
import tennis from "../image/tennis.png";
// import venue1 from "../image/venue1.png";
// import venue2 from "../image/venue2.png";
// import venue3 from "../image/venue3.png";
// import venue4 from "../image/venue4.png";

function Home() {
  const [games, setGames] = useState([]);

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


  return (
    <main>
      <section className="hero">
        <div className="hero__bg">
          <video autoPlay muted loop playsInline>
            <source src={gamioVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero__content container">
          <h1 className="hero__title">
            Your Court, Your Game, <br /> Your Time.
          </h1>
          <p className="hero__description">
            Discover and book top-tier sports venues near you. From box cricket
            to badminton, <br />
            your next match is just a click away.
          </p>
          <a href="/sport" className="btn btn--primary btn--glow">
            Book Now
          </a>
        </div>
      </section>

      <section className="section container" id="categories">
        <h2 className="section__title">Explore Sports</h2>
        <div
          className="category__grid"
          style={{ display: "flex", overflowX: "auto" }}
        >
          <div className="category__card">
            <img src={cricket} alt="Box cricket game" />
            <div className="category__card-overlay">
              <h3 className="category__card-title">Box Cricket</h3>
              <a href="/sport" className="btn btn--secondary">
                Explore
              </a>
            </div>
          </div>
          <div className="category__card">
            <img src={badminton} alt="Badminton court" />
            <div className="category__card-overlay">
              <h3 className="category__card-title">Badminton</h3>
              <a href="/sport" className="btn btn--secondary">
                Explore
              </a>
            </div>
          </div>
          <div className="category__card">
            <img src={tennis} alt="Tennis player" />
            <div className="category__card-overlay">
              <h3 className="category__card-title">Tennis</h3>
              <a href="/sport" className="btn btn--secondary">
                Explore
              </a>
            </div>
          </div>
          <div className="category__card">
            <img src={pool} alt="Pool" />
            <div className="category__card-overlay">
              <h3 className="category__card-title">Pool</h3>
              <a href="/sport" className="btn btn--secondary">
                Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="container">
          <h2 className="section__title">Featured Venues</h2>
          <div className="featured__carousel">
            <div className="featured__carousel-wrapper">
              {games.map((game) => (
                <div className="featured__slide" key={game._id}>
                  {game.photo && <img src={game.photo} alt={game.name} />}
                  <div className="featured__slide-content">
                    <h3>{game.name}</h3>
                    <p>
                      <i className="fas fa-map-marker-alt"></i> {game.place}
                    </p>
                    <a href="/sport" className="btn btn--outline">
                      View Details
                    </a>
                  </div>
                </div>
              ))}

            </div>
            <button className="carousel__btn carousel__btn--prev">&lt;</button>
            <button className="carousel__btn carousel__btn--next">&gt;</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
