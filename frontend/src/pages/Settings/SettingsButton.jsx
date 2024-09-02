import { useState } from "react";
import SettingsDialog from "../Settings/SettingsDialog";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "../../constants/icons";

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
