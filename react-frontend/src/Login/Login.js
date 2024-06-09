import React, { useState } from 'react';
import { Button, Container, Box, TextField } from '@mui/material';
import { GoogleLoginButton } from 'react-social-login-buttons';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import './Login.css'; 
import { GOOGLE_AUTH_URL } from '../Constants/constants';
import { useNavigate } from 'react-router-dom'; 
import { login, signup } from '../APIUtils/APIUtils';
import { ACCESS_TOKEN } from '../Constants/constants';

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
    const navigate = useNavigate(); 
    
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
        try {
            const response = authState === 'signUp' ? await signup(formData) : await login(formData);
            alert(`${authState === 'signUp' ? 'Signup' : 'Signin'} successful!`);
            console.log('Access Token:', response.accessToken);
            sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
            navigate('/organization'); 
        } catch (error) {
            alert(`${authState === 'signUp' ? 'Signup' : 'Signin'} failed: ${error}`);
        }
    };

    return (
        <div>
            <Container maxWidth="sm" sx={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', marginTop: '250px' }}>
                <div className='login-form-container'>
                    <form onSubmit={handleSubmit}>
                        <h2 className='text-h2'>Welcome to CASA</h2>
                        <div className='button-div'>
                            <Button 
                                variant={authState === 'signIn' ? 'contained' : 'outlined'} 
                                onClick={() => { setAuthState('signIn'); setNextStep(false); }}
                                sx={{marginRight: '10px', }}
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
                        <div className='form-div'>
                            <TextField 
                                id="outlined-basic" 
                                label="Email Address" 
                                variant="outlined" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{marginTop: '30px'}}
                            />
                        </div>
                        {authState === 'signUp' && nextStep && (
                            <>
                                <div className='form-div'>
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
                                <div className='form-div'>
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
                            <div className='form-div'>
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
                        <div className='button-div'>
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
                                onClick={handleStateNextStep}
                                sx={{marginTop: '10px', marginBottom: '10px'}}
                            >
                                Next
                            </Button>
                        )}
                        </div>
                        {authState === 'signUp' && (
                            <div className='form-div'>
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
                        <div className='form-div'>
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
                            <GoogleLoginButton onClick={() => window.location.href = GOOGLE_AUTH_URL} style={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                                &nbsp;&nbsp;<span>Continue with Google</span>
                            </GoogleLoginButton>
                        </Box>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Login;