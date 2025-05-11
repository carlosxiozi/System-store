'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { FaUserCircle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Login from '@/app/helpers/auth';

import { useEffect } from 'react';
function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [loadingText, setLoadingText] = useState('Cargando');
useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        router.push('/components/Dashboard');
    }
}, [router]);


    useEffect(() => {
        if (!isLoading) {
            setLoadingText('Cargando');
            return;
        }

        let dots = '';
        const interval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            setLoadingText(`Cargando${dots}`);
        }, 400);

        return () => clearInterval(interval);
    }, [isLoading]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await Login({ email, password });

            if (response.type === 'success') {
                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });

                router.push('/components/Dashboard'); 
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.message || "Credenciales incorrectas.",
                });
            }
        } catch (error) {
            console.error('Error en login:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo un error al intentar iniciar sesión.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-screen h-screen relative overflow-hidden">
            {/* Imagen de fondo con desenfoque */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/etienda.jpg"
                    alt="Tienda"
                    fill
                    className="object-cover filter blur-sm brightness-90"
                    priority
                />
            </div>

            {/* Contenedor centrado */}
            <div className="absolute inset-0 z-10 flex items-center justify-center h-full">
                <div className="flex flex-col md:flex-row bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
                    {/* Imagen decorativa del lado izquierdo */}
                    <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/img.jpg')" }} />

                    {/* Formulario de login del lado derecho */}
                    <div className="w-full md:w-1/2 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <FaUserCircle className="text-blue-600" size={64} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
                        <p className="text-gray-600 mb-6">
                            Bienvenido de nuevo. Inicia sesión para continuar.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="mb-4 text-left">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                    Correo electrónico
                                </label>
                                <div className="flex items-center border rounded-lg px-3">
                                    <FaEnvelope className="text-gray-400 mr-2" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="correo@ejemplo.com"
                                        className="w-full py-2 focus:outline-none text-black font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="mb-6 text-left relative">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <div className="flex items-center border rounded-lg px-3 relative">
                                    <FaLock className="text-gray-400 mr-2" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="********"
                                        className="w-full py-2 pr-8 focus:outline-none text-black font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? loadingText : 'Iniciar sesión'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
