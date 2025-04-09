'use client';

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useProducto } from '@/app/hooks/useProductos';
import { updateProductoApi, deleteProductoApi, createProductoApi } from '@/app/helpers/Producto';
import { usePagination } from '@/app/hooks/usePaginacion';
import Loading from '@/app/Loading/page';
import CustomPagination from '@/app/components/Pagination/page';
import ModalComponent from './Modal/page';
import sweatAlert2 from 'sweetalert2';
// import * as XLSX from 'xlsx'; // Remove if unused
import ButtonExcel from '@/app/components/Buttonexcel';
const ProductosPage: React.FC = () => {
    // Hooks al principio del componente (en el mismo orden)
    const { producto: catalogoDataFromApi = { data: [] }, loading, error } = useProducto();

    const [currentPage, setCurrentPage] = useState(1);
    
    const { rowsPerPage, totalPages } = usePagination(catalogoDataFromApi?.data || [], currentPage);
    const [showModal, setShowModal] = useState(false); // No debe cambiar de orden
    const [initialData, setInitialData] = useState<{ id?: number; name: string; descripcion: string; code: string; precio: number; categoria_id: number }>({
        name: '',
        descripcion: '',
        code: '',
        precio: 0,
        categoria_id: 0
    });

    const paginatedData = Array.isArray(catalogoDataFromApi?.data) 
    ? catalogoDataFromApi?.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) 
    : [];


    // Funciones de manejo
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
                        await deleteProductoApi(id);
                        sweatAlert2.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'La categoría ha sido eliminada.',
                        });
                        // Recargar la página después de eliminar
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } catch {
                        sweatAlert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Ocurrió un error al eliminar la categoría.',
                        });
                    }
                }
            });
    };

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '', code: '', precio: 0, categoria_id: 0 });
        setShowModal(true);
    };

    const handleSave = async (data: { id?: number; name: string; descripcion: string }) => {
        try {
            let result;
            if (data.id) {
                // Si hay un id, estamos editando
                result = await updateProductoApi(data);
                console.log('Categoría actualizada:', result);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoría actualizada exitosamente.',
                });
            } else {
                // Si no hay id, estamos creando
                result = await createProductoApi(data);
                console.log('Categoría creada:', result);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoría creada exitosamente.',
                });
            }

            // Recargar la página después de guardar
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch  {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar la categoría.',
            });
        }

        setShowModal(false);
    };

    const handleEditClick = (productos: { id: number; name: string; descripcion: string, precio: number, categoria_id: number }) => {
        setInitialData({
            id: productos.id,
            name: productos.name,
            descripcion: productos.descripcion,
            code: productos.code || '',
            precio: productos.precio,
            categoria_id: productos.categoria_id
        });
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: Ocurrió un error inesperado: Sin resultados</div>;


    return (
        <div className="container mt-4">
            <div className="flex justify-content-between mb-3">
                <h2>Productos</h2>
                <ButtonExcel  ></ButtonExcel>
                <Button variant="primary" onClick={handleCreate}>
                    Crear Producto
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>precio</th>
                        <th>categoria</th>
                        <th>code</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData?.map((productos: { id: number; name: string; descripcion: string; precio: number; code: string; categoria_id: number }) => (
                        <tr key={productos.id}>
                            <td>{productos.id}</td>
                            <td>{productos.name}</td>
                            <td>{productos.descripcion}</td>
                            <td>{productos.precio}</td>
                            <td>{productos.code}</td>
                            <td>{productos.categoria_id}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditClick(productos)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(productos.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handleChangePage}
            />
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
