import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Box, SpeedDialIcon, TextField } from "@mui/material";
import BaseCollapse from "../SettingsCollapses/BaseCollapse";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";

const RolesTabSettings = ({ settings }) => {
	const [selectedRole, setSelectedRole] = useState({});
	const [name, setName] = useState("initial role name");

	// useEffect(() => {
	// 	setName(selectedRole.name);
	// }, [selectedRole]);

	if (!settings || !settings.orgName) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Roles</Typography>
			<Box height="65vh" sx={{ display: "flex", gap: 1 }}>
				<Box
					sx={{
						width: "45%",
						pt: 1,
						overflow: "auto",
					}}
				>
					<Typography variant="h6">insert graph here</Typography>
				</Box>
				<Box
					sx={{
						width: "45%",
						pt: 1,
						overflow: "auto",
					}}
				>
					<Typography variant="h6" sx={{ mb: 1 }}>
						Role Details:
					</Typography>
					<TextField
						label="Name"
						type="text"
						autoFocus
						fullWidth
						variant="standard"
						value={name}
						onChange={(e) => setName(e.target.value)}
						sx={{ mb: 2 }}
						InputProps={{ sx: { fontSize: "1.5rem" } }}
						InputLabelProps={{ sx: { fontSize: "1.5rem" } }}
					/>
					<BaseCollapse Icon={ShieldIcon} Label={"Permissions"}>
						<Typography>list permissions here w/ toggle switch</Typography>
					</BaseCollapse>
					<BaseCollapse Icon={PeopleIcon} Label={"Users"}>
						<Typography>list user chips here w/ delete button</Typography>
					</BaseCollapse>
				</Box>
			</Box>
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
