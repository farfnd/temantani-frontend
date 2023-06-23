import React, { useContext, useEffect } from "react"
import { UserOutlined } from "@ant-design/icons"
import { Avatar, Modal } from "antd"
import { Button, Card, Col, Row, Spinner } from "react-bootstrap"
import config from "../../../../config"
import { Link, useHistory, useLocation } from "react-router-dom"
import { UserContext } from "../../../../Contexts/UserContext"

const Sider = () => {
    const {
        user,
        fetchUserIfEmpty,
    } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
    }, []);

    const history = useHistory();
    const location = useLocation();

    const handleLogout = () => {
        Modal.confirm({
            title: 'Logout',
            content: 'Apakah Anda yakin ingin keluar?',
            onOk: () => {
                history.push('/logout');
            },
        });
    };


    const isActivePath = (path) => {
        if (path === '/store/me/orders') return location.pathname === path || location.pathname === '/store/me';
        return location.pathname === path;
    };

    const SideButton = ({ path, text }) => {
        return (
            <Row className="mb-3">
                <Col>
                    <Link to={path}>
                        <Button
                            variant="outline-primary"
                            className={`w-100 ${isActivePath(path) ? 'active' : ''}`}
                        >
                            {text}
                        </Button>
                    </Link>
                </Col>
            </Row>
        );
    };

    return (
        <Col sm={4}>
            <Row>
                <Col>
                    <Card>
                        <Card.Title className="my-0">
                            {
                                user ? (
                                    <Row className="align-middle">
                                        <Col md={2}>
                                            {user.profilePictureUrl ? (
                                                <Avatar src={`${config.api.userService}/images/${user.profilePictureUrl}`} size={50} />
                                            ) : (
                                                <Avatar size={50} icon={<UserOutlined />} />
                                            )}
                                        </Col>
                                        <Col md={10}>
                                            <Row>
                                                <h5 className="mb-1">Halo, {user?.name}</h5>
                                            </Row>
                                            <Row>
                                                <h6 className="text-muted m-0">Pembeli</h6>
                                            </Row>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Row className="align-middle">
                                        <Col md={2}>
                                            <Spinner animation="border" />
                                        </Col>
                                        <Col md={10}>
                                            <Row>
                                                <h5 className="mb-1">Halo, </h5>
                                            </Row>
                                            <Row>
                                                <h6 className="text-muted m-0">Pembeli</h6>
                                            </Row>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Card.Title>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <SideButton path="/store/me/orders" text="Pesanan Saya" />
                            <SideButton path="/store/me/addresses" text="Alamat Saya" />
                            {/* <SideButton path="/store/me/profile" text="Profil Saya" /> */}
                            <Row className="mt-3">
                                <Col>
                                    <Button variant="outline-danger" className="w-100" onClick={handleLogout}>Logout</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Col>
    )
}

export default Sider