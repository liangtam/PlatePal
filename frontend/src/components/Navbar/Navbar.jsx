import React, {useContext, useEffect, useRef, useState} from "react";
import {DefaultButton, Link} from "@fluentui/react";
import styles from "./Navbar.module.css";
import {ShowSignInContext} from "../context/ShowSignInContext";
import SignIn from "../SignIn/SignIn";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/slices/userSlice";

const Navbar = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {showSignIn, setShowSignIn} = useContext(ShowSignInContext);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setDropdownVisible(false);
    }, [user]);

    const titleOpacity = Math.max(0, 1 - scrollPosition / 100);
    const titleFontSize = Math.max(1, 2 - scrollPosition / 100) + "rem";

    return (
        <div className={`${styles.navbar} flex-row align-items-center justify-space-between`}>
            <div
                style={{
                    opacity: titleOpacity,
                    transition: "opacity 0.3s, font-size 0.3s",
                    fontSize: titleFontSize,
                    textAlign: "center",
                    width: "100%"
                }}
            >
                <p><b>PlatePal</b></p>
            </div>
            <div
                className="w-100 flex-row gap-6 align-items-center"
                style={{justifyContent: "flex-end", paddingRight: "1rem"}}
            >
                <Link href="/home" className="font-size-4 base-1000">
                    Home
                </Link>
                {user ? (
                    <div className="dropdown-container" style={{ position: "relative" }}>
                        <span onClick={() => setDropdownVisible(true)} style={{ cursor: "pointer" }}>
                            {user}
                        </span>
                        {dropdownVisible && (
                            <div
                                className={'dropdown show'}
                                ref={dropdownRef}
                            >
                                <Link
                                    onClick={handleLogout}
                                    className={'link'}
                                >Logout</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <DefaultButton
                        text="Sign In"
                        className="radius-10 font-size-3 blue-500"
                        onClick={() => setShowSignIn(true)}
                    />
                )}
            </div>
            {showSignIn && <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}/>}
        </div>
    );
};

export default Navbar;
