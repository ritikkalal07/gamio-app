import React from "react";
import gamioVideo from "../image/gamio.mp4";
import badminton from "../image/badminton.png";
import pool from "../image/pool.png";
import cricket from "../image/cricket.png";
import tennis from "../image/tennis.png";

function Home()
{
    return(
         <main>
        <section className="hero">
            <div className="hero__bg">
                <video autoPlay muted loop playsInline>
                <source src={gamioVideo} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>
            <div className="hero__content container">
                <h1 className="hero__title">Your Court, Your Game, <br/> Your Time.</h1>
                <p className="hero__description">
                    Discover and book top-tier sports venues near you. From box cricket to badminton, <br/> your next match is just a click away.
                </p>
                <a href="sports.html" className="btn btn--primary btn--glow">Book Now</a>
            </div>
        </section>

        <section className="section container" id="categories">
            <h2 className="section__title">Explore Sports</h2>
            <div className="category__grid">
                <div className="category__card">
                    <img src={cricket} alt="Box cricket game"/>
                    <div className="category__card-overlay">
                        <h3 className="category__card-title">Box Cricket</h3>
                        <a href="sports.html" className="btn btn--secondary">Explore</a>
                    </div>
                </div>
                <div className="category__card">
                    <img src={badminton} alt="Badminton court"/>
                    <div className="category__card-overlay">
                        <h3 className="category__card-title">Badminton</h3>
                        <a href="sports.html" className="btn btn--secondary">Explore</a>
                    </div>
                </div>
                <div className="category__card">
                    <img src={tennis} alt="Tennis player"/>
                    <div className="category__card-overlay">
                        <h3 className="category__card-title">Tennis</h3>
                        <a href="sports.html" className="btn btn--secondary">Explore</a>
                    </div>
                </div>
                <div className="category__card">
                    <img src={pool} alt="pool"/>
                    <div className="category__card-overlay">
                        <h3 className="category__card-title">Pool</h3>
                        <a href="sports.html" className="btn btn--secondary">Explore</a>
                    </div>
                </div>
            </div>
        </section>

        <section className="section" id="featured">
            <div className="container">
                <h2 className="section__title">Featured Venues</h2>
                <div className="featured__carousel">
                    <div className="featured__carousel-wrapper">
                        <div className="featured__slide">
                            <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue+1" alt="Modern sports arena"/>
                            <div className="featured__slide-content">
                                <h3>Urban Sports Hub</h3>
                                <p><i className="fas fa-map-marker-alt"></i> Ahmedabad, Gujarat</p>
                                <a href="venue.html" className="btn btn--outline">View Details</a>
                            </div>
                        </div>
                        <div className="featured__slide">
                            <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue+2" alt="Indoor badminton hall"/>
                            <div className="featured__slide-content">
                                <h3>The Shuttle Zone</h3>
                                <p><i className="fas fa-map-marker-alt"></i> Gandhinagar, Gujarat</p>
                                <a href="venue.html" className="btn btn--outline">View Details</a>
                            </div>
                        </div>
                        <div className="featured__slide">
                            <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue+3" alt="Cricket pitch at night"/>
                            <div className="featured__slide-content">
                                <h3>Night Cricket Arena</h3>
                                <p><i className="fas fa-map-marker-alt"></i> Surat, Gujarat</p>
                                <a href="venue.html" className="btn btn--outline">View Details</a>
                            </div>
                        </div>
                         <div className="featured__slide">
                            <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue+4" alt="Tennis court"/>
                            <div className="featured__slide-content">
                                <h3>Grand Slam Tennis</h3>
                                <p><i className="fas fa-map-marker-alt"></i> Vadodara, Gujarat</p>
                                <a href="venue.html" className="btn btn--outline">View Details</a>
                            </div>
                        </div>
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