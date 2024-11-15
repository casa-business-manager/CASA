import React, { useContext } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { MS_ACCESS_TOKEN } from "../constants/login";

export const SignUpButton = ({ onSignupSuccess }) => {
	const { instance } = useMsal();
	const [_, setCurrentUser] = useContext(CurrentUserContext);

	const handleSignup = async (loginType) => {
		try {
			// Clear any existing session token
			sessionStorage.removeItem(MS_ACCESS_TOKEN);

			const response =
				loginType === "popup"
					? await instance.loginPopup(loginRequest)
					: await instance.loginRedirect(loginRequest);

			const accessToken = response.accessToken;

			// Store new token and update CurrentUserContext
			sessionStorage.setItem(MS_ACCESS_TOKEN, accessToken);

			onSignupSuccess(accessToken);
		} catch (e) {
			console.log("Error during Microsoft signup:", e);
		}
	};

	return (
		<DropdownButton
			variant="primary"
			className="ml-auto"
			drop="start"
			title="Sign Up"
		>
			<Dropdown.Item as="button" onClick={() => handleSignup("popup")}>
				Sign up using Popup
			</Dropdown.Item>
			<Dropdown.Item as="button" onClick={() => handleSignup("redirect")}>
				Sign up using Redirect
			</Dropdown.Item>
		</DropdownButton>
	);
};
