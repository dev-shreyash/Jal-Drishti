const API = "http://localhost:3000/operator-data";

export async function getOperatorPumps(operatorId: number) {
  const res = await fetch(`${API}/pumps/${operatorId}`);
  if (!res.ok) throw new Error("Failed to load pumps");
  return res.json();
}

export async function getOperatorTanks(operatorId: number) {
  const res = await fetch(`${API}/tanks/${operatorId}`);
  if (!res.ok) throw new Error("Failed to load tanks");
  return res.json();
}
