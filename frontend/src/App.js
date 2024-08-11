import React, { useState } from "react";
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
import EmailPage from "./Email/EmailPage";
import NavBar from "./NavBar/NavBar";
import OrganizationsContext from "./Contexts/OrganizationsContext";

function App() {
	const [organizations, setOrganizations] = useState([]);

	return (
		<Router>
			<OrganizationsContext.Provider value={[organizations, setOrganizations]}>
				<NavBar title="Organization Calendar" />
				<Routes>
					<Route path="/" element={<Navigate replace to="/login" />} />
					<Route path="/login" element={<Login />} />
					<Route path="/organization" element={<Organization />} />
					<Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
					<Route
						path="/organization/:orgId"
						element={<OrganizationLanding />}
					/>
					<Route
						path="/organization/:orgId/calendar"
						element={<OrganizationCalendar />}
					/>
					<Route path="/user/:userId/calendar" element={<UserCalendar />} />
					<Route path="/organization/:orgId/email" element={<EmailPage />} />
				</Routes>
			</OrganizationsContext.Provider>
		</Router>
	);
}

export default App;
