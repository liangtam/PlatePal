import React from 'react';
import { DefaultButton, Link } from '@fluentui/react';

const Navbar = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f3f2f1' }}>
            <Link href="/" styles={{ root: { margin: '0 10px', fontSize: '20px', textDecoration: 'none' } }}>Home</Link>
            <DefaultButton text="Sign In" onClick={props.onSignIn} />
        </div>
    );
};

export default Navbar;
