import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "../Settings/SettingsDialog";
import { IconButton } from "@mui/material";

const SettingsButton = ({ orgId }) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [orgSettings, setOrgSettings] = useState({});

	useEffect(() => {
		const fetchOrganizationSettings = async () => {
			const settings = await (() => ({
				services: ["zoom", "ms", "gMeets"],
			}))();
			setOrgSettings(settings);
		};

		fetchOrganizationSettings();
	}, [orgId]);

	// Maybe change so we only fetch settings when clicked?
	const handleButtonClick = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleDialogSave = () => {};

	return (
		<>
			<IconButton onClick={handleButtonClick}>
				<SettingsIcon className="icon" />
			</IconButton>

			<SettingsDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				onSave={handleDialogSave}
				orgSettings={orgSettings}
			/>
		</>
	);
};

export default SettingsButton;
