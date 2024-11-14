import { graphConfig } from "../authConfig";

/**
 * Attaches a given access token to a MS Graph API call to fetch basic user information.
 * @param {string} accessToken - Microsoft OAuth access token
 * @returns {Promise<Object>} - User information from Microsoft Graph API
 */
export async function callMsGraph(accessToken) {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);

	const options = {
		method: "GET",
		headers: headers,
	};

	return fetch(graphConfig.graphMeEndpoint, options)
		.then((response) => response.json())
		.catch((error) => console.log(error));
}

/**
 * Fetches events from the Microsoft user's calendar using the delta function.
 * @param {string} accessToken - Microsoft OAuth access token for API authorization
 * @param {string} deltaLink - Optional deltaLink for incremental synchronization
 * @returns {Promise<Object>} - Returns an object containing events and a new deltaLink
 */
export async function fetchMicrosoftCalendarDeltaEvents(
	accessToken,
	deltaLink = null,
) {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);

	const options = {
		method: "GET",
		headers: headers,
	};

	const url = deltaLink || `${graphConfig.graphCalendarEndpoint}/delta`;

	return fetch(url, options)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch delta events from Microsoft Calendar");
			}
			return response.json();
		})
		.then((data) => ({
			events: data.value,
			deltaLink: data["@odata.deltaLink"] || deltaLink, // Save deltaLink for the next sync
		}))
		.catch((error) => console.log(error));
}
