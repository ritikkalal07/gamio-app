import React, { useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("loggedIn"));
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Re-check login status on every route change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loggedIn"));
    setUsername(localStorage.getItem("username") || "");
  }, [location]);

  // Highlight active nav link (using class toggling, kept as per request)
  useEffect(() => {
    document.querySelectorAll(".nav__link").forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active-link", href === window.location.pathname);
    });
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowModal(true);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    setShowModal(false);
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  // --- Inline Styles for Actions, Dropdown, and Modal Buttons ---

  const navActionsStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', // Simulating space-x-4
  };

  const loggedInUserStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative', // Necessary for absolute dropdown positioning
    padding: '5px 0',
  };

  const dropdownContainerStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    width: '160px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const dropdownItemStyle = {
    display: 'block',
    padding: '8px 16px',
    color: '#333',
    textDecoration: 'none',
    textAlign: 'left',
    width: '100%',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  };

  // Helper for hover effect (inline CSS doesn't handle pseudo-classes well, so we use JS handlers)
  const dropdownItemHoverStyle = (e) => {
    e.currentTarget.style.backgroundColor = '#f0f0f0';
  };

  const dropdownItemLeaveStyle = (e) => {
    e.currentTarget.style.backgroundColor = 'white';
  };
  
  // Modal Button Styles
  const btnPrimaryStyle = {
    backgroundColor: '#4ECDC4', // Primary color example
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  };

  const btnSecondaryStyle = {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
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

          <div className="nav__actions" style={navActionsStyle}>
            {isLoggedIn ? (
              <>
                {/* Username element now acts as the dropdown toggle */}
                <div
                  className="nav__username"
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                  style={loggedInUserStyle}
                >
                  <FaUser style={{ marginRight: "4px" }} />
                  {username}

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div style={dropdownContainerStyle}>
                      <Link
                        to="/change-password"
                        className="dropdown__link"
                        style={dropdownItemStyle}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={dropdownItemHoverStyle}
                        onMouseLeave={dropdownItemLeaveStyle}
                      >
                        Change Password
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="dropdown__btn"
                        style={dropdownItemStyle}
                        onMouseEnter={dropdownItemHoverStyle}
                        onMouseLeave={dropdownItemLeaveStyle}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/register" className="btn btn--primary nav__btn" style={btnPrimaryStyle}>
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
        <div className="confirmation__modal show" style={modalOverlayStyle}>
          <div className="modal__content" style={modalContentStyle}>
            <div className="modal__icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h2>Are you sure you want to logout?</h2>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                onClick={confirmLogout}
                className="btn btn--primary"
                style={{ ...btnPrimaryStyle, marginRight: "1rem" }} // Yes button
              >
                Yes
              </button>
              <button onClick={cancelLogout} className="btn btn--secondary" style={btnSecondaryStyle}>
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