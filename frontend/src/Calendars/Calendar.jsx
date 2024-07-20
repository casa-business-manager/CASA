import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
	getCalendarData,
	getCurrentUser,
	createEvent,
	updateEvent,
	deleteEvent,
} from "../APIUtils/APIUtils";
import EventDialog from "./EventDialog";
import { getUsersInOrganization } from "../APIUtils/APIUtils";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Calendar = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [temporaryEvent, setTemporaryEvent] = useState(null); // shows on the calendar
	const [menuEvent, setMenuEvent] = useState({}); // passed to the menu
	const [editMenu, setEditMenu] = useState(false); // passed to the menu
	const [orgPeople, setOrgPeople] = useState([]);
	const [loadedRanges, setLoadedRanges] = useState(
		getCalendarBlock(moment().toDate())
	);

	// Get user
	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const user = await getCurrentUser();
				setCurrentUser(user);
			} catch (error) {
				console.error("Error fetching current user:", error);
			}
		};

		fetchCurrentUser();
	}, []);

	// Call fetchData
	useEffect(() => {
		if (!currentUser) return;
		fetchData(
			loadedRanges.start.toISOString(),
			loadedRanges.end.toISOString()
		);
	}, [currentUser]);

	// Get organization people
	// parameterize: pass in list of org IDs
	useEffect(() => {
		const fetchPeople = async () => {
			const response = await getUsersInOrganization(orgId);
			const orgPeopleWithNames = response.map((user) => ({
				...user,
				fullName: `${user.firstName} ${user.lastName}`,
			}));
			setOrgPeople(orgPeopleWithNames);
		};

		fetchPeople();
	}, [orgId]);

	// Get events for a user in an org
	// store it in a list of events
	const fetchData = async (startDate = null, endDate = null) => {
		try {
			const calendarData = await getCalendarData(
				orgId,
				currentUser.id,
				startDate,
				endDate
			);
			const combinedEvents = [
				...events,
				...calendarData.events.map((event) => ({
					...event,
					start: moment(event.start).local().toDate(),
					end: moment(event.end).local().toDate(),
				})),
			];
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
			};
			setTemporaryEvent(fakeTempEventToKeepTheBoxOpen);
			setMenuEvent(fakeTempEventToKeepTheBoxOpen);
			setEditMenu(false);
			setDialogOpen(true);
		},
		[currentUser]
	);

	// Base function for both saving and editing an event
	// Will need ID of org to save to
	const saveEvent = useCallback(
		(apiFunction, id) =>
			async (
				title,
				description,
				startTime,
				endTime,
				location,
				people
			) => {
				if (!currentUser) return;

				const peopleIds = people.map((person) => person.id);

				try {
					const newEvent = {
						title,
						description,
						location,
						start: moment(startTime).format(), // ISO time includes time zone so it is fine
						end: moment(endTime).format(), // ISO time includes time zone so it is fine
						allDay: false,
						eventCreatorId: currentUser.id,
						eventAccessorIds: peopleIds,
					};

					const createdEvent = await apiFunction(id, newEvent);

					setEvents((prev) => {
						const filterOutCurrentEvent = prev.filter(
							(event) => event.eventId !== createdEvent.eventId
						);
						return [
							...filterOutCurrentEvent,
							{
								...createdEvent,
								start: moment(createdEvent.start)
									.local()
									.toDate(), // Converting to date
								end: moment(createdEvent.end).local().toDate(), // Converting to date
							},
						];
					});
				} catch (error) {
					console.error("Error creating event:", error);
				} finally {
					setDialogOpen(false);
					setTemporaryEvent(null);
				}
			}
	);

	// function to create a new event given orgID
	// can parameterize orgId like how eventId is done for edit
	const handleSaveEvent = useCallback(saveEvent(createEvent, orgId), [
		saveEvent,
	]);

	// function to save an edited event
	const handleEditEvent = useCallback(
		(eventId) => saveEvent(updateEvent, eventId),
		[saveEvent]
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

	// control dialog for deleting an event
	// May need to update backend to delete from user calendar
	const handleDeleteEvent = useCallback(async (eventId) => {
		setDialogOpen(false);
		setTemporaryEvent(null);
		await deleteEvent(eventId);
		setEvents((prevEvents) =>
			prevEvents.filter((prevEvent) => prevEvent.eventId !== eventId)
		);
	}, []);

	// drag event to on calendar
	const moveEvent = useCallback(
		async ({
			event,
			start,
			end,
			isAllDay: droppedOnAllDaySlot = false,
		}) => {
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
						: prevEvent
				)
			);
		},
		[setEvents]
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
						: prevEvent
				)
			);
		},
		[setEvents]
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
				loadedRanges.start.toISOString()
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
				lastDayBlock.end.toISOString()
			);
			setLoadedRanges((oldLoadedRange) => {
				oldLoadedRange.end = lastDayBlock.end;
				return oldLoadedRange;
			});
		}
	};

	// helper function for lazy loading to get calendar blocks
	function getCalendarBlock(date) {
		// find the first day of the month -> find the sunday before/on that
		const firstDayMonth = moment(date).startOf("month");
		const calendarBlockStart = moment(firstDayMonth).startOf("week");

		// 5 week block
		// todo: test with daylight savings time
		const calendarBlockEnd = moment(calendarBlockStart)
			.add(4, "weeks")
			.endOf("week");

		return {
			start: calendarBlockStart.toDate(),
			end: calendarBlockEnd.toDate(),
		};
	}

	// helper function to remove duplicated events (caused by hot reloads)
	function deleteDuplicates(list) {
		return list.filter(
			(item, pos) =>
				list.findIndex((x) => x.eventId === item.eventId) == pos
		);
	}

	// In case calendar is still waiting on API calls
	if (loading || !currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<div className="Calendar">
			<DragAndDropCalendar
				localizer={localizer}
				selectable
				onSelectEvent={handleSelectEvent}
				onSelectSlot={handleSelectSlot}
				events={deleteDuplicates(
					[...events, temporaryEvent]
						.filter(Boolean)
						.map((event) => ({
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
						}))
				)}
				defaultDate={moment().toDate()}
				defaultView={Views.WEEK}
				style={{ height: "100vh" }}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
				popup
				resizable
				onRangeChange={handleRangeChange}
				draggableAccessor={(event) =>
					event.eventCreator.id === currentUser.id
				}
			/>
			<EventDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				onSave={handleSaveEvent}
				onEdit={handleEditEvent}
				onDelete={handleDeleteEvent}
				initialEvent={menuEvent}
				initialIsEditing={editMenu}
				organizationId={orgId}
				currentUser={currentUser}
				knownPeople={orgPeople}
			/>
		</div>
	);
};

export default Calendar;
