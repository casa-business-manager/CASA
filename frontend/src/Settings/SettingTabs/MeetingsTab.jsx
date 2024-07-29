import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import VideocamIcon from "@mui/icons-material/Videocam";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const name = "Meetings";

const MeetingsTabSettings = ({ settings, availableMeetings }) => {
	const [checked, setChecked] = useState(settings);

	if (!settings || !availableMeetings) {
		return <>Loading</>;
	}

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleSave = async () => {
		// const newCheckedList = await someAPICall(checked);
		try {
			const newCheckedList = await checked;
			setChecked(newCheckedList);
		} catch {
			console.error("Save failed");
		}
	};

	return (
		<>
			<Typography variant="h5">Meetings</Typography>
			<List
				sx={{
					width: "100%",
					bgcolor: "background.paper",
				}}
			>
				{availableMeetings.map((service) => {
					const labelId = `checkbox-list-label-${service}`;

					return (
						<ListItem
							key={service}
							// secondaryAction={
							// 	<IconButton edge="end" aria-label="comments">
							// 		<LaunchIcon />
							// 	</IconButton>
							// }
							disablePadding
						>
							<ListItemButton onClick={handleToggle(service)}>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={checked.indexOf(service) !== -1}
										tabIndex={-1}
										disableRipple
										inputProps={{
											"aria-labelledby": labelId,
										}}
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={`${service}`} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</>
	);
};

const MeetingsTab = ({
	settings,
	availableMeetings,
	onClick,
	selected,
	indentLevel = 0,
}) => {
	return (
		<BaseTab
			Icon={VideocamIcon}
			Label={name}
			selected={selected}
			indentLevel={indentLevel}
			onClick={() =>
				onClick(
					"Meetings",
					<MeetingsTabSettings
						settings={settings}
						availableMeetings={availableMeetings}
					/>,
				)
			}
		/>
	);
};

export default MeetingsTab;
