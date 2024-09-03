import { Box, Button, TextField } from "@mui/material";
import { OrganizationIcon } from "../../../constants/icons";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { updateOrganization } from "../../../API/OrganizationAPI";

const OrganizationTabSettings = ({ organization, setOrganization }) => {
	const [orgName, setOrgName] = useState(organization.orgName);
	const [orgDescription, setOrgDescription] = useState(
		organization.orgDescription,
	);
	const [orgLocation, setOrgLocation] = useState(organization.orgLocation);

	const [changesMade, setChangesMade] = useState(false);

	const handleChange = (setter) => {
		return (e) => {
			setter(e.target.value);
			setChangesMade(true);
		};
	};

	const handleUpdateOrganization = async (updatedOrg) => {
		try {
			const data = await updateOrganization(updatedOrg);
		} catch (error) {
			console.error("Error updating organization:", error);
		}
	};

	const handleClickSave = () => {
		const updatedOrg = {
			...organization,
			orgName,
			orgDescription,
			orgLocation,
		};

		setOrganization((oldOrganization) => updatedOrg);
		handleUpdateOrganization(updatedOrg);
		setChangesMade(false);
	};

	if (!organization || !organization.orgName) {
		return <>Loading</>;
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<Typography variant="h5">Organization</Typography>
			<TextField
				variant="standard"
				label="Name"
				value={orgName}
				onChange={handleChange(setOrgName)}
				sx={{ mt: 2 }}
			/>
			<TextField
				variant="standard"
				label="Description"
				value={orgDescription}
				onChange={handleChange(setOrgDescription)}
				sx={{ mt: 2 }}
			/>
			<TextField
				variant="standard"
				label="Location"
				value={orgLocation}
				onChange={handleChange(setOrgLocation)}
				sx={{ mt: 2 }}
			/>
			<Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
				{changesMade && (
					<Button variant="contained" color="primary" onClick={handleClickSave}>
						Save
					</Button>
				)}
			</Box>
		</Box>
	);
};

const OrganizationTab = ({
	organization,
	setOrganization,
	onClick,
	selected,
	indentLevel = 0,
}) => {
	return (
		<BaseTab
			Icon={OrganizationIcon}
			Label={"Organization"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={
				<OrganizationTabSettings
					organization={organization}
					setOrganization={setOrganization}
				/>
			}
		/>
	);
};

export default OrganizationTab;
