"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/nav-header";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: LoginFormValues) => {
    setApiError("");
    try {
      // 1. Get Token
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.email, password: data.password }), // assuming email is used as username or the backend uses it
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const tokenData = await res.json();

      // 2. Get Profile
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${tokenData.access}` },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await profileRes.json();

      // 3. Save to context
      login(tokenData.access, { id: profileData.id.toString(), name: profileData.username, email: profileData.email });
      router.push("/analyzer");
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[100px] bg-white/5 blur-[80px] pointer-events-none" />

          <h1 className="text-3xl font-black text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-zinc-400 text-center mb-8 text-sm">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
                placeholder="grandmaster@chess.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm text-center">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 mt-4 hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Don't have an account? <a href="/register" className="text-white font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
