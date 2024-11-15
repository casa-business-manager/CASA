import React, { useContext } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { MS_ACCESS_TOKEN } from "../constants/login";

export const SignInButton = ({ onLoginSuccess }) => {
	const { instance } = useMsal();
	const [_, setCurrentUser] = useContext(CurrentUserContext);

	const handleLogin = async (loginType) => {
		try {
			// Clear previous token if any
			sessionStorage.removeItem(MS_ACCESS_TOKEN);

			const response =
				loginType === "popup"
					? await instance.loginPopup(loginRequest)
					: await instance.loginRedirect(loginRequest);

			// Assuming response includes new user profile information and access token
			const accessToken = response.accessToken;

			// Store new token and update CurrentUserContext
			sessionStorage.setItem(MS_ACCESS_TOKEN, accessToken);

			// Pass access token to parent component callback if needed
			onLoginSuccess(accessToken);
		} catch (e) {
			console.log("Error during Microsoft login:", e);
		}
	};

	return (
		<DropdownButton
			variant="secondary"
			className="ml-auto"
			drop="start"
			title="Sign In"
		>
			<Dropdown.Item as="button" onClick={() => handleLogin("popup")}>
				Sign in using Popup
			</Dropdown.Item>
			<Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>
				Sign in using Redirect
			</Dropdown.Item>
		</DropdownButton>
	);
};
