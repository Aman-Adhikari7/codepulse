import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Auth from "./pages/Auth.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

const home = (user) => (user.role === "TEACHER" ? "/teacher" : "/student");

// Only lets the right role into a page. Everyone else is sent elsewhere.
function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={home(user)} replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={home(user)} /> : <Auth mode="login" />} />
      <Route path="/register" element={user ? <Navigate to={home(user)} /> : <Auth mode="register" />} />
      <Route path="/teacher" element={<Protected role="TEACHER"><TeacherDashboard /></Protected>} />
      <Route path="/student" element={<Protected role="STUDENT"><StudentDashboard /></Protected>} />
      <Route path="*" element={<Navigate to={user ? home(user) : "/login"} replace />} />
    </Routes>
  );
}
