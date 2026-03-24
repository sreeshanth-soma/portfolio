"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Wallpaper from "@/components/wallpaper";

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LoginScreen({
  onLogin,
  isDarkMode,
  onToggleDarkMode,
}: LoginScreenProps) {
  const isMobile = useIsMobile();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [hint, setHint] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length >= 0) {
      onLogin();
    } else {
      setError(true);
    }
  };

  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="relative h-screen w-screen flex flex-col items-center overflow-hidden">
      <Wallpaper isDarkMode={isDarkMode} />
      <div className="absolute inset-0 bg-black/10" />

      {/* Date & Time — large, top-center like real macOS */}
      <div className={`relative z-10 flex flex-col items-center ${isMobile ? "mt-[6vh]" : "mt-[8vh]"}`}>
        <div className="text-white/90 text-lg font-medium tracking-wide">
          {formattedDate}
        </div>
        <div
          className="text-white font-semibold leading-none"
          style={{ fontSize: isMobile ? "clamp(56px, 16vw, 80px)" : "clamp(80px, 12vw, 150px)", letterSpacing: "-2px" }}
        >
          {formattedTime}
        </div>
      </div>

      {/* User avatar, name & password — bottom area */}
      <div className={`relative z-10 flex flex-col items-center mt-auto ${isMobile ? "mb-[8vh]" : "mb-[12vh]"}`}>
        <div className={`${isMobile ? "w-14 h-14" : "w-16 h-16"} rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-3`}>
          <User className={`${isMobile ? "w-7 h-7" : "w-8 h-8"} text-white/70`} />
        </div>
        <h2 className="text-white text-[17px] font-medium mb-1">Soma sreeshanth</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center px-4">
          <p className="text-white/50 text-[13px] mb-1">Touch ID or Enter Password</p>
          <p className="text-white/60 text-[12px] mb-3">Hint: Who built this? (first name works)</p>
          <Input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-56 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 px-3 ${
              error ? "ring-2 ring-red-500" : ""
            }`}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">Please enter a password</p>
          )}
          <button
            type="submit"
            className="mt-3 px-6 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[13px] font-medium hover:bg-white/20 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
