import React, { useState, useEffect } from 'react';
import { DefaultButton, Link } from '@fluentui/react';

const Navbar = (props) => {
    /* gpt-4o 14:50 6/6
    Make this so the title of the app ("PlatePal") is visible above the buttons, center aligned.
     When the user scrolls down, the title should like shrink until no longer visible (based on how far down scrolled),
     but the buttons should always be visible
     */
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const titleOpacity = Math.max(0, 1 - scrollPosition / 100);
    const titleFontSize = Math.max(0, 2 - scrollPosition / 100) + 'rem';

    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#f3f2f1' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                opacity: titleOpacity,
                transition: 'opacity 0.3s, font-size 0.3s',
                fontSize: titleFontSize
            }}>
                <h1 style={{ margin: 0 }}>PlatePal</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <Link href="/" styles={{ root: { margin: '0 10px', fontSize: '20px', textDecoration: 'none' } }}>Home</Link>
                <DefaultButton text="Sign In" onClick={props.onSignIn} />
            </div>
        </div>
    );
};

export default Navbar;
