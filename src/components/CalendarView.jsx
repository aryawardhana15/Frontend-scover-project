import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import id from 'date-fns/locale/id';

const locales = {
  'id': id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarView({ events, onSelectEvent, onSelectSlot }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        popup
        views={['month', 'week', 'day']}
      />
    </div>
  );
} 