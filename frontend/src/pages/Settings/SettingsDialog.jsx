import React, { useState, useEffect, useContext } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Box,
	Typography,
	IconButton,
} from "@mui/material";
import List from "@mui/material/List";
import OrganizationTab from "./SettingTabs/OrganizationTab";
import MeetingsTab from "./SettingTabs/MeetingsTab";
import IntegrationsCollapse from "./SettingsCollapses/IntegrationsCollapse";
import UserCollapse from "./SettingsCollapses/UserCollapse";
import MembersTab from "./SettingTabs/MembersTab";
import RolesTab from "./SettingTabs/RolesTab";
import { getOrganizationRoles } from "../../API/RoleAPI";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { CloseIcon } from "../../constants/icons";

// orgId may be null
const SettingsDialog = ({ dialogOpen, onClose, onSave, orgId }) => {
	const defaultComponent = (
		<Typography variant="h5">Select a setting</Typography>
	);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [selected, setSelected] = useState(-1);
	const [settingsPage, setSettingsPage] = useState(defaultComponent);
	const [orgSettings, setOrgSettings] = useState({});
	const [availableIntegrations, setAvailableIntegrations] = useState({});
	const [roleSettings, setRoleSettings] = useState({});

	// Always open to defaultComponent
	useEffect(() => {
		if (dialogOpen) {
			setSettingsPage(defaultComponent);
			setSelected(-1);
		}
	}, [dialogOpen]);

	// get settings if clicked
	useEffect(() => {
		const fetchOrganizationSettings = async () => {
			// TODO: Make real backend function
			// const settings = await SomeAPICallHere(orgId);

			// hard code returns for now
			const settings = {
				orgName: "org name",
				orgDescription: "org Description",
				orgLocation: "org Location",
				integrations: {
					meetings: ["Zoom"],
				},
			};
			setOrgSettings(settings);
		};

		const fetchRoleSettings = async () => {
			const roleSettings = await getOrganizationRoles(orgId);
			setRoleSettings(roleSettings);
		};

		const fetchAvailableIntegrations = async () => {
			// TODO: Make real backend function
			// const integrations = await SomeAPIOtherCallHere(orgId);

			// hard code returns for now
			const integrations = {
				meetings: ["Zoom", "Google Meet", "Microsoft Teams"],
			};
			setAvailableIntegrations(integrations);
		};

		if (dialogOpen) {
			fetchOrganizationSettings();
			fetchAvailableIntegrations();
			fetchRoleSettings();
		}
	}, [dialogOpen, orgId, settingsPage]);

	const handleTabClick = (tabName, SettingComponent) => {
		setSelected(tabName);
		setSettingsPage(SettingComponent);
	};

	// TODO: detect changes and warn if there are unsaved changes
	const onCloseWrapper = () => {
		onClose();
	};

	const onSaveWrapper = () => {
		onCloseWrapper();
		onSave();
	};

	if (!orgSettings.integrations || !availableIntegrations) {
		return <Dialog open={false}>Loading</Dialog>;
	}

	return (
		<Dialog
			open={dialogOpen}
			onClose={onCloseWrapper}
			fullWidth
			maxWidth="100%"
			PaperProps={{
				sx: {
					height: "80vh",
				},
			}}
			// fullScreen // Too dummy thicc
		>
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					Organization settings
					<IconButton onClick={onCloseWrapper}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent>
				<Box height="65vh" sx={{ display: "flex", gap: 1 }}>
					{/* Scrollable list of settings */}
					<List
						sx={{
							width: "22%",
							overflow: "auto",
							// looks ass with the light blue select color
							// bgcolor: "lightgray",
						}}
						component="nav"
						aria-labelledby="nested-list-subheader"
					>
						<OrganizationTab
							settings={orgSettings}
							onClick={handleTabClick}
							selected={selected}
						/>
						<UserCollapse>
							<MembersTab
								settings={orgSettings}
								orgId={orgId}
								onClick={handleTabClick}
								selected={selected}
							/>
							<RolesTab
								settings={roleSettings}
								user={currentUser}
								onClick={handleTabClick}
								selected={selected}
							/>
						</UserCollapse>
						<IntegrationsCollapse>
							<MeetingsTab
								settings={orgSettings.integrations.meetings}
								availableMeetings={availableIntegrations.meetings}
								onClick={handleTabClick}
								selected={selected}
							/>
						</IntegrationsCollapse>
					</List>

					{/* Settings page */}
					{/* If you need it to be scrollable, wrap your settings in a Box with overflow set to "auto" */}
					<Box sx={{ flex: 3, m: 2 }}>{settingsPage}</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
