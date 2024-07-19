import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { getCalendarData, getCurrentUser, createEvent, updateEvent, deleteEvent } from '../APIUtils/APIUtils';
import EventDialog from './EventDialog';
import { getUsersInOrganization } from '../APIUtils/APIUtils';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const OrganizationCalendar = () => {
  const { orgId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockTimes, setBlockTimes] = useState({ start: null, end: null });
  const [temporaryEvent, setTemporaryEvent] = useState(null); // shows on the calendar
  const [menuEvent, setMenuEvent] = useState({}); // passed to the menu
  const [editMenu, setEditMenu] = useState(false); // passed to the menu
  const [orgPeople, setOrgPeople] = useState([]);
  const [loadedRanges, setLoadedRanges] = useState(getCalendarBlock(moment().toDate()));

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchData(loadedRanges.start.toISOString(), loadedRanges.end.toISOString());
  }, [orgId, currentUser]);
  
  useEffect(() => {
    const fetchPeople = async () => {
      const response = await getUsersInOrganization(orgId);
      const orgPeopleWithNames = response.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }));
      setOrgPeople(orgPeopleWithNames);
    }

    fetchPeople();
  }, [orgId]); 

  const fetchData = async (startDate=null, endDate=null) => {
    try {
      const calendarData = await getCalendarData(orgId, currentUser.id, startDate, endDate);
      const combinedEvents = [
        ...events, 
        ...calendarData.events.map(event => (
          {
            ...event,
            start: moment(event.start).local().toDate(),
            end: moment(event.end).local().toDate()
          }
        ))
      ];
      const deduplicated = deleteDuplicates(combinedEvents);
      setEvents(deduplicated);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      if (!currentUser) return;

      const fakeTempEventToKeepTheBoxOpen = {
        title: '',
        location: '',
        start: moment(start).local().toDate(),
        end: moment(end).local().toDate(),
        allDay: false,
        description: '',
        eventCreator: currentUser,
        eventAccessors: [currentUser]
      };
      setTemporaryEvent(fakeTempEventToKeepTheBoxOpen);
      setMenuEvent(fakeTempEventToKeepTheBoxOpen);
      setEditMenu(false);
      setDialogOpen(true);
      setBlockTimes({ start, end });
    },
    [currentUser]
  );

  const saveEvent = (apiFunction, id) => 
    async (title, description, startTime, endTime, location, people) => {
      if (!currentUser) return;

      const peopleIds = people.map(person => person.id);

      try {
        const newEvent = {
          title,
          description,
          location,
          start: moment(startTime).format(),  // ISO time includes time zone so it is fine
          end: moment(endTime).format(),      // ISO time includes time zone so it is fine
          allDay: false,
          eventCreatorId: currentUser.id,
          eventAccessorIds: peopleIds
        };

        const createdEvent = await apiFunction(id, newEvent);

        setEvents((prev) => {
            const filterOutCurrentEvent = prev.filter(event => event.eventId !== createdEvent.eventId);
            return [
              ...filterOutCurrentEvent, 
              {
                ...createdEvent,
                start: moment(createdEvent.start).local().toDate(),  // Converting to date
                end: moment(createdEvent.end).local().toDate()      // Converting to date
              }
            ];
          }
        );
      } catch (error) {
        console.error('Error creating event:', error);
      } finally {
        setDialogOpen(false);
        setTemporaryEvent(null);
      }
    }

  const handleSaveEvent = useCallback(
    saveEvent(createEvent, orgId), 
    [blockTimes]
  );

  const handleEditEvent = useCallback(
    (eventId) => saveEvent(updateEvent, eventId), 
    [blockTimes]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setTemporaryEvent(null);
  }, []);

  const handleSelectEvent = useCallback(
    (event) => {
      setMenuEvent(event);
      setEditMenu(true);
      setDialogOpen(true);
    },
    []
  );

  const handleDeleteEvent = useCallback(async (eventId) => {
    setDialogOpen(false);
    setTemporaryEvent(null);
    await deleteEvent(eventId);
    setEvents((prevEvents) => prevEvents.filter(prevEvent => prevEvent.eventId !== eventId));
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

      setEvents(prevEvents => 
        prevEvents.map(prevEvent => 
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

  const resizeEvent = useCallback(
    async ({ event, start, end }) => {
      event.start = start;
      event.end = end;
      const modifiedEvent = await updateEvent(event.eventId, event);

      setEvents(prevEvents => 
        prevEvents.map(prevEvent => 
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

  const handleRangeChange = async (range) => {
      const startDate = moment(range.start || range[0]).startOf('day').toDate();
      const endDate = moment(range.end || range[range.length - 1]).endOf('day').toDate();

      if (startDate < loadedRanges.start) {
        const firstDayBlock = getCalendarBlock(startDate);
        console.log("handleRangeChange firstDayBlock", firstDayBlock.start.toISOString())
        console.log("handleRangeChange firstDayBlock type", typeof(firstDayBlock.start.toISOString()))
        await fetchData(firstDayBlock.start.toISOString(), loadedRanges.start.toISOString());
        setLoadedRanges(oldLoadedRange => {
          oldLoadedRange.start = firstDayBlock.start;
          return oldLoadedRange;
        });
      }

      if (endDate > loadedRanges.end) {
        const lastDayBlock = getCalendarBlock(endDate);
        await fetchData(loadedRanges.end.toISOString(), lastDayBlock.end.toISOString());
        setLoadedRanges(oldLoadedRange => {
          oldLoadedRange.end = lastDayBlock.end;
          return oldLoadedRange;
        });
      }
  }
  
  function getCalendarBlock (date) {
    // find the first day of the month -> find the sunday before/on that
    const firstDayMonth = moment(date).startOf('month');
    
    // 5 week block
    // todo: test with daylight savings time
    const calendarBlockStart = moment(firstDayMonth).startOf('week');
    const calendarBlockEnd = moment(calendarBlockStart).add(4, 'weeks').endOf('week');

    return {start: calendarBlockStart.toDate(), end: calendarBlockEnd.toDate()};
  }

  function deleteDuplicates(list) {
    return list.filter((item, pos) => list.findIndex(x => x.eventId === item.eventId) == pos);
  }

  if (loading || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="OrganizationCalendar">
      <DragAndDropCalendar
        localizer={localizer}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        events={deleteDuplicates([...events, temporaryEvent].filter(Boolean).map(event => ({
          eventId: event.eventId,
          title: event.title,
          description: event.description,
          location: event.location,
          start: moment(event.start).local().toDate(),
          end: moment(event.end).local().toDate(),
          allDay: event.allDay,
          organization: event.organization,
          eventCreator: event.eventCreator,
          eventAccessors: event.eventAccessors
        })))}
        defaultDate={moment().toDate()}
        defaultView={Views.WEEK}
        style={{ height: '100vh' }}
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

export default OrganizationCalendar;

