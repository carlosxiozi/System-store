'use client';

import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useUsuarioData } from '@/app/hooks/useUsuario';
import { updateUsuario, deleteUsario, createUsuarios } from '@/app/helpers/Usuario';
import { usePagination } from '@/app/hooks/usePagination';
import Loading from '@/app/Loading/page';
import ModalComponent from './Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';

const UsuariosPage: React.FC = () => {
    const { usuarios: catalogoDataFromApi = { data: [] }, loading, error } = useUsuarioData();
    const [showModal, setShowModal] = useState(false);
    const [initialData, setInitialData] = useState<{ id?: number; name: string; email?: string; role: string; created_at?: string; updated_at?: string }>({
        name: '',
        email: '',
        role: '',
    });

    const { currentRows, totalPages, currentPage, handleChangePage, handleSearchChange, search } =
        usePagination(catalogoDataFromApi?.data || [], 'users');
    
    const handleCreate = () => {
        setInitialData({ name: '', email: '', role: '', created_at: '', updated_at: '' });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        sweatAlert2
            .fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esto.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteUsario(id);
                        sweatAlert2.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El usuario ha sido eliminado.',
                        });
                        setTimeout(() => window.location.reload(), 1000);
                    } catch {
                        sweatAlert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Ocurrió un error al eliminar el usuario.',
                        });
                    }
                }
            });
    };

    const handleSave = async (data: typeof initialData & { password?: string }) => {
        try {
            if (data.id) {
                await updateUsuario(data);
                sweatAlert2.fire({ icon: 'success', title: 'Éxito', text: 'Usuario actualizado exitosamente.' });
            } else {
                await createUsuarios(data);
                sweatAlert2.fire({ icon: 'success', title: 'Éxito', text: 'Usuario creado exitosamente.' });
            }
            setTimeout(() => window.location.reload(), 1000);
        } catch {
            sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al guardar el usuario.' });
        } finally {
            setShowModal(false);
        }
    };

    const handleEditClick = (usuario: typeof initialData & { id: number }) => {
        setInitialData(usuario);
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-center text-red-500">Error: Ocurrió un error inesperado</div>;

    return (
        <div className="max-w-screen-lg mx-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        Crear Usuario

                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="border bg-gray-100 rounded px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Rol</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Creado</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Actualizado</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentRows.length > 0 ? (
                            currentRows.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm text-gray-700">{usuario.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{usuario.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{usuario.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{usuario.role}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(usuario.created_at!).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(usuario.updated_at!).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleEditClick(usuario)}
                                            className="inline-flex items-center px-2 py-1 text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition"
                                        >
                                            <FiEdit className="mr-1" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
                                            className="inline-flex items-center px-2 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition ml-2"
                                        >
                                            <FiTrash2 className="mr-1" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No se encontraron usuarios.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex -space-x-px">
                        <button
                            className={`px-3 py-1 border rounded-l ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleChangePage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            {'<'}
                        </button>
                        {(() => {
                            const pages = [];
                            const maxPages = 5;
                            let start = Math.max(currentPage - Math.floor(maxPages / 2), 1);
                            let end = start + maxPages - 1;
                            if (end > totalPages) {
                                end = totalPages;
                                start = Math.max(end - maxPages + 1, 1);
                            }
                            if (start > 1) pages.push(<span key="start" className="px-2">...</span>);
                            for (let i = start; i <= end; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        className={`px-3 py-1 border ${i === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                        onClick={() => handleChangePage(i)}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            if (end < totalPages) pages.push(<span key="end" className="px-2">...</span>);
                            return pages;
                        })()}
                        <button
                            className={`px-3 py-1 border rounded-r ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleChangePage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            {'>'}
                        </button>
                    </nav>
                </div>
            )}

            <ModalComponent
                show={showModal}
                handleClose={() => setShowModal(false)}
                initialData={initialData}
                onSave={handleSave}
            />
        </div>
    );
};

export default UsuariosPage;
