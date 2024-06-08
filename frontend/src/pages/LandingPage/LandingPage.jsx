import './LandingPage.css'
import {SignIn} from '../../components';
import { useState } from 'react';

const LandingPage = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <>
            <div className="landing-page">
                <div className="title">
                    <h1>PlatePal</h1> 
                    <h2>Your Personalized AI-Chef</h2>
                </div>
                <button className="btn" onClick={() => setShowSignIn(true)}>
                    <span>Get Started</span>
                </button>
                <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn} ></SignIn>
            </div>
        </>
    );
}

export default LandingPage;