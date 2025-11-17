import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerType, setRegisterType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects: "",
    classes: "",
    className: "",
  });

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: registerType,
      ...(registerType === "teacher" && {
        subjects: formData.subjects.split(",").map(s => s.trim()),
        classes: formData.classes.split(",").map(c => c.trim()),
      }),
      ...(registerType === "student" && { className: formData.className }),
      status: "pending",
      requestDate: new Date().toLocaleDateString(),
    };

    const requests = JSON.parse(localStorage.getItem("pendingRequests") || "[]");
    requests.push(newRequest);
    localStorage.setItem("pendingRequests", JSON.stringify(requests));

    setShowRegisterModal(false);
    setRegisterType(null);
    setFormData({ name: "", email: "", password: "", subjects: "", classes: "", className: "" });
    alert("✓ Registration request submitted! Admin will review it soon.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <div className="text-center py-20 px-4">
        <div className="mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">BlockAttend</h1>
          <p className="text-gray-400 text-lg font-light">Smart Attendance Management System</p>
        </div>
        
        <p className="text-gray-500 mb-16">Select your role to continue</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Link to="/admin-login" className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-10 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 duration-300">
            <h2 className="text-2xl font-bold mb-2 text-white">Admin</h2>
            <p className="text-blue-100">Manage & Approve</p>
          </Link>

          <Link to="/teacher-login" className="group bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 p-10 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-green-500/50 duration-300">
            <h2 className="text-2xl font-bold mb-2 text-white">Teacher</h2>
            <p className="text-green-100">Mark Attendance</p>
          </Link>

          <Link to="/student-login" className="group bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 p-10 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 duration-300">
            <h2 className="text-2xl font-bold mb-2 text-white">Student</h2>
            <p className="text-purple-100">View Records</p>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">New User?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setRegisterType("teacher"); setShowRegisterModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-semibold transition"
            >
              Register as Teacher
            </button>
            <button
              onClick={() => { setRegisterType("student"); setShowRegisterModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition"
            >
              Register as Student
            </button>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md border border-neutral-700">
            <div className={`bg-gradient-to-r ${registerType === "teacher" ? "from-green-600 to-green-700" : "from-purple-600 to-purple-700"} px-8 py-6 flex justify-between items-center`}>
              <h2 className="text-2xl font-bold">Register as {registerType === "teacher" ? "Teacher" : "Student"}</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-2xl">&times;</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="p-8 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              {registerType === "teacher" ? (
                <>
                  <input
                    type="text"
                    placeholder="Subjects (comma separated)"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Classes (comma separated)"
                    value={formData.classes}
                    onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Class Name (e.g., 5A)"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  required
                />
              )}
              <div className="flex gap-3 pt-4">
                <button type="submit" className={`flex-1 px-4 py-3 bg-gradient-to-r ${registerType === "teacher" ? "from-green-600 to-green-700 hover:from-green-500 hover:to-green-600" : "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"} rounded-lg font-semibold transition text-white`}>
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-semibold transition text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
