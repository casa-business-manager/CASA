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

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const OrganizationCalendar = () => {
  const { orgId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockTimes, setBlockTimes] = useState({ start: null, end: null });
  const [temporaryEvent, setTemporaryEvent] = useState(null); // shows on the calendar
  const [menuEvent, setMenuEvent] = useState({}); // passed to the menu
  const [editMenu, setEditMenu] = useState(false); // passed to the menu

  const handleSelectSlot = useCallback(
    ({ start, end }) => { 
      const fakeTempEventToKeepTheBoxOpen = {
        title: '',
        location: '',
        start: moment(start).local().toDate(),
        end: moment(end).local().toDate(),
        allDay: false,
        description: '',
      };
      setTemporaryEvent(fakeTempEventToKeepTheBoxOpen);
      setMenuEvent(fakeTempEventToKeepTheBoxOpen);
      setEditMenu(false);
      setDialogOpen(true);
      setBlockTimes({ start, end });
    },
    []
  );

  const handleSaveEvent = useCallback(
    async (title, description, startTime, endTime, location) => {
      try {
        const currentUser = await getCurrentUser();
        const newEvent = {
          title,
          description: description,
          location,
          start: moment(startTime).format(),  // ISO time includes time zone so it is fine
          end: moment(endTime).format(),      // ISO time includes time zone so it is fine
          allDay: false,
          eventCreatorId: currentUser.id,
          eventAccessorIds: [currentUser.id]
        };

        const createdEvent = await createEvent(orgId, newEvent);
        setEvents((prev) => 
          [
            ...prev, 
            {
              ...createdEvent,
              start: moment(createdEvent.start).local().toDate(),  // Converting to local time
              end: moment(createdEvent.end).local().toDate()      // Converting to local time
            }
          ]
        );
      } catch (error) {
        console.error('Error creating event:', error);
      } finally {
        setDialogOpen(false);
        setTemporaryEvent(null);
      }
    },
    [orgId, blockTimes, setEvents]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setTemporaryEvent(null);
  }, []);

  // TODO: Need to find a way to make it so "save" in this menu makes the right call...
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
            ?
             { 
              ...modifiedEvent,
              start: moment(modifiedEvent.start).toDate(),
              end: moment(modifiedEvent.end).toDate(),
            }
            :
             prevEvent
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
            ?
             { 
              ...modifiedEvent,
              start: moment(modifiedEvent.start).toDate(),
              end: moment(modifiedEvent.end).toDate(),
            }
            :
             prevEvent
        )
      );
    },
    [setEvents]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        const calendarData = await getCalendarData(orgId, currentUser.id);
        setEvents(calendarData.events.map(event => ({
          ...event,
          start: moment(event.start).local().toDate(),
          end: moment(event.end).local().toDate()
        })));
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="OrganizationCalendar">
      <DragAndDropCalendar
        localizer={localizer}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        events={[...events, temporaryEvent].filter(Boolean).map(event => ({
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
        }))}
        defaultDate={moment().toDate()}
        defaultView={Views.MONTH}
        style={{ height: '100vh' }}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        popup
        resizable
      />
      <EventDialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={menuEvent}
        initialIsEditing={editMenu}
      />
    </div>
  );
};

export default OrganizationCalendar;
