import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const mLocalizer = momentLocalizer(moment);


export default function UserCalendar({
  localizer = mLocalizer,
  ...props
}) {
  // ensure there are no undefined accesses in props
  const {
    events = [],
    defaultDate = moment().toDate(),
    defaultView = Views.MONTH,
    showDemoLink = 0,

  } = props;

  return (
    <div className="UserCalendar">
      <Calendar
        title="User Calendar"
        events={events}
        defaultDate={defaultDate}
        defaultView={defaultView}
        localizer={localizer}
        resizable
        style={{ height: '100vh' }}
        {...props}
      />
    </div>
  );
}

UserCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
  events: PropTypes.array, 
  defaultDate: PropTypes.instanceOf(Date), 
  defaultView: PropTypes.string, 
};

