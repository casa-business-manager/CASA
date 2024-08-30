import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChatIcon from "@mui/icons-material/Chat";
import EventIcon from "@mui/icons-material/Event";

const OrganizationHome = ({}) => {
	const { orgId } = useParams();

	const [taskNotifications, setTaskNotifications] = useState([1, 2]);
	const [messageNotifications, setMessageNotifications] = useState([1, 2]);

	const Column = ({ title, icon, children }) => (
		<Box flex={1} align="center">
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 1,
				}}
			>
				{icon}
				<Typography variant="h5">{title}</Typography>
			</Box>
			<Divider
				variant="middle"
				sx={{ my: 2, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.5)" }}
			/>
			{children}
		</Box>
	);

	return (
		<>
			<Box display="flex" sx={{ flexGrow: 1, height: "100%", my: 2 }}>
				<Column title={"Upcoming Tasks"} icon={<AssignmentTurnedInIcon />}>
					{taskNotifications.length === 0 ? (
						<Typography>No tasks!</Typography>
					) : (
						// TODO: Make notification cards for tasks
						taskNotifications.map((task) => <Typography>{task}</Typography>)
					)}
				</Column>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.5)" }}
				/>
				<Column title={"New Messages"} icon={<ChatIcon />}>
					{messageNotifications.length === 0 ? (
						<Typography>No new messages</Typography>
					) : (
						// TODO: Make notification cards for tasks
						messageNotifications.map((messageNotification) => (
							<Typography>{messageNotification}</Typography>
						))
					)}
				</Column>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.5)" }}
				/>
				<Column title={"Upcoming Events"} icon={<EventIcon />}>
					<>Events go here</>
				</Column>
			</Box>
		</>
	);
};

export default OrganizationHome;
