import React, { useCallback, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { getCalendarData, updateEvent } from "../../API/EventAPI";
import EventDialog from "./EventDialog";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import OrganizationsContext from "../../contexts/OrganizationsContext";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const getCalendarBlock = (date) => {
	const firstDayMonth = moment(date).startOf("month");
	const calendarBlockStart = moment(firstDayMonth).startOf("week");
	const calendarBlockEnd = moment(calendarBlockStart)
		.add(5.5, "weeks")
		.startOf("week");
	return {
		start: calendarBlockStart.toDate(),
		end: calendarBlockEnd.toDate(),
	};
};

// TODO: color events by org?
const BaseCalendar = ({ orgIds }) => {
	const [currentUser, _] = useContext(CurrentUserContext);
	const [organizations, __] = useContext(OrganizationsContext);

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [temporaryEvent, setTemporaryEvent] = useState(null); // shows on the calendar
	const [menuEvent, setMenuEvent] = useState({}); // passed to the menu
	const [editMenu, setEditMenu] = useState(false); // passed to the menu
	const [orgInfo, setOrgInfo] = useState([]);
	const [loadedRanges, setLoadedRanges] = useState(
		getCalendarBlock(moment().toDate()),
	);

	// Window height for dynamic resizing
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	// Update height on window resize
	useEffect(() => {
		const handleResize = () => {
			setWindowHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Calculate the calendar height dynamically
	const calendarHeight = windowHeight - 80;

	// Fetch data when orgIds or currentUser changes
	useEffect(() => {
		if (!currentUser) return;
		fetchData(loadedRanges.start.toISOString(), loadedRanges.end.toISOString());
	}, [currentUser, orgIds]);

	// Get organization people
	useEffect(() => {
		if (!orgIds) {
			return;
		}

		// setOrgInfo(organizations.filter((org) => orgIds.includes(org.orgId)));
		setOrgInfo(
			orgIds.map((orgId) => organizations.find((org) => org.orgId === orgId)),
		);
	}, [orgIds]);

	// Get events for the orgs
	const fetchData = async (startDate = null, endDate = null) => {
		try {
			const calendarDataPromises = orgIds.map((orgId) =>
				getCalendarData(orgId, currentUser.id, startDate, endDate),
			);

			const combinedEvents = [...events];
			for (const orgCalendarData of calendarDataPromises) {
				const newEvents = (await orgCalendarData).events.map((event) => ({
					...event,
					start: moment(event.start).local().toDate(),
					end: moment(event.end).local().toDate(),
				}));
				const fixedNewEvents = newEvents.map((event) => {
					event.organization = {
						...event.organization,
						people: event.organization.users,
						name: event.organization.orgName,
					};
					return event;
				});
				combinedEvents.push(...fixedNewEvents);
			}

			const deduplicated = deleteDuplicates(combinedEvents);
			setEvents(deduplicated);
		} catch (error) {
			console.error("Error fetching calendar data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Open Create menu on a new time block
	const handleSelectSlot = useCallback(
		({ start, end }) => {
			if (!currentUser) return;

			const fakeTempEventToKeepTheBoxOpen = {
				title: "",
				location: "",
				start: moment(start).local().toDate(),
				end: moment(end).local().toDate(),
				allDay: false,
				description: "",
				eventCreator: currentUser,
				eventAccessors: [currentUser],
				organization: orgInfo[0], // default org to add it to
			};
			setTemporaryEvent(fakeTempEventToKeepTheBoxOpen);
			setMenuEvent(fakeTempEventToKeepTheBoxOpen);
			setEditMenu(false);
			setDialogOpen(true);
		},
		[currentUser],
	);

	// control dialog closing
	const handleCloseDialog = useCallback(() => {
		setDialogOpen(false);
		setTemporaryEvent(null);
	}, []);

	// control dialog for editing an event
	const handleSelectEvent = useCallback((event) => {
		setMenuEvent(event);
		setEditMenu(true);
		setDialogOpen(true);
	}, []);

	// drag event to on calendar
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
								start: moment(modifiedEvent.start).toDate(),
								end: moment(modifiedEvent.end).toDate(),
							}
						: prevEvent,
				),
			);
		},
		[setEvents],
	);

	// resize event on calendar
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
								start: moment(modifiedEvent.start).toDate(),
								end: moment(modifiedEvent.end).toDate(),
							}
						: prevEvent,
				),
			);
		},
		[setEvents],
	);

	// handler for going beyond the current range of lazily loaded events
	const handleRangeChange = async (range) => {
		const startDate = moment(range.start || range[0])
			.startOf("day")
			.toDate();
		const endDate = moment(range.end || range[range.length - 1])
			.endOf("day")
			.toDate();

		if (startDate < loadedRanges.start) {
			const firstDayBlock = getCalendarBlock(startDate);
			await fetchData(
				firstDayBlock.start.toISOString(),
				loadedRanges.start.toISOString(),
			);
			setLoadedRanges((oldLoadedRange) => {
				oldLoadedRange.start = firstDayBlock.start;
				return oldLoadedRange;
			});
		}

		if (endDate > loadedRanges.end) {
			const lastDayBlock = getCalendarBlock(endDate);
			await fetchData(
				loadedRanges.end.toISOString(),
				lastDayBlock.end.toISOString(),
			);
			setLoadedRanges((oldLoadedRange) => {
				oldLoadedRange.end = lastDayBlock.end;
				return oldLoadedRange;
			});
		}
	};

	// helper function to remove duplicated events (caused by hot reloads)
	function deleteDuplicates(list) {
		return list.filter(
			(item, pos) => list.findIndex((x) => x.eventId === item.eventId) === pos,
		);
	}

	// In case calendar is still waiting on API calls
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
				onSelectEvent={handleSelectEvent}
				onSelectSlot={orgIds.length > 0 && handleSelectSlot}
				events={deleteDuplicates(
					[...events, temporaryEvent].filter(Boolean).map((event) => ({
						eventId: event.eventId,
						title: event.title,
						description: event.description,
						location: event.location,
						start: moment(event.start).local().toDate(),
						end: moment(event.end).local().toDate(),
						allDay: event.allDay,
						organization: event.organization,
						eventCreator: event.eventCreator,
						eventAccessors: event.eventAccessors,
					})),
				)}
				defaultDate={moment().toDate()}
				defaultView={Views.WEEK}
				style={{ height: calendarHeight }} // Dynamically set height
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
				popup
				resizable
				onRangeChange={handleRangeChange}
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
