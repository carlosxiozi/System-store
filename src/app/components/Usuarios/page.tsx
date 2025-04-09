'use client';

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUsuarioData } from '@/app/hooks/useUsuario';
import { updateUsuario, deleteUsario, createUsuarios } from '@/app/helpers/Usuario';
import { usePagination } from '@/app/hooks/usePaginacion';
import Loading from '@/app/Loading/page';
import CustomPagination from '@/app/components/Pagination/page';
import ModalComponent from './Modal/page';
import sweatAlert2 from 'sweetalert2';

const ProductosPage: React.FC = () => {
    // Hooks al principio del componente (en el mismo orden)
    const { usuarios: catalogoDataFromApi = { data: [] }, loading, error } = useUsuarioData();
    const [currentPage, setCurrentPage] = useState(1);
    const { rowsPerPage, totalPages } = usePagination(catalogoDataFromApi?.data || [], currentPage);
    const [showModal, setShowModal] = useState(false); // No debe cambiar de orden
    const [initialData, setInitialData] = useState<{ id?: number; name: string; email?: string;role:string;created_at:string;updated_at:string }>({
        name: '',
        email: '',
        role: '',
        created_at: '',
        updated_at: '',
    });

    const paginatedData = catalogoDataFromApi?.slice(
        (currentPage - 1) * rowsPerPage, // Índice de inicio
        currentPage * rowsPerPage         // Índice de fin (no inclusivo)
    ) || [];
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
                        await deleteUsario(id);
                        sweatAlert2.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'La categoría ha sido eliminada.',
                        });
                        // Recargar la página después de eliminar
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } catch (error) {
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
        console.log('Crear usuario');
        setInitialData({ name: '', email: '', role: '', created_at: '', updated_at: '' });
        setShowModal(true);
    };

    const handleSave = async (data: { id?: number; name: string; email:string;role:string;created_at:string;updated_at:string }) => {
        try {
            let result;
            if (data.id) {
                // Si hay un id, estamos editando
                result = await updateUsuario(data);
                console.log('usuario actualizada:', result);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoría actualizada exitosamente.',
                });
            } else {
                // Si no hay id, estamos creando
                result = await createUsuarios(data);
                console.log('usuario creada:', result);
                sweatAlert2.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'usuario creada exitosamente.',
                });
            }

            // Recargar la página después de guardar
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar el usuario.',
            });
        }
        
        setShowModal(false);
    };

    const handleEditClick = (usuario: { id: number; name: string; email:string;role:string;created_at:string;updated_at:string }) => {
        setInitialData({
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
            created_at: usuario.created_at,
            updated_at: usuario.updated_at,
        });
        setShowModal(true);
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: Ocurrió un error inesperado: Sin resultados</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Usuarios</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Crear usuarios
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>role</th>
                        <th>created</th>
                        <th>updated</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((usuario: { id: number; name: string; email:string;role:string;created_at:string;updated_at:string }) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.name}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.role}</td>
                            <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                            <td>{new Date(usuario.updated_at).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditClick(usuario)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(usuario.id)}
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
                rowsPerPage={rowsPerPage}
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
