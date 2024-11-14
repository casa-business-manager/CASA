// SignUpButton.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Renders a drop-down button with options for signing up with a popup or redirect
 */
export const SignUpButton = ({ onSignupSuccess }) => {
	const { instance } = useMsal();

	const handleSignup = async (loginType) => {
		try {
			const response =
				loginType === "popup"
					? await instance.loginPopup(loginRequest)
					: await instance.loginRedirect(loginRequest);
			onSignupSuccess(response.accessToken);
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
