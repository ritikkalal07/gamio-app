import React from "react";
import { Link } from "react-router-dom";

function Login()
{
    return(
        <main className="auth__page">
        <div className="auth__container">
            <div className="auth__form">
                <a href="index.html" className="nav__logo" style={{display: 'block', textAlign: 'center', marginBottom: '2rem'}}>Gamio.</a>
                <h1 className="auth__title">Welcome Back!</h1>
                <p className="auth__subtitle">Login to continue your journey with Gamio.</p>
                <form>
                    <div className="form__group"><label for="email">Email Address</label><input type="email" id="email" className="form__input" placeholder="you@example.com" required/></div>
                    <div className="form__group"><label for="password">Password</label><input type="password" id="password" className="form__input" placeholder="••••••••" required/></div>
                    <div className="form__group"><button type="submit" className="btn btn--primary" style={{width: '100%'}}>Login</button></div>
                </form>
                <p style={{textAlign: 'center'}}><a href="/Forgot">Forgot Password?</a> | <a href="/Register">Create an Account</a></p>
            </div>
        </div>
        <div className="auth__image-section"><img src="https://placehold.co/800x1000/4ECDC4/FFFFFF?text=Play" alt="Person playing sports"/></div>
    </main>
    );
}
export default Login;