import { useAuth } from "../AuthContext.jsx";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  return (
    <main className="page">
      <header className="top">
        <h1>Hi, {user.name}</h1>
        <button className="ghost" onClick={logout}>Log out</button>
      </header>
      <div className="grid">
        <div className="card"><h2>Join a test</h2><p className="muted">Enter the code your teacher gave you. (Phase 5)</p></div>
        <div className="card"><h2>My history</h2><p className="muted">Review past tests and practice their questions. (Phase 9)</p></div>
      </div>
    </main>
  );
}
