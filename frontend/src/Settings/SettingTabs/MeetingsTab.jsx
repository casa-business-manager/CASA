import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import VideocamIcon from "@mui/icons-material/Videocam";
import Typography from "@mui/material/Typography";

const MeetingsTabSettings = (meetingSettings) => {
	if (!meetingSettings || !meetingSettings.integrations) {
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
				Integrations: {meetingSettings.integrations}
			</Typography>
		</>
	);
};

const MeetingsTab = ({ onClick, orgId, selected, indentLevel = 0 }) => {
	const [meetingSettings, setMeetingSettings] = useState({});

	useEffect(() => {
		const fetchOrganizationSettings = async () => {
			// TODO: Make real backend function
			// const settings = await SomeAPICallHere(orgId);

			// hard code returns for now
			const settings = {
				integrations: ["Zoom", "Google Meet", "Microsoft Teams"],
			};
			setMeetingSettings(settings);
		};

		fetchOrganizationSettings();
	}, [orgId]);

	return (
		<BaseTab
			Icon={VideocamIcon}
			Label={"Meetings"}
			indentLevel={indentLevel}
			onClick={() =>
				onClick("Meetings", MeetingsTabSettings(meetingSettings))
			}
			selected={selected === "Meetings"}
		/>
	);
};

export default MeetingsTab;
