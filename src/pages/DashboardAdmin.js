import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import id from "date-fns/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { id };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

export default function DashboardAdmin() {
  const [events, setEvents] = useState([]);
  const [permintaan, setPermintaan] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [mentorMap, setMentorMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/kelas"),
      api.get("/mentors"),
      api.get("/jadwal-sesi"),
      api.get("/permintaan-jadwal"),
    ])
      .then(([kelasRes, mentorRes, jadwalRes, permintaanRes]) => {
        const kelasObj = {};
        kelasRes.data.forEach((k) => (kelasObj[k.id] = k.nama));
        setKelasMap(kelasObj);
        const mentorObj = {};
        mentorRes.data.forEach((m) => (mentorObj[m.id] = m.nama));
        setMentorMap(mentorObj);
        const mapped = jadwalRes.data.map((item) => ({
          id: item.id,
          title: `Sesi ${item.sesi} - ${kelasObj[item.kelas_id] || "Kelas"} (${mentorObj[item.mentor_id] || "Mentor"})`,
          start: new Date(item.tanggal + "T" + item.jam_mulai),
          end: new Date(item.tanggal + "T" + item.jam_selesai),
        }));
        setEvents(mapped);
        setPermintaan(permintaanRes.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data dari backend");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/permintaan-jadwal/${id}`, { status: "approved" });
      toast.success("Permintaan di-approve!");
      setPermintaan((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
    } catch {
      toast.error("Gagal approve permintaan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600">{events.length}</span>
            <span className="text-gray-500">Total Sesi Terjadwal</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">{Object.keys(mentorMap).length}</span>
            <span className="text-gray-500">Mentor Aktif</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-yellow-600">{permintaan.filter(p => p.status === "pending").length}</span>
            <span className="text-gray-500">Permintaan Pending</span>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Kalender Jadwal Sesi</h2>
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
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Permintaan Jadwal (Approval)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User</th>
                <th className="p-2">Kelas</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Sesi</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {permintaan.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{p.user_id}</td>
                  <td className="p-2">{kelasMap[p.kelas_id]}</td>
                  <td className="p-2">{mentorMap[p.mentor_id]}</td>
                  <td className="p-2">{p.tanggal}</td>
                  <td className="p-2">{p.sesi}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2">
                    {p.status === "pending" && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleApprove(p.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 