import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, Input, Label } from "@/components/ui/form";
import { api, setToken } from "@/lib/api";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login/", { username, password });
      setToken(data.token);
      nav("/admin", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail ?? err.response?.data?.non_field_errors?.[0] ?? "Could not sign in.");
    }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-cream p-4">
      <Card className="w-full max-w-sm">
        <img src="/logo.png" alt="" className="mx-auto mb-2 h-16" />
        <h1 className="text-center text-2xl text-purple">Admin sign in</h1>
        <form onSubmit={submit}>
          <Label htmlFor="u">Username</Label><Input id="u" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Label htmlFor="p">Password</Label><Input id="p" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="mt-3 text-sm text-red">{error}</p>}
          <Button className="mt-5 w-full">Sign in</Button>
        </form>
        <p className="mt-4 text-center text-sm"><Link to="/" className="text-blue underline">← Back to website</Link></p>
      </Card>
    </div>
  );
}
