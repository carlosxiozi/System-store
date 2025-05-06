"use client";

import Menu from "@/app/components/Menu/page";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar/page";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Verifica si el usuario está autenticado
  const checkAuthentication = () => {
    // Aquí verificas si el usuario está autenticado (esto depende de tu lógica de autenticación)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // Asegúrate de que localStorage solo se use en el cliente

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  // Redirige si no está autenticado
  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuthentication();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/");  // Redirige a la página de login si no está autenticado
    }
  }, [isAuthenticated, router]);

  // Mientras se comprueba el estado de autenticación, muestra un cargando.
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen w-screen transition-all duration-300  bg-blue-100">
   
    <Sidebar />
  
    {/* Contenedor derecho: menu arriba + contenido */}
    <div className="flex flex-col flex-1 overflow-hidden">
      <Menu />
  
      <main className="flex-1 overflow-auto p-2">
        {children}
      </main>
    </div>
  </div>
  
  );
}
