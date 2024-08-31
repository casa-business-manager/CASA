import React, { useCallback, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { getOrganizationInfo } from "../API/OrganizationAPI";
import {
	getCalendarData,
	createEvent,
	updateEvent,
	deleteEvent,
} from "../API/EventAPI";
import EventDialog from "./EventDialog";
import CurrentUserContext from "../Contexts/CurrentUserContext";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

// TODO: color events by org?
const BaseCalendar = ({ orgIds }) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
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

	// Call fetchData
	useEffect(() => {
		if (!currentUser) return;
		fetchData(loadedRanges.start.toISOString(), loadedRanges.end.toISOString());
	}, [currentUser, orgIds]);

	// Get organization people
	useEffect(() => {
		if (!orgIds) {
			return;
		}

		const fetchPeople = async () => {
			const orgInfoPromises = orgIds.map((orgId) => getOrganizationInfo(orgId));

			var newOrgInfoList = [];
			for (var i = 0; i < orgIds.length; i++) {
				const orgInfoPromise = orgInfoPromises[i];
				newOrgInfoList.push({
					orgId: orgIds[i],
					...(await orgInfoPromise),
				});
			}

			setOrgInfo(newOrgInfoList);
		};

		fetchPeople();
	}, [orgIds]);

	// Get events for a user in an org
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

	// Base function for both saving and editing an event, needing function and id
	const saveEvent = useCallback(
		(apiFunction, id) =>
			async (title, description, startTime, endTime, location, people) => {
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
							(event) => event.eventId !== createdEvent.eventId,
						);
						createdEvent.organization = {
							...createdEvent.organization,
							people: createdEvent.organization.users,
							name: createdEvent.organization.orgName,
						};
						return [
							...filterOutCurrentEvent,
							{
								...createdEvent,
								start: moment(createdEvent.start).local().toDate(), // Converting to date
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
			},
	);

	// function to create a new event given orgID
	const handleSaveEvent = useCallback(
		(orgId) => saveEvent(createEvent, orgId),
		[saveEvent],
	);

	// function to save an edited event
	const handleEditEvent = useCallback(
		(eventId) => saveEvent(updateEvent, eventId),
		[saveEvent],
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
	const handleDeleteEvent = useCallback(async (eventId) => {
		setDialogOpen(false);
		setTemporaryEvent(null);
		await deleteEvent(eventId);
		setEvents((prevEvents) =>
			prevEvents.filter((prevEvent) => prevEvent.eventId !== eventId),
		);
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

	// helper function for lazy loading to get calendar blocks
	function getCalendarBlock(date) {
		// find the first day of the month -> find the sunday before/on that
		const firstDayMonth = moment(date).startOf("month");
		const calendarBlockStart = moment(firstDayMonth).startOf("week");

		// 5 week block
		// todo: test with daylight savings time
		const calendarBlockEnd = moment(calendarBlockStart)
			.add(5.5, "weeks")
			.startOf("week");

		return {
			start: calendarBlockStart.toDate(),
			end: calendarBlockEnd.toDate(),
		};
	}

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
		<div className="BaseCalendar">
			<DragAndDropCalendar
				localizer={localizer}
				selectable
				onSelectEvent={handleSelectEvent}
				onSelectSlot={
					orgIds.length > 0 ? handleSelectSlot : console.log("no organizations")
				}
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
				style={{ flexGrow: 1, height: "100%" }}
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
				onSave={handleSaveEvent}
				onEdit={handleEditEvent}
				onDelete={handleDeleteEvent}
				initialEvent={menuEvent}
				initialIsEditing={editMenu}
				currentUser={currentUser}
				orgInfo={orgInfo}
			/>
		</div>
	);
};

export default BaseCalendar;
