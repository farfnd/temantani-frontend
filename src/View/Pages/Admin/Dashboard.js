import { Layout } from 'antd';
import { Card, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';

const { Content } = Layout;

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        fetchAdminName();
    }, []);

    const fetchAdminName = async () => {
        try {
            const response = await fetch(`${config.api.userService}/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer "+ Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            const { name } = data; // Assuming the API response returns the admin's name as "name"
            setAdminName(name);
        } catch (error) {
            console.error('Error fetching admin name:', error);
        }
    };

    return (
        <Content className="mx-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Title className="my-0">Hello, {adminName}</Card.Title>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col sm={3}>
                    <Card>
                        <Card.Body>This is card 2</Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card>
                        <Card.Body>This is card 3</Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card>
                        <Card.Body>This is card 4</Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card>
                        <Card.Body>This is card 5</Card.Body>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default AdminDashboard;
