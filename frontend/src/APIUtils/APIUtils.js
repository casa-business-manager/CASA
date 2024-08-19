import { API_BASE_URL, ACCESS_TOKEN } from "../Constants/constants";

// TODO: split these into files by controller
const request = async (options) => {
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
				if (!response.ok) {
					return Promise.reject(json);
				}
				return json;
			} catch (error) {
				return Promise.reject("Failed to parse JSON: " + text);
			}
		});
	});
};

export function getCurrentUser() {
	if (!sessionStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: "/getCurrentUser",
	});
}

export function login(loginRequest) {
	return request({
		url: "/auth/login",
		body: JSON.stringify(loginRequest),
	});
}

export function signup(signupRequest) {
	return request({
		url: "/auth/signup",
		body: JSON.stringify(signupRequest),
	});
}

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

export async function createOrganization(organizationRequest) {
	return getCurrentUser()
		.then((user) => {
			const userId = user.id;
			return request({
				url: "/createOrganizationForUser/user/" + userId,
				method: "POST",
				body: JSON.stringify(organizationRequest),
			});
		})
		.catch((error) => {
			console.error("Error fetching current user:", error);
			return Promise.reject(error);
		});
}

export async function getOrganizations() {
	return getCurrentUser()
		.then((user) => {
			const userId = user.id;
			return request({
				url: "/getOrganizationsForUser/user/" + userId,
			});
		})
		.then((response) => {
			if (!response.ok) {
				return Promise.reject("Failed to fetch organizations");
			}
			if (response.status === 204) {
				return [];
			}
			return response.json();
		})
		.catch((error) => {
			console.error("Error fetching organizations:", error);
			return Promise.reject(error);
		});
}

export const updateOrganization = async (organization) => {
	return request({
		url: "/updateOrganization/organization/" + organization.orgId,
		body: JSON.stringify(organization),
	});
};

export const getUsersInOrganization = async (organizationId) => {
	return request({
		url: "/getUsersInOrganization/organization/" + organizationId,
	});
};

// getUsersInOrganization + org name
export const getOrganizationInfo = async (organizationId) => {
	return request({
		url: "/getOrganizationInfo/organization/" + organizationId,
	});
};

export const inviteUserToOrganization = async (organizationId, userEmail) => {
	const params = `?email=${userEmail}`;

	return request({
		url: "/inviteUserToOrganization/organization/" + organizationId + params,
	})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.error("Failed to invite user:", error);
			return Promise.reject("Failed to invite user: " + error);
		});
};

export const removeUserFromOrganization = async (organizationId, userId) => {
	return request({
		url:
			"/removeUserFromOrganization/organization/" +
			organizationId +
			"/user/" +
			userId,
	})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.error("Failed to remove user:", error);
			return Promise.reject("Failed to remove user: " + error);
		});
};

export const getOrganizationRoles = async (organizationId) => {
	return request({
		url: "/getOrganizationRoles/organization/" + organizationId,
	});
};

export const createRole = async (organizationId, roleRequest) => {
	return request({
		url: "/createRole/organization/" + organizationId,
		body: JSON.stringify(roleRequest),
	});
};

export const editRole = async (roleId, roleRequest) => {
	return request({
		url: "/editRole/role/" + roleId,
		body: JSON.stringify(roleRequest),
	});
};

export const deleteRole = async (roleId) => {
	return request({
		url: "/deleteRole/role/" + roleId,
	});
};
