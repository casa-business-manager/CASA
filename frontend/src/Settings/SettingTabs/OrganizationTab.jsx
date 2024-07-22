import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Typography from "@mui/material/Typography";

const OrganizationTabSettings = (settings) => {
	if (!settings || !settings.orgName) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Organization</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Ian can you do this part? I think its just to edit the name,
				description, location, users. Maybe whatever else you thing
				would be good here. I did most of the data propagation so if you
				could just make these into TextField or whatever, and integrate
				it with backend, that would be good.
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Name: {settings.orgName}
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Description: {settings.orgDescription}
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Location: {settings.orgLocation}
			</Typography>
		</>
	);
};

const OrganizationTab = ({ settings, onClick, selected, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={ApartmentIcon}
			Label={"Organization"}
			indentLevel={indentLevel}
			onClick={() =>
				onClick("Organization", OrganizationTabSettings(settings))
			}
			selected={selected === "Organization"}
		/>
	);
};

export default OrganizationTab;
