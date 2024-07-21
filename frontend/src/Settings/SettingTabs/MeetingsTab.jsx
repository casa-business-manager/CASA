import BaseTab from "./BaseTab";
import VideocamIcon from "@mui/icons-material/Videocam";

const MeetingsTab = ({ indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={VideocamIcon}
			Label={"Meetings"}
			indentLevel={indentLevel}
		/>
	);
};

export default MeetingsTab;
