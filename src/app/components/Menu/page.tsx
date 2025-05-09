"use client";

import { useState,useEffect } from "react";
import { FaStore } from "react-icons/fa";
import {
  FaBell,
  FaUserCircle,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
 interface User {
   name: string;
   role: string;
   [key: string]: string | number | boolean | null | undefined; 
 }
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const userNotifications = [
    {
      id: 1,
      title: "Nueva cita programada",
      message: "Tienes una nueva cita programada para el 15 de octubre a las 10:00 AM.",
      isRead: false,
      updated_at: "2023-10-10T14:30:00Z",
    },
    {
      id: 2,
      title: "Pago recibido",
      message: "Se ha recibido el pago de la consulta del paciente Juan Pérez.",
      isRead: true,
      updated_at: "2023-10-09T09:15:00Z",
    },
    {
      id: 3,
      title: "Recordatorio de cita",
      message: "Recuerda que tienes una cita programada mañana a las 3:00 PM.",
      isRead: false,
      updated_at: "2023-10-11T08:00:00Z",
    },
  ];

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleLogOut = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("user");
    window.location.href = "/";
  };


  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-3 bg-gray-800 text-white shadow-md  top-0 left-0 right-0 z-30 sticky">
      {/* Izquierda */}
      <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
        <FaStore className="w-7 h-7 text-blue-500" />
        <span className="text-lg text-white font-bold">Sistema Store</span>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <div className="relative">
          <FaBell
            className="w-6 h-6 cursor-pointer hover:text-blue-400 transition"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-gray-900 text-gray-100 rounded-lg shadow-lg z-50 overflow-y-auto max-h-80 backdrop-blur-sm">
              <div className="p-3">
                {userNotifications.length === 0 ? (
                  <p className="text-center text-sm text-gray-400">No tienes notificaciones</p>
                ) : (
                  userNotifications
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .map((noti, index) => (
                      <div
                        key={noti.id}
                      
                      >
                        {!noti.isRead && (
                          <span className="absolute left-1 top-3 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <p className="font-semibold text-sm">{noti.title}</p>
                        <p className="text-xs text-gray-400">{noti.message}</p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(noti.updated_at).toLocaleString()}
                        </p>
                        {index !== userNotifications.length - 1 && (
                          <hr className="my-2 border-gray-700" />
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full cursor-pointer transition"
          >
            <FaUserCircle className="w-6 h-6 text-blue-500" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold truncate">Hola, {user?.name}</span>
                <span className="text-[10px] bg-blue-600 text-white rounded-full px-2 py-0.5">
                {user?.role?.toUpperCase()}
                </span>
            </div>
            <FaCog className="w-4 h-4 hidden md:inline text-gray-400" />
            <FaChevronDown className="w-3 h-3 hidden md:inline text-gray-400" />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
            
              <div className="border-t border-gray-700" />
              <div
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm"
                onClick={handleLogOut}
              >
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
