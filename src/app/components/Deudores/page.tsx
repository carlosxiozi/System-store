'use client';

import { useState } from 'react';
import TableComponent from './components/TableComponent';
import { useGetNotes } from '@/app/hooks/useNotes';
import ModalComponent from './components/ModalComponent';
import Loading from '@/app/Loading/page';
import { create, update, destroy } from '@/app/helpers/Notes';
import Swal from 'sweetalert2';
import { usePagination } from '@/app/hooks/usePagination';


interface Deudor {
    id: number;
    cliente: string;
    monto_total: number;
    monto_pagado: number;
    saldo_pendiente: number;
    estado: 'pendiente' | 'pagado';
    observaciones?: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

export default function DeudoresPage() {
    const { notes: fetchedNotes = { data: [] }, loading } = useGetNotes();
    const [showModal, setShowModal] = useState(false);

    const { currentRows, totalPages, currentPage, handleChangePage, handleSearchChange, search } =
        usePagination(fetchedNotes?.data || [], 'deudores');
    const [initialData, setInitialData] = useState<Deudor>({
        id: 0,
        cliente: '',
        monto_total: 0,
        monto_pagado: 0,
        saldo_pendiente: 0,
        estado: 'pendiente',
        observaciones: '',
        user_id: 1,
    });

    const handleCreate = () => {
        setInitialData({
            id: 0,
            cliente: '',
            monto_total: 0,
            monto_pagado: 0,
            saldo_pendiente: 0,
            estado: 'pendiente',
            observaciones: '',
            user_id: 1,
        });
        setShowModal(true);
    };

    const handleEditClick = (deudor: Deudor) => {
        setInitialData(deudor);
        setShowModal(true);
    };
    const handleDelete = async (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás recuperar este deudor después de eliminarlo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await destroy(id);
                    if (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deudor eliminado correctamente',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                } catch {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar el deudor',
                        text: 'Intenta nuevamente más tarde.',
                    });
                }
            }
        });
    };
    const handleSave = async (nuevo: Deudor) => {
        try {
            if (Number(nuevo.id) > 0) {
                const response = await update(nuevo);
                if (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deudor actualizado correctamente',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } else {

                const response = await create(nuevo);
                if (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deudor creado correctamente',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    setInitialData({
                        id: 0,
                        cliente: '',
                        monto_total: 0,
                        monto_pagado: 0,
                        saldo_pendiente: 0,
                        estado: 'pendiente',
                        observaciones: '',
                        user_id: 1,
                    });
                }
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Error con el deudor',
                text: 'Intenta nuevamente más tarde.',
            });
        } finally {
            setShowModal(false);
        }
    };

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Listado de Deudores</h1>
                <input
                    type="text"
                    placeholder="Buscar deudor por nombre"
                    className="border bg-white border-gray-300 rounded px-4 py-2 w-1/3"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                    Crear Deudor
                </button>
            </div>

            {loading ? (
                <Loading />
            ) : (
                <TableComponent
                    deudores={(currentRows).map((note: Deudor) => ({
                        id: note.id,
                        cliente: note.cliente,
                        monto_total: note.monto_total,
                        monto_pagado: note.monto_pagado,
                        saldo_pendiente: note.saldo_pendiente,
                        estado: note.estado === 'pagado' ? 'pagado' : 'pendiente',
                        observaciones: note.observaciones || '',
                        user_id: Number(note.user_id),
                        created_at: note.created_at,
                        updated_at: note.updated_at,
                    }))}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                />

            )}
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
        </main>
    );
}
