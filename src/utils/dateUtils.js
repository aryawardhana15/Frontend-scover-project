// Helper functions untuk perhitungan tanggal dan minggu (Frontend)

// Hitung minggu ke berapa dari tanggal - KONSISTEN DENGAN BACKEND
export function getWeekNumber(date) {
  const dateObj = new Date(date.getTime());
  dateObj.setHours(0, 0, 0, 0);

  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const days = Math.floor((dateObj - startOfYear) / (24 * 60 * 60 * 1000));
  
  // Logika ini HARUS SAMA PERSIS dengan yang di backend
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  return weekNumber;
}

// Hitung minggu ke berapa dari tanggal (menggunakan standar ISO - minggu dimulai dari Senin)
// DEPRECATED: Gunakan getWeekNumber() yang konsisten dengan backend
export function getWeekNumberISO(date) {
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

// Debug function untuk membandingkan perhitungan minggu
export function debugWeekCalculation(date) {
  const backendStyle = getWeekNumber(date);
  const isoStyle = getWeekNumberISO(date);
  
  console.log('🔍 [WEEK DEBUG] Date:', date.toISOString().split('T')[0]);
  console.log('🔍 [WEEK DEBUG] Backend style (used):', backendStyle);
  console.log('🔍 [WEEK DEBUG] ISO style (deprecated):', isoStyle);
  console.log('🔍 [WEEK DEBUG] Difference:', backendStyle - isoStyle);
  
  return {
    date: date.toISOString().split('T')[0],
    backendStyle,
    isoStyle,
    difference: backendStyle - isoStyle
  };
} 