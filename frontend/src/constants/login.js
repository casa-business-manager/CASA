// export const API_BASE_URL = 'http://localhost:8080';
// export const ACCESS_TOKEN = 'accessToken';

// export const CLIENTID =  '468393170198-8gan5sqbb8v9i9ve5on5pprq81n7066p.apps.googleusercontent.com'

// export const OAUTH2_REDIRECT_URI = 'http://localhost:8080/oauth2/callback/google'
// export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?
//                                     redirect_uri=${OAUTH2_REDIRECT_URI}&
//                                     response_type=token&
//                                     client_id=${CLIENTID}&
//                                     scope=openid%20email%20profile`;

export const API_BASE_URL = "https://casa-gse6.onrender.com";
export const ACCESS_TOKEN = "accessToken";

export const OAUTH2_REDIRECT_URI = `${API_BASE_URL}/oauth2/redirect`;

export const GOOGLE_AUTH_URL =
	API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;
