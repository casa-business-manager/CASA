import React, { useState } from "react";
import { Button, Container, Box, TextField, Typography } from "@mui/material";
import { GoogleLoginButton } from "react-social-login-buttons";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Login.css";
import { GOOGLE_AUTH_URL } from "../Constants/constants";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../APIUtils/APIUtils";
import { ACCESS_TOKEN } from "../Constants/constants";
import loginImage from "../Assets/loginScreen.jpg";

function Login() {
	const [formData, setFormData] = useState({
		email: "",
		termsAccepted: false,
		keepLoggedIn: false,
		firstName: "",
		lastName: "",
		password: "",
	});

	const [authState, setAuthState] = useState(null);
	const [nextStep, setNextStep] = useState(false);
	const navigate = useNavigate();

	const handleStateNextStep = (e) => {
		e.preventDefault();
		setNextStep(true);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (authState === "signUp" && !formData.termsAccepted) {
			alert("You must accept the terms of service and privacy policy.");
			return;
		}
		try {
			const response =
				authState === "signUp" ? await signup(formData) : await login(formData);
			alert(`${authState === "signUp" ? "Signup" : "Signin"} successful!`);
			console.log("Access Token:", response.accessToken);
			sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
			navigate("/organization");
		} catch (error) {
			alert(`${authState === "signUp" ? "Signup" : "Signin"} failed: ${error}`);
		}
	};

	return (
		<div className="wrapper">
			<div className="left-container">
				<nav>CASA</nav>
				<img src={loginImage} alt="Login" className="displayImg" />
			</div>
			<div className="right-container">
				{!authState && (
					<div>
						<h2 className="h2">Get Started</h2>
						<Button
							variant={"contained"}
							onClick={() => {
								setAuthState("signIn");
								setNextStep(false);
							}}
							sx={{
								marginRight: "10px",
								height: "50px",
								width: "200px",
								borderRadius: "50px",
							}}
						>
							Log In
						</Button>
						<Button
							variant={"contained"}
							onClick={() => {
								setAuthState("signUp");
								setNextStep(false);
							}}
							sx={{
								height: "50px",
								width: "200px",
								borderRadius: "50px",
							}}
						>
							Sign Up
						</Button>
					</div>
				)}
				{authState === "signIn" && (
					<div>
						<h2 className="h2">Welcome Back</h2>
						<form onSubmit={handleSubmit}>
							<TextField
								label="Email Address"
								name="email"
								value={formData.email}
								onChange={handleChange}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								fullWidth
								margin="normal"
							/>
							<Typography
								variant="body2"
								align="center"
								sx={{
									cursor: "pointer",
									marginTop: "10px",
									":hover": { color: "#00705b" },
								}}
								onClick={() => setAuthState("signUp")}
							>
								Do not have an account? Sign Up
							</Typography>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									sx={{ marginTop: "20px", width: "100%" }}
								>
									Sign In
								</Button>
							</div>
							<div className="hr-with-text">Or</div>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<GoogleLoginButton
									onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
									style={{
										justifyContent: "center",
										display: "flex",
										alignItems: "center",
										border: "1px solid grey",
									}}
								>
									&nbsp;&nbsp;
									<span>Continue with Google</span>
								</GoogleLoginButton>
							</Box>
						</form>
					</div>
				)}
				{authState === "signUp" && (
					<div>
						<h2 className="h2">Create An Account</h2>
						<form onSubmit={handleSubmit}>
							<TextField
								label="Email Address"
								name="email"
								value={formData.email}
								onChange={handleChange}
								margin="normal"
								fullWidth
							/>
							<TextField
								label="Password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								margin="normal"
								fullWidth
							/>
							<TextField
								label="First Name"
								id="firstName"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								margin="normal"
								fullWidth
							/>
							<TextField
								label="Last Name"
								id="lastName"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								margin="normal"
								fullWidth
							/>
							<label>
								<input
									type="checkbox"
									name="termsAccepted"
									onChange={handleChange}
								/>
								I have read and accept the <a href="#">Terms of Service</a> and{" "}
								<a href="#">Privacy Policy</a>.
							</label>
							<Typography
								variant="body2"
								align="center"
								sx={{
									cursor: "pointer",
									marginTop: "10px",
									":hover": { color: "#00705b" },
								}}
								onClick={() => setAuthState("signIn")}
							>
								Already have an account? Login
							</Typography>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									sx={{ marginTop: "20px", width: "100%" }}
								>
									Sign Up
								</Button>
							</div>
							<div className="hr-with-text">Or</div>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<GoogleLoginButton
									onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
									style={{
										justifyContent: "center",
										display: "flex",
										alignItems: "center",
										border: "1px solid grey",
									}}
								>
									&nbsp;&nbsp;
									<span>Continue with Google</span>
								</GoogleLoginButton>
							</Box>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}

export default Login;
