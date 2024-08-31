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
import OrganizationHome from "./OrganizationHome/OrganizationHome";
import UserCalendar from "./Calendars/UserCalendar";
import OrganizationCalendar from "./Calendars/OrganizationCalendar";
import EmailPage from "./Email/EmailPage";
import NavBar from "./NavBar/NavBar";
import OrganizationsContext from "./Contexts/OrganizationsContext";
import { Box, Toolbar } from "@mui/material";
import { CurrentUserProvider } from "./Contexts/CurrentUserContext";
import Sidebar from "./Sidebar/Sidebar";
import EmailContext from "./Contexts/EmailContext";

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
