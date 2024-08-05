import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Home, LandingPage, UserProfile, Explore } from "./pages";
import { useSelector } from "react-redux";
import { Navbar } from "./components/";
import { ShowSignInContextProvider } from "./components/context/ShowSignInContext";
import { IngredientsContextProvider } from "./components/context/IngredientsContext";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import { DislikedRecipesContextProvider } from "./components/context/DislikedRecipesContext";
import { AllergiesContextProvider } from "./components/context/AllergiesContext";
import { FoodPreferencesContextProvider } from "./components/context/FoodPreferencesContext";

const Root = () => {
  const user = useSelector((state) => state.user.value);
  // const location = useLocation();

  // const showNavbar = ["/explore", "/home", "/users/:userId"].includes(location.pathname);

  return (
    <BrowserRouter>
      <ShowSignInContextProvider>
        <ConditionalNavbar />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <ShowSignInContextProvider>
                <LandingPage />
              </ShowSignInContextProvider>
            }
          />
          <Route
            exact
            path="/terms-of-service"
            element={<TermsOfService />}
          ></Route>
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />}></Route>
        </Routes>
      </ShowSignInContextProvider>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ShowSignInContextProvider>
              <LandingPage />
            </ShowSignInContextProvider>
          }
        />
        <Route exact path="/users/:userId" element={<UserProfile />} />
        <Route
          exact
          path="/explore"
          element={
            <IngredientsContextProvider>
              <Explore />
            </IngredientsContextProvider>
          }
        />
        <Route
          exact
          path="/home"
          element={
            <FoodPreferencesContextProvider>
              <AllergiesContextProvider>
                <DislikedRecipesContextProvider>
                  <IngredientsContextProvider>
                    <Home />
                  </IngredientsContextProvider>
                </DislikedRecipesContextProvider>
              </AllergiesContextProvider>
            </FoodPreferencesContextProvider>
          }
        />
        <Route
          exact
          path="/terms-of-service"
          element={<TermsOfService />}
        ></Route>
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

const ConditionalNavbar = () => {
  const location = useLocation();
  // const showNavbar = ["/explore", "/home", "/users/:userId"].includes(location.pathname);
  const showNavbar = ["/explore", "/home"].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith("/users/");

  return showNavbar ? <Navbar /> : null;
};

export default Root;
