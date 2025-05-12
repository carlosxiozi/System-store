"use client";

import Menu from "@/app/components/Menu/page";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/"); // redirige al login si no hay user
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen w-screen transition-all duration-300 bg-blue-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Menu />
        <main className="flex-1 overflow-auto p-2">
          {children}
        </main>
      </div>
    </div>
  );
}
