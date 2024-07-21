import React, { useState, useEffect, Fragment } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Box,
	Typography,
} from "@mui/material";
import List from "@mui/material/List";

import OrganizationTab from "./SettingTabs/OrganizationTab";
import MeetingsTab from "./SettingTabs/MeetingsTab";
import IntegrationsCollapse from "./SettingsCollapses/IntegrationsCollapse";

// orgId may be null
const SettingsDialog = ({ dialogOpen, onClose, onSave, orgId }) => {
	const defaultComponent = (
		<Typography variant="h5">Select a setting</Typography>
	);
	const [settingsPage, setSettingsPage] = useState(defaultComponent);

	useEffect(() => {
		dialogOpen && setSettingsPage(defaultComponent);
	}, [dialogOpen]);

	const onCloseWrapper = () => {
		onClose();
	};

	const onSaveWrapper = () => {
		onCloseWrapper();
		onSave();
	};

	return (
		<Dialog
			open={dialogOpen}
			onClose={onCloseWrapper}
			fullWidth
			maxWidth="xl"
			PaperProps={{
				sx: {
					height: "80vh",
				},
			}}
			// fullScreen // Too dummy thicc
		>
			<DialogTitle>Organization settings</DialogTitle>

			{/* Scrollable list of settings */}
			<DialogContent>
				<Box height="65vh" sx={{ display: "flex", gap: 1 }}>
					<List
						sx={{
							width: "100%",
							maxWidth: 360,
							overflow: "auto",
						}}
						component="nav"
						aria-labelledby="nested-list-subheader"
					>
						<OrganizationTab
							orgId={orgId}
							onClick={setSettingsPage}
						/>
						<IntegrationsCollapse>
							<MeetingsTab
								orgId={orgId}
								onClick={setSettingsPage}
							/>
						</IntegrationsCollapse>
					</List>

					<Box sx={{ flex: 3, m: 2, overflow: "auto" }}>
						{settingsPage}
					</Box>
				</Box>
			</DialogContent>

			{/* Settings page */}
			<DialogActions>
				<Button onClick={onCloseWrapper} color="primary">
					Cancel
				</Button>
				<Button // Only show if there is something to save. Move into the DialogContent?
					onClick={onSaveWrapper}
					color="primary"
					variant="contained"
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SettingsDialog;
