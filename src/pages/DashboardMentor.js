import { useEffect, useState } from "react";
import api from "../api/axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import id from "date-fns/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { id };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

export default function DashboardMentor({ user }) {
  const [events, setEvents] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/kelas"),
      api.get("/jadwal-sesi"),
    ])
      .then(([kelasRes, jadwalRes]) => {
        const kelasObj = {};
        kelasRes.data.forEach((k) => (kelasObj[k.id] = k.nama));
        setKelasMap(kelasObj);
        const mapped = jadwalRes.data
          .filter((item) => item.mentor_id === user.id)
          .map((item) => ({
            id: item.id,
            title: `Sesi ${item.sesi} - ${kelasObj[item.kelas_id] || "Kelas"}`,
            start: new Date(item.tanggal + "T" + item.jam_mulai),
            end: new Date(item.tanggal + "T" + item.jam_selesai),
          }));
        setEvents(mapped);
        setLoading(false);
      });
  }, [user.id]);

  const handleInputAvailability = () => {
    alert("Fitur input/ubah availability mentor (akan diimplementasikan)");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-green-800">Dashboard Mentor</h1>
        <button
          onClick={handleInputAvailability}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Input/Ubah Availability
        </button>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Kalender Jadwal Mengajar</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading jadwal...</div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              popup
              views={["month", "week", "day"]}
            />
          )}
        </div>
      </div>
    </div>
  );
} 