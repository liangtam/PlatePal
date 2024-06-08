import { useState } from "react";
import { SignIn } from "../../components";
import LandingPage from "../LandingPage/LandingPage";
import Navbar from "../../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar></Navbar>
      <div style={{ height: "150vh" }}></div>{" "}
      {/* Really tall blank div to force a scrollbar to test the dynamically scaling title */}
    </>
  );
};

export default Home;
