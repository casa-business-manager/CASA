import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Renders a drop-down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = ({ onLoginSuccess }) => {
	const { instance } = useMsal();

	const handleLogin = async (loginType) => {
		try {
			const response =
				loginType === "popup"
					? await instance.loginPopup(loginRequest)
					: await instance.loginRedirect(loginRequest);
			onLoginSuccess(response.accessToken);
		} catch (e) {
			console.log(e);
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
