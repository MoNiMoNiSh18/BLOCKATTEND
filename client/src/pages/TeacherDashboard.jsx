// client/src/pages/TeacherDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/teacher/students");
      const data = await res.json();
      setStudents(data || []);
      const cls = Array.from(new Set((data || []).map(s => s.className).filter(Boolean)));
      setClasses(cls);
      if (cls.length) setSelectedClass(cls[0]);
      const map = {};
      (data || []).forEach(s => { map[s.email] = true; });
      setAttendanceMap(map);
    } catch (e) {
      console.error("Failed to load students", e);
    }
  }

  function handleToggle(email) {
    setAttendanceMap(prev => ({ ...prev, [email]: !prev[email] }));
  }

  function markAll(value) {
    const visible = students.filter(s => !selectedClass || s.className === selectedClass);
    const map = { ...attendanceMap };
    visible.forEach(s => map[s.email] = value);
    setAttendanceMap(map);
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    const visible = students.filter(s => !selectedClass || s.className === selectedClass);
    try {
      for (const s of visible) {
        const payload = {
          teacherEmail: user?.email || "",
          subject,
          className: s.className || selectedClass || "",
          studentEmail: s.email,
          date,
          present: !!attendanceMap[s.email]
        };
        const res = await fetch("/api/teacher/mark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Mark failed");
        }
      }
      setMessage("Attendance submitted successfully.");
      // refresh local students & attendance info
      await fetchStudents();
    } catch (e) {
      console.error("Submit failed", e);
      setMessage("Failed to submit attendance: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  const visibleStudents = students.filter(s => !selectedClass || s.className === selectedClass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <nav className="bg-neutral-800/50 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm text-gray-400">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Students Taught</p>
            <p className="text-3xl font-bold mt-2">{students.length}</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Classes Assigned</p>
            <p className="text-3xl font-bold mt-2">{classes.length}</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Attendance Marked</p>
            <p className="text-3xl font-bold mt-2">—</p>
          </div>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-300">Class</label>
              <select value={selectedClass} onChange={(e)=>setSelectedClass(e.target.value)} className="w-full mt-2 p-2 bg-neutral-700 rounded">
                <option value="">All Classes</option>
                {classes.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300">Subject</label>
              <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" className="w-full mt-2 p-2 bg-neutral-700 rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Date</label>
              <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full mt-2 p-2 bg-neutral-700 rounded" />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={()=>markAll(true)} className="px-4 py-2 bg-green-600 rounded">Mark All Present</button>
            <button onClick={()=>markAll(false)} className="px-4 py-2 bg-red-600 rounded">Mark All Absent</button>
          </div>

          <div className="max-h-96 overflow-y-auto border border-neutral-700 rounded p-4 mb-4">
            {visibleStudents.length === 0 ? <p className="text-gray-400">No students for selected class.</p> : (
              <div className="space-y-3">
                {visibleStudents.map(s => (
                  <div key={s.email} className="flex items-center justify-between p-2 bg-neutral-900/40 rounded">
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-sm text-gray-400">{s.email} • {s.className}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-300">Present</label>
                      <input type="checkbox" checked={!!attendanceMap[s.email]} onChange={()=>handleToggle(s.email)} className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white font-semibold">{loading ? 'Submitting...' : 'Submit Attendance'}</button>
          </div>
          {message && <div className="mt-4 text-sm text-gray-300">{message}</div>}
        </div>
      </div>
    </div>
  );
}
