import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function SideBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("loggedIn"));
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loggedIn"));
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    setShowModal(false);
    window.location.href = "/login"; 
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__logo">Gamio.</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar__nav">
          <ul>
            <li>
              <Link to="/admin/dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/gameslist">
                <i className="fas fa-users"></i> Games List
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings">
                <i className="fas fa-calendar-check"></i> Bookings
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <i className="fas fa-users"></i> Users
              </Link>
            </li>
             <li>
              <Link to="/admin/adminfeedback">
                <i className="fas fa-users"></i> FeedBack
              </Link>
            </li>
          </ul>

          <div className="nav__actions" style={{ marginTop: "2rem" }}>
            {isLoggedIn ? (
              <>
                <span className="nav__username">
                  <FaUser style={{ marginRight: "4px" }} />
                  {username}
                </span>
                <button
                  className="btn btn--primary nav__btn"
                  onClick={handleLogoutClick}
                  style={{ marginTop: "0.5rem" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn--primary nav__btn">
                Login
              </Link>
            )}
          </div>
        </nav>
      </aside>

      {showModal && (
        <div className="confirmation__modal show">
          <div className="modal__content">
            <div className="modal__icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h2>Are you sure you want to logout?</h2>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                onClick={confirmLogout}
                className="btn btn--primary"
                style={{ marginRight: "1rem" }}
              >
                Yes
              </button>
              <button onClick={cancelLogout} className="btn btn--secondary">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideBar;



// import React from "react";
// import { Link } from "react-router-dom";

// function SideBar()
// {
//     return(
//            <aside className="sidebar">
//             <div className="sidebar__header">
//                 <h2 className="sidebar__logo">Gamio.</h2>
//                 <span>Admin Panel</span>
//             </div>
//             <nav className="sidebar__nav">
//                 <ul>
//                     <li><a href="Admin_DashBoard" className="active"><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
//                     <li><a href="Admin_Venue"><i className="fas fa-map-marker-alt"></i> Venues</a></li>
//                     <li><a href="Admin_Bookings"><i className="fas fa-calendar-check"></i> Bookings</a></li>
//                     <li><a href="Admin_Users"><i className="fas fa-users"></i> Users</a></li>
//                     <li><a href="#"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
//                 </ul>
//             </nav>
//             </aside>
//     );
// }
// export default SideBar;