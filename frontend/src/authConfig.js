import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
	auth: {
		clientId: "",
		authority: "",
		redirectUri: "http://localhost:3000",
	},
	cache: {
		cacheLocation: "sessionStorage", // configures where cache will be stored
		storeAuthStateInCookie: false, // set to "true" if having issues in IE11 or Edge
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
					default:
						return;
				}
			},
		},
	},
};

// scopes to prompt for user consent
// default, mSAL.js adds openid, profile, email to any login request
export const loginRequest = {
	scopes: ["User.Read"],
};

// scopes to request when obtaining an access token for MS Graph API
export const graphConfig = {
	graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
	graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/events",
};
