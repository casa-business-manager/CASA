import { ACCESS_TOKEN } from "../constants/login";
import { request } from "./APIUtils";

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
