import {SignIn} from "../../components";
import {useState} from "react";
import Navbar from "../../components/Navbar";

const Home = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <>
            <Navbar onSignIn={() => setShowSignIn(true)}></Navbar>
            <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>
        </>
    );
}

export default Home;
