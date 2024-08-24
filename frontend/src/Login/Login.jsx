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
	Alert,
} from "@mui/material";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GOOGLE_AUTH_URL } from "../Constants/constants";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../API/UserAPI";
import { ACCESS_TOKEN } from "../Constants/constants";
import loginImage from "../Assets/loginScreen.jpg";

const validateEmail = (email) => {
	// https://mailtrap.io/blog/react-native-email-validation/
	const expression =
		/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	return expression.test(String(email).toLowerCase());
};

const OrDivider = () => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2 }}>
			<Divider sx={{ flex: 1 }} />
			<Typography sx={{ mx: 2 }}>Or</Typography>
			<Divider sx={{ flex: 1 }} />
		</Box>
	);
};

const detectErrors = (
	authState,
	formData,
	errors,
	setErrors,
	canSetNewErrors = true,
) => {
	var errorDetected = false;
	var newErrors = {
		email: false,
		termsAccepted: false,
		keepLoggedIn: false,
		firstName: false,
		lastName: false,
		password: false,
	};

	const handleErrorDetected = (flag) => {
		newErrors = { ...newErrors, [flag]: canSetNewErrors ? true : errors[flag] };
		errorDetected = true;
	};

	switch (authState) {
		case "signUp":
			if (
				!formData.email ||
				formData.email === "" ||
				!validateEmail(formData.email)
			) {
				handleErrorDetected("email");
			}
			if (!formData.password || formData.password === "") {
				handleErrorDetected("password");
			}
			if (!formData.firstName || formData.firstName === "") {
				handleErrorDetected("firstName");
			}
			if (!formData.lastName || formData.lastName === "") {
				handleErrorDetected("lastName");
			}
			if (!formData.termsAccepted) {
				handleErrorDetected("termsAccepted");
			}
			break;

		case "signIn":
			if (!formData.email || formData.email === "") {
				handleErrorDetected("email");
			}
			if (!formData.password || formData.password === "") {
				handleErrorDetected("password");
			}
			break;

		default:
		// should never reach here
		// errorDetected would be false so the return is true
	}

	setErrors(newErrors);
	return !errorDetected;
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

	const [errors, setErrors] = useState({
		email: false,
		termsAccepted: false,
		keepLoggedIn: false,
		firstName: false,
		lastName: false,
		password: false,
	});
	const [apiError, setApiError] = useState(false);

	const navigate = useNavigate();

	const handleSwitchSignupLogin = () => {
		setAuthState(authState === "signUp" ? "signIn" : "signUp");
		setErrors({
			email: false,
			termsAccepted: false,
			keepLoggedIn: false,
			firstName: false,
			lastName: false,
			password: false,
		});
		setApiError(false);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const newFormData = {
			...formData,
			[name]: type === "checkbox" ? checked : value,
		};
		setFormData(newFormData);
		detectErrors(authState, newFormData, errors, setErrors, false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setApiError(false);

		if (!detectErrors(authState, formData, errors, setErrors)) {
			return;
		}

		// if signing up a new user, make the signup call first then a login call after signup succeeds
		try {
			if (authState === "signUp") {
				const signupResponse = await signup(formData);
				console.log("signupResponse", signupResponse);
			}
			const response = await login(formData);
			sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
			navigate("/organization");
		} catch (error) {
			setApiError(error);
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
				error={errors.email}
				helperText={errors.email && "Please enter a valid email address."}
			/>
			<TextField
				label="Password"
				name="password"
				type="password"
				value={formData.password}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={errors.password}
				helperText={errors.password && "Please enter a password."}
			/>
			<Typography
				align="center"
				sx={{
					marginTop: 1,
				}}
			>
				<Link onClick={handleSwitchSignupLogin}>
					Don't have an account? Sign Up
				</Link>
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
			{apiError && (
				<Alert
					severity="error"
					onClose={() => setApiError(false)}
					sx={{ mt: 2 }}
				>
					{typeof apiError == "boolean"
						? "Log in failed. Please try again."
						: apiError}
				</Alert>
			)}
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
				error={errors.email}
				helperText={errors.email && "Please enter a valid email address."}
			/>
			<TextField
				label="Password"
				name="password"
				type="password"
				value={formData.password}
				onChange={handleChange}
				margin="normal"
				fullWidth
				error={errors.password}
				helperText={errors.password && "Please enter a password."}
			/>
			<TextField
				label="First Name"
				id="firstName"
				name="firstName"
				value={formData.firstName}
				onChange={handleChange}
				margin="normal"
				fullWidth
				error={errors.firstName}
				helperText={errors.firstName && "Please enter your first name."}
			/>
			<TextField
				label="Last Name"
				id="lastName"
				name="lastName"
				value={formData.lastName}
				onChange={handleChange}
				margin="normal"
				fullWidth
				error={errors.lastName}
				helperText={errors.lastName && "Please enter your last name."}
			/>
			<FormControl error={errors.termsAccepted}>
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
				{errors.termsAccepted && (
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
			>
				<Link onClick={handleSwitchSignupLogin}>
					Already have an account? Login
				</Link>
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
			{apiError && (
				<Alert
					severity="error"
					onClose={() => setApiError(false)}
					sx={{ mt: 2 }}
				>
					{typeof apiError == "boolean"
						? "Sign up failed. Please try again."
						: apiError}
				</Alert>
			)}
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
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				flexGrow: 1,
				justifyContent: "center",
				height: "100%",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 4, px: 2 }}>
				<Box component="img" src={loginImage} sx={{ width: "70%" }} />
				<Box sx={{ width: "30%", pr: 6 }}>
					{!authState
						? GetStarted
						: authState === "signIn"
							? LoginFields
							: SignUpFields}
				</Box>
			</Box>
		</Box>
	);
}

export default Login;
