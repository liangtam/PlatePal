import React, {useContext, useEffect, useRef, useState} from "react";
import {ContextualMenu, DefaultButton, Link} from "@fluentui/react";
import styles from "./Navbar.module.css";
import {ShowSignInContext} from "../context/ShowSignInContext";
import SignIn from "../SignIn/SignIn";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/users/userSlice";
import blackLogo from "../../assets/455-platepal-logo-black.png";
import exploreIcon from "../../assets/explore_flaticon.png";
import homeIcon from "../../assets/home_flaticon.png";
import avatar from "../../assets/455-user-avatar.png";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {showSignIn, setShowSignIn} = useContext(ShowSignInContext);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    const handleLogoutClick = (e) => {
        dispatch(logout());
        navigate("/");
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
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
        <div
            className={`${styles.navbar} flex-row align-items-center justify-space-between`}
        >
            <div
                className="flex-row gap-2 padL-5 align-items-center"
                onClick={
                    user && user.id ? () => navigate("/home") : () => navigate("/")
                }
                style={{cursor: "pointer"}}
            >
                <img className={styles.navbarLogo} src={blackLogo} alt="black-logo"/>
                <div
                    style={{
                        opacity: titleOpacity,
                        transition: "opacity 0.3s, font-size 0.3s",
                        fontSize: titleFontSize,
                        textAlign: "center",
                        width: "100%",
                    }}
                >
                    <p>
                        <b>PlatePal</b>
                    </p>
                </div>
            </div>

            <div
                className="w-100 flex-row gap-6 align-items-center padR-5"
                style={{justifyContent: "flex-end"}}
            >
                {user && user.id ? (
                    <div
                        className="w-100 flex-row gap-7 align-items-center padR-5"
                        style={{justifyContent: "flex-end"}}
                    >
                        <Link
                            href="/explore"
                            className="font-size-4 base-1000 flex-row gap-2 align-items-center"
                        >
                            <img
                                src={exploreIcon}
                                style={{width: "100%", height: "20px"}}
                            />
                            Explore
                        </Link>
                        <Link
                            href="/home"
                            className="font-size-4 base-1000 flex-row gap-2 align-items-center"
                        >
                            <img src={homeIcon} style={{width: "100%", height: "20px"}}/>
                            Home
                        </Link>
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button
                                className={styles.btn}
                                onClick={() => setDropdownVisible(true)}
                            >
                                <img src={avatar} style={{width: "100%", height: "25px"}}/>
                                {user.email}
                            </button>
                            {dropdownVisible && (
                                <ContextualMenu
                                    items={[
                                        {
                                            key: "userprofile",
                                            text: "Profile",
                                            onClick: () => navigate(`/users/${user.id}`),
                                        },
                                        {
                                            key: "logout",
                                            text: "Logout",
                                            onClick: handleLogoutClick,
                                        },
                                    ]}
                                    target={dropdownRef.current}
                                    onDismiss={() => setDropdownVisible(false)}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <DefaultButton
                            text="Sign In"
                            className="radius-10 font-size-3 bg-blue-500"
                            onClick={() => setShowSignIn(true)}
                        />
                    </div>
                )}
            </div>
            {showSignIn && (
                <SignIn onClose={() => setShowSignIn(false)} isOpen={showSignIn}/>
            )}
        </div>
    );
};

export default Navbar;
