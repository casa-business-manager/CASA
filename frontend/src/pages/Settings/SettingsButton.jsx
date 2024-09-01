import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "../Settings/SettingsDialog";
import { IconButton } from "@mui/material";

const SettingsButton = ({ orgId }) => {
	const [dialogOpen, setDialogOpen] = useState(false);

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
				dialogOpen={dialogOpen}
				onClose={handleDialogClose}
				onSave={handleDialogSave}
				orgId={orgId}
			/>
		</>
	);
};

export default SettingsButton;
