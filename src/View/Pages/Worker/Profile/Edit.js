import { Avatar, Layout, message } from 'antd';
import React, { useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
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
import { UserOutlined } from '@ant-design/icons';

const { Content } = Layout;

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [validated, setValidated] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [inputData, setInputData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        bank: "",
        bankAccountNumber: "",
        bankAccountHolderName: "",
        street: "",
        city: "",
        postalCode: "",
    })

    useEffect(() => {
        fetchUserData();

    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${config.api.userService}/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setUserData(data);
            setInputData({
                name: data?.name || "",
                email: data?.email || "",
                phoneNumber: data?.phoneNumber || "",
                bank: data?.bank || "",
                bankAccountNumber: data?.bankAccountNumber || "",
                bankAccountHolderName: data?.bankAccountHolderName || "",
                street: data?.street || "",
                city: data?.city || "",
                postalCode: data?.postalCode || "",
            });
        } catch (error) {
            console.error('Error fetching worker data:', error);
        }
    };    

    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value

        setInputData({ ...inputData, [name]: value })
    }

    const handleImage = (event) => {
        let name = event.target.name
        let value = event.target.files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(value);

        setInputData({ ...inputData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            setValidated(true);
    
            const formData = new FormData();
            console.log(inputData);
            for (let key in inputData) {
                formData.append(key, inputData[key]);
            }
    
            try {
                const response = await fetch(`${config.api.userService}/me`, {
                    method: 'PUT',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                    },
                    body: formData,
                });
                const data = await response.json();
                setUserData(data.data);
                message.success("Profil berhasil diperbarui.");
            } catch (error) {
                console.error('Gagal memperbarui profil:', error);
                message.error("Gagal memperbarui profil: " + error);
            }
        }
    };
    

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <Card className="text-center">
                        <Card.Header>
                            <h1>Edit Profil</h1>
                        </Card.Header>
                        <Card.Body>
                            {
                                userData ? (
                                    <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
                                        <Row>
                                            <Col md="2">
                                                <Row>
                                                    <Col>
                                                        {userData.profilePictureUrl ? (
                                                            <Avatar src={`${config.api.userService}/images/${userData.profilePictureUrl}`} size={128} />
                                                        ) : (
                                                            <Avatar size={128} icon={<UserOutlined />} />
                                                        )}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Form.Group controlId="formImage">
                                                            <Form.Label>Foto Profil</Form.Label>
                                                            <Form.Control type="file" name="image" onChange={handleImage} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col md="10">
                                                <Row className="mb-3">
                                                    <Col md="4">
                                                        <Form.Group controlId="formName">
                                                            <Form.Label>Nama</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="name"
                                                                placeholder="Masukkan nama Anda"
                                                                defaultValue={userData?.name}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan nama Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formEmail">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="email"
                                                                name="email"
                                                                placeholder="Masukkan email"
                                                                defaultValue={userData?.email}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan email Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formPhoneNumber">
                                                            <Form.Label>Nomor telepon</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="phoneNumber"
                                                                placeholder="Masukkan nomor telepon"
                                                                defaultValue={userData?.phoneNumber}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan nomor telepon Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md="4">
                                                        <Form.Group controlId="formStreet">
                                                            <Form.Label>Alamat</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="street"
                                                                placeholder="Masukkan alamat Anda"
                                                                defaultValue={userData?.street}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan alamat Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formCity">
                                                            <Form.Label>Kota</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="city"
                                                                placeholder="Masukkan kota Anda"
                                                                defaultValue={userData?.city}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan kota Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formPostalCode">
                                                            <Form.Label>Kode Pos</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="postalCode"
                                                                placeholder="Masukkan kode pos Anda"
                                                                defaultValue={userData?.postalCode}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon masukkan kode pos Anda.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row className="justify-content-md-center mt-3">
                                            <Col md="4">
                                                <Link to="/worker/profile">
                                                    <Button variant="secondary" className='me-3'>
                                                        Cancel
                                                    </Button>
                                                </Link>
                                                <Button variant="primary" type="submit">
                                                    Update Profile
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
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

export default EditProfile;
