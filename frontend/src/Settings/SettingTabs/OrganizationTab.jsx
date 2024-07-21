import BaseTab from "./BaseTab";
import ApartmentIcon from "@mui/icons-material/Apartment";

const OrganizationTab = ({ indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={ApartmentIcon}
			Label={"Organization"}
			indentLevel={indentLevel}
		/>
	);
};

export default OrganizationTab;
