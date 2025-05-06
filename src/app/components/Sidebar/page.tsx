"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { IoIosCloseCircle, IoMdSettings } from "react-icons/io";
import { MdDashboard, MdMiscellaneousServices, MdWorkHistory } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";
import { FaUsers, FaUserShield, FaCalendarAlt } from "react-icons/fa";
import { BsFillBoxFill } from "react-icons/bs";
const handleLogOut = async () => {
    await fetch("/api/logout");
    window.location.href = "/";
};

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const sections = [
        { name: "Ventas", icon: MdDashboard, path: "/components/Dashboard" },
        { name: "Usuarios", icon: FaUsers, path: "/components/Usuarios" },
        { name: "Roles", icon: FaUserShield, path: "/components/Roles" },
        { name: "Configuración", icon: IoMdSettings, path: "/components/Config" },
        { name: "Deudores", icon: MdMiscellaneousServices, path: "/components/Tratamientos" },
        { name: "Reportes", icon: FaCalendarAlt, path: "/components/Reportes" },
        { name: "Categorias", icon: TbClipboardList, path: "/components/Categoria" },
        { name: "Productos", icon: MdWorkHistory, path: "/components/Productos" },
    ];

    return (
        <>
            {/* Botón menú móvil */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition"
                aria-label="Abrir menú"
            >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>

            {/* Fondo oscuro al abrir menú móvil */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:static
         w-48 md:w-56 bg-gray-800 text-white flex flex-col px-6 py-2 min-h-screen shadow-xl`}
            >
                <div className="flex justify-center ">
                    <Image
                        src="/tienda.jpg"
                        width={60}
                        height={60}
                        alt="Logo Tienda"
                        className="rounded-full border-2 border-white"
                    />
                </div>

                <hr className="border-gray-700 mb-4" />

                {/* Navegación */}
                <nav className="flex flex-col w-full flex-1">
                    {sections.map(({ name, icon: Icon, path }) => {
                        const isActive = pathname === path;
                        return (
                            <Link
                                key={path}
                                href={path}
                                onClick={() => setIsOpen(false)}
                                style={{ textDecoration: 'none' }}
                                className={`flex items-center gap-3 px-3  py-2 rounded-lg text-base transition-colors ${isActive
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                        : "hover:bg-blue-500 hover:text-white text-gray-300"
                                    }`}
                            >
                                <Icon
                                    className={`h-6 w-6 ${isActive ? "text-white" : "text-white group-hover:text-white"
                                        }`}
                                />
                                <span className="font-medium text-white">{name}</span>
                            </Link>



                        );
                    })}

                    {/* Botón cerrar sesión */}
                    <button
                        onClick={async () => {
                            await handleLogOut();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-600 hover:text-white transition-colors mt-4"
                    >
                        <IoIosCloseCircle className="h-5 w-5" />
                        <span>Cerrar sesión</span>
                    </button>
                </nav>

                {/* Versión */}
                <div className="text-center text-md text-white mt-6 hidden md:block">
                    <BsFillBoxFill className="h-5 w-5 mb-1 mx-auto" />
                    <span className="text-gray-400">Versión:</span> 1.0.0
                    Sistema Store
                </div>
            </aside>
        </>
    );
}
