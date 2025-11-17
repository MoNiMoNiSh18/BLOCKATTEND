import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
