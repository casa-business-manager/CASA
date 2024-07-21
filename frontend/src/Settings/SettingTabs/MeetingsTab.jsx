import BaseTab from "./BaseTab";
import VideocamIcon from "@mui/icons-material/Videocam";
import Typography from "@mui/material/Typography";

const MeetingsTabSettings = ({}) => {
	return (
		<>
			<Typography variant="h5">Meetings</Typography>
			<Typography
				sx={{
					// Increment in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				fuck
			</Typography>
		</>
	);
};

const MeetingsTab = ({ onClick, orgId, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={VideocamIcon}
			Label={"Meetings"}
			indentLevel={indentLevel}
			onClick={() => onClick(MeetingsTabSettings)}
		/>
	);
};

export default MeetingsTab;
