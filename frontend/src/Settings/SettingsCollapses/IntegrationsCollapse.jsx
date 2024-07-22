import BaseCollapse from "./BaseCollapse";
import CableIcon from "@mui/icons-material/Cable";

const IntegrationsCollapse = ({ indentLevel = 0, children }) => {
	return (
		<BaseCollapse
			Icon={CableIcon}
			Label={"Integrations"}
			indentLevel={indentLevel}
			children={children}
		/>
	);
};

export default IntegrationsCollapse;
