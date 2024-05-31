import React, { useState } from 'react';
import { Button } from '@mui/material';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        termsAccepted: false,
        keepLoggedIn: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert('You must accept the terms of service and privacy policy.');
            return;
        }
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert('Signup successful!');
        } else {
            alert('Signup failed!');
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Welcome to CASA</h2>
                    <div>
                        <Button variant="contained">Sign In</Button>
                        <button type="button">Sign Up</button>
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Next</button>
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
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="keepLoggedIn"
                                onChange={handleChange}
                            />
                            Keep me logged in for 30 days
                        </label>
                    </div>
                    <div>
                        <div></div>
                        <span>OR</span>
                        <div></div>
                    </div>
                    <button type="button">Continue with Google</button>
                </form>
            </div>
        </div>
    );
}

export default Login;