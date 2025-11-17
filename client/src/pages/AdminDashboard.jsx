// client/src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const requests = JSON.parse(localStorage.getItem("pendingRequests") || "[]");
    setPendingRequests(requests);

    fetchLowAttendance();
    // eslint-disable-next-line
  }, [refreshKey]);

  async function fetchLowAttendance() {
    try {
      const res = await fetch("/api/admin/low-attendance-students");
      const data = await res.json();
      setLowAttendanceStudents(data || {});
    } catch (e) {
      console.error("Failed to fetch low attendance students:", e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const approveRequest = async (id) => {
    const approved = pendingRequests.find(r => r.id === id);
    if (!approved) return alert("Request not found");

    const payload = {
      id: approved.id,
      name: approved.name,
      email: approved.email,
      role: approved.role,
      className: approved.className || "",
      password: approved.password || "changeMe123"
    };

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Approval failed");
      }
      // remove from pendingRequests in localStorage and state
      const updated = pendingRequests.filter(r => r.id !== id);
      setPendingRequests(updated);
      localStorage.setItem("pendingRequests", JSON.stringify(updated));

      // refresh low attendance and users
      setRefreshKey(k => k + 1);
      alert("Approved and added to backend");
    } catch (e) {
      console.error("Approve failed:", e);
      alert("Approve failed: " + e.message);
    }
  };

  const rejectRequest = (id) => {
    const updated = pendingRequests.filter(r => r.id !== id);
    setPendingRequests(updated);
    localStorage.setItem("pendingRequests", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <nav className="bg-neutral-800/50 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Pending Requests</p>
            <p className="text-3xl font-bold mt-2">{pendingRequests.length}</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Teachers</p>
            <p className="text-3xl font-bold mt-2">—</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Students</p>
            <p className="text-3xl font-bold mt-2">—</p>
          </div>
          <div className="bg-neutral-900/40 rounded-xl p-6">
            <p className="text-gray-400 text-sm">System Status</p>
            <p className="text-3xl font-bold mt-2 text-green-400">Active</p>
          </div>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Registration Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-neutral-700/40 rounded-lg p-6 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{req.name}</p>
                    <p className="text-gray-400">{req.email}</p>
                    <p className="text-sm text-gray-400 mt-1">Role: <span className="capitalize">{req.role}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => approveRequest(req.id)} className="px-6 py-2 bg-green-600 rounded-lg">Approve</button>
                    <button onClick={() => rejectRequest(req.id)} className="px-6 py-2 bg-red-600 rounded-lg">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Students with Low Attendance (&lt; 75%)</h2>
          {Object.keys(lowAttendanceStudents).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No students with low attendance</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(lowAttendanceStudents).map(cls => (
                <div key={cls} className="p-4 bg-neutral-900/30 rounded-lg border">
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">Class {cls}</h3>
                  <div className="space-y-3">
                    {lowAttendanceStudents[cls].map((s, idx) => (
                      <div key={idx} className="bg-neutral-800/40 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">{s.name}</div>
                            <div className="text-sm text-gray-400">{s.email}</div>
                            <div className="text-sm text-red-400 mt-1">Attendance: {s.attendancePercentage}% ({s.presentDays}/{s.totalDays})</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
