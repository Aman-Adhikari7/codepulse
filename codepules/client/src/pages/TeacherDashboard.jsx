import { useAuth } from "../AuthContext.jsx";

// Placeholder cards. Each one becomes a real feature in a later phase.
export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  return (
    <main className="page">
      <header className="top">
        <h1>Welcome, {user.name}</h1>
        <button className="ghost" onClick={logout}>Log out</button>
      </header>
      <div className="grid">
        <div className="card"><h2>Create a test</h2><p className="muted">Paste text or upload a PDF and let AI write the questions. (Phase 3)</p></div>
        <div className="card"><h2>Start a live session</h2><p className="muted">Share a code and push questions to students. (Phase 5)</p></div>
        <div className="card"><h2>Results</h2><p className="muted">Class graphs and individual student data. (Phase 8)</p></div>
      </div>
    </main>
  );
}
