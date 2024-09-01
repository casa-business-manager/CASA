import BaseCollapse from "./BaseCollapse";
import PeopleIcon from "@mui/icons-material/People";

const UserCollapse = ({ indentLevel = 0, children }) => {
	return (
		<BaseCollapse
			Icon={PeopleIcon}
			Label={"User Management"}
			indentLevel={indentLevel}
			children={children}
		/>
	);
};

export default UserCollapse;
