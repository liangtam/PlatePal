import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, UserProfile, LandingPage } from "./pages";
import { useSelector } from "react-redux";
import { Navbar } from "./components/";
import { ShowSignInContextProvider } from "./components/context/ShowSignInContext";

const Root = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <BrowserRouter>
      <ShowSignInContextProvider>
        <Navbar />
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
        <Route exact path="/users/:id" element={<UserProfile />} />
        <Route exact path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
