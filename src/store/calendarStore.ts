import { create } from 'zustand';
import { CalendarEvent } from '../types';
import { persist } from 'zustand/middleware';
import { addDays, startOfDay } from 'date-fns';

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => CalendarEvent | undefined;
}

// Mock data for the calendar
const today = startOfDay(new Date());
const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Test Article Event',
    start: today,
    end: addDays(today, 1),
    type: 'article',
    status: 'scheduled',
    articleId: 'test-article-1',
  },
  {
    id: 'event-2',
    title: 'Test Pin Event',
    start: addDays(today, 2),
    end: addDays(today, 3),
    type: 'pin',
    status: 'draft',
    pinId: 'test-pin-1',
  },
];

export const useCalendarStore = create<CalendarStore>()(
    persist(
        (set, get) => ({
            events: mockEvents, // Initialize with mock data
            addEvent: (event) => set((state) => ({
                events: [...state.events, event],
            })),
            updateEvent: (id, event) =>
                set((state) => ({
                    events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
                })),
            deleteEvent: (id) => set((state) => ({
                events: state.events.filter((e) => e.id !== id),
            })),
            getEvent: (id) => get().events.find((e) => e.id === id),
        }),
        {
            name: 'calendar-storage', // unique name
        }

    )
);
