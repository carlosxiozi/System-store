'use client';

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useProducto } from '@/app/hooks/useProductos';
import { updateProductoApi, deleteProductoApi, createProductoApi } from '@/app/helpers/Producto';
import { usePagination } from '@/app/hooks/usePaginacion';
import Loading from '@/app/Loading/page';
import ModalComponent from '@/app/components/Productos/Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';
import Pagination from 'react-bootstrap/Pagination';
import ButtonExcel from '@/app/components/Buttonexcel';

const ProductosPage: React.FC = () => {
    const { producto: catalogoDataFromApi = { data: [] }, loading, error } = useProducto();
    const [currentPage, setCurrentPage] = useState(1);
    const { rowsPerPage } = usePagination(catalogoDataFromApi?.data || [], currentPage);
    const [showModal, setShowModal] = useState(false);
    const [initialData, setInitialData] = useState({
        name: '',
        descripcion: '',
        code: '',
        precio: 0,
        categoria_id: 0
    });
    const [search, setSearch] = useState('');

    // 🔍 Filtro local por nombre, código o precio
    const filteredData = catalogoDataFromApi?.data?.filter((producto: { id: number; name: string; descripcion: string; code: string; precio: number; categoria_id: number }) => {
        const searchLower = search.toLowerCase();
        return (
            producto.name.toLowerCase().includes(searchLower) ||
            producto.code.toLowerCase().includes(searchLower) ||
            producto.precio.toString().includes(searchLower)
        );
    }) || [];

    // 📄 Paginación del resultado filtrado
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleChangePage = (page: number) => setCurrentPage(page);

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '', code: '', precio: 0, categoria_id: 0 });
        setShowModal(true);
    };

    const handleSave = async (data: any) => {
        try {
            const result = data.id ? await updateProductoApi(data) : await createProductoApi(data);

            sweatAlert2.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.id ? 'Producto actualizado exitosamente.' : 'Producto creado exitosamente.',
            });

            setTimeout(() => window.location.reload(), 1000);
        } catch {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar el producto.',
            });
        }
        setShowModal(false);
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
                        await deleteProductoApi(id);
                        sweatAlert2.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El producto ha sido eliminado.',
                        });
                        setTimeout(() => window.location.reload(), 1000);
                    } catch {
                        sweatAlert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Ocurrió un error al eliminar el producto.',
                        });
                    }
                }
            });
    };

    const handleEditClick = (producto: any) => {
        setInitialData(producto);
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: Ocurrió un error inesperado.</div>;

    return (
        <div className="container ">
            <div className="container mt-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <h2 className="mb-0 me-auto">Productos</h2>

                    <div className="d-flex flex-wrap gap-2" style={{ minWidth: '300px', flex: 1 }}>
                        <div className="flex-grow-1">
                            <ButtonExcel />
                        </div>

                        <div className="flex-grow-1">
                            <Button variant="primary" className="w-50" onClick={handleCreate}>
                                Crear Producto
                            </Button>
                        </div>

                        <div className="flex-grow-1 w-100">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, código o precio..."
                                className="form-control w-100"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Código</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((producto: { id: number; name: string; descripcion: string; code: string; precio: number; categoria_id: number }) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.name}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.categoria_id}</td>
                                <td>{producto.code}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(producto)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(producto.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">No se encontraron productos.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {filteredData.length > rowsPerPage && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={currentPage === index + 1}
                                onClick={() => handleChangePage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
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
