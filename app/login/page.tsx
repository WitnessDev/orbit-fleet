"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      if (error?.code === "auth/invalid-credential") {
        alert("Incorrect email or password.");
      } else if (error?.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (
        error?.code === "auth/user-not-found"
      ) {
        alert("No account exists with this email.");
      } else if (
        error?.code === "auth/wrong-password"
      ) {
        alert("Incorrect password.");
      } else if (
        error?.code === "auth/operation-not-allowed"
      ) {
        alert(
          "Email/Password authentication is not enabled in Firebase."
        );
      } else if (
        error?.code === "auth/network-request-failed"
      ) {
        alert(
          "Network error. Check your internet connection."
        );
      } else {
        alert(
          `Login failed.\n\nCode: ${
            error?.code || "unknown"
          }\n\nMessage: ${
            error?.message || "Unknown error"
          }`
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

      const userCredential = await signUp(
        email,
        password
      );

      const user = userCredential.user;

      await createUserProfile(
        user.uid,
        user.email || email,
        fullName,
        "driver"
      );

      router.replace("/dashbord");
    } catch (error: any) {
      console.error("SIGNUP ERROR:", error);

      if (
        error?.code === "auth/email-already-in-use"
      ) {
        alert("This email is already registered.");
      } else if (
        error?.code === "auth/invalid-email"
      ) {
        alert("Please enter a valid email address.");
      } else if (
        error?.code === "auth/weak-password"
      ) {
        alert("Password must be at least 6 characters.");
      } else if (
        error?.code === "auth/operation-not-allowed"
      ) {
        alert(
          "Email/Password authentication is not enabled in Firebase."
        );
      } else if (
        error?.code === "permission-denied"
      ) {
        alert(
          "Firebase Firestore permission denied. Check your Firestore rules."
        );
      } else if (
        error?.code === "auth/network-request-failed"
      ) {
        alert(
          "Network error. Check your internet connection."
        );
      } else {
        alert(
          `Signup failed.\n\nCode: ${
            error?.code || "unknown"
          }\n\nMessage: ${
            error?.message || "Unknown error"
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">

      <div className="relative grid h-[560px] w-full max-w-4xl grid-cols-2 overflow-hidden rounded-3xl bg-[#fdfbf7] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

        {/* =====================================================
            LOGIN
        ====================================================== */}

        <div
          className={`flex h-full flex-col justify-center p-10 text-[#12281d] transition-opacity duration-200 ${
            isSignUp
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }`}
        >
          <h2 className="mb-6 text-3xl font-bold">
            Sign in
          </h2>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Driver or manager email"
                type="email"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#12281d]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Password
              </label>

              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                type="password"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#12281d]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#0e3022] py-3 font-medium text-white shadow-md transition-all hover:bg-[#071d15] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-600">
            New to Orbit Fleet?{" "}
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsSignUp(true)}
              className="font-bold text-[#0e3022] underline"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* =====================================================
            SIGN UP
        ====================================================== */}

        <div
          className={`flex h-full flex-col justify-center p-10 text-[#12281d] transition-opacity duration-200 ${
            !isSignUp
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }`}
        >
          <h2 className="mb-6 text-3xl font-bold">
            Create account
          </h2>

          <form
            onSubmit={handleSignUp}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Full name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Full name"
                type="text"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#12281d]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Email address
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email address"
                type="email"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#12281d]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Password
              </label>

              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
                type="password"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#12281d]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-[#0e3022] py-3 font-medium text-white shadow-md transition-all hover:bg-[#071d15] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-600">
            Already registered?{" "}
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsSignUp(false)}
              className="font-bold text-[#0e3022] underline"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* =====================================================
            ANIMATED BLADE
        ====================================================== */}

        <motion.div
          initial={false}
          animate={{
            x: isSignUp ? "0%" : "85%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
          }}
          className={`absolute left-0 top-0 z-20 flex h-full w-[55%] flex-col justify-center p-10 shadow-2xl ${
            isSignUp
              ? "bg-gradient-to-r from-[#051a11] via-[#0c3626] to-[#fdfbf7]"
              : "bg-gradient-to-l from-[#051a11] via-[#0c3626] to-[#fdfbf7]"
          }`}
          style={{
            clipPath: isSignUp
              ? "polygon(0 0, 100% 0, 82% 100%, 0 100%)"
              : "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <motion.div
            key={
              isSignUp
                ? "signup-desc"
                : "login-desc"
            }
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
            className={
              isSignUp
                ? "pr-8 text-left"
                : "pl-10 text-left"
            }
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
              ORBIT FLEET MANAGEMENT
            </span>

            <h3 className="mt-2 mb-3 font-serif text-3xl leading-tight text-white">
              {isSignUp ? (
                <>
                  Join the{" "}
                  <br />
                  <em className="font-normal italic text-[#e0cfb3]">
                    network.
                  </em>
                </>
              ) : (
                <>
                  Welcome{" "}
                  <br />
                  <em className="font-normal italic text-[#e0cfb3]">
                    back.
                  </em>
                </>
              )}
            </h3>

            <p className="max-w-xs text-xs leading-relaxed text-gray-200 opacity-90">
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