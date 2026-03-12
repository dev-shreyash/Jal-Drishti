import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

interface Tank {
  tank_id: string | number;
  tank_name: string;
  capacity_liters: number;
  is_smart_tank: boolean;
}

const fetchTanks = async (): Promise<Tank[]> => {
  const response = await api.get("/operator/tanks");
  return response.data;
};

export default function OperatorTanks() {
  const { data: tanks = [], isLoading, isError } = useQuery<Tank[]>({
    queryKey: ["operatorTanks"],
    queryFn: fetchTanks,
  });

  if (isLoading) return <div className="p-4">Loading tanks...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load tanks.</div>;

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Water Tanks</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Tank</th>
            <th className="text-left">Capacity</th>
            <th className="text-left">Smart</th>
          </tr>
        </thead>
        <tbody>
          {tanks.map((t) => (
            <tr key={t.tank_id} className="border-b">
              <td className="p-2">{t.tank_name}</td>
              <td>{t.capacity_liters.toLocaleString()} L</td>
              <td>
                <span className={`px-2 py-1 rounded text-sm ${t.is_smart_tank ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {t.is_smart_tank ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}