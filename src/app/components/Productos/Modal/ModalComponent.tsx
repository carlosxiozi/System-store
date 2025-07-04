'use client';

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import sweatAlert2 from 'sweetalert2';
import { getCategoriasApi } from '@/app/helpers/Producto';


export interface ModalProps {
    show: boolean;
    handleClose: () => void;
    initialData?: {
        id?: number;
        name?: string;
        descripcion?: string;
        precio?: number;
        code?: string;
        categoria_id?: number;
    };
    onSave: (data: { id?: number; name: string; descripcion: string; precio: number; code: string; categoria_id: number }) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ show, handleClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        descripcion: 'descripcion',
        precio: 0,
        code: '',
        categoria_id: 0,
    });
    const [data, setData] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                descripcion: initialData.descripcion || 'descripcion',
                precio: initialData.precio || 0,
                code: initialData.code || '',
                categoria_id: initialData.categoria_id || 0,
            });
            const fecthData = async () => {
                const response = await getCategoriasApi();
                setData(response.data);
            }
            fecthData();
        } else {
            setFormData({ name: '', descripcion: '', precio: 0, code: '', categoria_id: 0 });
            const fecthData = async () => {
                const response = await getCategoriasApi();
                setData(response.data);
            }
            fecthData();
        }
    }, [initialData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'precio' || name === 'categoria_id' ? Number(value) : value,
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.descripcion || !formData.precio || !formData.code || !formData.categoria_id) {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos requeridos.',
            });
            return;
        }

        const dataToSave = initialData ? { ...formData, id: initialData.id } : formData;

        onSave(dataToSave);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Editar Producto' : 'Crear Producto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <Form className="grid grid-cols-2 gap-4">
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            autoFocus
                        />
                    </Form.Group>
                
                    <Form.Group className="mb-3" controlId="formPrecio">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            placeholder="Precio del producto"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCode">
                        <Form.Label>Código</Form.Label>
                        <Form.Control
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Código del producto"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCategoria">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            name="categoria_id"
                            value={formData?.categoria_id || ""}
                            onChange={handleChange}
                            aria-label="Selecciona una categoría"
                        >
                            <option value="" disabled>
                                {data.length > 0
                                    ? "Selecciona una categoría"
                                    : "No hay categorías disponibles"}
                            </option>

                            {data.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.name}
                                    </option>
                                ))}
                        </Form.Select>



                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {initialData ? 'Actualizar Producto' : 'Guardar Producto'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalComponent;
