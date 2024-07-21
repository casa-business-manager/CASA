import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Typography from "@mui/material/Typography";

const OrganizationTabSettings = (orgSettings) => {
	if (!orgSettings || !orgSettings.orgName) {
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
				Name: {orgSettings.orgName}
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Description: {orgSettings.orgDescription}
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Location: {orgSettings.orgLocation}
			</Typography>
		</>
	);
};

const OrganizationTab = ({ orgId, onClick, selected, indentLevel = 0 }) => {
	const [orgSettings, setOrgSettings] = useState({});

	useEffect(() => {
		const fetchOrganizationSettings = async () => {
			// TODO: Make real backend function
			// const settings = await SomeAPICallHere(orgId);

			// hard code returns for now
			const settings = {
				orgName: "org name",
				orgDescription: "org Description",
				orgLocation: "org Location",
			};
			setOrgSettings(settings);
		};

		fetchOrganizationSettings();
	}, [orgId]);

	return (
		<BaseTab
			Icon={ApartmentIcon}
			Label={"Organization"}
			indentLevel={indentLevel}
			onClick={() =>
				onClick("Organization", OrganizationTabSettings(orgSettings))
			}
			selected={selected === "Organization"}
		/>
	);
};

export default OrganizationTab;
