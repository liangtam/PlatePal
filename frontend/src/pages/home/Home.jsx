import { useState } from 'react';
import { SignIn } from "../../components";
import LandingPage from "../../components/LandingPage/LandingPage";

const Home = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <>
            <LandingPage onSignInClick={() => setShowSignIn(true)}/>
            <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>
        </>
    );
}

export default Home;
