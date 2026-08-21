"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signUp } from "@/app/dashbord/database";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);

      router.push("/dashbord");
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        alert("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

const handleSignUp = async () => {
  try {
    const userCredential = await signUp(
      email,
      password
    );

    const user = userCredential.user;

    await createUserProfile(
      user.uid,
      user.email || email,
      "New User",
      "driver"
    );

    router.push("/dashbord");
  } catch (error: any) {
    console.error("Signup error:", error);

    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (error.code === "auth/weak-password") {
      alert("Password must be at least 6 characters.");
    } else {
      alert("Signup failed.");
    }
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Orbit Fleet Login
        </h1>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md"
          >
            Login
          </button>

          <button
            onClick={handleSignUp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}