import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

import "bootstrap/dist/css/bootstrap.min.css";

import reportWebVitals from "./reportWebVitals";

const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();
await msalInstance.handleRedirectPromise();

//msalInstance.acquireTokenSilent();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<MsalProvider instance={msalInstance}>
			<App />
		</MsalProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
