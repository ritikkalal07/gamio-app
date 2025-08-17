import React from "react";

function Dashboard()
{
    return(
 <main>
        <section className="section container">
            <div className="page__header">
                <h1 className="page__title">My Dashboard</h1>
            </div>

            <div className="dashboard__layout">
                <div className="dashboard__tabs">
                    <button className="tab__link active" data-tab="upcoming-bookings">Upcoming Bookings</button>
                    <button className="tab__link" data-tab="booking-history">Booking History</button>
                    <button className="tab__link" data-tab="profile-settings">Profile Settings</button>
                </div>

                <div className="dashboard__content">
                    <div className="tab__content active" id="upcoming-bookings">
                        <h3>Your Upcoming Games</h3>
                        <div className="booking__item">
                            <div className="booking__details">
                                <h4>Urban Sports Hub - Box Cricket</h4>
                                <p><i className="fas fa-calendar-alt"></i> August 20, 2025</p>
                                <p><i className="fas fa-clock"></i> 05:00 PM - 06:00 PM</p>
                            </div>
                            <button className="btn btn--outline" style={{color:'var(--accent-coral)', borderColor:'var(--accent-coral)'}}>Cancel Booking</button>
                        </div>
                    </div>
                    <div className="tab__content" id="booking-history">
                        <h3>Your Past Games</h3>
                        <div className="booking__item">
                            <div className="booking__details">
                                <h4>The Shuttle Zone - Badminton</h4>
                                <p><i className="fas fa-calendar-alt"></i> July 15, 2025</p>
                                <p><i className="fas fa-check-circle"></i> Completed</p>
                            </div>
                            <button className="btn btn--secondary">Book Again</button>
                        </div>
                    </div>
                    <div className="tab__content" id="profile-settings">
                        <h3>Update Your Profile</h3>
                        <form>
                            <div className="form__group"><label for="dash-name">Full Name</label><input type="text" id="dash-name" className="form__input" value="John Doe"/></div>
                            <div className="form__group"><label for="dash-email">Email</label><input type="email" id="dash-email" className="form__input" value="you@example.com" disabled/></div>
                            <button className="btn btn--primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>
    );
}
export default Dashboard;