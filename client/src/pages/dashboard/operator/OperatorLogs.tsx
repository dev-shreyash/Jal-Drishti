import { useEffect, useState } from "react";

export default function OperatorLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/operator/daily-logs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>My Daily Logs</h2>

      {logs.map((log) => (
        <div key={log.log_id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><b>Start:</b> {new Date(log.start_time).toLocaleString()}</p>
          <p><b>End:</b> {new Date(log.end_time).toLocaleString()}</p>
          <p><b>Usage:</b> {log.usage_liters} L</p>
        </div>
      ))}
    </div>
  );
}
