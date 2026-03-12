import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

interface Log {
  log_id: string | number;
  start_time: string;
  end_time: string;
  usage_liters: number;
}

const fetchOperatorLogs = async (): Promise<Log[]> => {
  const response = await api.get("/operator/daily-logs");
  return response.data;
};

export default function OperatorLogs() {
  const { data: logs = [], isLoading, isError } = useQuery<Log[]>({
    queryKey: ["operatorDailyLogs"],
    queryFn: fetchOperatorLogs,
  });

  if (isLoading) return <div className="p-4">Loading logs...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load logs.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Daily Logs</h2>

      <div className="grid gap-4">
        {logs.map((log) => (
          <div key={log.log_id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            <p className="mb-1"><span className="font-semibold text-gray-700">Start:</span> {new Date(log.start_time).toLocaleString()}</p>
            <p className="mb-1"><span className="font-semibold text-gray-700">End:</span> {new Date(log.end_time).toLocaleString()}</p>
            <p><span className="font-semibold text-gray-700">Usage:</span> <span className="text-blue-600 font-medium">{log.usage_liters} L</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}