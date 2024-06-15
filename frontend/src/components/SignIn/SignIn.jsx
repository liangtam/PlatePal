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
    const [rememberMe, setRememberMe] = useState(false);

    const handleLoginIdInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleTosInput = (e) => setAgreedToTos(e.target.checked);

    useEffect(() => setWindow(Window.Login), []); // Default window

    const handleSignIn = async () => {
        try {
            const response = await api.post('/users/login', {email, password, rememberMe});
            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token);
                signInProps.onClose();
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || 'An error occurred.');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Network error or server is not reachable.');
            }
        } finally {
            setPassword(''); // Always clear password
        }
    };

    const handleSignUp = async () => {
        try {
            if (!agreedToTos) {
                alert('You must accept the terms and conditions.');
                return;
            }
            const response = await api.post('/users/signup', {email, password});
            console.log(response.data);

            if (response.status === 201) {
                localStorage.setItem('authToken', response.data.token);
                signInProps.onClose();
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || 'An error occurred.');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Network error or server is not reachable.');
            }
        } finally {
            setPassword('');
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await api.post('/users/passwordReset', {email});
            if (response.status === 200) {
                alert("If an account exists with that email, we've sent a password reset email.");
                signInProps.onClose();
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || 'An error occurred.');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Network error or server is not reachable.');
            }
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
                                <input type='password' onChange={handlePasswordInput} className={'dialog-box'}
                                       value={password}/>
                                <div className={'checkbox-container'}>
                                    <Checkbox
                                        name='rememberMe'
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        id='rememberMe'
                                    />
                                    <label htmlFor='rememberMe'>
                                        Remember me
                                    </label>
                                </div>
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
                                <input type='password' onChange={handlePasswordInput} className={'dialog-box'}
                                       value={password}/>
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
