import React,{ useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar(){
    
    useEffect(() => {
    document.querySelectorAll(".nav__link").forEach(link => {
      link.classList.toggle("active-link", link.pathname === window.location.pathname);
    });
  }, []);

    return(
         <header className="header">
        <nav className="nav container">
            <h1><a href="\" >Gamio<span className="nav__logo">.</span></a></h1>
            
            <div className="nav__menu" id="nav-menu">
                <ul className="nav__list">
                    <li><a href="/" className="nav__link ">Home</a></li>
                    <li><a href="/Sport" className="nav__link ">Sports</a></li>
                    <li><a href="/Dashboard" className="nav__link">DashBoard</a></li>
                    <li><a href="/Contact" className="nav__link">Contact</a></li>
                </ul>
                <div className="nav__close" id="nav-close"><i className="fas fa-times"></i></div>
            </div>

            <div className="nav__actions">
                <i className="fas fa-moon theme-toggle" id="theme-toggle"></i>
                <a href="\Register" className="btn btn--primary nav__btn">Sign Up</a>
                <div className="nav__toggle" id="nav-toggle"><i className="fas fa-bars"></i></div>
            </div>
        </nav>
    </header>
    )
}
export default Navbar;