"use client";

import { motion } from "framer-motion";
import { Compass, ArrowRight, Truck, MapPin } from "lucide-react";
import Link from "next/link";

export default function LandingHero() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-50 text-slate-900 flex items-center justify-center">

      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),_transparent_65%)] pointer-events-none z-0" />

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(16,185,129,0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

     

      {/* 3D Moving Orbit Background */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ perspective: "1000px" }}
      >
        {/* Outer Ring */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", rotateX: "65deg", rotateY: "-15deg" }}
          className="absolute w-[560px] h-[560px] rounded-full border-2 border-dashed border-emerald-500/35"
        >
          <span className="absolute -top-2 left-1/2 h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_20px_4px_rgba(16,185,129,0.7)]" />
        </motion.div>

        {/* Inner Ring */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", rotateX: "70deg", rotateY: "20deg" }}
          className="absolute w-[420px] h-[420px] rounded-full border border-teal-500/50"
        >
          <span className="absolute top-1/2 -right-2 h-3.5 w-3.5 rounded-full bg-teal-500 shadow-[0_0_15px_3px_rgba(20,184,166,0.6)]" />
        </motion.div>
      </div>

      {/* Dead-Centered Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 max-w-md w-full">
        
        {/* 3D Floating Compass Icon */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotateX: [0, 8, 0],
            rotateY: [0, -8, 0],
            boxShadow: [
              "0 15px 30px -10px rgba(16,185,129,0.2)",
              "0 25px 40px -10px rgba(16,185,129,0.35)",
              "0 15px 30px -10px rgba(16,185,129,0.2)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-300 bg-white/90 backdrop-blur-md"
        >
          <Compass className="h-10 w-10 text-emerald-600" />
        </motion.div>

        {/* Centered Title */}
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Orbit <span className="text-emerald-600">Fleet</span>
        </h1>

        {/* Tagline */}
        <p className="mt-2 max-w-xs text-xs sm:text-sm font-semibold text-slate-600 tracking-wide">
          Track. Manage. Move.
        </p>

        {/* Centered Login Button */}
        <Link
          href="/login"
          className="group relative mt-6 flex w-full max-w-xs items-center justify-center gap-3 overflow-hidden rounded-full bg-emerald-600 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-600/40 active:scale-95"
        >
          <span>LOGIN</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Status Pills */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-emerald-600" />
            Fleet
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-600" />
            GPS
          </span>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-5 left-0 right-0 text-center z-20 pointer-events-none">
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400">
          ORBIT FLEET SYSTEM
        </p>
      </div>

    </main>
  );
}