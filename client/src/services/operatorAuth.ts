// client/src/services/operatorAuth.ts

export async function operatorLogin(data: {
  username: string;
  password: string;
}) {
  const res = await fetch("http://localhost:3000/operator/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Invalid credentials");
  }

  return json;
}
