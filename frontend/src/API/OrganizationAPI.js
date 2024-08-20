import { request } from "./APIUtils";
import { getCurrentUser } from "./UserAPI";

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

export async function updateOrganization(organization) {
	return request({
		url: "/updateOrganization/organization/" + organization.orgId,
		body: JSON.stringify(organization),
	});
}

export async function getUsersInOrganization(organizationId) {
	return request({
		url: "/getUsersInOrganization/organization/" + organizationId,
	});
}

// getUsersInOrganization + org name
export async function getOrganizationInfo(organizationId) {
	return request({
		url: "/getOrganizationInfo/organization/" + organizationId,
	});
}

export async function inviteUserToOrganization(organizationId, userEmail) {
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
}

export async function removeUserFromOrganization(organizationId, userId) {
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
}
