"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/network");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen w-screen bg-void flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border border-accent-red border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-secondary font-mono tracking-widest">INITIALIZING</span>
      </div>
    </div>
  );
}
