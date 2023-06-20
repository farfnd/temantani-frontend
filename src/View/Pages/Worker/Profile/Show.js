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
import { LeftCircleOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../../../Contexts/UserContext';

const { Content } = Layout;

const ShowProfile = () => {
    const { user, setUser, fetchUserIfEmpty } = useContext(UserContext);
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchWorker();
    }, []);

    const fetchWorker = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.api.workerService}/worker/me?include=skills`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorker(data);
        } catch (error) {
            console.error('Error fetching worker data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Content className="mx-3">
            <Card className="mb-3">
                <Link to="/worker" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <LeftCircleOutlined style={{ marginRight: '5px' }} />
                    <span>Kembali</span>
                </Link>
                <Card.Header className="text-center">
                    <h3>Profil</h3>
                </Card.Header>
                <Card.Body>
                    {
                        loading || !user ? (
                            <Spinner animation="border" />
                        ) : (
                            <>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
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
                                                        <p>
                                                            <strong>Alamat:</strong><br />
                                                            {user.street}<br />
                                                            {user.city}, {user.postalCode}
                                                        </p>
                                                        <Link to="/worker/profile/edit">
                                                            <Button variant="primary">Edit Profil</Button>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Row>
                                                    <Form.Label column md="2" htmlFor="formBasicBank">
                                                        <strong>Status Ketersediaan Bekerja</strong>
                                                    </Form.Label>
                                                    <Form.Label column md="10">
                                                        <Badge bg={worker.workAvailability === "AVAILABLE" ? "success" : "danger"} className="ml-2">
                                                            {worker.workAvailability}
                                                        </Badge>
                                                    </Form.Label>
                                                </Row>
                                                <Row>
                                                    <Form.Label column md="2" htmlFor="formBasicDescription">
                                                        <strong>Ringkasan Profil</strong>
                                                    </Form.Label>
                                                    <Form.Label column md="10">
                                                        <p className='m-0'>{worker.description ?? "-"}</p>
                                                    </Form.Label>
                                                </Row>
                                                <Row>
                                                    <Form.Label column md="2" htmlFor="formBasicSkills">
                                                        <strong>Keahlian</strong>
                                                    </Form.Label>
                                                    <Form.Label column md="10">
                                                        <p className='m-0'>
                                                            {
                                                                worker.skills.length > 0 ? (
                                                                    worker.skills.map((skill, index) => skill.tag).join(', ')
                                                                ) : (
                                                                    '-'
                                                                )
                                                            }
                                                        </p>
                                                    </Form.Label>
                                                </Row>

                                                <Row className="mt-3">
                                                    <Col md="2">
                                                    <Link to="/worker/work-details/edit">
                                                        <Button variant="primary">Edit</Button>
                                                    </Link>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                </Card.Body>
            </Card>
        </Content >
    );
}

export default ShowProfile;