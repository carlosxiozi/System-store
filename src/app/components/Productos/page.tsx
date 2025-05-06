'use client';

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useProducto } from '@/app/hooks/useProductos';
import { updateProductoApi, deleteProductoApi, createProductoApi } from '@/app/helpers/Producto';
import Loading from '@/app/Loading/page';
import ModalComponent from '@/app/components/Productos/Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';
import ProductosTable from '@/app/components/Productos/components/table';
import ButtonExcel from '@/app/components/Buttonexcel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { usePagination } from '@/app/hooks/usePagination';

const ProductosPage = () => {
    const { producto: catalogoDataFromApi = { data: [] }, loading, error } = useProducto();
    const [showModal, setShowModal] = useState(false);
    const [initialData, setInitialData] = useState({ name: '', descripcion: '', code: '', precio: 0, categoria_id: 0 });

    // 👉 USANDO EL HOOK CON ESTADO INTERNO
    const { currentRows, totalPages, currentPage, handleChangePage, handleSearchChange, search } =
        usePagination(catalogoDataFromApi?.data || [], 'productos');

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '', code: '', precio: 0, categoria_id: 0 });
        setShowModal(true);
    };

    const handleExportExcel = () => {
        const dataToExport = catalogoDataFromApi?.data.map(({ id, name, descripcion, precio, categoria_id, code }) => ({
            ID: id,
            Nombre: name,
            Descripción: descripcion,
            Precio: precio,
            Categoría: categoria_id,
            Código: code,
        }));
        if (!dataToExport) {
            sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'No hay datos para exportar.' });
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'productos.xlsx');
    };

    const handleSave = async (data: typeof initialData & { id?: number }) => {
        try {
            if (data.id && data.id > 0) await updateProductoApi(data);
            else await createProductoApi(data);
            sweatAlert2.fire({ icon: 'success', title: 'Éxito', text: data.id ? 'Producto actualizado' : 'Producto creado' });
            setTimeout(() => window.location.reload(), 1000);
        } catch {
            sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al guardar el producto.' });
        } finally {
            setShowModal(false);
        }
    };

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
                    await deleteProductoApi(id);
                    sweatAlert2.fire({ icon: 'success', title: 'Eliminado', text: 'El producto ha sido eliminado.' });
                    setTimeout(() => window.location.reload(), 1000);
                } catch {
                    sweatAlert2.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al eliminar el producto.' });
                }
            }
        });
    };

    const handleEditClick = (producto: typeof initialData & { id: number }) => {
        setInitialData(producto);
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: Ocurrió un error inesperado.</div>;

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <ButtonExcel />
                    <button
                        onClick={handleExportExcel}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Exportar Excel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        Crear Producto
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nombre, código o precio..."
                    className="border rounded px-4 bg-gray-100  py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>
    
            <ProductosTable data={currentRows} handleEditClick={handleEditClick} handleDelete={handleDelete} />
    
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex -space-x-px">
                        <button
                            className={`px-3 py-1 border rounded-l ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleChangePage(Math.max(currentPage - 1, 1))}
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
                            onClick={() => handleChangePage(Math.min(currentPage + 1, totalPages))}
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

export default ProductosPage;
