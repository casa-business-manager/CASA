import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCalendarData, getCurrentUser, createEvent } from '../APIUtils/APIUtils';

const localizer = momentLocalizer(moment);

const OrganizationCalendar = () => {
  const { orgId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSelectSlot = useCallback(
    async ({ start, end }) => {
      const title = window.prompt('New Event Name');
      const location = window.prompt('Event Location');
      if (title && location) {
        try {
          const currentUser = await getCurrentUser();
          const newEvent = {
            title,
            location,
            start: moment(start).format(),  // ISO time includes time zone so it is fine
            end: moment(end).format(),      // ISO time includes time zone so it is fine
            allDay: false,
            resource: "",
            eventCreatorId: currentUser.id,
            eventAccessorIds: [currentUser.id]
          };

          const createdEvent = await createEvent(orgId, newEvent);

          setEvents((prev) => [...prev, {
            ...createdEvent,
            start: moment(createdEvent.start).local().toDate(),  // Converting to local time
            end: moment(createdEvent.end).local().toDate()      // Converting to local time
          }]);
        } catch (error) {
          console.error('Error creating event:', error);
        }
      }
    },
    [orgId, setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
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
      <Calendar
        localizer={localizer}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        events={events.map(event => ({
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
      />
    </div>
  );
};

export default OrganizationCalendar;
