import { graphConfig } from "../authConfig";
import { Client } from "@microsoft/microsoft-graph-client";

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
 * Fetch events using delta sync over a specified date range.
 * If deltaLink is provided, use it to fetch incremental changes.
 * @param {string} accessToken - Microsoft OAuth access token
 * @param {string} startDateTime - ISO date string for the start of the calendar view
 * @param {string} endDateTime - ISO date string for the end of the calendar view
 * @param {string} deltaLink - Optional delta link for incremental sync
 * @returns {Promise<Object>} - Returns an object containing events and a new delta link
 */
export async function fetchCalendarDeltaEvents(
	accessToken,
	startDateTime,
	endDateTime,
	deltaLink = null,
) {
	const client = Client.init({
		authProvider: (done) => {
			done(null, accessToken); // Provide access token
		},
	});

	// Use either deltaLink for incremental sync or the new delta sync with date range
	const url = deltaLink
		? deltaLink
		: `/me/calendarView/delta?startDateTime=${startDateTime}&endDateTime=${endDateTime}`;

	try {
		console.log("Fetching calendar events with URL:", url);
		const response = await client
			.api(url)
			.header("Prefer", "odata.maxpagesize=10")
			.get();

		// Process the initial page of data
		let events = response.value;
		console.log("Fetched events:", events);

		// Follow @odata.nextLink if paginated results exist
		while (response["@odata.nextLink"]) {
			response = await client.api(response["@odata.nextLink"]).get();
			events = events.concat(response.value);
			console.log("Fetched additional page of events:", response.value);
		}

		// Use @odata.deltaLink for future incremental syncs
		let deltaLink = response["@odata.deltaLink"];
		console.log("Delta link for future syncs:", deltaLink);

		return { events, deltaLink };
	} catch (error) {
		console.error("Error in fetchCalendarDeltaEvents:", error);
		throw error;
	}
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
