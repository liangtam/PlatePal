/* GPT-4o 07:42 5/28 Make the sign in screen and make it work with sign up and password reset
Modified it to use enums instead of string
 */

import {useEffect, useState} from 'react';
import {DefaultButton, Dialog, Checkbox} from '@fluentui/react';
import './SignIn.css';
import api from "../../api.js";

const Window = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    ResetPassword: 'RESET_PASSWORD',
};

const SignIn = (signInProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [window, setWindow] = useState(Window.Login);
    const [agreedToTos, setAgreedToTos] = useState(false);

    const handleLoginIdInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleTosInput = (e) => setAgreedToTos(e.target.checked);

    useEffect(() => setWindow(Window.Login), []); // Default window

    const handleSignIn = async () => {
        try {
            const response = await api.post('/login', {email, password});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setPassword(''); // Always clear password
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await api.post('/signup', {email, password});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setPassword('');
        }
    }

    const handlePasswordReset = async () => {
        try {
            const response = await api.post('/passwordReset', {email});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggleSignUp = () => {
        setEmail('');
        setPassword('');
        setWindow(Window.Signup);
    };

    const handleResetPassword = () => {
        setEmail('');
        setPassword('');
        setWindow(Window.ResetPassword);
    };

    return (
        <Dialog
            hidden={!signInProps.isOpen}
            onDismiss={signInProps.onClose}
            dialogContentProps={{
                showCloseButton: true
            }}
            modalProps={{
                isBlocking: false,
            }}
        >
            <div style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{textAlign: 'center', width: '300px'}}>
                        <h2 className={'dialog-header'}>{window === Window.Login ? 'Login' : Window.Signup ? 'Sign Up' : 'Reset Password'}</h2>
                        {window === Window.Login && (
                            <>
                                <h5 className={'dialog-label'}>Email</h5>
                                <input
                                    placeholder={'example'}
                                    id='loginId'
                                    onChange={handleLoginIdInput}
                                    value={email}
                                    className={'dialog-box'}
                                />
                                <h5 className={'dialog-label'}>Password</h5>
                                <input type='password' onChange={handlePasswordInput} className={'dialog-box'}/>
                                <h5
                                    style={{
                                        textDecoration: 'underline',
                                        marginBottom: '15px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={handleResetPassword}
                                >
                                    Forgot Password?
                                </h5>
                                <div style={{display: 'table', margin: '0 auto'}}>
                                    <DefaultButton
                                        onClick={handleSignIn}
                                        className={'dialog-button'}
                                    >
                                        Login
                                    </DefaultButton>
                                    <DefaultButton
                                        onClick={handleToggleSignUp}
                                        className={'dialog-button'}
                                    >
                                        Create new account
                                    </DefaultButton>
                                </div>
                            </>
                        )}
                        {window === Window.Signup && (
                            // SignUp form
                            <div>
                                <h5 style={{marginTop: '15px', marginBottom: '15px'}}>Email</h5>
                                <input
                                    placeholder={'example'}
                                    id='signUpId'
                                    onChange={handleLoginIdInput}
                                    value={email}
                                    className={'dialog-box'}
                                />
                                <h5 className={'dialog-label'}>Password</h5>
                                <input type='password' onChange={handlePasswordInput} className={'dialog-box'}/>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Checkbox
                                        name='agreeToTerms'
                                        checked={agreedToTos}
                                        onChange={handleTosInput}
                                        id='agreeToTerms'
                                    />
                                    <label htmlFor='agreeToTerms' style={{marginLeft: '8px'}}>
                                        I agree to the terms of service and privacy policy.
                                    </label>
                                </div>
                                <DefaultButton
                                    onClick={handleSignUp}
                                    className={'dialog-button'}
                                >
                                    Sign Up
                                </DefaultButton>
                            </div>
                        )}
                        {window === Window.ResetPassword && (
                            // ResetPassword form
                            <div>
                                <h5 style={{marginTop: '15px', marginBottom: '15px'}}>Email</h5>
                                <input
                                    placeholder={'example'}
                                    id='resetId'
                                    onChange={handleLoginIdInput}
                                    value={email}
                                    className={'dialog-box'}
                                />
                                <DefaultButton
                                    onClick={handlePasswordReset}
                                    className={'dialog-button'}
                                >
                                    Reset Password
                                </DefaultButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default SignIn;
