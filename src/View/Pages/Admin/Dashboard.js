import { Layout } from 'antd';
import { Card, Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await fetch(`${config.api.userService}/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setAdminData(data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    return (
        <Content className="mx-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Title className="my-0">Hello, {adminData?.name}</Card.Title>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col sm={9}>
                    <Card>
                        <Card.Title>Profile</Card.Title>
                        <Card.Body>
                            <p>Email: {adminData?.email}</p>
                            <p>Phone Number: {adminData?.phoneNumber}</p>
                            <p>Roles:
                                {adminData?.roles?.map((role, index) => (
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
