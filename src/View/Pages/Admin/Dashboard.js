import { Layout } from 'antd';
import { Card, Row, Col, Button } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../Contexts/UserContext';

const { Content } = Layout;

const AdminDashboard = () => {
    const { user, fetchUserIfEmpty, fetchUser } = useContext(UserContext);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Content className="mx-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Title className="my-0">Hello, {user?.name}</Card.Title>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col sm={9}>
                    <Card>
                        <Card.Title>Profile</Card.Title>
                        <Card.Body>
                            <p>Email: {user?.email}</p>
                            <p>Phone Number: {user?.phoneNumber}</p>
                            <p>Roles:
                                {user?.roles?.map((role, index) => (
                                    <span key={index}> {role.name}</span>
                                ))}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Button variant="outline-primary" className="w-100">Edit Profile</Button>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Link to="/change-password">
                                        <Button variant="outline-primary" className="w-100">Change Password</Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default AdminDashboard;
