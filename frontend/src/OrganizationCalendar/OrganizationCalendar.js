import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom'
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
            start: start.toISOString(),
            end: end.toISOString(),
            allDay: false,
            eventCreator: currentUser.id,
            eventAccessors: [currentUser]
          };

          const createdEvent = await createEvent(orgId, newEvent);
          setEvents((prev) => [...prev, { ...createdEvent, start: new Date(createdEvent.start), end: new Date(createdEvent.end) }]);
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
  )

  useEffect(() => {
    const fetchData = async () => {
        try {
            const currentUser = await getCurrentUser();
            const calendarData = await getCalendarData(orgId, currentUser.id);
            setEvents(calendarData.events);
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
          start: new Date(event.start),
          end: new Date(event.end),
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

OrganizationCalendar.propTypes = {
};

export default OrganizationCalendar;
