import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "operator";

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      // save auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // redirect
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/operator/dashboard");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Jal-Drishti Login</h2>

        {/* ROLE TOGGLE */}
        <div style={styles.tabs}>
          <button
            onClick={() => setRole("admin")}
            style={{
              ...styles.tab,
              ...(role === "admin" ? styles.activeTab : {}),
            }}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("operator")}
            style={{
              ...styles.tab,
              ...(role === "operator" ? styles.activeTab : {}),
            }}
          >
            Operator
          </button>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            placeholder={`${role} username`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : `Login as ${role}`}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
  },
  card: {
    width: 360,
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: 16,
  },
  tabs: {
    display: "flex",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #ddd",
  },
  tab: {
    flex: 1,
    padding: 10,
    cursor: "pointer",
    background: "#f5f5f5",
    border: "none",
    fontWeight: 600,
  },
  activeTab: {
    background: "#2563eb",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
