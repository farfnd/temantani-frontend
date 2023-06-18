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
                setUserData(data);
                message.success("Profile updated successfully");
            } catch (error) {
                console.error('Error updating worker profile:', error);
                message.error("Failed to update profile. Please try again.");
            }
        }
    };
    

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <Card className="text-center">
                        <Card.Header>
                            <h1>Edit Profile</h1>
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
                                                            <Form.Label>Profile Picture</Form.Label>
                                                            <Form.Control type="file" name="image" onChange={handleImage} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col md="10">
                                                <Row className="mb-3">
                                                    <Col md="4">
                                                        <Form.Group controlId="formName">
                                                            <Form.Label>Name</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="name"
                                                                placeholder="Enter name"
                                                                defaultValue={userData?.name}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your name.
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
                                                                placeholder="Enter email"
                                                                defaultValue={userData?.email}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your email.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formPhoneNumber">
                                                            <Form.Label>Phone Number</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="phoneNumber"
                                                                placeholder="Enter phone number"
                                                                defaultValue={userData?.phoneNumber}
                                                                onChange={handleChange}
                                                                minLength={2}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your phone number.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md="4">
                                                        <Form.Group controlId="formBank">
                                                            <Form.Label>Bank</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="bank"
                                                                placeholder="Enter bank"
                                                                defaultValue={userData?.bank}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your bank.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formBankAccountNumber">
                                                            <Form.Label>Bank Account Number</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="bankAccountNumber"
                                                                placeholder="Enter bank account number"
                                                                defaultValue={userData?.bankAccountNumber}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your bank account number.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formBankAccountHolderName">
                                                            <Form.Label>Bank Account Holder Name</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="bankAccountHolderName"
                                                                placeholder="Enter bank account holder name"
                                                                defaultValue={userData?.bankAccountHolderName}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your bank account holder name.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md="4">
                                                        <Form.Group controlId="formStreet">
                                                            <Form.Label>Street</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="street"
                                                                placeholder="Enter street"
                                                                defaultValue={userData?.street}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your street.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formCity">
                                                            <Form.Label>City</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="city"
                                                                placeholder="Enter city"
                                                                defaultValue={userData?.city}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your city.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group controlId="formPostalCode">
                                                            <Form.Label>Postal Code</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="postalCode"
                                                                placeholder="Enter postal code"
                                                                defaultValue={userData?.postalCode}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter your postal code.
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
