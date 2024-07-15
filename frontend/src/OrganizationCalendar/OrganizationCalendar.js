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
import { getCalendarData, getCurrentUser, createEvent, updateEvent } from '../APIUtils/APIUtils';
import EventDialog from './EventDialog';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const OrganizationCalendar = () => {
  const { orgId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockTimes, setBlockTimes] = useState({ start: null, end: null });
  const [temporaryEvent, setTemporaryEvent] = useState(null);

  const handleSelectSlot = useCallback(
    ({ start, end }) => { 
      const fakeTempEventToKeepTheBoxOpen = {
        title: '',
        location: '',
        start: moment(start).local().toDate(),
        end: moment(end).local().toDate(),
        allDay: false,
        resource: '',
      };
      setTemporaryEvent(fakeTempEventToKeepTheBoxOpen);
      setBlockTimes({ start, end });
      setDialogOpen(true);
    },
    []
  );

  const handleSaveEvent = useCallback(
    async (title, location) => {
      if (title && location) {
        try {
          const currentUser = await getCurrentUser();
          const newEvent = {
            title,
            location,
            start: moment(blockTimes.start).format(),  // ISO time includes time zone so it is fine
            end: moment(blockTimes.end).format(),      // ISO time includes time zone so it is fine
            allDay: false,
            resource: "",
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
      }
    },
    [orgId, blockTimes, setEvents]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setTemporaryEvent(null);
  }, []);

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

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
          location: event.location,
          start: moment(event.start).local().toDate(),
          end: moment(event.end).local().toDate(),
          allDay: event.allDay,
          resource: event.resource,
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
      />
    </div>
  );
};

export default OrganizationCalendar;
