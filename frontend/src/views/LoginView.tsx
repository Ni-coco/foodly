import { useState } from "react";
import axios from "axios";

interface LoginViewProps {
  setToken: (token: string) => void;
  setCurrentView: (view: string) => void;
}

interface LoginResponse {
  user: string;
  token: string;
}

export default function LoginView({
  setToken,
  setCurrentView,
}: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Local state for errors
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setError(null);
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_URL}/login`,
        { email, password }
      );

      // If login is successful:
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setCurrentView("Home");
      }
    } catch (err: string | any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign in
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setCurrentView("Register")}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
