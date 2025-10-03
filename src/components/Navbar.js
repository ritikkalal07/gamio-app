import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("loggedIn"));
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();

  // Re-check login status on every route change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loggedIn"));
    setUsername(localStorage.getItem("username") || "");
  }, [location]);

  // Highlight active nav link
  useEffect(() => {
    document.querySelectorAll(".nav__link").forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active-link", href === window.location.pathname);
    });
  }, [location]);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token"); // Optional: if you're storing auth token
    setIsLoggedIn(false);
    setUsername("");
    setShowModal(false);
    window.location.href = "/"; // Redirect to home after logout
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="header">
        <nav className="nav container">
          <h1>
            <Link to="/">
              Gamio<span className="nav__logo">.</span>
            </Link>
          </h1>

          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li>
                <Link to="/" className="nav__link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sport" className="nav__link">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="nav__link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav__link">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="nav__close" id="nav-close">
              <i className="fas fa-times"></i>
            </div>
          </div>

          <div className="nav__actions">
            {isLoggedIn ? (
              <>
                <span className="nav__username">
                  <FaUser style={{ marginRight: "4px" }} />
                  {username}
                </span>
                <button className="btn btn--primary nav__btn" onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/register" className="btn btn--primary nav__btn">
                Sign Up
              </Link>
            )}

            <div className="nav__toggle" id="nav-toggle">
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="confirmation__modal show">
          <div className="modal__content">
            <div className="modal__icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h2>Are you sure you want to logout?</h2>
            <div style={{ marginTop: "1.5rem" }}>
              <button onClick={confirmLogout} className="btn btn--primary" style={{ marginRight: "1rem" }}>
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

export default Navbar;



// import React,{ useEffect } from "react";
// import { Link } from "react-router-dom";

// function Navbar(){
    
//     useEffect(() => {
//     document.querySelectorAll(".nav__link").forEach(link => {
//       link.classList.toggle("active-link", link.pathname === window.location.pathname);
//     });
//   }, []);

//     return(
//          <header className="header">
//         <nav className="nav container">
//             <h1><a href="\" >Gamio<span className="nav__logo">.</span></a></h1>
            
//             <div className="nav__menu" id="nav-menu">
//                 <ul className="nav__list">
//                     <li><a href="/" className="nav__link ">Home</a></li>
//                     <li><a href="/Sport" className="nav__link ">Sports</a></li>
//                     <li><a href="/Dashboard" className="nav__link">DashBoard</a></li>
//                     <li><a href="/Contact" className="nav__link">Contact</a></li>
//                 </ul>
//                 <div className="nav__close" id="nav-close"><i className="fas fa-times"></i></div>
//             </div>

//             <div className="nav__actions">
//                 <i className="fas fa-moon theme-toggle" id="theme-toggle"></i>
//                 <a href="\Register" className="btn btn--primary nav__btn">Sign Up</a>
//                 <div className="nav__toggle" id="nav-toggle"><i className="fas fa-bars"></i></div>
//             </div>
//         </nav>
//     </header>
//     )
// }
// export default Navbar;