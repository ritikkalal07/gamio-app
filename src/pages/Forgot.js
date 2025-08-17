import React from "react";
import Login from "./Login";
function Forgot()
{
    return(
        <main className="auth__page">
        <div className="auth__container">
            <div className="auth__form">
                <a href="index.html" className="nav__logo" style={{display: 'block', textAlign: 'center', marginBottom: '2rem'}}>Gamio.</a>
                <h1 className="auth__title">Forgot Password?</h1>
                <p className="auth__subtitle">No worries, we'll send you reset instructions.</p>
                <form>
                    <div className="form__group"><label for="email">Email Address</label><input type="email" id="email" className="form__input" placeholder="you@example.com" required/></div>
                    <div className="form__group"><button type="submit" className="btn btn--primary" style={{width: '100%'}}>Reset Password</button></div>
                </form>
                <p style={{textAlign: 'center'}}><a href="Login">Back to Login</a></p>
            </div>
        </div>
        <div className="auth__image-section"><img src="https://placehold.co/800x1000/FF6B6B/FFFFFF?text=Reset" alt="Illustration"/></div>
    </main>
    );
}
export default Forgot;