import React, { useState } from "react";
import {
	Button,
	Box,
	TextField,
	Typography,
	Divider,
	Checkbox,
	Link,
	FormControlLabel,
	FormHelperText,
	FormControl,
} from "@mui/material";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GOOGLE_AUTH_URL } from "../Constants/constants";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../APIUtils/APIUtils";
import { ACCESS_TOKEN } from "../Constants/constants";
import loginImage from "../Assets/loginScreen.jpg";

const OrDivider = () => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2 }}>
			<Divider sx={{ flex: 1 }} />
			<Typography sx={{ mx: 2 }}>Or</Typography>
			<Divider sx={{ flex: 1 }} />
		</Box>
	);
};

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

	const [termsError, setTermsError] = useState(false);

	const navigate = useNavigate();

	const handleStateNextStep = (e) => {
		e.preventDefault();
		setNextStep(true);
	};

	const handleSwitchSignupLogin = () => {
		setAuthState(authState === "signUp" ? "signIn" : "signUp");
		setTermsError(false);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		setTermsError(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (authState === "signUp" && !formData.termsAccepted) {
			setTermsError(true);
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

	const GetStarted = (
		<Box
			sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<Typography variant="h4" align="center" sx={{ mb: 2 }}>
				Get Started
			</Typography>
			<Box sx={{ display: "flex", px: 1 }}>
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
			</Box>
		</Box>
	);

	const LoginFields = (
		<Box>
			<Typography variant="h4" align="center">
				Welcome Back
			</Typography>
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
				align="center"
				sx={{
					marginTop: 1,
				}}
				onClick={handleSwitchSignupLogin}
			>
				<Link>Don't have an account? Sign Up</Link>
			</Typography>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				onClick={handleSubmit}
				sx={{ marginTop: 3, width: "100%" }}
			>
				Sign In
			</Button>
			<OrDivider />
			<GoogleLoginButton
				onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
				style={{
					justifyContent: "center",
					display: "flex",
					alignItems: "center",
					border: "1px solid grey",
				}}
			>
				Continue with Google
			</GoogleLoginButton>
		</Box>
	);

	const SignUpFields = (
		<Box>
			<Typography variant="h4" align="center">
				Create an Account
			</Typography>
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
			<FormControl error={termsError}>
				<FormControlLabel
					control={
						<Checkbox
							name="termsAccepted"
							checked={formData.termsAccepted}
							onChange={handleChange}
						/>
					}
					label={
						<Typography sx={{ fontSize: "0.875rem" }}>
							I have read and accept the{" "}
							<Link href="/terms-of-service" target="_blank" rel="noopener">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy-policy" target="_blank" rel="noopener">
								Privacy Policy
							</Link>
							.
						</Typography>
					}
				/>
				{termsError && (
					<FormHelperText sx={{ mt: -1 }}>
						You must accept the terms of service and privacy policy.
					</FormHelperText>
				)}
			</FormControl>
			<Typography
				align="center"
				sx={{
					marginTop: 1,
				}}
				onClick={handleSwitchSignupLogin}
			>
				<Link>Already have an account? Login</Link>
			</Typography>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				onClick={handleSubmit}
				sx={{ marginTop: 3, width: "100%" }}
			>
				Sign Up
			</Button>
			<OrDivider />
			<GoogleLoginButton
				onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
				style={{
					justifyContent: "center",
					display: "flex",
					alignItems: "center",
					border: "1px solid grey",
				}}
			>
				Continue with Google
			</GoogleLoginButton>
		</Box>
	);

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
			<Box component="img" src={loginImage} sx={{ width: "75%" }} />
			<Box sx={{ width: "25%", mx: 4 }}>
				{!authState
					? GetStarted
					: authState === "signIn"
						? LoginFields
						: SignUpFields}
			</Box>
		</Box>
	);
}

export default Login;
