import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Operator");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Add Daily Log",
      description: "Record new daily activities",
      icon: "📝",
      path: "/operator/daily-log",
      color: "#2196f3",
    },
    {
      id: 2,
      title: "My Logs",
      description: "View your submitted logs",
      icon: "📋",
      path: "/operator/my-logs",
      color: "#4caf50",
    },
    {
      id: 3,
      title: "Logout",
      description: "Sign out from dashboard",
      icon: "🚪",
      action: handleLogout,
      color: "#f44336",
    },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Operator Dashboard</h1>
          <p style={styles.welcome}>Welcome, {username}</p>
        </div>
        <div style={styles.userBadge}>
          <span style={styles.userIcon}>👨‍💼</span>
          <span>Operator</span>
        </div>
      </header>

      <div style={styles.menuGrid}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : navigate(item.path!)}
            style={{
              ...styles.menuCard,
              backgroundColor: item.color + "15",
              borderColor: item.color + "30",
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.icon}>{item.icon}</span>
              <h3 style={styles.cardTitle}>{item.title}</h3>
            </div>
            <p style={styles.cardDescription}>{item.description}</p>
            <div style={styles.cardFooter}>
              <span style={{
                ...styles.actionText,
                color: item.color
              }}>
                {item.action ? "Sign Out" : "Access →"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OperatorDashboard;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#f8f9fa",
    background: "linear-gradient(180deg, #f5f7fa 0%, #e3f2fd 100%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  title: {
    margin: "0 0 8px 0",
    color: "#1a237e",
    fontSize: "28px",
    fontWeight: "700",
  },
  welcome: {
    margin: "0",
    color: "#666",
    fontSize: "16px",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  userIcon: {
    fontSize: "20px",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  menuCard: {
    padding: "24px",
    border: "1px solid",
    borderRadius: "12px",
    textAlign: "left" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    minHeight: "140px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "8px",
  },
  icon: {
    fontSize: "32px",
  },
  cardTitle: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
  },
  cardDescription: {
    margin: "0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  actionText: {
    fontSize: "14px",
    fontWeight: "600",
  },
};