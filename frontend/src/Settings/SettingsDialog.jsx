import React, { useState, useEffect, Fragment } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

import OrganizationTab from "./SettingTabs/OrganizationTab";
import MeetingsTab from "./SettingTabs/MeetingsTab";
import IntegrationsCollapse from "./SettingsCollapses/IntegrationsCollapse";

// orgId may be null
const SettingsDialog = ({ dialogOpen, onClose, onSave, orgSettings }) => {
	const [open, setOpen] = useState(true);

	const handleClick = () => {
		setOpen(!open);
	};

	const onCloseWrapper = () => {
		onClose();
	};

	const onSaveWrapper = () => {
		onCloseWrapper();
		onSave();
	};

	// TODO: replace with any awaited components
	if (dialogOpen && !orgSettings.services) {
		return <Dialog open={false} />;
	}

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

			<DialogContent>
				<Box height="65vh" sx={{ display: "flex", gap: 1 }}>
					<List
						sx={{
							width: "100%",
							maxWidth: 360,
							bgcolor: "background.paper",
						}}
						component="nav"
						aria-labelledby="nested-list-subheader"
					>
						<OrganizationTab />
						<IntegrationsCollapse>
							<MeetingsTab />
						</IntegrationsCollapse>
					</List>
					{/* TODO: change this to the actual setting page */}
					<Box sx={{ flex: 3 }}>
						<Typography>Settings page goes here</Typography>
						<Typography>
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
						</Typography>
					</Box>
				</Box>
			</DialogContent>

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
