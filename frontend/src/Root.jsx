import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, UserProfile, LandingPage } from "./pages";
import { useSelector } from "react-redux";
import { Navbar } from "./components";

const Root = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <BrowserRouter>
      {!user && <Navbar />}
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/users/:id" element={<UserProfile />} />
        <Route exact path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
