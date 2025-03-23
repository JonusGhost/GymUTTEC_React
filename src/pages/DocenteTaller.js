import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { obtenerTallerPorDocente } from "../services/api";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function DocenteTaller() {
    const [taller, setTaller] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "D") {
            navigate("/");
            return;
        }

        const cargarTaller = async () => {
            try {
                const response = await obtenerTallerPorDocente(user.idUsuario);
                setTaller(response.data);
            } catch (error) {
                console.error("Error al obtener el taller", error);
            }
        };

        cargarTaller();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
        <div className="container-fluid p-0">
                <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
                    <Container>
                        <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/TalleresGestion" className="text-white">Talleres</Nav.Link>
                                <Nav.Link href="/GimnasiosGestion" className="text-white">Gimnasios</Nav.Link>
                                <Nav.Link href="/InformacionDocente" className="text-white">Datos</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

        </>
    );
}
