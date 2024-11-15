import React, { useCallback, useState, useEffect, useContext } from "react";
import moment from "moment";
import "moment-timezone";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
	getCalendarData,
	updateEvent,
	createEvent,
	deleteEvent,
} from "../../API/EventAPI";
import { fetchCalendarDeltaEvents } from "../../API/GraphAPI";
import EventDialog from "./EventDialog";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import OrganizationsContext from "../../contexts/OrganizationsContext";
import { MS_ACCESS_TOKEN } from "../../constants/login";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const BaseCalendar = ({ orgIds }) => {
	const [currentUser] = useContext(CurrentUserContext);
	const [organizations] = useContext(OrganizationsContext);

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [temporaryEvent, setTemporaryEvent] = useState(null);
	const [menuEvent, setMenuEvent] = useState({});
	const [editMenu, setEditMenu] = useState(false);
	const [deltaLink, setDeltaLink] = useState(null);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [orgInfo, setOrgInfo] = useState([]);

	const startDateTime = moment().subtract(1, "month").toISOString();
	const endDateTime = moment().add(1, "month").toISOString();

	// Set organization info based on orgIds prop
	useEffect(() => {
		setOrgInfo(
			orgIds.map((orgId) => organizations.find((org) => org.orgId === orgId)),
		);
	}, [orgIds, organizations]);

	const initializeDeltaSync = async () => {
		const token = sessionStorage.getItem(MS_ACCESS_TOKEN);
		const { events: initialEvents, deltaLink: initialDeltaLink } =
			await fetchCalendarDeltaEvents(token, startDateTime, endDateTime);
		setDeltaLink(initialDeltaLink);
		syncEventsWithBackend(initialEvents);
	};

	const syncDeltaEvents = async () => {
		if (!deltaLink) return;

		const token = sessionStorage.getItem(MS_ACCESS_TOKEN);
		const { events: deltaEvents, deltaLink: newDeltaLink } =
			await fetchCalendarDeltaEvents(
				token,
				startDateTime,
				endDateTime,
				deltaLink,
			);
		setDeltaLink(newDeltaLink);
		syncEventsWithBackend(deltaEvents);
	};

	// Fetch initial events and set up periodic syncs
	useEffect(() => {
		if (currentUser) {
			initializeDeltaSync();
			const syncInterval = setInterval(() => syncDeltaEvents(), 300000);
			return () => clearInterval(syncInterval);
		}
	}, [currentUser]);

	// Ensure proper date-time parsing for events
	const parseMicrosoftDateTime = (dateTimeObj) => {
		if (dateTimeObj.dateTime && dateTimeObj.timeZone) {
			return moment.tz(dateTimeObj.dateTime, dateTimeObj.timeZone).toDate();
		} else {
			return new Date(dateTimeObj.dateTime); // Fallback for cases without timeZone
		}
	};

	const syncEventsWithBackend = async (incomingEvents) => {
		try {
			// Fetch backend events for all orgs
			const backendEventsResponses = await Promise.all(
				orgIds.map((orgId) => getCalendarData(orgId, currentUser.id)),
			);

			// Flatten the events from backend responses
			const combinedBackendEvents = backendEventsResponses.flatMap(
				({ events }) => events,
			);

			// Deduplicate events (prioritize backend data over delta updates)
			const deduplicateEvents = (list) => {
				const seen = new Map();
				return list.filter((event) => {
					const key = event.microsoftEventId || event.eventId; // Use Microsoft ID or fallback to event ID
					if (!key) return false; // Skip invalid entries
					if (seen.has(key)) return false; // Remove duplicates
					seen.set(key, event);
					return true;
				});
			};

			// Prepare lists for processing
			const processedIncomingEvents = incomingEvents.map((msEvent) => ({
				eventId: msEvent.id, // Ensure a local ID exists
				microsoftEventId: msEvent.id,
				title: msEvent.subject,
				description: msEvent.bodyPreview || "",
				location: msEvent.location?.displayName || "",
				start: parseMicrosoftDateTime(msEvent.start),
				end: parseMicrosoftDateTime(msEvent.end),
				allDay: msEvent.isAllDay,
				eventCreatorId: msEvent.organizer?.emailAddress?.address,
				eventAccessorIds:
					msEvent.attendees?.map((att) => att.emailAddress.address) || [],
			}));

			// Merge backend and incoming events, then deduplicate
			const allEvents = deduplicateEvents([
				...combinedBackendEvents,
				...processedIncomingEvents,
			]);

			// Ensure events are correctly formatted for state updates
			const formattedEvents = allEvents.map((event) => ({
				...event,
				start: new Date(event.start),
				end: new Date(event.end),
			}));

			// Update state with the deduplicated events
			setEvents(formattedEvents);
		} catch (error) {
			console.error("Error syncing events with backend:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSelectSlot = useCallback(
		({ start, end }) => {
			if (!currentUser) return;

			const fakeTempEvent = {
				title: "",
				location: "",
				start: moment(start).local().toDate(),
				end: moment(end).local().toDate(),
				allDay: false,
				description: "",
				eventCreator: currentUser,
				eventAccessors: [currentUser],
				organization: orgInfo[0],
			};
			setTemporaryEvent(fakeTempEvent);
			setMenuEvent(fakeTempEvent);
			setEditMenu(false);
			setDialogOpen(true);
		},
		[currentUser, orgInfo],
	);

	const handleCloseDialog = useCallback(() => {
		setDialogOpen(false);
		setTemporaryEvent(null);
	}, []);

	const handleSelectEvent = useCallback((event) => {
		setMenuEvent(event);
		setEditMenu(true);
		setDialogOpen(true);
	}, []);

	const moveEvent = useCallback(
		async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
			const { allDay } = event;
			if (!allDay && droppedOnAllDaySlot) {
				event.allDay = true;
			} else if (allDay && !droppedOnAllDaySlot) {
				event.allDay = false;
			}

			event.start = start;
			event.end = end;
			const modifiedEvent = await updateEvent(event.eventId, event);

			setEvents((prevEvents) =>
				prevEvents.map((prevEvent) =>
					prevEvent.eventId === modifiedEvent.eventId
						? {
								...modifiedEvent,
								start: new Date(modifiedEvent.start),
								end: new Date(modifiedEvent.end),
							}
						: prevEvent,
				),
			);
		},
		[setEvents],
	);

	const resizeEvent = useCallback(
		async ({ event, start, end }) => {
			event.start = start;
			event.end = end;
			const modifiedEvent = await updateEvent(event.eventId, event);

			setEvents((prevEvents) =>
				prevEvents.map((prevEvent) =>
					prevEvent.eventId === modifiedEvent.eventId
						? {
								...modifiedEvent,
								start: new Date(modifiedEvent.start),
								end: new Date(modifiedEvent.end),
							}
						: prevEvent,
				),
			);
		},
		[setEvents],
	);

	useEffect(() => {
		const handleResize = () => setWindowHeight(window.innerHeight);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const calendarHeight = windowHeight - 80;

	if (loading || !currentUser || !orgIds) {
		return <div>Loading...</div>;
	}

	return (
		<div
			style={{
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<DragAndDropCalendar
				localizer={localizer}
				selectable
				events={events}
				defaultDate={moment().toDate()}
				defaultView={Views.WEEK}
				style={{ height: calendarHeight }}
				onSelectEvent={handleSelectEvent}
				onSelectSlot={handleSelectSlot}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
				popup
				resizable
				draggableAccessor={(event) =>
					event.eventCreator && event.eventCreator.id === currentUser.id
				}
			/>
			<EventDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				initialEvent={menuEvent}
				initialIsEditing={editMenu}
				orgInfo={orgInfo}
				setEvents={setEvents}
				setDialogOpen={setDialogOpen}
				setTemporaryEvent={setTemporaryEvent}
			/>
		</div>
	);
};

export default BaseCalendar;
