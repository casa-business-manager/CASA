import BaseTab from "./BaseTab";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Typography from "@mui/material/Typography";

const OrganizationTabSettings = ({}) => {
	return (
		<>
			<Typography variant="h5">Organization</Typography>
			<Typography
				sx={{
					// Increment in multiples of 4
					pl: 4,
				}}
			>
				Ian can you do this part? I think its just to edit the name,
				description, location, users. Maybe whatever else you thing
				would be good here.
			</Typography>
		</>
	);
};

const OrganizationTab = ({ onClick, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={ApartmentIcon}
			Label={"Organization"}
			indentLevel={indentLevel}
			onClick={() => onClick(OrganizationTabSettings)}
		/>
	);
};

export default OrganizationTab;
