export default function Topbar() {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
}
