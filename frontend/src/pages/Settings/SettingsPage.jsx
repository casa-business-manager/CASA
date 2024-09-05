import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import List from "@mui/material/List";
import OrganizationTab from "./SettingTabs/OrganizationTab";
import MeetingsTab from "./SettingTabs/MeetingsTab";
import IntegrationsCollapse from "./SettingsCollapses/IntegrationsCollapse";
import UserCollapse from "./SettingsCollapses/UserCollapse";
import MembersTab from "./SettingTabs/MembersTab";
import RolesTab from "./SettingTabs/RolesTab";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import OrganizationsContext from "../../contexts/OrganizationsContext";

const SettingsPage = ({}) => {
	const defaultComponent = (
		<Typography variant="h5">Select a setting</Typography>
	);

	const { orgId } = useParams();
	const [currentUser, _] = useContext(CurrentUserContext);
	const [organizations, setOrganizations] = useContext(OrganizationsContext);
	const organization = organizations.find((org) => org.orgId === orgId);

	const [selected, setSelected] = useState(-1);
	const [settingsPage, setSettingsPage] = useState(defaultComponent);
	const [availableIntegrations, setAvailableIntegrations] = useState(null);

	// Always open to defaultComponent
	useEffect(() => {
		setSettingsPage(defaultComponent);
		setSelected(-1);
	}, []);

	// get settings if clicked
	useEffect(() => {
		const fetchAvailableIntegrations = async () => {
			if (!organization) {
				return;
			}
			// TODO: Make real backend function
			// const integrations = await SomeAPIOtherCallHere(orgId);
			organization.integrations = { meetings: ["Zoom"] };

			// hard code returns for now
			const integrations = {
				meetings: ["Zoom", "Google Meet", "Microsoft Teams"],
			};
			setAvailableIntegrations(integrations);
		};

		fetchAvailableIntegrations();
	}, [orgId, organizations]);

	const handleTabClick = (tabName, SettingComponent) => {
		setSelected(tabName);
		setSettingsPage(SettingComponent);
	};

	const setOrganization = (functionToSetOrganization) => {
		const currentOrganization = organization;
		setOrganizations((oldOrganizations) => {
			const otherOrganizations = oldOrganizations.filter(
				(org) => org.orgId !== orgId,
			);
			return [
				...otherOrganizations,
				functionToSetOrganization(currentOrganization),
			];
		});
	};

	if (!availableIntegrations) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5" sx={{ my: 1 }}>
				Organization settings
			</Typography>
			<Divider sx={{ mt: 2 }} />
			<Box height="80vh" sx={{ display: "flex", gap: 1 }}>
				{/* Scrollable list of settings */}
				<List
					sx={{
						width: "22%",
						maxWidth: "260px",
						overflow: "auto",
					}}
					component="nav"
					aria-labelledby="nested-list-subheader"
				>
					<OrganizationTab
						organization={organization}
						setOrganization={setOrganization}
						onClick={handleTabClick}
						selected={selected}
					/>
					<UserCollapse>
						<MembersTab
							organization={organization}
							setOrganization={setOrganization}
							onClick={handleTabClick}
							selected={selected}
						/>
						<RolesTab
							organization={organization}
							setOrganization={setOrganization}
							user={currentUser}
							onClick={handleTabClick}
							selected={selected}
						/>
					</UserCollapse>
					<IntegrationsCollapse>
						<MeetingsTab
							organization={organization}
							setOrganization={setOrganization}
							availableMeetings={availableIntegrations.meetings}
							onClick={handleTabClick}
							selected={selected}
						/>
					</IntegrationsCollapse>
				</List>

				<Divider orientation="vertical" flexItem />

				{/* Settings page */}
				{/* If you need it to be scrollable, wrap your settings in a Box with overflow set to "auto" */}
				<Box sx={{ flex: 3, m: 2 }}>{settingsPage}</Box>
			</Box>
		</>
	);
};

export default SettingsPage;
