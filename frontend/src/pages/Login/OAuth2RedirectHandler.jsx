import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants/constants";

const OAuth2RedirectHandler = () => {
	const location = useLocation();

	const getUrlParameter = (name) => {
		name = name.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
		const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		const results = regex.exec(location.search);
		return results === null
			? ""
			: decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	const token = getUrlParameter("token");
	const error = getUrlParameter("error");

	if (token) {
		sessionStorage.setItem(ACCESS_TOKEN, token);
		return <Navigate to="/organization" state={{ from: location }} replace />;
	} else {
		return (
			<Navigate to="/login" state={{ from: location, error: error }} replace />
		);
	}
};

export default OAuth2RedirectHandler;
