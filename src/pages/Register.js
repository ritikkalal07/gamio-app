import React from "react";
import { Link } from "react-router-dom";

function Register()
{
    return(
 <main className="auth__page">
        <div className="auth__image-section"><img src="https://placehold.co/800x1000/FFD166/333333?text=Join" alt="Group playing sports"/></div>
        <div className="auth__container">
            <div className="auth__form">
                <a href="\" className="nav__logo" style={{display: 'block', textAlign: 'center', marginBottom: '2rem'}}>Gamio.</a>
                <h1 className="auth__title">Join Gamio Today!</h1>
                <p className="auth__subtitle">Create an account to start booking sports venues.</p>
                <form>
                    <div className="form__group"><label for="fullname">Full Name</label><input type="text" id="fullname" className="form__input" placeholder="John Doe" required/></div>
                    <div className="form__group"><label for="email">Email Address</label><input type="email" id="email" className="form__input" placeholder="you@example.com" required/></div>
                    <div className="form__group"><label for="password">Password</label><input type="password" id="password" className="form__input" placeholder="••••••••" required/></div>
                    <div className="form__group"><button type="submit" className="btn btn--primary" style={{width: '100%'}}>Create Account</button></div>
                </form>
                <p style={{textAlign: 'center'}}>Already have an account? <a href="/Login">Login</a></p>
            </div>
        </div>
    </main>
    );
}
export default Register;