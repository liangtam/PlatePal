import {SignIn} from "../../components";
import {useState} from "react";
import Navbar from "../../components/Navbar";

const Home = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <>
            <Navbar onSignIn={() => setShowSignIn(true)}></Navbar>
            <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>
            <div style={{ height: '150vh' }}></div> {/* Really tall blank div to force a scrollbar to test the dynamically scaling title */}
        </>
    );
}

export default Home;
