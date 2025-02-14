import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '../types';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}
const CustomCalendar: React.FC<CalendarProps> = ({ events, onSelectEvent, onSelectSlot }) => {
    const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
        let style = {
            backgroundColor: '#3b82f6', // Default color
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };

        if (event.type === 'article') {
            style.backgroundColor = '#22c55e'; // Green for articles
        } else if (event.type === 'pin') {
            style.backgroundColor = '#ef4444'; // Red for pins
        }
        return {
            style: style
        };
    };


  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      selectable
      eventPropGetter={eventStyleGetter}

    />
  );
};

export default CustomCalendar;
