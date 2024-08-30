import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Avatar,
	Box,
	Card,
	Divider,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChatIcon from "@mui/icons-material/Chat";
import EventIcon from "@mui/icons-material/Event";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TodayIcon from "@mui/icons-material/Today";
import { getCalendarData } from "../API/EventAPI";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import { getMMDDHHMM12hr } from "../util/date";
import EventDialog from "../Calendars/EventDialog";
import OrganizationsContext from "../Contexts/OrganizationsContext";

const getOrgInfo = (organization) => {
	return {};
};

const OrganizationHome = ({}) => {
	const { orgId } = useParams();
	const [currentUser, _] = useContext(CurrentUserContext);
	const [organizations, __] = useContext(OrganizationsContext);

	const [taskNotifications, setTaskNotifications] = useState([
		"task1",
		"task2",
	]);
	const [messageNotifications, setMessageNotifications] = useState([
		"message1",
		"message2",
	]);
	/// Event notifications for [today, 7 days from now] fetched from the backend
	const [eventNotifications, setEventNotifications] = useState([]);

	const [openEventDialog, setOpenEventDialog] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState({});

	useEffect(() => {
		if (!currentUser) {
			return;
		}

		const fetchNotifications = async () => {
			try {
				const currentDate = new Date();
				const oneWeekFromNow = new Date();
				oneWeekFromNow.setDate(currentDate.getDate() + 7);

				const response = await getCalendarData(
					orgId,
					currentUser.id,
					currentDate.toISOString(),
					oneWeekFromNow.toISOString(),
				);
				setEventNotifications(
					response.events.sort((a, b) => new Date(a.start) - new Date(b.start)),
				);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, [currentUser]);

	/// Text should be a ListItemText component
	const NotificationCard = ({ icon, text, onClick }) => {
		return (
			<Card
				onClick={onClick}
				sx={{
					width: "90%",
					"&:hover": {
						cursor: "pointer",
						backgroundColor: "#f5f5f5",
					},
				}}
			>
				<ListItem>
					<ListItemAvatar>
						<Avatar>{icon}</Avatar>
					</ListItemAvatar>
					{text}
				</ListItem>
			</Card>
		);
	};

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
			<Box
				sx={{
					display: "grid",
					gap: 2,
					justifyItems: "center",
				}}
			>
				{children}
			</Box>
		</Box>
	);

	return (
		<>
			<Box display="flex" sx={{ flexGrow: 1, height: "100%", my: 1 }}>
				<Column title={"Upcoming Tasks"} icon={<AssignmentTurnedInIcon />}>
					{taskNotifications.length === 0 ? (
						<Typography>No tasks!</Typography>
					) : (
						// TODO: Make notification cards for tasks
						taskNotifications.map((task, index) => (
							<NotificationCard
								key={index}
								icon={<TaskAltIcon />}
								text={<ListItemText primary={task} secondary={task} />}
							/>
						))
					)}
					TODO: Make project management and integrate notifications here
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
						messageNotifications.map((messageNotification, index) => (
							<NotificationCard
								key={index}
								text={
									<ListItemText
										primary={messageNotification}
										secondary={messageNotification}
									/>
								}
							/>
						))
					)}
					TODO: Make messages and integrate notifications here
				</Column>

				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.5)" }}
				/>

				<Column title={"Upcoming Events"} icon={<EventIcon />}>
					{eventNotifications.length === 0 ? (
						<Typography>No upcoming events</Typography>
					) : (
						eventNotifications.map((event, index) => (
							<NotificationCard
								key={index}
								icon={<TodayIcon />}
								text={
									<ListItemText
										primary={event.title}
										secondary={`${getMMDDHHMM12hr(new Date(event.start))} - ${getMMDDHHMM12hr(new Date(event.end))}`}
									/>
								}
								onClick={() => {
									setSelectedEvent(event);
									setOpenEventDialog(true);
								}}
							/>
						))
					)}
				</Column>
			</Box>

			<EventDialog
				open={openEventDialog}
				onClose={() => setOpenEventDialog(false)}
				initialEvent={selectedEvent}
				initialIsEditing={true}
				setEvents={setEventNotifications}
				orgInfo={[organizations.find((org) => org.orgId === orgId)]}
			/>
		</>
	);
};

export default OrganizationHome;
