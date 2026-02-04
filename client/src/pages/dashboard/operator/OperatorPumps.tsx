import { useEffect, useState } from "react";

export default function OperatorPumps() {
  const [pumps, setPumps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/operator/pumps")
      .then(res => res.json())
      .then(setPumps);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Village Pumps</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2">Pump Name</th>
            <th>Status</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {pumps.map((p: any) => (
            <tr key={p.pump_id} className="border-b">
              <td className="p-2">{p.pump_name}</td>
              <td>{p.status}</td>
              <td>{p.power_hp} HP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
