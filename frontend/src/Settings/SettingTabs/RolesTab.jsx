import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const RolesTabSettings = ({ settings }) => {
	if (!settings || !settings.orgName) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Roles</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				TODO
			</Typography>
		</>
	);
};

const RolesTab = ({ settings, onClick, selected, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={AccountTreeIcon}
			Label={"Roles"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={<RolesTabSettings settings={settings} />}
		/>
	);
};

export default RolesTab;
