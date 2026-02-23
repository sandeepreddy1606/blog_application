"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, PenTool } from "lucide-react";

export default function Home() {
  const title = "BlogX.";
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typing animation effect
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= title.length) {
        setDisplayText(title.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 250);

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background ambient decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="text-center space-y-10 max-w-3xl mx-auto relative z-10 w-full">

        {/* Typing Animation Container */}
        <div className="h-32 sm:h-40 flex items-center justify-center">
          <h1 className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tighter flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              {displayText}
            </span>
            <span
              className={`w-2 h-16 sm:h-24 bg-rose-500 ml-2 sm:ml-4 rounded-full transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'
                }`}
            ></span>
          </h1>
        </div>

        {/* Subtitle - Fades in AFTER typing is done */}
        <p
          className="text-xl sm:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto transition-all duration-1000 ease-out"
          style={{
            opacity: displayText.length === title.length ? 1 : 0,
            transform: displayText.length === title.length ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          The elegant, simple, and secure platform designed for modern thinkers and creators.
        </p>

        {/* Call to Actions - Fades in AFTER subtitle */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 transition-all duration-1000 delay-300 ease-out"
          style={{
            opacity: displayText.length === title.length ? 1 : 0,
            transform: displayText.length === title.length ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <Link
            href="/feed"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1 active:translate-y-0"
          >
            <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
            Explore the Feed
          </Link>
          <Link
            href="/register"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
          >
            Start Writing
            <PenTool size={20} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
