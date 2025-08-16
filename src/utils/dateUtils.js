// Helper functions untuk perhitungan tanggal dan minggu (Frontend)

// Hitung minggu ke berapa dari tanggal (menggunakan standar ISO - minggu dimulai dari Senin)
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Ambil nama hari dari tanggal
export function getHariFromDate(date) {
  const hariArray = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return hariArray[date.getDay()];
}

// Ambil range minggu (tanggal awal dan akhir)
export function getWeekRange(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const weekStart = new Date(simple);
  weekStart.setDate(simple.getDate() - ((dow + 6) % 7)); // Senin
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return [weekStart, weekEnd];
}

// Get current week number
export function getCurrentWeekNumber() {
  return getWeekNumber(new Date());
} 