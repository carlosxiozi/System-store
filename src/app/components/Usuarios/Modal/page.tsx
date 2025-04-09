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
        id?: number;
        name?: string;
        email?: string;
        role?: string;
        password?: string;
        created_at?: string;
        updated_at?: string;
    };
    onSave: (data: { id?: number; name: string; email: string; role: string; password?: string }) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ show, handleClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        password: '',
        created_at: '',
        updated_at: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                role: initialData.role || '',
                password: '', // Password should not be pre-filled for security reasons
                created_at: initialData.created_at || '',
                updated_at: initialData.updated_at || '',
            });
        } else {
            setFormData({ name: '', email: '', role: '', password: '', created_at: '', updated_at: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.role ) {
            sweatAlert2.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos requeridos.',
            });
            return;
        }

        const dataToSave = initialData
            ? { id: initialData.id, name: formData.name, email: formData.email, role: formData.role, password: formData.password }
            : { name: formData.name, email: formData.email, role: formData.role, password: formData.password };

        onSave(dataToSave);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
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
                            placeholder="Nombre del usuario"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email del usuario"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña del usuario"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            aria-label="Default select example"
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="Usuario">Usuario</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {initialData ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;
