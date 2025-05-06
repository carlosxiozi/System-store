'use client';

import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useCatalogo } from '@/app/hooks/useCatalogo';
import { updateCatalogoApi, deleteCatalogoApi, createCatalogoApi } from '@/app/helpers/catalogoApi';
import Loading from '@/app/Loading/page';
import ModalComponent from './Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';

const CategoriaPage: React.FC = () => {
    const { catalogo: catalogoDataFromApi = { data: [] as { id: number; name: string; descripcion: string }[] }, loading, error } = useCatalogo();
    const [showModal, setShowModal] = useState(false);
    const [initialData, setInitialData] = useState<{ id?: number; name: string; descripcion: string }>({ name: '', descripcion: '' });

    const rowsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil((catalogoDataFromApi?.data?.length ?? 0) / rowsPerPage));

    const paginatedData = catalogoDataFromApi?.data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleDelete = (id: number) => {
        sweatAlert2.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCatalogoApi(id);
                    sweatAlert2.fire({ icon: 'success', title: 'Eliminado', text: 'La categoría ha sido eliminada.' });
                    setTimeout(() => window.location.reload(), 1000);
                } catch {
                    sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al eliminar la categoría.' });
                }
            }
        });
    };

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '' });
        setShowModal(true);
    };

    const handleSave = async (data: typeof initialData) => {
        try {
            if (data.id) {
                await updateCatalogoApi(data);
                sweatAlert2.fire({ icon: 'success', title: 'Éxito', text: 'Categoría actualizada exitosamente.' });
            } else {
                await createCatalogoApi(data);
                sweatAlert2.fire({ icon: 'success', title: 'Éxito', text: 'Categoría creada exitosamente.' });
            }
            setTimeout(() => window.location.reload(), 1000);
        } catch {
            sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al guardar la categoría.' });
        } finally {
            setShowModal(false);
        }
    };

    const handleEditClick = (categoria: typeof initialData & { id: number }) => {
        setInitialData(categoria);
        setShowModal(true);
    };

    const handleChangePage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-center text-red-500">Error: Ocurrió un error inesperado</div>;

    return (
        <div className="max-w-screen-lg mx-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                    Crear Categoría
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(paginatedData ?? []).length > 0 ? (
                            paginatedData?.map((categoria) => (
                                <tr key={categoria.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm text-gray-700">{categoria.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{categoria.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{categoria.descripcion}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleEditClick(categoria)}
                                            className="inline-flex items-center px-2 py-1 text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition"
                                        >
                                            <FiEdit className="mr-1" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(categoria.id)}
                                            className="inline-flex items-center px-2 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition ml-2"
                                        >
                                            <FiTrash2 className="mr-1" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No se encontraron categorías.</td>
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
                            onClick={() => handleChangePage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
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
                            onClick={() => handleChangePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
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

export default CategoriaPage;
