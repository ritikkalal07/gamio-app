import React from "react";
import { Link } from "react-router-dom";

function SideBar()
{
    return(
           <aside className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__logo">Gamio.</h2>
                <span>Admin Panel</span>
            </div>
            <nav className="sidebar__nav">
                <ul>
                    <li><a href="Admin_DashBoard" className="active"><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="Admin_Venue"><i className="fas fa-map-marker-alt"></i> Venues</a></li>
                    <li><a href="Admin_Bookings"><i className="fas fa-calendar-check"></i> Bookings</a></li>
                    <li><a href="Admin_Users"><i className="fas fa-users"></i> Users</a></li>
                    <li><a href="#"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </nav>
            </aside>
    );
}
export default SideBar;