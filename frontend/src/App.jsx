import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login/Login";
import OAuth2RedirectHandler from "./pages/Login/OAuth2RedirectHandler";
import OrganizationHome from "./pages/OrganizationHome";
import OrganizationSelection from "./pages/OrganizationSelection";
import OrganizationCalendar from "./pages/Calendars/OrganizationCalendar";
import UserCalendar from "./pages/Calendars/UserCalendar";
import EmailPage from "./pages/Email/EmailPage";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import OrganizationsContext from "./contexts/OrganizationsContext";
import EmailContext from "./contexts/EmailContext";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
	const [organizations, setOrganizations] = useState([]);
	const [emailRecipients, setEmailRecipients] = useState([]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<Router>
				<CurrentUserProvider>
					<OrganizationsContext.Provider
						value={[organizations, setOrganizations]}
					>
						<EmailContext.Provider
							value={[emailRecipients, setEmailRecipients]}
						>
							<NavBar title="Organization Calendar" />
							{/* For spacing */}
							<Toolbar sx={{ mb: 1 }} />
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
										path="/user/:userId/calendar"
										element={<UserCalendar />}
									/>
									<Route
										path="/organization/:orgId"
										element={
											<Sidebar>
												<OrganizationHome />
											</Sidebar>
										}
									/>
									<Route
										path="/organization/:orgId/calendar"
										element={
											<Sidebar selected={"Calendar"}>
												<OrganizationCalendar />
											</Sidebar>
										}
									/>
									<Route
										path="/organization/:orgId/email"
										element={
											<Sidebar selected={"Email"}>
												<EmailPage />
											</Sidebar>
										}
									/>
									<Route
										path="/organization/:orgId/settings"
										element={
											<Sidebar selected={"Settings"}>
												<SettingsPage />
											</Sidebar>
										}
									/>
								</Routes>
							</Box>
						</EmailContext.Provider>
					</OrganizationsContext.Provider>
				</CurrentUserProvider>
			</Router>
		</Box>
	);
}

export default App;
