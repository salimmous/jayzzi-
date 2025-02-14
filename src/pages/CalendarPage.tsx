import React from 'react';
import CustomCalendar from '../components/Calendar.tsx'; // .tsx extension
import { useCalendarStore } from '../store/calendarStore.ts'; // .ts extension
import { addDays, startOfDay } from 'date-fns';

function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarStore();

  const handleSelectEvent = (event: any) => {
    // Handle event click (e.g., show details, edit)
    alert(`Clicked event: ${event.title}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Handle slot selection (e.g., add a new event)
    const title = prompt('Enter event title:');
    if (title) {
      addEvent({
        id: String(Math.random()), // Generate a unique ID
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        type: 'article', // Or 'pin', based on user selection
        status: 'scheduled',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Content Calendar</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <CustomCalendar
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </div>
    </div>
  );
}

export default CalendarPage;
