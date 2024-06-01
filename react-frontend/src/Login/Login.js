import React, { useState } from 'react';
import { Button, Container, Box, TextField } from '@mui/material';
import { GoogleLoginButton } from 'react-social-login-buttons';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import './Login.css'; 
import { GOOGLE_AUTH_URL } from '../Constants/constants';
import { login, signup } from '../../util/APIUtils';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        termsAccepted: false,
        keepLoggedIn: false,
        firstName: '',
        lastName: '',
        password: ''
    });
    
    const [authState, setAuthState] = useState('signIn');
    const [nextStep, setNextStep] = useState(false);

    const handleStateNextStep = (e) => {
        e.preventDefault();
        setNextStep(true);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authState === 'signUp' && !formData.termsAccepted) {
            alert('You must accept the terms of service and privacy policy.');
            return;
        }
        const url = authState === 'signUp' ? 'http://localhost:8080/auth/signup' : 'http://localhost:8080/auth/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert(`${authState === 'signUp' ? 'Signup' : 'Signin'} successful!`);
        } else {
            alert(`${authState === 'signUp' ? 'Signup' : 'Signin'} failed!`);
        }
    };

    return (
        <div>
            <Container maxWidth="sm" sx={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', marginTop: '250px' }}>
                <div>
                    <form onSubmit={handleSubmit}>
                        <h2>Welcome to CASA</h2>
                        <div>
                            <Button 
                                variant={authState === 'signIn' ? 'contained' : 'outlined'} 
                                onClick={() => { setAuthState('signIn'); setNextStep(false); }}
                                sx={{marginRight: '10px'}}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant={authState === 'signUp' ? 'contained' : 'outlined'} 
                                onClick={() => { setAuthState('signUp'); setNextStep(false); }}
                            >
                                Sign Up
                            </Button>
                        </div>
                        <div>
                            <TextField 
                                id="outlined-basic" 
                                label="Email Address" 
                                variant="outlined" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{marginTop: '10px'}}
                            />
                        </div>
                        {authState === 'signUp' && nextStep && (
                            <>
                                <div>
                                    <TextField 
                                        id="firstName" 
                                        label="First Name" 
                                        variant="outlined" 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        sx={{marginTop: '10px'}}
                                    />
                                </div>
                                <div>
                                    <TextField 
                                        id="lastName" 
                                        label="Last Name" 
                                        variant="outlined" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        sx={{marginTop: '10px'}}
                                    />
                                </div>
                            </>
                        )}
                        {nextStep && (
                            <div>
                                <TextField 
                                    id="password" 
                                    label="Password" 
                                    type="password" 
                                    variant="outlined" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{marginTop: '10px'}}
                                />
                            </div>
                        )}
                        {nextStep ? (
                            <Button 
                                type="submit"
                                variant="contained" 
                                sx={{marginTop: '10px', marginBottom: '10px'}}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button 
                                variant="contained" 
                                endIcon={<NavigateNextIcon />} 
                                sx={{marginTop: '10px', marginBottom: '10px'}}
                                onClick={handleStateNextStep}
                            >
                                Next
                            </Button>
                        )}
                        {authState === 'signUp' && (
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        onChange={handleChange}
                                    />
                                    I have read and accept the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                </label>
                            </div>
                        )}
                        <div>
                            <label style={{display: 'left-align', alignItems: 'center'}}>
                                <input
                                    type="checkbox"
                                    name="keepLoggedIn"
                                    onChange={handleChange}
                                />
                                Keep me logged in for 30 days
                            </label>
                        </div>
                        <div className="hr-with-text">Or</div>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLoginButton onClick={() => window.location.href = GOOGLE_AUTH_URL}>
                                <span>Continue with Google</span>
                            </GoogleLoginButton>
                        </Box>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Login;