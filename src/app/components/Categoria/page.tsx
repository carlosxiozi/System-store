'use client';

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCatalogo } from '@/app/hooks/useCatalogo';
import { updateCatalogoApi, deleteCatalogoApi, createCatalogoApi } from '@/app/helpers/catalogoApi';
import { usePagination } from '@/app/hooks/usePaginacion';
import Loading from '@/app/Loading/page';
import CustomPagination from '@/app/components/Pagination/page';
import ModalComponent from './Modal/ModalComponent';
import sweatAlert2 from 'sweetalert2';

const CategoriaPage: React.FC = () => {
    // Hooks al principio del componente (en el mismo orden)
    const { catalogo: catalogoDataFromApi = { data: [] }, loading, error } = useCatalogo();
    const [currentPage, setCurrentPage] = useState(1);
    const { rowsPerPage, totalPages } = usePagination(catalogoDataFromApi?.data || [], currentPage);
    const [showModal, setShowModal] = useState(false); // No debe cambiar de orden
    const [initialData, setInitialData] = useState<{ id?: number; name: string; descripcion: string }>({
        name: '',
        descripcion: ''
    });


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
        setCurrentPage(page);
    };

    const handleCreate = () => {
        setInitialData({ name: '', descripcion: '' });
        setShowModal(true);
    };

    const handleSave = async (data: { id?: number; name: string; descripcion: string }) => {
        try {
            let result;
            if (data.id) {
                result = await updateCatalogoApi(data);
                console.log('Categoría actualizada:', result);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoría actualizada exitosamente.',
                });
            } else {
                result = await createCatalogoApi(data);
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

export default CategoriaPage;
