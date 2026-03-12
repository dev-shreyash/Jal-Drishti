import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

interface DailyLog {
  log_id: string | number;
  created_at: string;
  usage_liters: number;
  chlorine_added: boolean;
  operator: {
    name: string;
  };
  pump: {
    pump_name: string;
  };
}

const fetchDailyLogs = async (): Promise<DailyLog[]> => {
  const response = await api.get("/admin/daily-logs");
  return response.data;
};

export default function DailyLogs() {
  const { data: logs = [], isLoading, isError } = useQuery<DailyLog[]>({
    queryKey: ["adminDailyLogs"],
    queryFn: fetchDailyLogs,
  });

  if (isLoading) return <div className="p-4">Loading logs...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load daily logs.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Operator Daily Logs</h2>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full bg-white text-left border-collapse">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-gray-700">Date</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-gray-700">Operator</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-gray-700">Pump</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-gray-700">Usage (L)</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-gray-700">Chlorine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.log_id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{new Date(log.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-sm text-gray-700">{log.operator.name}</td>
                <td className="p-3 text-sm text-gray-700">{log.pump.pump_name}</td>
                <td className="p-3 text-sm text-gray-700 font-medium">{log.usage_liters.toLocaleString()}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.chlorine_added ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {log.chlorine_added ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}