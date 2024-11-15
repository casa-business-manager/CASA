// Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "../../components/SignInButton";
import { SignUpButton } from "../../components/SignUpButton";
import { callMsGraph } from "../../API/GraphAPI";
import { login, signup } from "../../API/UserAPI";
import { MS_ACCESS_TOKEN, BE_ACCESS_TOKEN } from "../../constants/login";

function Login() {
	const isAuthenticated = useIsAuthenticated();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false); // Loading state
	const hardcodedPassword = "kdi2002!";

	const handleMicrosoftLogin = async (msAccessToken) => {
		try {
			console.log("Received Microsoft access token for login:", msAccessToken);
			sessionStorage.setItem(MS_ACCESS_TOKEN, msAccessToken);

			console.log("Fetching Microsoft user data for login...");
			const microsoftUser = await callMsGraph(msAccessToken);
			console.log("Microsoft user data received for login:", microsoftUser);

			const email = microsoftUser?.mail || microsoftUser?.userPrincipalName;
			if (!email) throw new Error("No email found in Microsoft account");

			console.log("Checking backend for existing user with email:", email);
			const loginResponse = await login({ email, password: hardcodedPassword });
			if (!loginResponse || !loginResponse.accessToken) {
				throw new Error("User not found in backend");
			}

			sessionStorage.setItem(BE_ACCESS_TOKEN, loginResponse.accessToken);
			console.log("Login successful, backend access token stored.");
			setIsLoading(true); // Set loading state to true
			navigate("/organization");
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	const handleMicrosoftSignup = async (msAccessToken) => {
		try {
			console.log("Received Microsoft access token for signup:", msAccessToken);
			sessionStorage.setItem(MS_ACCESS_TOKEN, msAccessToken);

			console.log("Fetching Microsoft user data for signup...");
			const microsoftUser = await callMsGraph(msAccessToken);
			console.log("Microsoft user data received for signup:", microsoftUser);

			const email = microsoftUser?.mail || microsoftUser?.userPrincipalName;
			if (!email) throw new Error("No email found in Microsoft account");

			const signupData = {
				email,
				firstName: microsoftUser.givenName || "DefaultFirstName",
				lastName: microsoftUser.surname || "DefaultLastName",
				password: hardcodedPassword,
			};
			console.log("Attempting backend signup with data:", signupData);

			try {
				await signup(signupData);
				console.log("Signup successful. Logging in...");

				const loginResponse = await login({
					email,
					password: hardcodedPassword,
				});
				sessionStorage.setItem(BE_ACCESS_TOKEN, loginResponse.accessToken);
				console.log(
					"Login after signup successful, backend access token stored.",
				);
			} catch (signupError) {
				if (signupError.message.includes("Email address already in use")) {
					console.log("User already exists. Attempting login...");

					const loginResponse = await login({
						email,
						password: hardcodedPassword,
					});
					sessionStorage.setItem(BE_ACCESS_TOKEN, loginResponse.accessToken);
					console.log("Login successful, backend access token stored.");
				} else {
					console.error("Unexpected signup error:", signupError);
					throw signupError;
				}
			}

			setIsLoading(true); // Set loading state to true
			navigate("/organization");
		} catch (error) {
			console.error("Error during signup/login:", error);
		}
	};

	useEffect(() => {
		const backendToken = sessionStorage.getItem(BE_ACCESS_TOKEN);
		if (isAuthenticated && backendToken) {
			setIsLoading(true);
			navigate("/organization");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div>
			{isAuthenticated ? (
				isLoading ? (
					<p>Loading...</p> // Show loading if waiting for token
				) : null
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
						flexDirection: "column",
						gap: "20px",
					}}
				>
					<SignInButton onLoginSuccess={handleMicrosoftLogin} />
					<SignUpButton onSignupSuccess={handleMicrosoftSignup} />
				</div>
			)}
		</div>
	);
}

export default Login;
