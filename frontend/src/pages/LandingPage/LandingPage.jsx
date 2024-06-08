import "./LandingPage.css";
import { SignIn } from "../../components";
import { useContext, useState } from "react";
import { ShowSignInContext } from "../../components/context/ShowSignInContext";

const LandingPage = () => {

  const {showSignIn, setShowSignIn} = useContext(ShowSignInContext);
  console.log("Landing pg: ", showSignIn)

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
        <SignIn
          onClose={() => setShowSignIn(false)}
          isOpen={showSignIn}
        ></SignIn>
        <div style={{ height: "150vh" }}></div>
        {/* Really tall blank div to force a scrollbar to test the dynamically scaling title */}
      </div>
    </>
  );
};

export default LandingPage;
