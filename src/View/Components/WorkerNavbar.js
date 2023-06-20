import { Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { UserContext } from "../../Contexts/UserContext";
import React, { useContext } from "react";
import config from "../../config";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const WorkerNavbar = (props) => {
    const { user } = useContext(UserContext);

    return (
        <>
            <Navbar expand="lg" bg="success" variant="dark">
                <Container style={{ maxWidth: '100%' }}>
                    <Navbar.Brand><Link to="/" className="nav-link">TemanTani</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" id="navLinks">
                            <Link to="/worker" className="nav-link">Dashboard</Link>
                            <Link to="/worker/projects" className="nav-link">Proyek</Link>
                        </Nav>
                        <Nav>
                            <NavDropdown drop="start" title={
                                <div className="d-flex align-items-center">
                                    {user.profilePictureUrl ? (
                                        <Avatar src={`${config.api.userService}/images/${user.profilePictureUrl}`} size={30} />
                                    ) : (
                                        <Avatar size={30} icon={<UserOutlined />} />
                                    )}
                                    <span className="mx-2">{user.name}</span>
                                </div>
                            } id="basic-nav-dropdown">
                                <NavDropdown.Item href="/worker/profile">Profil</NavDropdown.Item>
                                <NavDropdown.Item href="/change-password">Change Password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="/logout">Logout</Link></NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default WorkerNavbar;
