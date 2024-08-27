import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./Login/Login";
import OrganizationSelection from "./OrganizationSelection/OrganizationSelection";
import OAuth2RedirectHandler from "./Login/OAuth2RedirectHandler";
import OrganizationLanding from "./OrganizationLanding/OrganizationLanding";
import UserCalendar from "./Calendars/UserCalendar";
import OrganizationCalendar from "./Calendars/OrganizationCalendar";
import EmailPage from "./Email/EmailPage";
import NavBar from "./NavBar/NavBar";
import OrganizationsContext from "./Contexts/OrganizationsContext";
import { Box } from "@mui/material";
import { CurrentUserProvider } from "./Contexts/CurrentUserContext";

function App() {
	const [organizations, setOrganizations] = useState([]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<Router>
				<CurrentUserProvider>
					<OrganizationsContext.Provider
						value={[organizations, setOrganizations]}
					>
						<NavBar title="Organization Calendar" />
						<Box sx={{ flexGrow: 1, px: 1 }}>
							<Routes>
								<Route path="/" element={<Navigate replace to="/login" />} />
								<Route path="/login" element={<Login />} />
								<Route
									path="/organization"
									element={<OrganizationSelection />}
								/>
								<Route
									path="/oauth2/redirect"
									element={<OAuth2RedirectHandler />}
								/>
								<Route
									path="/organization/:orgId"
									element={<OrganizationLanding />}
								/>
								<Route
									path="/organization/:orgId/calendar"
									element={<OrganizationCalendar />}
								/>
								<Route
									path="/user/:userId/calendar"
									element={<UserCalendar />}
								/>
								<Route
									path="/organization/:orgId/email"
									element={<EmailPage />}
								/>
							</Routes>
						</Box>
					</OrganizationsContext.Provider>
				</CurrentUserProvider>
			</Router>
		</Box>
	);
}

export default App;
