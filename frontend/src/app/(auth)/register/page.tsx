"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/nav-header";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError("");
    try {
      // 1. Register User
      const registerRes = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           username: data.name, // using name as username
           email: data.email, 
           password: data.password 
        }),
      });
      
      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.username ? "Username already exists" : "Registration failed");
      }
      
      // 2. Auto-login after registration
      const loginRes = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.name, password: data.password }),
      });
      
      if (!loginRes.ok) throw new Error("Failed to auto-login");
      const tokenData = await loginRes.json();
      
      // 3. Get Profile
      const profileRes = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        headers: { Authorization: `Bearer ${tokenData.access}` },
      });
      
      if (!profileRes.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileRes.json();
      
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

          <h1 className="text-3xl font-black text-white mb-2 text-center">Create Account</h1>
          <p className="text-zinc-400 text-center mb-8 text-sm">Join the global chess community.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
                placeholder="Magnus Carlsen"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>
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
              className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 mt-6 hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Already have an account? <a href="/login" className="text-white font-semibold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
