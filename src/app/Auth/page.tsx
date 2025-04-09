'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Login from '@/app/helpers/auth';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const router = useRouter();

    interface User {
        email: string;
        password: string;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); 

        if (e.currentTarget.checkValidity() === false) {
            setValidated(true);
            return;  
        }
        setValidated(true); 

        const user: User = {
            email,
            password
        };

        try {
            const response = await Login(user); 
            if (response.type === 'success') {
                localStorage.setItem('token', response.token || '');  
                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    icon: "success",
                    draggable: true
                });
                router.push('components/Dashboard');      
            } 
        } catch  {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo un error al intentar iniciar sesión.",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-400">
            <div className="bg-white p-8 rounded shadow-md w-2xl h-124 flex">
                <div className="w-1/2 flex items-center justify-center">
                    <img src="/tienda.jpg" className="h-full w-full object-cover" />
                </div>
                <div className="w-1/2 flex flex-col justify-center px-8">
                    <p className="text-black">Sistema Tienda</p>
                    <h2 className="text-2xl text-black mb-6 text-center p-4">Iniciar Sesión</h2>
                    
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group  className="mb-4"  as={Col} md="12" controlId="validationCustom01">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingresa un email válido
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                            />
                            <Form.Control.Feedback type="invalid">
                                La contraseña debe tener al menos 6 caracteres
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className='w-48 items-end justify-end' type="submit">Iniciar sesión</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Auth;
