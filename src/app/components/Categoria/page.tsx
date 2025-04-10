'use client';

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCatalogo } from '@/app/hooks/useCatalogo';
import { updateCatalogoApi, deleteCatalogoApi, createCatalogoApi } from '@/app/helpers/catalogoApi';
import Loading from '@/app/Loading/page';
import ModalComponent from './Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';
import Pagination from 'react-bootstrap/Pagination';

const CategoriaPage: React.FC = () => {
    // Hooks al principio del componente
    const { catalogo: catalogoDataFromApi = { data: [] }, loading, error } = useCatalogo();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);  // Número de filas por página
    const [showModal, setShowModal] = useState(false);
    const [initialData, setInitialData] = useState<{ id?: number; name: string; descripcion: string }>({
        name: '',
        descripcion: ''
    });

    // Total de páginas
    const totalPages = Math.ceil((catalogoDataFromApi?.data?.length || 0) / rowsPerPage);

    // Datos paginados
    const paginatedData = catalogoDataFromApi?.data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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
                        await deleteCatalogoApi(id);
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
        if (page < 1) {
            page = 1;
        } else if (page > totalPages) {
            page = totalPages;
        }
        setCurrentPage(page);
    };

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '' });
        setShowModal(true);
    };

    const handleSave = async (data: { id?: number; name: string; descripcion: string }) => {
        try {
            
            if (data.id) {
                await updateCatalogoApi(data);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoría actualizada exitosamente.',
                });
            } else {
                await createCatalogoApi(data);
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

        } catch {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar la categoría.',
            });
        }

        setShowModal(false);
    };

    const handleEditClick = (categoria: { id: number; name: string; descripcion: string }) => {
        setInitialData({
            id: categoria.id,
            name: categoria.name,
            descripcion: categoria.descripcion
        });
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: Ocurrió un error inesperado: Sin resultados</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Categorías</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Crear Categoría
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((categoria: { id: number; name: string; descripcion: string }) => (
                        <tr key={categoria.id}>
                            <td>{categoria.id}</td>
                            <td>{categoria.name}</td>
                            <td>{categoria.descripcion}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditClick(categoria)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(categoria.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación de React Bootstrap */}
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
