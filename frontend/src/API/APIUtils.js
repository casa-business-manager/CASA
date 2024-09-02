import { API_BASE_URL, ACCESS_TOKEN } from "../constants/login";

export const request = async (options) => {
	const headers = new Headers({
		"Content-Type": "application/json",
	});

	if (sessionStorage.getItem(ACCESS_TOKEN)) {
		headers.append(
			"Authorization",
			"Bearer " + sessionStorage.getItem(ACCESS_TOKEN),
		);
	}

	const defaults = { headers: headers, method: "POST" };
	options = Object.assign({}, defaults, options);
	const url = API_BASE_URL + options.url;

	return fetch(url, options).then((response) => {
		return response.text().then((text) => {
			// cant call JSON.parse on an empty string - may be an ok response but the function will throw an error
			try {
				if (response.ok) {
					return text === "" ? response.ok : JSON.parse(text);
				}
				return Promise.reject(JSON.parse(text).error);
			} catch (error) {
				console.error("Error parsing JSON response:", error);
				return Promise.reject(text);
			}
		});
	});
};
