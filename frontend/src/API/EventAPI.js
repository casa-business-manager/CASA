import { request } from "./APIUtils";

export function getCalendarData(
	orgId,
	userId,
	startDate = null,
	endDate = null,
) {
	const paramStartDate = startDate ? `startDate=${startDate}` : "";
	const paramEndDate = endDate ? `endDate=${endDate}` : "";
	const params = `?${paramStartDate}&${paramEndDate}`;

	return request({
		url: `/getCalendarData/organization/${orgId}/user/${userId}` + params,
	});
}

export function createEvent(orgId, eventRequest) {
	return request({
		url: `/createEvent/organization/${orgId}`,
		body: JSON.stringify(eventRequest),
	});
}

export function updateEvent(eventId, eventRequest) {
	return request({
		url: `/updateEvent/event/${eventId}`,
		body: JSON.stringify(eventRequest),
	});
}

export function deleteEvent(eventId) {
	return request({
		url: `/deleteEvent/event/${eventId}`,
	});
}
