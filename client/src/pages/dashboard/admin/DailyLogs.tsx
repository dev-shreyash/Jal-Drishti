import { useEffect, useState } from "react";

const DailyLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/daily-logs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Operator Daily Logs</h2>

      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Operator</th>
            <th>Pump</th>
            <th>Usage (L)</th>
            <th>Chlorine</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.log_id}>
              <td>{new Date(log.created_at).toLocaleDateString()}</td>
              <td>{log.operator.name}</td>
              <td>{log.pump.pump_name}</td>
              <td>{log.usage_liters}</td>
              <td>{log.chlorine_added ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyLogs;
