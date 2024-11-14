// Login.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "../../components/SignInButton";
import { SignUpButton } from "../../components/SignUpButton"; // Ensure SignUpButton is properly imported
import { callMsGraph } from "../../API/GraphAPI";
import { login, signup } from "../../API/UserAPI";
import { MS_ACCESS_TOKEN, BE_ACCESS_TOKEN } from "../../constants/login";

function Login() {
	const isAuthenticated = useIsAuthenticated();
	const navigate = useNavigate();
	const hardcodedPassword = "kdi2002!"; // Ensure this matches backend signup password

	// Function for handling login directly
	const handleMicrosoftLogin = async (msAccessToken) => {
		try {
			console.log("Received Microsoft access token for login:", msAccessToken);
			sessionStorage.setItem(MS_ACCESS_TOKEN, msAccessToken);

			console.log("Fetching Microsoft user data for login...");
			const microsoftUser = await callMsGraph(msAccessToken);
			console.log("Microsoft user data received for login:", microsoftUser);

			const email = microsoftUser?.mail || microsoftUser?.userPrincipalName;
			if (!email) {
				throw new Error("No email found in Microsoft account");
			}

			console.log("Attempting backend login with email:", email);
			const loginResponse = await login({ email, password: hardcodedPassword });
			const backendToken = loginResponse.accessToken;

			sessionStorage.setItem(BE_ACCESS_TOKEN, backendToken);
			console.log("Login successful, backend access token stored.");
			navigate("/organization");
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	// Function for handling signup, with fallback to login if user exists
	const handleMicrosoftSignup = async (msAccessToken) => {
		try {
			console.log("Received Microsoft access token for signup:", msAccessToken);
			sessionStorage.setItem(MS_ACCESS_TOKEN, msAccessToken);

			console.log("Fetching Microsoft user data for signup...");
			const microsoftUser = await callMsGraph(msAccessToken);
			console.log("Microsoft user data received for signup:", microsoftUser);

			const email = microsoftUser?.mail || microsoftUser?.userPrincipalName;
			if (!email) {
				throw new Error("No email found in Microsoft account");
			}

			// Attempt to signup with required fields
			const signupData = {
				email: email,
				firstName: microsoftUser.givenName || "DefaultFirstName",
				lastName: microsoftUser.surname || "DefaultLastName",
				password: hardcodedPassword,
			};
			console.log("Attempting backend signup with data:", signupData);

			try {
				await signup(signupData);
				console.log("Signup successful, proceeding to login...");

				// Login after successful signup
				const loginResponse = await login({
					email: email,
					password: hardcodedPassword,
				});
				const backendToken = loginResponse.accessToken;
				sessionStorage.setItem(BE_ACCESS_TOKEN, backendToken);
				console.log(
					"Login after signup successful, backend access token stored.",
				);
			} catch (signupError) {
				if (signupError.message.includes("Email address already in use")) {
					console.log("Email already in use. Attempting login...");

					// Attempt login if signup fails due to existing user
					const loginResponse = await login({
						email,
						password: hardcodedPassword,
					});
					const backendToken = loginResponse.accessToken;
					sessionStorage.setItem(BE_ACCESS_TOKEN, backendToken);
					console.log("Login successful, backend access token stored.");
				} else {
					console.error("Unexpected signup error:", signupError);
					throw signupError;
				}
			}

			navigate("/organization");
		} catch (error) {
			console.error("Error during signup/login:", error);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			console.log(
				"User authenticated with Microsoft. Redirecting to /organization...",
			);
			navigate("/organization");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div>
			{isAuthenticated ? null : (
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
