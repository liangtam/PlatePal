import styles from "./LandingPage.module.css";
import { SignIn } from "../../components";
import { useContext } from "react";
import { ShowSignInContext } from "../../components/context/ShowSignInContext";
import landingImg from "../../assets/455-landing-bg.png";
import blackLogo from "../../assets/455-platepal-logo-black.png";

const LandingPage = () => {
  const { showSignIn, setShowSignIn } = useContext(ShowSignInContext);
  console.log("Landing pg: ", showSignIn);

  return (
    <div className={styles.landingPage}>
      <div className={styles.intro}>
        <div className="flex-row align-items-center">
        <img className={styles.logo} src={blackLogo}/>
        <h1>PlatePal</h1>
        </div>

        <h2>Your Personalized AI-Chef</h2>
        <p className="font-size-5 padR-3 padY-4">
          Find and save recipe ideas for the ingredients you have at your home.
        </p>
        <button className={styles.btn} onClick={() => setShowSignIn(true)}>
          <span>Get Started</span>
        </button>
      </div>
      <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>
      <div className={styles.landingImg}>
        <img src={landingImg} alt="plate pal" />
      </div>
    </div>
  );
};

export default LandingPage;
