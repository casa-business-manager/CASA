import BaseCollapse from "./BaseCollapse";
import { IntegrationIcon } from "../../../constants/icons";

const IntegrationsCollapse = ({ indentLevel = 0, children }) => {
	return (
		<BaseCollapse
			Icon={IntegrationIcon}
			Label={"Integrations"}
			indentLevel={indentLevel}
			children={children}
		/>
	);
};

export default IntegrationsCollapse;
