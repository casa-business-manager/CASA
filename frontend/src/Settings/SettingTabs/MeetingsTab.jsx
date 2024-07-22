import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import VideocamIcon from "@mui/icons-material/Videocam";
import Typography from "@mui/material/Typography";

const MeetingsTabSettings = (settings) => {
	if (!settings || !settings.integrations) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Meetings</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				hello there
			</Typography>
			<Typography
				sx={{
					// Increment pl in multiples of 4
					pl: 4,
					mt: 2,
				}}
			>
				Integrations: {settings.integrations}
			</Typography>
		</>
	);
};

const MeetingsTab = ({ onClick, settings, selected, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={VideocamIcon}
			Label={"Meetings"}
			indentLevel={indentLevel}
			onClick={() => onClick("Meetings", MeetingsTabSettings(settings))}
			selected={selected === "Meetings"}
		/>
	);
};

export default MeetingsTab;
