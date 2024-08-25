import { API_BASE_URL, ACCESS_TOKEN } from "../Constants/constants";

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
		if (response.status === 204) {
			return {};
		}

		return response.text().then((text) => {
			if (!text) {
				return {};
			}
			try {
				const json = JSON.parse(text);
				return response.ok ? json : Promise.reject(json.error ?? json);
			} catch (error) {
				return Promise.reject(text);
			}
		});
	});
};
