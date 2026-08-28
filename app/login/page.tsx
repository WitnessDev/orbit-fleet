"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Lock, Mail, User } from "lucide-react";

import {
  login,
  signUp,
  createUserProfile,
} from "@/app/dashbord/database";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      await login(email, password);

      router.replace("/dashbord");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string } | undefined;
      console.error("LOGIN ERROR:", err);

      if (err?.code === "auth/invalid-credential") {
        alert("Incorrect email or password.");
      } else if (err?.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (err?.code === "auth/user-not-found") {
        alert("No account exists with this email.");
      } else if (err?.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (err?.code === "auth/operation-not-allowed") {
        alert("Email/Password authentication is not enabled in Firebase.");
      } else if (err?.code === "auth/network-request-failed") {
        alert("Network error. Check your internet connection.");
      } else {
        alert(
          `Login failed.\n\nCode: ${
            err?.code || "unknown"
          }\n\nMessage: ${err?.message || "Unknown error"}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signUp(email, password);

      const user = userCredential.user;

      await createUserProfile(
        user.uid,
        user.email || email,
        fullName,
        "driver"
      );

      router.replace("/dashbord");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string } | undefined;
      console.error("SIGNUP ERROR:", err);

      if (err?.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (err?.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (err?.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else if (err?.code === "auth/operation-not-allowed") {
        alert("Email/Password authentication is not enabled in Firebase.");
      } else if (err?.code === "permission-denied") {
        alert(
          "Firebase Firestore permission denied. Check your Firestore rules."
        );
      } else if (err?.code === "auth/network-request-failed") {
        alert("Network error. Check your internet connection.");
      } else {
        alert(
          `Signup failed.\n\nCode: ${
            err?.code || "unknown"
          }\n\nMessage: ${err?.message || "Unknown error"}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6 overflow-hidden">
      {/* Background Radial Glow matching Home */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),_transparent_65%)] pointer-events-none z-0" />

      {/* Grid Pattern Background matching Home */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(16,185,129,0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 grid min-h-[560px] h-auto w-full max-w-4xl grid-cols-1 md:h-[560px] md:grid-cols-2 overflow-hidden rounded-3xl bg-[#fdfbf7] shadow-[0_20px_50px_rgba(16,185,129,0.14)] border border-emerald-100">
        
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-b border-emerald-100 bg-emerald-50/60 p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              !isSignUp
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-emerald-900/70 hover:text-emerald-900"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              isSignUp
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-emerald-900/70 hover:text-emerald-900"
            }`}
          >
            Create account
          </button>
        </div>

        {/* =====================================================
            LOGIN
        ====================================================== */}
        <motion.div
          animate={{
            opacity: isSignUp ? 0 : 1,
            x: isSignUp ? -18 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`flex min-h-[500px] flex-col justify-between p-8 sm:p-10 text-slate-900 md:col-start-1 md:h-full md:min-h-0 ${
            isSignUp
              ? "pointer-events-none absolute inset-y-0 left-0 w-1/2 z-0"
              : "relative z-10"
          }`}
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 shadow-sm">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                Orbit <span className="text-emerald-600">Fleet</span>
              </span>
              
              {/* Home Link with special surround pill */}
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-sm transition-all hover:bg-emerald-100 hover:border-emerald-300 hover:shadow"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-600" />
                <span>Home</span>
              </Link>
            </div>

            <h2 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
              Sign in
            </h2>
            <p className="mb-5 text-xs font-medium text-slate-500">
              Access your fleet management console
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-0 top-2.5 h-4 w-4 text-emerald-600/70" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Driver or manager email"
                    type="email"
                    required
                    disabled={loading}
                    className="w-full border-b border-emerald-200 bg-transparent py-2 pl-6 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-0 top-2.5 h-4 w-4 text-emerald-600/70" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    required
                    disabled={loading}
                    className="w-full border-b border-emerald-200 bg-transparent py-2 pl-6 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-full bg-emerald-700 py-3 font-bold text-sm tracking-wide text-white shadow-md shadow-emerald-700/25 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Switch Link with special surround badge */}
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50/80 px-4 py-2 border border-emerald-200/90 shadow-sm text-xs text-slate-600">
              <span>New to Orbit Fleet?</span>
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsSignUp(true)}
                className="inline-flex items-center rounded-full bg-emerald-700 px-3 py-1 font-bold text-white shadow-sm hover:bg-emerald-600 transition-all cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            SIGN UP
        ====================================================== */}
        <motion.div
          animate={{
            opacity: isSignUp ? 1 : 0,
            x: isSignUp ? 0 : 18,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`flex min-h-[500px] flex-col justify-between p-8 sm:p-10 text-slate-900 md:col-start-2 md:h-full md:min-h-0 ${
            !isSignUp
              ? "pointer-events-none absolute inset-y-0 right-0 w-1/2 z-0"
              : "relative z-10"
          }`}
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 shadow-sm">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                Orbit <span className="text-emerald-600">Registration</span>
              </span>
              
              {/* Home Link with special surround pill */}
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-sm transition-all hover:bg-emerald-100 hover:border-emerald-300 hover:shadow"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-600" />
                <span>Home</span>
              </Link>
            </div>

            <h2 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
              Create account
            </h2>
            <p className="mb-4 text-xs font-medium text-slate-500">
              Register your driver profile in the network
            </p>

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Full name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-0 top-2.5 h-4 w-4 text-emerald-600/70" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    type="text"
                    required
                    disabled={loading}
                    className="w-full border-b border-emerald-200 bg-transparent py-1.5 pl-6 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-0 top-2.5 h-4 w-4 text-emerald-600/70" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                    required
                    disabled={loading}
                    className="w-full border-b border-emerald-200 bg-transparent py-1.5 pl-6 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-0 top-2.5 h-4 w-4 text-emerald-600/70" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    type="password"
                    required
                    disabled={loading}
                    className="w-full border-b border-emerald-200 bg-transparent py-1.5 pl-6 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-full bg-emerald-700 py-3 font-bold text-sm tracking-wide text-white shadow-md shadow-emerald-700/25 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          {/* Switch Link with special surround badge */}
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50/80 px-4 py-2 border border-emerald-200/90 shadow-sm text-xs text-slate-600">
              <span>Already registered?</span>
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsSignUp(false)}
                className="inline-flex items-center rounded-full bg-emerald-700 px-3 py-1 font-bold text-white shadow-sm hover:bg-emerald-600 transition-all cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            ANIMATED BLADE (Home matching emerald gradient)
        ====================================================== */}
        <motion.div
          initial={false}
          animate={{
            x: isSignUp ? "0%" : "100%",
            clipPath: isSignUp
              ? "polygon(0 0, 100% 0, 82% 100%, 0 100%)"
              : "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
          }}
          className={`hidden md:flex absolute left-0 top-0 z-20 h-full w-[55%] flex-col justify-center p-10 shadow-2xl ${
            isSignUp
              ? "bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22]"
              : "bg-gradient-to-bl from-[#064e3b] via-[#047857] to-[#022c22]"
          }`}
        >
          <motion.div
            key={isSignUp ? "signup-desc" : "login-desc"}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.2,
            }}
            className={isSignUp ? "pr-8 text-left" : "pl-10 text-left"}
          >
            

            <h3 className="mt-3 mb-3 text-3xl font-black leading-tight text-white">
              {isSignUp ? (
                <>
                  Join the <br />
                  <em className="font-normal italic text-emerald-200">network.</em>
                </>
              ) : (
                <>
                  Welcome <br />
                  <em className="font-normal italic text-emerald-200">back.</em>
                </>
              )}
            </h3>

            <p className="max-w-xs text-xs leading-relaxed text-emerald-100/90">
              {isSignUp
                ? "Register your driver profile to access active assignments, live trip tracking, and route details."
                : "Sign in to monitor active routes, track fleet analytics, and stay connected with your dispatch team."}
            </p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
