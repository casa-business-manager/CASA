// APIUtils.js
import { API_BASE_URL, BE_ACCESS_TOKEN } from "../constants/login";

export const request = async (options) => {
	const headers = new Headers({
		"Content-Type": "application/json",
	});

	const token = sessionStorage.getItem(BE_ACCESS_TOKEN);
	if (token) {
		headers.append("Authorization", "Bearer " + token);
	} else {
		console.warn("No backend access token found in sessionStorage");
	}

	const defaults = { headers: headers, method: "POST" };
	options = Object.assign({}, defaults, options);
	const url = API_BASE_URL + options.url;

	return fetch(url, options).then((response) => {
		return response.text().then((text) => {
			try {
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const jsonResponse = JSON.parse(text);
					console.log("API Response:", jsonResponse); // Log the full response
					return response.ok
						? jsonResponse
						: Promise.reject(jsonResponse.error);
				} else {
					return response.ok ? text : Promise.reject(text);
				}
			} catch (error) {
				console.error("Error parsing JSON response:", error);
				return Promise.reject(text);
			}
		});
	});
};
