import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

interface Pump {
  pump_id: string | number;
  pump_name: string;
  status: string;
  power_hp: number;
}

const fetchPumps = async (): Promise<Pump[]> => {
  const response = await api.get("/operator/pumps");
  return response.data;
};

export default function OperatorPumps() {
  const { data: pumps = [], isLoading, isError } = useQuery<Pump[]>({
    queryKey: ["operatorPumps"],
    queryFn: fetchPumps,
  });

  if (isLoading) return <div className="p-4">Loading pumps...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load pumps.</div>;

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Village Pumps</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Pump Name</th>
            <th className="text-left">Status</th>
            <th className="text-left">Power</th>
          </tr>
        </thead>
        <tbody>
          {pumps.map((p) => (
            <tr key={p.pump_id} className="border-b">
              <td className="p-2">{p.pump_name}</td>
              <td>
                <span className={`px-2 py-1 rounded text-sm ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {p.status}
                </span>
              </td>
              <td>{p.power_hp} HP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}