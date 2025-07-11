import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function DashboardUser({ user }) {
  const [jadwal, setJadwal] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [tanggal, setTanggal] = useState("");
  const [sesi, setSesi] = useState("1");
  const [kelasId, setKelasId] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/kelas"),
      api.get("/jadwal-sesi"),
    ])
      .then(([kelasRes, jadwalRes]) => {
        const kelasObj = {};
        kelasRes.data.forEach((k) => (kelasObj[k.id] = k.nama));
        setKelasMap(kelasObj);
        const filtered = jadwalRes.data.filter((item) => item.user_id === user.id);
        setJadwal(filtered);
        setLoading(false);
      });
  }, [user.id]);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post("/permintaan-jadwal", {
        user_id: user.id,
        kelas_id: kelasId,
        tanggal,
        sesi,
        status: "pending",
      });
      toast.success("Permintaan jadwal dikirim!");
    } catch {
      toast.error("Gagal mengirim permintaan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Dashboard Siswa</h1>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Jadwal Pribadi</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading jadwal...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Kelas</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Sesi</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map((j) => (
                  <tr key={j.id} className="border-b">
                    <td className="p-2">{kelasMap[j.kelas_id]}</td>
                    <td className="p-2">{j.tanggal}</td>
                    <td className="p-2">{j.sesi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Request Sesi Tambahan/Privat</h2>
          <form onSubmit={handleRequest} className="space-y-2">
            <div>
              <label className="block text-gray-700 mb-1">Kelas</label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={kelasId}
                onChange={(e) => setKelasId(e.target.value)}
                required
              >
                <option value="">Pilih Kelas</option>
                {Object.entries(kelasMap).map(([id, nama]) => (
                  <option key={id} value={id}>{nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 p-2 rounded"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Sesi</label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={sesi}
                onChange={(e) => setSesi(e.target.value)}
                required
              >
                <option value="1">Sesi 1</option>
                <option value="2">Sesi 2</option>
                <option value="3">Sesi 3</option>
                <option value="4">Sesi 4</option>
                <option value="5">Sesi 5</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Kirim Permintaan
            </button>
          </form>
        </div>
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">History Materi (Dummy)</h2>
          <div className="text-gray-400">Fitur history materi akan diimplementasikan.</div>
        </div>
      </div>
    </div>
  );
} 