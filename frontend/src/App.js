import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./Login/Login";
import Organization from "./Organization/Organization";
import OAuth2RedirectHandler from "././Login/OAuth2RedirectHandler";
import OrganizationLanding from "./OrganizationLanding/OrganizationLanding";
import UserManagement from "./UserManagement/UserManagement";
import UserCalendar from "./Calendars/UserCalendar";
import OrganizationCalendar from "./Calendars/OrganizationCalendar";
import TemplateSelectorPage from "./Email/TemplateSelectorPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/organization" element={<Organization />} />
				<Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
				<Route path="/organization/:orgId" element={<OrganizationLanding />} />
				<Route
					path="/organizationCalendar/:orgId"
					element={<OrganizationCalendar />}
				/>
				<Route path="/userManagement/:orgId" element={<UserManagement />} />
				<Route path="/userCalendar/:userId" element={<UserCalendar />} />
				<Route
					path="/organization/:orgId/email"
					element={<TemplateSelectorPage />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
