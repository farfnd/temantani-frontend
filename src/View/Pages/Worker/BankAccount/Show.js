import { Avatar, Layout, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import banks from '../../../../assets/data/banks.json';
import {
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    FormControl,
    Container,
    Card,
    Alert,
    Spinner,
} from 'react-bootstrap';
import { UserContext } from '../../../../Contexts/UserContext';
import { LeftCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ShowBankAccount = () => {
    const { user, fetchUserIfEmpty } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
    }, []);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <Card className="text-center">
                        <Link to="/worker" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <LeftCircleOutlined style={{ marginRight: '5px' }} />
                            <span>Kembali</span>
                        </Link>
                        <Card.Header>
                            <h1>Informasi Rekening Bank</h1>
                        </Card.Header>
                        <Card.Body>
                            {
                                user ? (
                                    <>
                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicBank">Bank</Form.Label>
                                            <Col md="10">
                                                <Form.Control
                                                    type="text"
                                                    name="bank"
                                                    value={user?.bank}
                                                    disabled />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicBankAccountNumber">Nomor Rekening</Form.Label>
                                            <Col md="10">
                                                <Form.Control
                                                    type="text"
                                                    name="bankAccountNumber"
                                                    value={user?.bankAccountNumber}
                                                    disabled />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicBankAccountHolderName">Nama Pemilik Rekening</Form.Label>
                                            <Col md="10">
                                                <Form.Control
                                                    type="text"
                                                    name="bankAccountHolderName"
                                                    value={user?.bankAccountHolderName}
                                                    disabled />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Link to="/worker/bank-account/edit">
                                                <Button variant="primary">Edit</Button>
                                            </Link>
                                        </Row>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Spinner animation="border" />
                                    </div>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShowBankAccount;
