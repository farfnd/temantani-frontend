import { Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { UserContext } from "../../Contexts/UserContext";
import React, { useContext } from "react";
import config from "../../config";

const WorkerNavbar = (props) => {
    const { user } = useContext(UserContext);

    return (
        <>
            <Navbar expand="lg" bg="success" variant="dark">
                <Container style={{ maxWidth: '100%' }}>
                    <Navbar.Brand href="#home">TemanTani</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" id="navLinks">
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown drop="start" title={
                                <div className="d-flex align-items-center">
                                    <Image src={`${config.api.userService}/images/${user.profilePictureUrl}`} roundedCircle style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                                    {user.name}
                                </div>
                            } id="basic-nav-dropdown">
                                <NavDropdown.Item href="/edit-profile">Edit Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/change-password">Change Password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default WorkerNavbar;
