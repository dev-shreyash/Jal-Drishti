export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Jal-Drishti</h2>
      <p className="subtitle">Admin Panel</p>

      <nav className="menu">
        <button>📍 Villages</button>
        <button>🚰 Pumps</button>
        <button>🛢 Tanks</button>
        <button>👷 Operators</button>
        <button>📊 Analytics</button>
      </nav>

      <button className="logout">Logout</button>
    </aside>
  );
}
