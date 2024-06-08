import React, { useState, useEffect, useContext } from "react";
import { DefaultButton, Link } from "@fluentui/react";
import styles from "./Navbar.module.css";
import { ShowSignInContext } from "../context/ShowSignInContext";
import SignIn from "../SignIn/SignIn";

const Navbar = () => {
  /* gpt-4o 14:50 6/6
    Make this so the title of the app ("PlatePal") is visible above the buttons, center aligned.
     When the user scrolls down, the title should like shrink until no longer visible (based on how far down scrolled),
     but the buttons should always be visible
     */
  const [scrollPosition, setScrollPosition] = useState(0);
  const { showSignIn, setShowSignIn } = useContext(ShowSignInContext);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleOpacity = Math.max(0, 1 - scrollPosition / 100);
  const titleFontSize = Math.max(0, 2 - scrollPosition / 100) + "rem";

  return (
    <div
      className={`${styles.navbar} flex-row align-items-center justify-space-between`}
    >
      <div
        style={{
          opacity: titleOpacity,
          transition: "opacity 0.3s, font-size 0.3s",
          fontSize: titleFontSize,
        }}
        className="flex-row pad-2 marL-6 w-100"
      >
        <p><b>PlatePal</b></p>
      </div>
      <div
        className="w-100 flex-row gap-6 align-items-center marR-6"
        style={{ justifyContent: "flex-end" }}
      >
        <Link href="/home" className="font-size-4 base-1000">
          Home
        </Link>
        <DefaultButton
          text="Sign In"
          className="radius-10 font-size-3"
          onClick={() => setShowSignIn(true)}
        />
      </div>
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}></SignIn>}
    </div>
  );
};

export default Navbar;
