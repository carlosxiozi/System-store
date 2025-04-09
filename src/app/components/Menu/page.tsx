"use client";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
function NavbarComponent() {
  const handleCerrar = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        
        <Col xs={6} md={4}>
             <Image src="/tienda.jpg" roundedCircle style={{height:"50px",width:"50px"}} alt='' />
        </Col>
        <Container>
          <Navbar.Brand href="/components/Dashboard">Sistema Tienda</Navbar.Brand>
          <Nav className="justify-content-end">
          <Nav.Link href="/components/Usuarios">Usuarios</Nav.Link>
            <Nav.Link href="/components/Categoria">Categoria</Nav.Link>
            <Nav.Link href="/components/Productos">Productos</Nav.Link>
            <Nav.Link href="/components/Dashboard">Ventas</Nav.Link>
            <Nav.Link href="/components/Reportes">Reportes</Nav.Link>
            <Nav.Link onClick={handleCerrar}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  
    </>
  );
}

export default NavbarComponent;