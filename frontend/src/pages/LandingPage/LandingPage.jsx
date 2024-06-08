import './LandingPage.css'
import SignIn from '../../components/SignIn/SignIn';

const LandingPage = ({onSignInClick}) => {
    return (
        <>
            <div className="landing-page">
                <div className="title">
                    <h1>PlatePal</h1> 
                    <h2>Your Personalized AI-Chef</h2>
                </div>
                <button className="btn" onClick={onSignInClick}>
                    <span>Get Started</span>
                </button>
            </div>
        </>
    );
}

export default LandingPage;