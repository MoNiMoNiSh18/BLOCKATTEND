// client/src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecords, setModalRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (user && user.email) fetchAttendance(user.email);
    // eslint-disable-next-line
  }, [user]);

  async function fetchAttendance(email) {
    try {
      const resp = await fetch(`/api/student/attendance/${encodeURIComponent(email)}`);
      const data = await resp.json();
      // convert to map by date
      const map = {};
      (data || []).forEach(r => {
        if (r.date) map[r.date] = r.present;
      });
      setAttendanceMap(map);
    } catch (e) {
      console.error("Failed to fetch attendance", e);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function generateCalendarDays() {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        day: i,
        date: dateStr,
        present: attendanceMap[dateStr] !== undefined ? attendanceMap[dateStr] : null,
      });
    }
    return days;
  }

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const totalDays = Object.keys(attendanceMap).length;
  const presentDays = Object.values(attendanceMap).filter(Boolean).length;
  const attendancePercent = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <nav className="bg-neutral-800/50 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-gray-400">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Days Present</p>
            <p className="text-3xl font-bold mt-2">{presentDays}</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Days Absent</p>
            <p className="text-3xl font-bold mt-2">{Math.max(0, totalDays - presentDays)}</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Attendance %</p>
            <p className="text-3xl font-bold mt-2 text-blue-400">{attendancePercent}%</p>
          </div>
        </div>

        {attendancePercent < 75 && (
          <div className="mb-8 p-4 bg-red-900/40 border-2 border-red-600 rounded-lg flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-1">Attendance Alert</h3>
              <p className="text-red-300">Your attendance is below 75% ({attendancePercent}%). Please contact your teacher/admin.</p>
            </div>
          </div>
        )}

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Attendance Calendar</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="px-4 py-2 bg-slate-700 rounded">← Prev</button>
              <span className="px-4 py-2 bg-slate-700 rounded">{monthYear}</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="px-4 py-2 bg-slate-700 rounded">Next →</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center font-bold text-gray-400 py-2">{d}</div>)}

            {calendarDays.map((dayObj, idx) => {
              if (dayObj === null) return <div key={idx} className="aspect-square"><div className="w-full h-full bg-neutral-900 rounded-lg"></div></div>;
              const content = (
                <div className={`w-full h-full rounded-lg flex items-center justify-center font-bold cursor-pointer
                  ${dayObj.present === null ? "bg-neutral-700 text-gray-400" : dayObj.present ? "bg-gradient-to-br from-green-600 to-green-700" : "bg-gradient-to-br from-red-600 to-red-700"}`}>
                  {dayObj.day}
                </div>
              );
              return (
                <div key={idx} className="aspect-square" onClick={async () => {
                  if (!user?.email) return;
                  try {
                    const resp = await fetch(`/api/student/attendance/${encodeURIComponent(user.email)}`);
                    const data = await resp.json();
                    const recs = (data || []).filter(r => r.date === dayObj.date);
                    setModalRecords(recs);
                    setSelectedDate(dayObj.date);
                    setModalOpen(true);
                  } catch (e) {
                    console.error('Failed to fetch attendance records', e);
                  }
                }}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-600 rounded" /> <span className="text-gray-300">Present</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-600 rounded" /> <span className="text-gray-300">Absent</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-700 rounded" /> <span className="text-gray-300">No record</span></div>
        </div>

      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg w-full max-w-lg p-6 border border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Attendance for {selectedDate}</h3>
              <button onClick={()=>setModalOpen(false)} className="text-2xl">&times;</button>
            </div>
            {modalRecords.length === 0 ? (
              <p className="text-gray-400">No attendance record found for this date.</p>
            ) : (
              <div className="space-y-3">
                {modalRecords.map((r, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900/40 rounded">
                    <div className="font-semibold">Subject: {r.subject || 'N/A'}</div>
                    <div className="text-sm text-gray-400">Class: {r.className || 'N/A'}</div>
                    <div className="text-sm text-gray-400">Teacher: {r.teacherEmail || 'N/A'}</div>
                    <div className="mt-2">Status: {r.present ? <span className="text-green-400">Present</span> : <span className="text-red-400">Absent</span>}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
