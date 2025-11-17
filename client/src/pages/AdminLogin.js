import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password, "admin");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-neutral-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Admin Login</h1>
        </div>
        {error && <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4 border border-red-700/50 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg mb-6 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
          <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
