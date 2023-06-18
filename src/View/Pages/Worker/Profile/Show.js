import { Layout, message, Avatar } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Spinner,
    Badge,
} from 'react-bootstrap';
import { UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../../../Contexts/UserContext';

const { Content } = Layout;

const ShowProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkerData();
    }, []);

    const fetchWorkerData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.api.workerService}/worker/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorkerData(data);
        } catch (error) {
            console.error('Error fetching worker data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Content className="mx-3">
            <Card>
                <Card.Header>
                    <h3>Worker Profile</h3>
                </Card.Header>
                <Card.Body>
                    {
                        loading || !(user && workerData) ? (
                            <Spinner animation="border" />
                        ) : (
                            <Row>
                                <Col md={2} className='text-center'>
                                    {user.profilePictureUrl ? (
                                        <Avatar src={`${config.api.userService}/images/${user.profilePictureUrl}`} size={128} />
                                    ) : (
                                        <Avatar size={128} icon={<UserOutlined />} />
                                    )}
                                </Col>
                                <Col md={10}>
                                    <p><strong>Nama:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Nomor Telepon:</strong> {user.phoneNumber}</p>
                                    <p><strong>Bank:</strong> {user.bank}</p>
                                    <p><strong>Nomor Rekening:</strong> {user.bankAccountNumber}</p>
                                    <p><strong>Nama Pemegang Rekening:</strong> {user.bankAccountHolderName}</p>
                                    <p><strong>Street:</strong> {user.street}</p>
                                    <p><strong>City:</strong> {user.city}</p>
                                    <p><strong>Postal Code:</strong> {user.postalCode}</p>
                                    <p><strong>Work Availability:</strong>&nbsp;
                                        <Badge bg={workerData.workAvailability === "AVAILABLE" ? "success" : "danger"} className="ml-2">
                                            {workerData.workAvailability}
                                        </Badge>
                                    </p>
                                    <Link to="/worker/profile/edit">
                                        <Button variant="primary">Edit Profile</Button>
                                    </Link>
                                </Col>
                            </Row>
                        )}
                </Card.Body>
            </Card>
        </Content>
    );
}

export default ShowProfile;