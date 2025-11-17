const API = "http://localhost:5000/api";

export async function login(email, password, role) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function register(name, email, password, role, className) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role, className }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
