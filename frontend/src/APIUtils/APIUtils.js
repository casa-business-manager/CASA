import { API_BASE_URL, ACCESS_TOKEN } from '../Constants/constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response => {
            if (response.status === 204) {
                return {};
            }
            return response.text().then(text => {
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
                    return Promise.reject('Failed to parse JSON: ' + text);
                }
            });
        });
};

export function getCurrentUser() {
    if(!sessionStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getCalendarData(orgId, userId) {
    return request({
        url: API_BASE_URL + `/organizationCalendar/${orgId}/userId/${userId}`,
        method: 'GET'
    });
}

export function createEvent(orgId, eventRequest) {
    return request({
        url: API_BASE_URL + `/organization/${orgId}/event`,
        method: 'POST',
        body: JSON.stringify(eventRequest)
    });
}

export function updateEvent(eventId, eventRequest) {
    return request({
        url: API_BASE_URL + `/event/${eventId}`,
        method: 'PUT',
        body: JSON.stringify(eventRequest)
    });
}

export function deleteEvent(eventId) {
    return request({
        url: API_BASE_URL + `/event/${eventId}`,
        method: 'DELETE'
    });
}

export function createOrganization(organizationRequest) {
    return getCurrentUser()
        .then(user => {
            const userId = user.id;
            console.log(userId);
            return request({
                url: API_BASE_URL + "/user/" + userId + "/organizations",
                method: 'POST',
                body: JSON.stringify(organizationRequest)
            });
        })
        .catch(error => {
            console.error('Error fetching current user:', error);
            return Promise.reject(error);
        });
}

export function getOrganizations() {
    return getCurrentUser()
        .then(user => {
            const userId = user.id;
            console.log(userId);
            return fetch(API_BASE_URL + "/user/" + userId + "/organizations", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                return Promise.reject('Failed to fetch organizations');
            }
            if (response.status === 204) {
                return []; 
            }
            return response.json(); 
        })
        .catch(error => {
            console.error('Error fetching organizations:', error);
            return Promise.reject(error);
        });
}

export const updateOrganization = async (organization) => {
    console.log("Organization Id: ", organization.orgId);
    return request({
        url: API_BASE_URL + "/organization/" + organization.orgId,
        method: 'PUT',
        body: JSON.stringify(organization)
    });
};

export const getUsersInOrganization = async (organizationId) => {
    return request({
        url: API_BASE_URL + "/organization/" + organizationId + "/users",
        method: 'GET',
    });
};

export const inviteUserToOrganization = async (organizationId, userEmail) => {
    return request({
        url: API_BASE_URL + "/organization/" + organizationId + "/invite?email=" + userEmail,
        method: 'POST'
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Failed to invite user:', error);
        return Promise.reject('Failed to invite user: ' + error);
    });
};

export const removeUserFromOrganization = async (organizationId, userId) => {
    return request({
        url: API_BASE_URL + "/organization/" + organizationId + "/user/" + userId,
        method: 'DELETE'
    })
    .then(response => {
        return response; 
    })
    .catch(error => {
        console.error('Failed to remove user:', error);
        return Promise.reject('Failed to remove user: ' + error);
    });
};