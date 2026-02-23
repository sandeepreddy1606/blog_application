"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, PenTool } from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger the massive animation chain immediately after the component physically mounts to the screen
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const titleChars = "BlogX.".split("");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Cinematic Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none transition-opacity duration-[3000ms]" style={{ opacity: isMounted ? 1 : 0 }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-500/15 rounded-full blur-[120px] pointer-events-none transition-opacity duration-[3000ms] delay-500" style={{ opacity: isMounted ? 1 : 0 }} />

      {/* Subtle Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="text-center space-y-12 max-w-5xl mx-auto relative z-10 w-full mb-20">

        {/* Elegant Animated Staggered Text - Cinematic Reveal */}
        <div className="h-32 sm:h-56 flex items-center justify-center overflow-visible">
          <h1 className="text-7xl sm:text-[11rem] font-bold tracking-tighter flex items-center" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            {titleChars.map((char, index) => (
              <span
                key={index}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 transform transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  // Highly customized staggering math for a fluid, continuous liquid motion
                  transitionDuration: '1400ms',
                  transitionDelay: `${index * 120}ms`,
                  opacity: isMounted ? 1 : 0,
                  transform: isMounted ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(120px) scale(0.8) rotateX(40deg)',
                  filter: isMounted ? 'blur(0px)' : 'blur(20px)',
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle - Gentle fade up with dramatic blur release */}
        <p
          className="text-xl sm:text-3xl text-slate-400 font-light tracking-wide leading-relaxed max-w-3xl mx-auto transition-all duration-[1500ms] ease-out"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'translateY(0)' : 'translateY(30px)',
            filter: isMounted ? 'blur(0px)' : 'blur(10px)',
            transitionDelay: '1000ms'
          }}
        >
          A premium sanctuary for modern <span className="text-white font-medium">thinkers</span> and <span className="text-white font-medium">creators</span>.
        </p>

        {/* Call to Actions - Slide in softly */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 transition-all duration-[1500ms] ease-out"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '1300ms'
          }}
        >
          <Link
            href="/feed"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-full font-semibold tracking-wide hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] active:scale-95"
          >
            <BookOpen size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
            Explore the Feed
          </Link>
          <Link
            href="/register"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/20 rounded-full font-semibold tracking-wide hover:bg-white/10 hover:border-white/40 transition-all duration-300 active:scale-95"
          >
            Start Writing
            <PenTool size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </div>
  );
}
