import React from "react";

function Sport()
{
    return(
        <main>
        <section className="section container">
            <div className="page__header">
                <h1 className="page__title">Find Your Arena</h1>
                <p className="page__subtitle">Filter by sport, location, and price to find the perfect spot for your next game.</p>
            </div>
            <div className="listing__layout">
                <aside className="listing__filters">
                    <h3 className="filter__title">Filters</h3>
                    <div className="form__group">
                        <label for="location">Location</label>
                        <select id="location" className="form__input">
                            <option>Ahmedabad</option>
                            <option>Gandhinagar</option>
                            <option>Surat</option>
                            <option>Vadodara</option>
                        </select>
                    </div>
                    <div className="form__group">
                        <label for="sport-type">Sport</label>
                        <select id="sport-type" className="form__input">
                            <option>Box Cricket</option>
                            <option>Badminton</option>
                            <option>Tennis</option>
                            <option>Pool</option>
                        </select>
                    </div>
                    <div className="form__group">
                        <label for="price-range">Price Range (₹)</label>
                        <input type="range" id="price-range" min="500" max="5000" value="2500" className="price-slider"/>
                        <span id="price-value">₹2500</span>
                    </div>
                    <button className="btn btn--primary" style={{width: '100%'}}>Apply Filters</button>
                </aside>

                <div className="listing__grid">
                    <div className="venue__card">
                        <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue" alt="Sports venue"/>
                        <div className="venue__card-content">
                            <div className="venue__card-header">
                                <h3 className="venue__title">Urban Sports Hub</h3>
                                <span className="venue__price">₹1500/hr</span>
                            </div>
                            <p className="venue__location"><i className="fas fa-map-marker-alt"></i> Ahmedabad, Gujarat</p>
                            <div className="venue__tags"><span>Cricket</span><span>Badminton</span></div>
                            <a href="venue.html" className="btn btn--secondary">Book Now</a>
                        </div>
                    </div>
                    <div className="venue__card">
                        <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue" alt="Sports venue"/>
                        <div className="venue__card-content">
                            <div className="venue__card-header">
                                <h3 className="venue__title">The Shuttle Zone</h3>
                                <span className="venue__price">₹800/hr</span>
                            </div>
                            <p className="venue__location"><i className="fas fa-map-marker-alt"></i> Gandhinagar, Gujarat</p>
                            <div className="venue__tags"><span>Badminton</span></div>
                            <a href="venue.html" className="btn btn--secondary">Book Now</a>
                        </div>
                    </div>
                    <div className="venue__card">
                        <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue" alt="Sports venue"/>
                        <div className="venue__card-content">
                            <div className="venue__card-header">
                                <h3 className="venue__title">Night Cricket Arena</h3>
                                <span className="venue__price">₹2000/hr</span>
                            </div>
                            <p className="venue__location"><i className="fas fa-map-marker-alt"></i> Surat, Gujarat</p>
                            <div className="venue__tags"><span>Cricket</span></div>
                            <a href="venue.html" className="btn btn--secondary">Book Now</a>
                        </div>
                    </div>
                    <div className="venue__card">
                        <img src="https://placehold.co/600x400/2c2c2c/FFFFFF?text=Venue" alt="Sports venue"/>
                        <div className="venue__card-content">
                            <div className="venue__card-header">
                                <h3 className="venue__title">Grand Slam Tennis</h3>
                                <span className="venue__price">₹1200/hr</span>
                            </div>
                            <p className="venue__location"><i className="fas fa-map-marker-alt"></i> Vadodara, Gujarat</p>
                            <div className="venue__tags"><span>Tennis</span></div>
                            <a href="venue.html" className="btn btn--secondary">Book Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    );
}
export default Sport;