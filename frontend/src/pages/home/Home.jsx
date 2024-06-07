import { useState } from 'react';
import { SignIn } from "../../components";
import LandingPage from "../../components/LandingPage/LandingPage";

const Home = () => {
    const [showSignIn, setShowSignIn] = useState(true);

    return (
        <>
            <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>
            <LandingPage />
        </>
    );
}

export default Home;
