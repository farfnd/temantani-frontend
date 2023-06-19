import { Avatar, Layout, Modal, message } from 'antd';
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../../Contexts/UserContext';

const { Content } = Layout;

const WorkerDashboard = () => {
    const {
        user, setUser,
        role, setRole,
        setLoginStatus,
        fetchUser,
    } = useContext(UserContext);

    useEffect(() => {
        fetchUser();
    }, []);

    const history = useHistory();

    const handleLogout = () => {
        Modal.confirm({
            title: 'Logout',
            content: 'Are you sure you want to logout?',
            onOk: () => {
                history.push('/logout');
            },
        });
    };

    return (
        <Content className="mx-3">
            <Row>
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
                                                        <h5 className="mb-1">Hello, {user?.name}</h5>
                                                    </Row>
                                                    <Row>
                                                        <h6 className="text-muted m-0">Worker</h6>
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
                                                        <h5 className="mb-1">Hello, </h5>
                                                    </Row>
                                                    <Row>
                                                        <h6 className="text-muted m-0">Worker</h6>
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
                                    <Row>
                                        <Col>
                                            <Link to="/worker/profile">
                                                <Button variant="outline-primary" className="w-100">Profil</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Link to="/worker/bank-account">
                                                <Button variant="outline-primary" className="w-100">Kelola Rekening Bank</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Link to="/change-password">
                                                <Button variant="outline-primary" className="w-100">Ganti Password</Button>
                                            </Link>
                                        </Col>
                                    </Row>
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
                <Col sm={8}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Title>Profile</Card.Title>
                                <Card.Body>
                                    <p>Email: {user?.email}</p>
                                    <p>Phone Number: {user?.phoneNumber}</p>
                                    <p>Bank Account:

                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Content>
    );
};

export default WorkerDashboard;
