import { request } from "./APIUtils";

export async function getOrganizationRoles(organizationId) {
	return request({
		url: "/getOrganizationRoles/organization/" + organizationId,
	});
}

export async function createRole(organizationId, roleRequest) {
	return request({
		url: "/createRole/organization/" + organizationId,
		body: JSON.stringify(roleRequest),
	});
}

export async function editRole(roleId, roleRequest) {
	return request({
		url: "/editRole/role/" + roleId,
		body: JSON.stringify(roleRequest),
	});
}

export async function deleteRole(roleId) {
	return request({
		url: "/deleteRole/role/" + roleId,
	});
}
