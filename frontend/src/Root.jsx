import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home, LandingPage, UserProfile} from "./pages";
import {useSelector} from "react-redux";
import {Navbar} from "./components/";
import {ShowSignInContextProvider} from "./components/context/ShowSignInContext";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";

const Root = () => {
    const user = useSelector((state) => state.user.value);

    return (
        <BrowserRouter>
            <ShowSignInContextProvider>
                <Navbar/>
            </ShowSignInContextProvider>

            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <ShowSignInContextProvider>
                            <LandingPage/>
                        </ShowSignInContextProvider>
                    }
                />
                <Route exact path="/users/:id" element={<UserProfile/>}/>
                <Route exact path="/users/:id" element={<UserProfile/>}/>

                <Route exact path="/home" element={<Home/>}></Route>
                <Route exact path="/terms-of-service" element={<TermsOfService/>}></Route>
                <Route exact path="/privacy-policy" element={<PrivacyPolicy/>}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Root;
