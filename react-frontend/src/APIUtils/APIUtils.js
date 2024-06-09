import { API_BASE_URL, ACCESS_TOKEN } from '../Constants/constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
}

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
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
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
    .then(response => response.text()) 
    .then(text => {
        try {
            return JSON.parse(text); 
        } catch (error) {
            console.error('Failed to parse JSON:', text);
            return Promise.reject('Failed to parse JSON: ' + text);
        }
    });

};

export const removeUserFromOrganization = async (organizationId, userId) => {
    return request({
        url: API_BASE_URL + "/organization/" + organizationId + "/user/" + userId,
        method: 'DELETE'
    })
    .then(response => response.text()) 
    .then(text => {
        try {
            return JSON.parse(text); 
        } catch (error) {
            console.error('Failed to parse JSON:', text);
            return Promise.reject('Failed to parse JSON: ' + text);
        }
    });
};