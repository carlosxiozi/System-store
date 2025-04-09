'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import sweatAlert2 from 'sweetalert2';

interface ModalProps {
    show: boolean;
    handleClose: () => void;
    initialData?: {
        id?: number;   // Agregar el id para la edición
        name?: string;
        descripcion?: string;
    };
    onSave: (data: { id?: number; name: string; descripcion: string }) => void;  // Asegúrate de que el onSave reciba id también en el caso de editar
}

const ModalComponent: React.FC<ModalProps> = ({ show, handleClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({ name: '', descripcion: '' });

    // Se actualiza el formulario con los datos iniciales si existe alguno
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                descripcion: initialData.descripcion || '',
            });
        } else {
            setFormData({ name: '', descripcion: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validación de los campos
        if (!formData.name || !formData.descripcion) {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos requeridos.',
            });
            return;
        }

        // Si estamos editando, agregamos el ID a los datos
        const dataToSave = initialData ? { ...formData, id: initialData.id } : formData;

        // Llamamos a la función onSave para crear o actualizar el catálogo
        onSave(dataToSave);
        handleClose(); // Cerramos el modal después de guardar
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Editar Categoría' : 'Crear Categoría'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre de la categoría"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Descripción de la categoría"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {initialData ? 'Actualizar Categoría' : 'Guardar Categoría'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;
