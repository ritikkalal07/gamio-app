import React from "react";

function Admin_DashBoard()
{
    return(
           <main className="main-content">
            <header className="main-header">
                <h1>Dashboard</h1>
                <div className="header-actions">
                    <span>Welcome, Admin!</span>
                </div>
            </header>

            <section className="stats-cards">
                <div className="card">
                    <div className="card__icon"><i className="fas fa-dollar-sign"></i></div>
                    <div className="card__info">
                        <p>Total Revenue</p>
                        <h3>₹1,25,500</h3>
                    </div>
                </div>
                <div className="card">
                    <div className="card__icon"><i className="fas fa-calendar-check"></i></div>
                    <div className="card__info">
                        <p>Total Bookings</p>
                        <h3>84</h3>
                    </div>
                </div>
                <div className="card">
                    <div className="card__icon"><i className="fas fa-map-marker-alt"></i></div>
                    <div className="card__info">
                        <p>Listed Venues</p>
                        <h3>12</h3>
                    </div>
                </div>
                <div className="card">
                    <div className="card__icon"><i className="fas fa-users"></i></div>
                    <div className="card__info">
                        <p>Registered Users</p>
                        <h3>210</h3>
                    </div>
                </div>
            </section>

            <section className="charts-section">
                <div className="chart-container">
                    <h3>Revenue Over Time</h3>
                    <canvas id="revenueChart"></canvas>
                </div>
                <div className="chart-container">
                    <h3>Bookings by Sport</h3>
                    <canvas id="bookingsChart"></canvas>
                </div>
            </section>
        </main>
        
    );
}
export default Admin_DashBoard;