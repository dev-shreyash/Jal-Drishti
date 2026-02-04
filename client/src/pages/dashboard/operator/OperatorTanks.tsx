import { useEffect, useState } from "react";

export default function OperatorTanks() {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/operator/tanks")
      .then(res => res.json())
      .then(setTanks);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Water Tanks</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th className="p-2">Tank</th>
            <th>Capacity</th>
            <th>Smart</th>
          </tr>
        </thead>
        <tbody>
          {tanks.map((t: any) => (
            <tr key={t.tank_id}>
              <td className="p-2">{t.tank_name}</td>
              <td>{t.capacity_liters} L</td>
              <td>{t.is_smart_tank ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
